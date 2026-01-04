import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from 'styled-components/native';
import { baseTheme } from './styles/theme';
import { FONT_LEVEL_SCALE } from './styles/fontLevel';

type FontLevelContextValue = {
  level: number;
  setLevel: (level: number) => void;
};

const FontLevelContext = createContext<FontLevelContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = 'fontLevel';

export const FontLevelProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [level, setLevelState] = useState<number>(4);

  // 앱 시작 시 저장된 레벨 불러오기
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = Number(saved);
        if (parsed >= 1 && parsed <= 5) setLevelState(parsed);
      }
    })();
  }, []);

  const setLevel = (next: number) => {
    const clamped = Math.min(6, Math.max(1, next));
    setLevelState(clamped);
    AsyncStorage.setItem(STORAGE_KEY, String(clamped));
  };

  const themeWithScale = useMemo(
    () => ({
      ...baseTheme,
      fontScale: FONT_LEVEL_SCALE[level] ?? 1,
    }),
    [level],
  );

  return (
    <FontLevelContext.Provider value={{ level, setLevel }}>
      <ThemeProvider theme={themeWithScale}>{children}</ThemeProvider>
    </FontLevelContext.Provider>
  );
};

export const useFontLevel = () => {
  const ctx = useContext(FontLevelContext);
  if (!ctx) throw new Error('useFontLevel must be used inside provider');
  return ctx;
};
