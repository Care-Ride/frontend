import { scale, scaleVertical, scaleFont } from '../utils/screen';

export const baseTheme = {
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  colors: {
    white: '#ffffff',
    black: '#000000',
    bluePrimary: '#001830',
    blueSecondary: '#93DAE5',
    yellowPrimary: '#F8C129',
    yellowSecondary: '#FEEFD2',
    gray100: '#EFEFEF',
    gray200: '#D4D4D4',
    gray300: '#B6B6B6',
    gray400: '#A0A0A0',
    gray500: '#7D7D7D',
  },
  font: {
    family: 'Pretendard',
  },
  layout: {
    appWidth: 375,
    appHeight: '100%',
    marginHorizontal: 'auto',
  },
  scale,
  scaleVertical,
  scaleFont,
  fontScale: 1,
} as const;

export type AppTheme = typeof baseTheme;
