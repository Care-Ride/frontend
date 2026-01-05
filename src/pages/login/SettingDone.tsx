import React, { ReactNode } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import SettingRound from '../../assets/common/setting_round.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { postDeviceSetting } from '../../api/member-controller';

import { useAuth } from '../../AuthContext';
import { api } from '../../api/api';

const SettingDone = () => {
  const { state, setFromServer } = useAuth();
  const route = useRoute<any>();

  const { soundLevel, localLevel } = route.params;
  console.log(soundLevel, localLevel);
  console.log(state, 'state');

  const createSetting = async () => {
    try {
      await postDeviceSetting(localLevel, soundLevel);

      if (!state.provider || !state.tokens?.accessToken) {
        console.log('auth state missing:', state);
        return;
      }

      await setFromServer(state.provider!, {
        //user: data.user,
        accessToken: state.tokens.accessToken,
        hasDeviceSetting: true,
      });
    } catch (err: any) {
      console.error(err?.response);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}
    >
      <BadgeWrapper>
        <SettingRound />
      </BadgeWrapper>

      <Title>초기 설정 완료</Title>

      <BodyContainer>
        <BodyText>
          개인 맞춤 설정이 끝났습니다. 최적화된 운전노하우를 사용해보세요.
          {'\n\n'}
        </BodyText>

        <BodyText>
          설정은 홈화면의 개인 맞춤 설정에서 언제든 다시 변경할 수 있어요.
        </BodyText>
      </BodyContainer>

      <ConfirmButton onPress={createSetting} accessibilityRole="button">
        <ConfirmText>확인</ConfirmText>
      </ConfirmButton>
    </SafeAreaView>
  );
};

export default SettingDone;

const BadgeWrapper = styled.View`
  margin-bottom: 30px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(24 * theme.fontScale)};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
  margin-bottom: 30px;
`;

const BodyContainer = styled.View`
  width: 72%;
  margin-bottom: 60px;
`;

const BodyText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  line-height: 27px;
  text-align: center;
  color: ${({ theme }) => theme.colors.black};
`;

const ConfirmButton = styled.TouchableOpacity`
  width: 35%;
  height: 44px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.bluePrimary};
  justify-content: center;
  align-items: center;
`;

const ConfirmText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(15 * theme.fontScale)};
  font-weight: 600;
  color: #ffffff;
`;
