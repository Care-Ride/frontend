import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNavigationContainerRef,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';

import {
  RootStackParamList,
  DrivingActionStackParamList,
  DrivingRecordStackParamList,
  PointStackParamList,
  SettingStackParamList,
  ManualStackParamList,
  AlternativeTransportationStackParamList,
  InitialSettingStackParamList,
} from './params';

import NavigationBar from '../components/common/NavigationBar';

import SelectUserType from '../pages/login/SelectUserType';
import FirstFontSetting from '../pages/login/FirstFontSetting';
import FirstSoundSetting from '../pages/login/FirstSoundSetting';
import SettingDone from '../pages/login/SettingDone';

import Home from '../pages/home/Home';

import StartDriving from '../pages/drivingAction/StartDriving';
import MyRecord from '../pages/drivingRecord/MyRecord';
import SelectTransportation from '../pages/alternativeTransportation/SelectTransportation';
import MyPoint from '../pages/point/MyPoint';
import PointList from '../pages/point/PointList';
import Setting from '../pages/setting/Setting';
import SearchDestination from '../pages/drivingAction/SearchDestination';
import MonthlyRecord from '../pages/drivingRecord/MonthlyRecord';
import DailyRecord from '../pages/drivingRecord/DailyRecord';
import LinkDriver from '../pages/setting/LinkDriver';
import SoundSetting from '../pages/setting/SoundSetting';
import FontSetting from '../pages/setting/FontSetting';
import Withdraw from '../pages/setting/Withdraw';
import BasicRuleBelt from '../pages/drivingAction/BasicRuleBelt';
import BasicRuleMirror from '../pages/drivingAction/BasicRuleMirror';
import DrivingScreen from '../pages/drivingAction/DrivingScreen';
import BasicRuleWarningLight from '../pages/drivingAction/BasicRuleWarningLight';
import BasicRuleDevice from '../pages/drivingAction/BasicRuleDevice';
import DrivingDone from '../pages/drivingAction/DrivingDone';
import ReactivityTest from '../pages/drivingAction/ReactivityTest';
import GetCode from '../pages/setting/GetCode';
import EnterCode from '../pages/setting/EnterCode';
import DrivingDanger from '../pages/drivingAction/DrivingDanger';
import ReadyDriving from '../pages/drivingAction/ReadyDriving';
import BasicRuleBrake from '../pages/drivingAction/BasicRuleBrake';
import ManualHome from '../pages/Manuals/ManualHome';
import ManualDetail from '../pages/Manuals/ManualDetail';

import { useAuth } from '../AuthContext';
import Privacy from '../pages/home/Privacy';
import ConnectBluetooth from '../pages/setting/ConnectBluetooth';
import ReceivedGift from '../pages/point/ReceivedGift';
import UsePoint from '../pages/point/UsePoint';
import SelectOtherTransportation from '../pages/drivingAction/SelectOtherTransportation';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();

const InitialSettingStack =
  createNativeStackNavigator<InitialSettingStackParamList>() as ReturnType<
    typeof createNativeStackNavigator<InitialSettingStackParamList>
  >;

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

const ManualStack = createNativeStackNavigator<ManualStackParamList>();

const InitialSettingStackNavigator = () => {
  return (
    <InitialSettingStack.Navigator
      initialRouteName="SelectUserType"
      screenOptions={{ headerShown: false }}
    >
      <InitialSettingStack.Screen
        name="SelectUserType"
        component={SelectUserType}
      />
      <InitialSettingStack.Screen
        name="FirstFontSetting"
        component={FirstFontSetting}
      />
      <InitialSettingStack.Screen
        name="FirstSoundSetting"
        component={FirstSoundSetting}
      />
      <InitialSettingStack.Screen name="SettingDone" component={SettingDone} />
    </InitialSettingStack.Navigator>
  );
};

