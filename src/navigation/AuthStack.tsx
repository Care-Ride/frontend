import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnBoardingPage from '../pages/login/OnBoardingPage';
import LoginPage from '../pages/login/LoginPage';
import SelectUserType from '../pages/login/SelectUserType';
import FirstFontSetting from '../pages/login/FirstFontSetting';
import FirstSoundSetting from '../pages/login/FirstSoundSetting';
import FirstVibrationSetting from '../pages/login/FirstVibrationSetting';
import SettingDone from '../pages/login/SettingDone';
// import Policy from '../pages/home/Policy';
// import Privacy from '../pages/home/Privacy';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnBoardingPage"
      screenOptions={{
        headerShown: false, // 헤더 숨기기
      }}
    >
      <Stack.Screen name="OnBoardingPage" component={OnBoardingPage} />
      {/* <Stack.Screen name="LoginPage" component={LoginPage} /> */}
      <Stack.Screen name="LoginPage" component={LoginPage} />
    </Stack.Navigator>
  );
};

export default AuthStack;
