import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { authorize, AuthConfiguration } from 'react-native-app-auth';
import { jwtDecode } from 'jwt-decode';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';

import { oauthConfigMap } from './oauth/oauthConfig';
import { api, bindAuthHelpers } from './api/api';

import { login as kakaoLogin } from '@react-native-seoul/kakao-login';

export type Provider = 'password' | 'google' | 'kakao';

export type ServerUser = {
  id: string;
  email: string | null;
  name?: string | null;
  nickname: string | null;
  hasDeviceSetting?: boolean;
};

type Tokens = {
  accessToken: string;
  expiresAt: number;
};

export type AuthState = {
  provider: Provider | null;
  // user: ServerUser | null;
  tokens: Tokens | null;
  hasDeviceSetting: boolean | null;
};

type AuthContextType = {
  state: AuthState;
  //signInWithPassword: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (
    provider: Extract<Provider, 'google' | 'kakao'>,
  ) => Promise<{ provider: 'google' | 'kakao'; data: any }>;
  setFromServer: (
    provider: Provider,
    payload: {
      //user: ServerUser;
      accessToken: string;
      hasDeviceSetting: boolean;
    },
  ) => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
};

const STORAGE_SERVICE = 'authTokens';
const EXP_SKEW_MS = 60_000;
const initialState: AuthState = {
  provider: null,
  tokens: null,
  hasDeviceSetting: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const loggingOut = useRef(false);
  const queryClient = useQueryClient();

  const persist = async (next: AuthState) => {
    await Keychain.setGenericPassword('auth', JSON.stringify(next), {
      service: STORAGE_SERVICE,
    });
    // await AsyncStorage.setItem('userId', next.user?.id || '');
    // await AsyncStorage.setItem('nickname', next.user?.nickname || '');

    setAuthState(next);
  };

  const signOut = useCallback(async () => {
    if (loggingOut.current) return;
    loggingOut.current = true;
    try {
      await Keychain.resetGenericPassword({ service: STORAGE_SERVICE });
      queryClient.removeQueries({ queryKey: ['user'] });
      await AsyncStorage.clear();
      setAuthState(initialState);
    } finally {
      loggingOut.current = false;
    }
  }, []);

  const load = useCallback(async () => {
    const saved = await Keychain.getGenericPassword({
      service: STORAGE_SERVICE,
    });
    if (!saved) return;

    const st = JSON.parse(saved.password) as AuthState;
    if (!st.tokens || Date.now() >= st.tokens.expiresAt - EXP_SKEW_MS) {
      await signOut();
      return;
    }
    setAuthState(st);
  }, [signOut]);

  useEffect(() => {
    load();
  }, [load]);

  const setFromServer = useCallback(
    async (
      provider: Provider,
      payload: {
        //user: ServerUser;
        accessToken: string;
        hasDeviceSetting: boolean;
      },
    ) => {
      let expMs = Date.now() + 5 * 60 * 1000;
      try {
        const decoded: any = jwtDecode(payload.accessToken);
        if (decoded?.exp) expMs = decoded.exp * 1000;
      } catch {}

      const next: AuthState = {
        provider,
        //user: payload.user,
        tokens: { accessToken: payload.accessToken, expiresAt: expMs },
        hasDeviceSetting: payload.hasDeviceSetting,
      };

      await persist(next);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    [queryClient],
  );

  // const signInWithPassword = async (email: string, password: string) => {
  //   const { data } = await api.post('/auth/login', { email, password });
  //   await setFromServer('password', data);
  // };

  const signInWithOAuth = async (
    provider: 'google' | 'kakao',
  ): Promise<{ provider: 'google' | 'kakao'; data: any }> => {
    if (provider === 'google') {
      const conf = oauthConfigMap.google as AuthConfiguration;
      const result = await authorize(conf);

      if (!result.idToken) {
        throw new Error('Google idToken not returned');
      }
      console.log('idtoken', result.idToken);

      const body: Record<string, string> = {};
      if (result.idToken) body.idToken = result.idToken;
      // else if (result.accessToken) body.accessToken = result.accessToken;
      const { data } = await api.post('/auth/google', {
        idToken: result.idToken,
      });
      const payload = data.data;
      console.log(payload, 'data');
      await setFromServer('google', {
        accessToken: payload.accessToken,
        hasDeviceSetting: payload.hasDeviceSetting,
      });

      return { provider: 'google', data: payload };
    }

    if (provider === 'kakao') {
      try {
        const kakaoResult = await kakaoLogin();
        console.log('[KAKAO] login result:', kakaoResult);

        const body = { accessToken: kakaoResult.accessToken };
        const { data } = await api.post('/auth/kakao', body);
        const payload = data.data;

        await setFromServer('kakao', {
          //user: payload.user,
          accessToken: payload.accessToken,
          hasDeviceSetting: payload.hasDeviceSetting,
        });

        return { provider: 'kakao', data: payload };
      } catch (e) {
        console.log('[KAKAO] login error:', e);
        throw e;
      }
    }
    throw new Error('Unsupported provider');
  };

  const getAccessToken = useCallback(async () => {
    const tk = authState.tokens;
    if (!tk) return null;
    if (Date.now() >= tk.expiresAt - EXP_SKEW_MS) return null;
    return tk.accessToken;
  }, [authState.tokens]);

  useEffect(() => {
    bindAuthHelpers({ getAccessToken, signOut });
  }, [authState, getAccessToken, signOut]);

  return (
    <AuthContext.Provider
      value={{
        state: authState,
        // signInWithPassword,
        signInWithOAuth,
        setFromServer,
        signOut,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
