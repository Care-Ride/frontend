import React, { ReactNode } from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';

export type SimpleInfoModalProps = {
  visible: boolean;
  badgeIcon?: ReactNode;
  title: string;
  bodyLines: string[];
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onRequestClose?: () => void;
};

export const SimpleInfoModal = ({
  visible,
  badgeIcon,
  title,
  bodyLines,
  confirmText = '확인',
  onConfirm,
  onRequestClose,
}: SimpleInfoModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onRequestClose}
    >
      <Backdrop>
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <BackdropInner />
        </TouchableWithoutFeedback>

        <Card>
          {badgeIcon ? (
            <BadgeWrapper>
              <Badge>{badgeIcon}</Badge>
            </BadgeWrapper>
          ) : null}
          <Title>{title}</Title>

          <BodyContainer>
            {bodyLines.map((line, idx) => (
              <BodyText key={`${line}-${idx}`}>{line}</BodyText>
            ))}
          </BodyContainer>

          <ConfirmButton onPress={onConfirm}>
            <ConfirmText>{confirmText}</ConfirmText>
          </ConfirmButton>
        </Card>
      </Backdrop>
    </Modal>
  );
};

export const ActionModal = ({
  visible,
  badgeIcon,
  title,
  bodyLines,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel = () => {},
  onRequestClose,
}: SimpleInfoModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onRequestClose}
    >
      <Backdrop>
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <BackdropInner />
        </TouchableWithoutFeedback>

        <Card>
          {badgeIcon ? (
            <BadgeWrapper>
              <Badge>{badgeIcon}</Badge>
            </BadgeWrapper>
          ) : null}
          <Title>{title}</Title>

          <BodyContainer>
            {bodyLines.map((line, idx) => (
              <BodyText key={`${line}-${idx}`}>{line}</BodyText>
            ))}
          </BodyContainer>

          <ButtonContainer>
            <CancelButton onPress={onCancel}>
              <CancelText>{cancelText}</CancelText>
            </CancelButton>
            <ConfirmButton onPress={onConfirm}>
              <ConfirmText>{confirmText}</ConfirmText>
            </ConfirmButton>
          </ButtonContainer>
        </Card>
      </Backdrop>
    </Modal>
  );
};

const Backdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
`;

const BackdropInner = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Card = styled.View`
  width: 75%;
  padding: 28px 24px 24px 24px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.white};
  align-items: center;
  elevation: 4;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 12px;
  shadow-offset: 0px 4px;
`;

const BadgeWrapper = styled.View`
  margin-bottom: 16px;
`;

const Badge = styled.View`
  justify-content: center;
  align-items: center;
  width: 65px;
  height: 65px;
  border-radius: 500px;
  background-color: ${({ theme }) => theme.colors.bluePrimary};
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(24 * theme.fontScale)};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
  margin-bottom: 12px;
`;

const BodyContainer = styled.View`
  margin-bottom: 24px;
`;

const BodyText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  line-height: 25px;
  text-align: center;
  color: ${({ theme }) => theme.colors.black};
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const CancelButton = styled.TouchableOpacity`
  width: 47%;
  height: 44px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.gray200};
  justify-content: center;
  align-items: center;
`;

const CancelText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(15 * theme.fontScale)};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.bluePrimary};
`;

const ConfirmButton = styled.TouchableOpacity`
  width: 47%;
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
