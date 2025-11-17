import 'styled-components/native';
import type { theme } from './theme';

type ThemeType = typeof theme;

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeType {
    root: {
      flex: 1;
      backgroundColor: '#ffffff';
    };
    colors: {
      white: '#ffffff';
      bluePrimary: '#001830';
      blueSecondary: '#93DAE5';
      yellowPrimary: '#F8C129';
      yellowSecondary: '#FEEFD2';
      white: '#ffffff';
      black: '#000000';
      gray100: '#EFEFEF';
      gray200: '#D4D4D4';
      gray300: '#B6B6B6';
      gray400: '#A0A0A0';
      gray500: '#7D7D7D';
    };
  }
}
