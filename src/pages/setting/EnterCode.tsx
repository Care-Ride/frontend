import React, { useMemo, useState } from 'react';
import { Modal, Pressable, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/common/BackButton';
import {
  postLinkConnect,
  patchMemberLinkInfo,
} from '../../api/member-controller';
import { BottomButton } from '../../components/common/BottomButton';
import { SimpleInfoModal } from '../../components/common/Modal';

type RelationType =
  | 'PARENT'
  | 'CHILD'
  | 'GRANDPARENT'
  | 'GRANDCHILD'
  | 'CAREGIVER'
  | 'FRIEND'
  | 'CUSTOM';

const RELATION_LABEL: Record<RelationType, string> = {
  PARENT: '부모',
  CHILD: '자녀',
  GRANDPARENT: '조부모',
  GRANDCHILD: '손자녀',
  CAREGIVER: '보호자/돌봄자',
  FRIEND: '친구',
  CUSTOM: '직접 입력',
};

const RELATION_OPTIONS: RelationType[] = [
  'PARENT',
  'CHILD',
  'GRANDPARENT',
  'GRANDCHILD',
  'CAREGIVER',
  'FRIEND',
  'CUSTOM',
];

type ResultModalState = {
  visible: boolean;
  title: string;
  body: string;
  isSuccess: boolean;
};

const EnterCode = () => {
  const [code, setCode] = useState('');
  const [relationType, setRelationType] = useState<RelationType | null>(null);
  const [customRelation, setCustomRelation] = useState('');
  const [name, setName] = useState('');
  const [relationModalOpen, setRelationModalOpen] = useState(false);

  const [resultModal, setResultModal] = useState<ResultModalState>({
    visible: false,
    title: '',
    body: '',
    isSuccess: false,
  });

  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [codeError, setCodeError] = useState<string>('');

  const navigation = useNavigation();

  const isValidCode = code.trim().length === 6;

  const isValidRelation = useMemo(() => {
    if (!relationType) return false;
    if (relationType === 'CUSTOM') return customRelation.trim().length > 0;
    return true;
  }, [relationType, customRelation]);

  const isValidName = name.trim().length > 0;

  const canSubmit = isVerified && isValidRelation && isValidName;

  const handleVerify = async () => {
    if (!isValidCode || isVerifying) return;

    setIsVerifying(true);
    setCodeError('');
    try {
      await postLinkConnect(code);
      setIsVerified(true);

      setResultModal({
        visible: true,
        isSuccess: true,
        title: '인증 완료',
        body: '연동 코드 인증이 완료되었습니다.',
      });
    } catch (e: any) {
      setIsVerified(false);

      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        '연동 코드 인증에 실패했습니다.';

      if (status === 409) {
        setResultModal({
          visible: true,
          isSuccess: false,
          title: '인증 실패',
          body: `${
            msg || '이미 연동된 코드입니다.'
          }\n다른 코드를 입력해주세요.`,
        });
        return;
      }

      setCodeError('* 코드가 일치하지 않습니다');

      setResultModal({
        visible: true,
        isSuccess: false,
        title: '인증 실패',
        body: `${msg} 코드를 다시 확인해주세요.`,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const onSelectRelation = (value: RelationType) => {
    setRelationType(value);
    if (value !== 'CUSTOM') setCustomRelation('');
    setRelationModalOpen(false);
  };

  const handleConfirm = async () => {
    if (!canSubmit) return;
    if (!relationType) return;

    const relationToSend =
      relationType === 'CUSTOM' ? customRelation.trim() : relationType;

    try {
      await patchMemberLinkInfo(relationToSend, name.trim());

      setResultModal({
        visible: true,
        isSuccess: true,
        title: '연동 성공',
        body: '운전자 연동이 완료되었습니다.',
      });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        '운전자 연동에 실패했습니다.';

      setResultModal({
        visible: true,
        isSuccess: false,
        title: '연동 실패',
        body: `${msg} '잠시 후 다시 시도해주세요.`,
      });
    }
  };

  const closeResultModal = () => {
    setResultModal(prev => ({ ...prev, visible: false }));
  };

  const onResultConfirm = () => {
    if (resultModal.isSuccess && resultModal.title === '연동 성공') {
      closeResultModal();
      navigation.goBack();
      return;
    }
    closeResultModal();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <Title>운전자 연동하기</Title>

        <CodeContainer>
          <Label>연동 코드</Label>
          <Description>
            * 연동 코드는 운전자 앱 &gt; 설정 &gt; 보호자 연동 관리에서 확인할
            수 있습니다
          </Description>

          <CodeInputContainer>
            <CodeInput
              placeholder="6자리 인증코드 입력"
              value={code}
              onChangeText={v => {
                setCode(v);
                setIsVerified(false);
                setCodeError('');
              }}
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor="#A0A0A0"
            />
            <VerifyButton
              onPress={handleVerify}
              disabled={!isValidCode || isVerifying || isVerified}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <VerifyButtonText
                disabled={!isValidCode || isVerifying || isVerified}
              >
                {isVerified
                  ? '인증완료'
                  : isVerifying
                  ? '확인중...'
                  : '인증하기'}
              </VerifyButtonText>
            </VerifyButton>
          </CodeInputContainer>
          {codeError.length > 0 && (
            <ErrorText accessibilityRole="text">{codeError}</ErrorText>
          )}
        </CodeContainer>

        <CodeContainer>
          <Label>관계</Label>

          <SelectContainer
            activeOpacity={0.85}
            onPress={() => setRelationModalOpen(true)}
          >
            <SelectText hasValue={!!relationType}>
              {relationType
                ? RELATION_LABEL[relationType]
                : '운전자와의 관계 선택'}
            </SelectText>
            <Chevron>▾</Chevron>
          </SelectContainer>

          {relationType === 'CUSTOM' && (
            <CodeInputContainer>
              <CodeInput
                placeholder="관계를 직접 입력해주세요"
                value={customRelation}
                onChangeText={setCustomRelation}
                maxLength={20}
                placeholderTextColor="#A0A0A0"
              />
            </CodeInputContainer>
          )}
        </CodeContainer>

        <CodeContainer>
          <Label>운전자 성함</Label>
          <CodeInputContainer>
            <CodeInput
              placeholder="운전자 성함 입력"
              value={name}
              onChangeText={setName}
              maxLength={20}
              placeholderTextColor="#A0A0A0"
            />
          </CodeInputContainer>
        </CodeContainer>

        <BottomButton
          text="확인"
          onPress={() => {
            handleConfirm();
          }}
          disabled={!canSubmit}
        />

        <Modal
          visible={relationModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setRelationModalOpen(false)}
        >
          <Overlay>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => setRelationModalOpen(false)}
            />

            <Sheet>
              <SheetHeader>
                <SheetTitle>관계 선택</SheetTitle>
                <CloseText onPress={() => setRelationModalOpen(false)}>
                  닫기
                </CloseText>
              </SheetHeader>

              <FlatList
                data={RELATION_OPTIONS}
                keyExtractor={item => item}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => {
                  const selected = relationType === item;
                  return (
                    <OptionRow
                      onPress={() => onSelectRelation(item)}
                      activeOpacity={0.85}
                    >
                      <OptionText selected={selected}>
                        {RELATION_LABEL[item]}
                      </OptionText>
                      {selected && <Check>✓</Check>}
                    </OptionRow>
                  );
                }}
              />
            </Sheet>
          </Overlay>
        </Modal>
        <SimpleInfoModal
          visible={resultModal.visible}
          title={resultModal.title}
          body={resultModal.body}
          confirmText="확인"
          onConfirm={onResultConfirm}
          onRequestClose={closeResultModal}
        />
      </Container>
    </SafeAreaView>
  );
};

export default EnterCode;
const Container = styled.View`
  flex: 1;
  margin: 0 20px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};
  font-weight: 600;
  padding: 30px 0;
`;

const CodeContainer = styled.View`
  margin-top: 10px;
`;

const Label = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  font-weight: 600;
`;

const Description = styled.Text`
  margin-top: 4px;
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  color: #555555;
`;

const CodeInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 12px 0;
  padding: 0 6px 0 16px;
  height: 55px;
  border-radius: 22px;
  background-color: #feefd2;
  border: 1px solid ${({ theme }) => theme.colors.yellowPrimary};
`;

const ErrorText = styled.Text`
  margin-top: -6px;
  margin-bottom: 10px;
  margin-left: 6px;
  font-size: ${({ theme }) => theme.scaleFont(13 * theme.fontScale)};
  color: #d32f2f;
  font-weight: 600;
`;

const CodeInput = styled.TextInput`
  flex: 1;
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  color: #000000;
`;

const VerifyButton = styled.TouchableOpacity<{ disabled: boolean }>`
  height: 43px;
  padding: 0 18px;
  border-radius: 21px;
  border: 1px solid #a47e14;
  background-color: ${({ theme, disabled }) =>
    disabled ? '#F2DFA5' : theme.colors.yellowPrimary};
  align-items: center;
  justify-content: center;
`;

const VerifyButtonText = styled.Text<{ disabled: boolean }>`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  font-weight: 500;
  color: ${({ disabled }) => (disabled ? '#A0A0A0' : '#000000')};
`;

const SelectContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0 12px 0;
  padding: 0 16px;
  height: 55px;
  border-radius: 22px;
  background-color: #feefd2;
  border: 1px solid ${({ theme }) => theme.colors.yellowPrimary};
`;

const SelectText = styled.Text<{ hasValue: boolean }>`
  flex: 1;
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  color: ${({ hasValue }) => (hasValue ? '#000000' : '#A0A0A0')};
`;

const Chevron = styled.Text`
  margin-left: 8px;
  font-size: 16px;
  color: #000000;
`;

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.35);
  justify-content: flex-end;
`;

const Sheet = styled.View`
  background-color: #ffffff;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  padding: 14px 16px 18px 16px;
  max-height: 420px;
`;

const SheetHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
`;

const SheetTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #000000;
`;

const CloseText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #555555;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #eeeeee;
`;

const OptionRow = styled.TouchableOpacity`
  padding: 14px 4px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const OptionText = styled.Text<{ selected: boolean }>`
  font-size: 15px;
  font-weight: ${({ selected }) => (selected ? 700 : 500)};
  color: #000000;
`;

const Check = styled.Text`
  font-size: 16px;
  font-weight: 900;
  color: #000000;
`;
