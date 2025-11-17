import React, { useEffect, useRef } from 'react';
import {
  Modal,
  Animated,
  Easing,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import styled, { css } from 'styled-components/native';

type BaseProps = {
  visible: boolean;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  dismissOnBackdrop?: boolean;
  onRequestClose?: () => void;
};

type ConfirmModalProps = BaseProps & {
  confirmText?: string;
  onConfirm: (e?: GestureResponderEvent) => void;
};

type ActionModalProps = BaseProps & {
  confirmText?: string;
  cancelText?: string;
  onConfirm: (e?: GestureResponderEvent) => void;
  onCancel: (e?: GestureResponderEvent) => void;
  destructive?: boolean;
};

// ---- Animation Hook
const useFadeScale = (visible: boolean) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 16,
          stiffness: 180,
          mass: 0.6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 120,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.96,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [opacity, scale, visible]);

  return { opacity, scale };
};

// ---- Base Card
const BaseCard: React.FC<BaseProps & { footer: React.ReactNode }> = ({
  visible,
  title,
  description,
  icon,
  dismissOnBackdrop = false,
  onRequestClose,
  footer,
}) => {
  const { opacity, scale } = useFadeScale(visible);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <Overlay>
        <Pressable
          style={{ position: 'absolute', inset: 0 }}
          onPress={dismissOnBackdrop ? onRequestClose : undefined}
        />
        <Card style={{ opacity, transform: [{ scale }] }}>
          {icon ? (
            <IconWrap>
              <IconBg>{icon}</IconBg>
            </IconWrap>
          ) : null}

          <Title numberOfLines={2}>{title}</Title>
          {description ? <Desc>{description}</Desc> : null}
          <Footer>{footer}</Footer>
        </Card>
      </Overlay>
    </Modal>
  );
};

// ---- Public Modals
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  description,
  icon,
  confirmText = '확인',
  onConfirm,
  dismissOnBackdrop = false,
  onRequestClose,
}) => (
  <BaseCard
    visible={visible}
    title={title}
    description={description}
    icon={icon}
    dismissOnBackdrop={dismissOnBackdrop}
    onRequestClose={onRequestClose}
    footer={
      <Button variant="primary" onPress={onConfirm}>
        <BtnText variant="primary">{confirmText}</BtnText>
      </Button>
    }
  />
);

export const ActionModal: React.FC<ActionModalProps> = ({
  visible,
  title,
  description,
  icon,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  destructive = false,
  dismissOnBackdrop = false,
  onRequestClose,
}) => (
  <BaseCard
    visible={visible}
    title={title}
    description={description}
    icon={icon}
    dismissOnBackdrop={dismissOnBackdrop}
    onRequestClose={onRequestClose}
    footer={
      <Row>
        <Button variant="muted" onPress={onCancel}>
          <BtnText variant="muted">{cancelText}</BtnText>
        </Button>
        <Button
          variant={destructive ? 'destructive' : 'primary'}
          onPress={onConfirm}
        >
          <BtnText variant={destructive ? 'destructive' : 'primary'}>
            {confirmText}
          </BtnText>
        </Button>
      </Row>
    }
  />
);

const AnimatedCard = Animated.createAnimatedComponent(styled.View``);

const Overlay = styled.View`
  flex: 1;
  background-color: ${({ theme }) =>
    theme?.colors?.white ?? 'rgba(0,0,0,0.44)'};
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled(AnimatedCard)`
  width: 100%;
  background-color: ${({ theme }) => theme?.colors?.white ?? '#FFFFFF'};
  border-radius: 22px;
  padding: 10px;
`;

const IconWrap = styled.View`
  align-items: center;
  margin-bottom: 12px;
`;

const IconBg = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme?.colors?.black ?? '#0B1020'};
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`;

const Desc = styled.Text`
  color: ${({ theme }) => theme?.colors?.black ?? '#697085'};
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
  line-height: 20px;
`;

const Footer = styled.View`
  margin-top: 16px;
`;

const Row = styled.View`
  flex-direction: row;
  gap: 10px;
`;

type BtnProps = {
  variant?: 'primary' | 'muted' | 'destructive';
};

const Button = styled(Pressable)<BtnProps>`
  flex: 1;
  height: 48px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  padding: 0 14px;

  ${({ variant, theme }) => {
    const colors = theme?.colors ?? {};
    if (variant === 'muted') {
      return css`
        background-color: ${colors.black ?? '#E9EDF3'};
      `;
    }
    if (variant === 'destructive') {
      return css`
        background-color: ${colors.bluePrimary ?? '#D92D20'};
      `;
    }
    return css`
      background-color: ${colors.bluePrimary ?? '#0D1B2A'};
    `;
  }}
`;

const BtnText = styled.Text<BtnProps>`
  font-size: 15px;
  font-weight: 700;

  ${({ variant, theme }) => {
    const colors = theme?.colors ?? {};
    if (variant === 'muted') {
      return css`
        color: ${colors.white};
      `;
    }
    return css`
      color: ${colors.bluePrimary ?? '#FFFFFF'};
    `;
  }}
`;
