export type RootStackParamList = {
  InitialSettingStackNavigator: undefined;
  // DrivingActionStackNavigator: undefined;
  // DrivingRecordStackNavigator: undefined;
  // AlternativeTransportationStackNavigator: undefined;
  // PointStackNavigator: undefined;
  // SettingStackNavigator: undefined;
  // ManualStackNavigator: undefined;
  // Home: undefined;
  MainTabs: undefined;
};

export type InitialSettingStackParamList = {
  SelectUserType: undefined;
  FirstFontSetting: undefined;
  FirstSoundSetting: undefined;
  SettingDone: undefined;
};

export type DrivingActionStackParamList = {
  StartDriving: undefined;
  SelectOtherTransportation: undefined;
  SearchDestination: undefined;
  ReadyDriving: undefined;
  DrivingDanger: undefined;
  BasicRuleBelt: undefined;
  BasicRuleMirror: undefined;
  BasicRuleWarningLight: undefined;
  BasicRuleDevice: undefined;
  BasicRuleBrake: undefined;
  ReactivityTest: undefined;
  DrivingScreen: undefined;
  DrivingDone: undefined;
};

export type DrivingRecordStackParamList = {
  MyRecord: undefined;
  MonthlyRecord: undefined;
  DailyRecord: undefined;
};

export type AlternativeTransportationStackParamList = {
  SelectTransportation: undefined;
};

export type PointStackParamList = {
  MyPoint: undefined;
  PointList: undefined;
  UsePoint: undefined;
  ReceivedGift: undefined;
};

export type SettingStackParamList = {
  Setting: undefined;
  LinkDriver: undefined;
  SoundSetting: undefined;
  VibrationSetting: undefined;
  FontSetting: undefined;
  Withdraw: undefined;
  GetCode: undefined;
  EnterCode: undefined;
  ConnectBluetooth: undefined;
};

export type ManualStackParamList = {
  ManualHome: undefined;
  ManualDetail: { manualId: string };
};