const DrivingActionStackNavigator = () => {
  return (
    <DrivingActionStack.Navigator
      initialRouteName="StartDriving"
      screenOptions={{ headerShown: false }}
    >
      <DrivingActionStack.Screen name="StartDriving" component={StartDriving} />
      <DrivingActionStack.Screen name="ReadyDriving" component={ReadyDriving} />
      <DrivingActionStack.Screen
        name="SelectOtherTransportation"
        component={SelectOtherTransportation}
      />
      <DrivingActionStack.Screen
        name="SearchDestination"
        component={SearchDestination}
      />
      <DrivingActionStack.Screen
        name="DrivingDanger"
        component={DrivingDanger}
      />
      <DrivingActionStack.Screen
        name="BasicRuleBelt"
        component={BasicRuleBelt}
      />
      <DrivingActionStack.Screen
        name="BasicRuleMirror"
        component={BasicRuleMirror}
      />
      <DrivingActionStack.Screen
        name="BasicRuleWarningLight"
        component={BasicRuleWarningLight}
      />
      <DrivingActionStack.Screen
        name="BasicRuleDevice"
        component={BasicRuleDevice}
      />
      <DrivingActionStack.Screen
        name="BasicRuleBrake"
        component={BasicRuleBrake}
      />
      <DrivingActionStack.Screen
        name="ReactivityTest"
        component={ReactivityTest}
      />
      <DrivingActionStack.Screen
        name="DrivingScreen"
        component={DrivingScreen}
      />
      <DrivingActionStack.Screen name="DrivingDone" component={DrivingDone} />
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
      <DrivingRecordStack.Screen
        name="MonthlyRecord"
        component={MonthlyRecord}
      />

      <DrivingRecordStack.Screen name="DailyRecord" component={DailyRecord} />
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
      <PointStack.Screen name="PointList" component={PointList} />
      <PointStack.Screen name="UsePoint" component={UsePoint} />
      <PointStack.Screen name="ReceivedGift" component={ReceivedGift} />
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
      <SettingStack.Screen name="LinkDriver" component={LinkDriver} />
      <SettingStack.Screen name="SoundSetting" component={SoundSetting} />

      <SettingStack.Screen name="FontSetting" component={FontSetting} />
      <SettingStack.Screen name="Withdraw" component={Withdraw} />
      <SettingStack.Screen name="GetCode" component={GetCode} />
      <SettingStack.Screen name="EnterCode" component={EnterCode} />
      <SettingStack.Screen
        name="ConnectBluetooth"
        component={ConnectBluetooth}
      />
    </SettingStack.Navigator>
  );
};

const ManualStackNavigator = () => (
  <ManualStack.Navigator
    initialRouteName="ManualHome"
    screenOptions={{ headerShown: false }}
  >
    <ManualStack.Screen name="ManualHome" component={ManualHome} />
    <ManualStack.Screen name="ManualDetail" component={ManualDetail} />
  </ManualStack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={props => {
      const route = props.state.routes[props.state.index];
      const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;

      const hiddenRoutes = [
        'Home',
        'Privacy',
        'SoundSetting',
        'LinkDriver',
        'SoundSetting',
        'FontSetting',
        'ManualHome',
        'ManualDetail',
        'Withdraw',
        'BasicRuleBelt',
        'BasicRuleMirror',
        'BasicRuleWarningLight',
        'BasicRuleDevice',
        'BasicRuleBrake',
        'MonthlyRecord',
        'DailyRecord',
        'PointList',
        'ReactivityTest',
        'DrivingScreen',
        'DrivingDone',
        'EnterCode',
        'GetCode',
        'DrivingDanger',
        'StartDrivingNoDestination',
        'UsePoint',
        'ReceivedGift',
        'ConnectBluetooth',
        'SelectOtherTransportation',
      ];

      const shouldHideTab = hiddenRoutes.includes(routeName);
      return (
        <NavigationBar
          {...props}
          style={{ display: shouldHideTab ? 'none' : 'flex' }}
        />
      );
    }}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Privacy" component={Privacy} />

    <Tab.Screen
      name="InitialSetting"
      component={InitialSettingStackNavigator}
    />
    <Tab.Screen name="DrivingAction" component={DrivingActionStackNavigator} />
    <Tab.Screen name="DrivingRecord" component={DrivingRecordStackNavigator} />
    <Tab.Screen
      name="AlternativeTransportation"
      component={AlternativeTransportationStackNavigator}
    />
    <Tab.Screen name="Point" component={PointStackNavigator} />

    <Tab.Screen name="Setting" component={SettingStackNavigator} />
    <Tab.Screen name="ManualHome" component={ManualStackNavigator} />
  </Tab.Navigator>
);

const AppStack = () => {
  const { state } = useAuth();
  const isNewUser = state.hasDeviceSetting == false;
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isNewUser ? (
        <RootStack.Screen
          name="InitialSettingStackNavigator"
          component={InitialSettingStackNavigator}
        />
      ) : (
        <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
      )}
      {/* <RootStack.Screen name="MainTabs" component={MainTabNavigator} /> */}
    </RootStack.Navigator>
  );
};

export default AppStack;
