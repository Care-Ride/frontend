import React, { useEffect, useState } from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';

type BarcodeModalProps = {
  visible: boolean;
  barcodeImageUrl: string | null;
  loading: boolean;
  onClose: () => void;
};

const BarcodeModal = ({
  visible,
  barcodeImageUrl,
  loading,
  onClose,
}: BarcodeModalProps) => {
  const [ratio, setRatio] = useState<number>(1 / 2);

  useEffect(() => {
    if (barcodeImageUrl) setRatio(1 / 2);
  }, [barcodeImageUrl]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Backdrop>
        {/* 배경 탭하면 닫기 */}
        <TouchableWithoutFeedback onPress={onClose}>
          <BackdropInner />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback>
          <BarcodeCard>
            {loading ? (
              <BodyText>불러오는중 ..</BodyText>
            ) : barcodeImageUrl ? (
              <BarcodeImage
                source={{ uri: barcodeImageUrl }}
                resizeMode="contain"
                style={{ aspectRatio: ratio }} 
                onLoad={(e) => {
                  const { width, height } = e.nativeEvent.source;
                  if (width && height) setRatio(width / height);
                }}
              />
            ) : (
              <BodyText>바코드를 불러올 수 없습니다.</BodyText>
            )}
          </BarcodeCard>
        </TouchableWithoutFeedback>
      </Backdrop>
    </Modal>
  );
};

export default BarcodeModal;

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

const BarcodeCard = styled.View`
  width: 80%;
  max-height: 80%;
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  justify-content: center;
  align-items: center;
`;

const BarcodeImage = styled.Image`
  width: 100%;
  max-height: 100%;
`;

const BodyText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  line-height: 25px;
  text-align: center;
  color: ${({ theme }) => theme.colors.black};
`;
