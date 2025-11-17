import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import {
  RootStackParamList,
  DrivingActionStackParamList,
  DrivingRecordStackParamList,
  PointStackParamList,
  SettingStackParamList,
  AlternativeTransportationStackParamList,
} from './params';

import NavigationBar from '../components/common/NavigationBar';

import { View, Text } from 'react-native';

import Home from '../pages/home/Home';

import StartDriving from '../pages/drivingAction/StartDriving';
import MyRecord from '../pages/drivingRecord/MyRecord';
import SelectTransportation from '../pages/alternativeTransportation/SelectTransportation';
import MyPoint from '../pages/point/MyPoint';
import Setting from '../pages/setting/Setting';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();

const DrivingActionStack =
  createNativeStackNavigator<DrivingActionStackParamList>() as ReturnType<
    typeof createNativeStackNavigator<DrivingActionStackParamList>
  >;

const DrivingRecordStack =
  createNativeStackNavigator<DrivingRecordStackParamList>() as ReturnType<
    typeof createNativeStackNavigator<DrivingRecordStackParamList>
  >;

const AlternativeTransportationStack =
  createNativeStackNavigator<AlternativeTransportationStackParamList>() as ReturnType<
    typeof createNativeStackNavigator<AlternativeTransportationStackParamList>
  >;

const PointStack =
  createNativeStackNavigator<PointStackParamList>() as ReturnType<
    typeof createNativeStackNavigator<PointStackParamList>
  >;

const SettingStack =
  createNativeStackNavigator<SettingStackParamList>() as ReturnType<
    typeof createNativeStackNavigator<SettingStackParamList>
  >;

const DrivingActionStackNavigator = () => {
  return (
    <DrivingActionStack.Navigator
      initialRouteName="StartDriving"
      screenOptions={{ headerShown: false }}
    >
      <DrivingActionStack.Screen name="StartDriving" component={StartDriving} />
    </DrivingActionStack.Navigator>
  );
};

const DrivingRecordStackNavigator = () => {
  return (
    <DrivingRecordStack.Navigator
      initialRouteName="MyRecord"
      screenOptions={{ headerShown: false }}
    >
      <DrivingRecordStack.Screen name="MyRecord" component={MyRecord} />
    </DrivingRecordStack.Navigator>
  );
};

const AlternativeTransportationStackNavigator = () => {
  return (
    <AlternativeTransportationStack.Navigator
      initialRouteName="SelectTransportation"
      screenOptions={{ headerShown: false }}
    >
      <AlternativeTransportationStack.Screen
        name="SelectTransportation"
        component={SelectTransportation}
      />
    </AlternativeTransportationStack.Navigator>
  );
};

const PointStackNavigator = () => {
  return (
    <PointStack.Navigator
      initialRouteName="MyPoint"
      screenOptions={{ headerShown: false }}
    >
      <PointStack.Screen name="MyPoint" component={MyPoint} />
    </PointStack.Navigator>
  );
};

const SettingStackNavigator = () => {
  return (
    <SettingStack.Navigator
      initialRouteName="Setting"
      screenOptions={{ headerShown: false }}
    >
      <SettingStack.Screen name="Setting" component={Setting} />
    </SettingStack.Navigator>
  );
};

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={props => {
      const route = props.state.routes[props.state.index];
      const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;

      const hiddenRoutes = ['Policy', 'Privacy'];

      const shouldHideTab = hiddenRoutes.includes(routeName);
      return (
        <NavigationBar
          {...props}
          style={{ display: shouldHideTab ? 'none' : 'flex' }}
        />
      );
    }}
  >
    <Tab.Screen name="DrivingAction" component={DrivingActionStackNavigator} />
    <Tab.Screen name="DrivingRecord" component={DrivingRecordStackNavigator} />
    <Tab.Screen
      name="AlternativeTransportation"
      component={AlternativeTransportationStackNavigator}
    />
    <Tab.Screen name="Point" component={PointStackNavigator} />

    <Tab.Screen name="Setting" component={SettingStackNavigator} />
  </Tab.Navigator>
);

const AppStack = () => {
  return (
    <RootStack.Navigator initialRouteName="MainTabs">
      <RootStack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

export default AppStack;
