import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnBoardingPage from '../pages/login/OnBoardingPage';
import LoginPage from '../pages/login/LoginPage';

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
