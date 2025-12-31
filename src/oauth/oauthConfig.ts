import { AuthConfiguration } from 'react-native-app-auth';

export const googleConfig: AuthConfiguration = {
  issuer: 'https://accounts.google.com',
  clientId:
    '60276299958-nn6jrsf78cj7as3dlrk9v745j211klgf.apps.googleusercontent.com',
  redirectUrl: 'com.care.ride:/oauthredirect',
  scopes: ['openid', 'email', 'profile'], // idToken 포함
};
export const oauthConfigMap: Record<'google', AuthConfiguration> = {
  google: googleConfig,
};
