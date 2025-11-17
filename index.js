// index.js
import { AppRegistry } from 'react-native';
import App from './App.tsx';
import { name as appName } from './app.json';
//import { AuthProvider } from './src/AuthContext';
//import messaging from '@react-native-firebase/messaging';
//import notifee, { AndroidImportance } from '@notifee/react-native';

import { Buffer } from 'buffer';

//import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 중복 폴리필 방지
// @ts-ignore
if (typeof global.Buffer === 'undefined') {
  // @ts-ignore
  global.Buffer = Buffer;
}

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       gcTime: 5 * 60 * 1000,
//     },
//   },
// });

// const Root = () => (
//   <QueryClientProvider client={queryClient}>
//     {/* <AuthProvider> */}
//     <App />
//     {/* </AuthProvider> */}
//   </QueryClientProvider>
// );
const Root = () => <App />;

// messaging().onNotificationOpenedApp(remoteMessage => {
//   const route = remoteMessage?.data?.route;
//   const id = remoteMessage?.data?.id;
//   // 앱이 포그라운드로 올라왔을 때 네이게이트 (navigationRef는 App가 떠야 준비됨)
//   setTimeout(() => navigateFromOutside(route, id ? { id } : undefined), 0);
// });

// // 2) 앱이 완전 종료 상태에서 탭 → getInitialNotification
// messaging()
//   .getInitialNotification()
//   .then(remoteMessage => {
//     if (remoteMessage) {
//       const route = remoteMessage?.data?.route;
//       const id = remoteMessage?.data?.id;
//       setTimeout(() => navigateFromOutside(route, id ? { id } : undefined), 0);
//     }
//   });

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   // 채널이 없다면 만들어두기 (안전)
//   await notifee.createChannel({
//     id: 'default',
//     name: 'General',
//     importance: AndroidImportance.HIGH,
//     sound: 'default',
//   });

//   const { title, body } = remoteMessage.notification ?? {};
//   await notifee.displayNotification({
//     title: title ?? '알림',
//     body: body ?? '',
//     android: { channelId: 'default', pressAction: { id: 'default' } },
//     data: remoteMessage.data,
//   });
// });

AppRegistry.registerComponent(appName, () => Root);
