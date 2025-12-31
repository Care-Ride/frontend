import { useState } from 'react';
import { LevelSetting } from '../../components/common/LevelSetting';
import Sound from '../../assets/setting/sound.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import { SmallBottomButton } from '../../components/common/BottomButton';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { ActionModal } from '../../components/common/Modal';
import { SimpleInfoModal } from '../../components/common/Modal';
import { postWithdraw } from '../../api/auth-controller';
import { useAuth } from '../../AuthContext';

import Logout from '../../assets/common/logout.svg';

const REASONS = [
  '사용 빈도가 적음',
  '포인트가 너무 모이지 않음',
  '운전을 더이상 하지 않음',
  '제공하는 기능이 불편함',
  '기타',
];

const Withdraw = () => {
  const [level, setLevel] = useState(3);
  const navigation = useNavigation();
  const [selected, setSelected] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { signOut } = useAuth();

  const openWithdrawModal = () => {
    setWithdrawVisible(true);
  };

  const closeWithdrawModal = () => {
    setWithdrawVisible(false);
  };

  const handleWithdrawConfirm = async () => {
    const response = await postWithdraw();
    await signOut();
    console.log(response, 'withdraw');
    closeWithdrawModal();
    openConfirmModal();
  };

  const openConfirmModal = () => {
    setConfirmVisible(true);
  };

  const closeConfirmModal = () => {
    setConfirmVisible(false);
  };

  const handleConfirm = () => {
    closeConfirmModal();
  };

  const onSelect = reason => {
    setSelected(reason);
    if (reason !== '기타') {
      setOtherReason('');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <Title>탈퇴 사유</Title>
        <Description>운전노하우를 탈퇴하는 이유가 무엇인가요?</Description>
        <ReasonsContainer>
          {REASONS.map((reason, idx) => (
            <ReasonRow key={idx} onPress={() => onSelect(reason)}>
              <RadioOuter $selected={selected === reason}>
                {selected === reason && <RadioInner />}
              </RadioOuter>
              <ReasonText>{reason}</ReasonText>
            </ReasonRow>
          ))}

          {selected === '기타' && (
            <OtherInput
              placeholder="탈퇴 사유를 자유롭게 작성해주세요."
              value={otherReason}
              onChangeText={setOtherReason}
              multiline
            />
          )}
        </ReasonsContainer>

        <SmallBottomButton text="탈퇴하기" onPress={openWithdrawModal} />

        <ActionModal
          visible={withdrawVisible}
          title="정말로 운전노하우를 탈퇴하시겠어요?"
          bodyLines={[
            '로그아웃 후에도 언제든지\n다시 로그인할 수 있습니다.',
            '로그아웃이 완료되면 자동으로\n로그인 화면으로 넘어갑니다.',
          ]}
          badgeIcon={<Logout />}
          confirmText="아니오"
          cancelText="예"
          onConfirm={closeWithdrawModal}
          onCancel={handleWithdrawConfirm}
          onRequestClose={closeWithdrawModal}
        />
        <SimpleInfoModal
          visible={confirmVisible}
          badgeIcon={<Logout />}
          title="탈퇴하였습니다"
          bodyLines={[
            '보내주신 응답으로 더 발전된 모습으로 돌아오는 운전노하우가 되겠습니다.',
          ]}
          confirmText="확인"
          onConfirm={handleConfirm}
          onCancel={closeConfirmModal}
          onRequestClose={closeConfirmModal}
        />
      </Container>
    </SafeAreaView>
  );
};

export default Withdraw;

const Container = styled.View`
  flex: 1;
  align-items: center;
  margin: 0 20px;
`;
const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  margin: 40px 0px 20px 0px;
`;

const Description = styled.Text`
  font-size: 18px;
`;
const ReasonsContainer = styled.View`
  margin-top: 30px;
  width: 90%;
`;

const ReasonRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 22px;
`;

const RadioOuter = styled.View<{ $selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border-width: 2px;
  border-color: ${({ $selected }) => ($selected ? '#F0C13D' : '#C8C8C8')};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;
const RadioInner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #f0c13d;
`;

const ReasonText = styled.Text`
  font-size: 17px;
`;

const OtherInput = styled.TextInput.attrs({
  placeholderTextColor: '#000000',
})`
  padding: 20px;
  background-color: #fff8e8;
  border: 1px solid ${({ theme }) => theme.colors.yellowPrimary};
  border-radius: 22px;
  font-size: 14px;
  text-align-vertical: top;
  font-weight: 300;
`;
