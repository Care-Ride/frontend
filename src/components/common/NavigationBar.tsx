import React from 'react';
import styled from 'styled-components/native';

// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import Handle from '../../assets/common/handle_black.svg';
import Transportation from '../../assets/common/transportation_black.svg';
import Record from '../../assets/common/record_black.svg';
import Point from '../../assets/common/point_black.svg';
import Setting from '../../assets/common/setting_black.svg';
import TransportationGray from '../../assets/common/transportation_gray.svg';
import RecordGray from '../../assets/common/record_gray.svg';
import PointGray from '../../assets/common/point_gray.svg';
import SettingGray from '../../assets/common/setting_gray.svg';
import HandleGray from '../../assets/common/handle_gray.svg';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RootStackParamList = {
  DrivingAction: undefined;
  DrivingRecord: undefined;
  AlternativeTransportation: undefined;
  Point: undefined;
  Setting: undefined;
};

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteKey = keyof RootStackParamList;

const navItems: {
  key: RouteKey;
  label: string;
  icon: { active: React.FC<any>; inactive: React.FC<any> };
}[] = [
  {
    key: 'DrivingAction',
    label: '운전',
    icon: { active: Handle, inactive: HandleGray },
  },
  {
    key: 'DrivingRecord',
    label: '기록',
    icon: { active: Record, inactive: RecordGray },
  },
  {
    key: 'AlternativeTransportation',
    label: '이동',
    icon: { active: Transportation, inactive: TransportationGray },
  },
  {
    key: 'Point',
    label: '포인트',
    icon: { active: Point, inactive: PointGray },
  },
  {
    key: 'Setting',
    label: '설정',
    icon: { active: Setting, inactive: SettingGray },
  },
];
const BAR_HEIGHT = 77;

const NavigationBar = ({
  state,
  navigation,
  style,
}: BottomTabBarProps & { style?: any }) => {
  const insets = useSafeAreaInsets();
  if (style?.display === 'none') {
    return null;
  }
  return (
    <Container
      style={[
        style,
        {
          paddingBottom: insets.bottom,
          height: BAR_HEIGHT + insets.bottom,
        },
      ]}
    >
      {navItems.map(item => {
        // 이 탭이 실제로 라우터에 등록돼 있는지 확인
        const routeIndex = state.routes.findIndex(r => r.name === item.key);
        if (routeIndex === -1) {
          console.log(`Route ${item.key} not found in state.routes`);
          return null;
        }

        const isFocused = state.index === routeIndex;
        const IconComponent = isFocused ? item.icon.active : item.icon.inactive;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: item.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(item.key);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: item.key,
          });
        };

        return (
          <NavItem
            key={item.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            // accessibilityLabel={descriptors[item.key].options.tabBarAccessibilityLabel}
            // testID={descriptors[item.key].options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <IconComponent width={23} height={23} />
            <Label $active={isFocused}>{item.label}</Label>
          </NavItem>
        );
      })}
    </Container>
  );
};

export default NavigationBar;

const Container = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 15px 9px;
  border-top-width: 1px;
  border-color: ${({ theme }) => theme.colors.gray100};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 30px;
  elevation: 20;
  shadow: 3px;
`;

const NavItem = styled.TouchableOpacity.attrs(() => ({
  hitSlop: { top: 10, bottom: 10, left: 12, right: 12 },
  activeOpacity: 0.8,
}))`
  align-items: center;
  width: 20%;
`;

const Label = styled.Text<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.scaleFont(13 * theme.fontScale)};

  margin-top: 5px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#001830' : '#6D767F')};
`;
