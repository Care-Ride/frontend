import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@env';
import { incLoadingAtom, decLoadingAtom } from '../atoms/loadingAtom';
import { store } from '../atoms/store';

// 요청 설정에 커스텀 플래그 추가
declare module 'axios' {
  export interface AxiosRequestConfig {
    showLoader?: boolean; // 기본 true
    loaderKey?: string; // 필요시 구분용 키
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 로딩 제외하고 싶은 엔드포인트가 있으면 여기에
const loaderExclude: string[] = [
  // "/health",
];

const loaderExcludeRegex: RegExp[] = [
  /^\/book-interest\/[^/]+\/heart(?:\?.*)?$/,
  /^\/book-interest\/[^/]+\/notice(?:\?.*)?$/,
  /^\/reviews\/cancreate\/[^/]+(?:\?.*)?$/,
];

function shouldShowLoader(config: InternalAxiosRequestConfig) {
  if (config.showLoader === false) return false;
  const url = config.url || '';
  if (loaderExclude.some(e => url.includes(e))) return false;
  if (loaderExcludeRegex.some(re => re.test(url))) return false;
  return true;
}

let helpers: {
  getAccessToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
} = {
  getAccessToken: async () => null,
  signOut: async () => {},
};

export const bindAuthHelpers = (h: typeof helpers) => {
  helpers = h;
};

export const verifyAuth = async (): Promise<boolean> => {
  const t = await helpers.getAccessToken();
  if (!t) return false;
  try {
    await api.get('/api/member/me');
    return true;
  } catch {
    return false;
  }
};

api.interceptors.request.use(
  async config => {
    if (shouldShowLoader(config)) {
      store.set(incLoadingAtom);
      // 요청 config에 플래그 저장 (응답에서만 감소하도록)
      (config as any).__loaderTouched = true;
    }
    // 필요시 헤더, 토큰 등 추가
    // config.headers.Authorization = `Bearer ${token}`;

    if (helpers) {
      const accessToken = await helpers.getAccessToken();
      if (accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${accessToken}`;

        console.log('[API] attach token:', accessToken, '→', config.url);
      }
    }
    return config;
  },
  error => {
    // 요청 단계에서 에러 나면 감소
    // (여기선 config 없을 수 있으니 그냥 감소 안전 처리)
    store.set(decLoadingAtom);
    return Promise.reject(error);
  },
);

let loggingOut = false;

api.interceptors.response.use(
  response => {
    if ((response.config as any).__loaderTouched) {
      store.set(decLoadingAtom);
    }
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as any;
    if (config?.__loaderTouched) {
      store.set(decLoadingAtom);
    }
    if (!helpers) return Promise.reject(error);
    const status = error?.response?.status;

    // 재로그인/리프레시 없이: 401이면 즉시 로그아웃
    if (status === 401 && !loggingOut) {
      loggingOut = true;
      try {
        await helpers.signOut();
      } finally {
        loggingOut = false;
      }
    }
    return Promise.reject(error);
  },
);
