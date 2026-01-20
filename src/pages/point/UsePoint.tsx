import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components/native';
import BackButton from '../../components/common/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import UsePointList from '../../components/point/UsePointList';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getGifticonProductList,
  purchaseGifticon,
} from '../../api/gifticon-controller';
import { ActionModal } from '../../components/common/Modal';

export type BuyStatus = '구매하기' | '구매불가';
export type UsePointListProps = {
  id: number;
  picture: string;
  brand: string;
  productName: string;
  price: number;
  status: BuyStatus;
};

const UsePoint = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const initialPoint = (route.params as { point?: number })?.point ?? 0;
  const [point, setPoint] = useState<number>(initialPoint);
  const [rows, setRows] = useState<UsePointListProps[]>([]);

  const [buyVisible, setBuyVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<UsePointListProps | null>(null);
  const [buyLoading, setBuyLoading] = useState(false);

  const openBuyModal = (row: UsePointListProps) => {
    setSelectedProduct(row);
    setBuyVisible(true);
  };

  const closeBuyModal = () => {
    if (buyLoading) return; // 구매 중엔 닫히지 않게
    setBuyVisible(false);
    setSelectedProduct(null);
  };

  const readGifticonList = async () => {
    try {
      const response = await getGifticonProductList();
      const data = response?.data.data;

      const products = data?.products ?? [];
      const pointBalance = data?.pointBalance;

      const effectivePoint =
        typeof pointBalance === 'number' ? pointBalance : point;

      if (typeof pointBalance === 'number') {
        setPoint(pointBalance);
      }

      const mappedRows: UsePointListProps[] = products.map((p: any) => {
        const canBuy = effectivePoint >= p.requiredPoint && p.stock > 0;
        return {
          id: p.id,
          picture: p.imageUrl,
          brand: p.brandName,
          productName: p.productName,
          price: p.requiredPoint,
          status: canBuy ? '구매하기' : '구매불가',
        };
      });

      setRows(mappedRows);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    readGifticonList();
  }, []);

  // 구매 확정
  const handleBuyConfirm = async () => {
    if (!selectedProduct) return;

    try {
      setBuyLoading(true);

      const response = await purchaseGifticon(selectedProduct.id);
      const purchased = response?.data.data;

      // 모달 닫기
      setBuyVisible(false);
      setSelectedProduct(null);
      navigation.navigate('ReceivedGift' as never);
    } catch (err) {
      console.error(err);
    } finally {
      setBuyLoading(false);
    }
  };

  const modalTitle = selectedProduct
    ? `${selectedProduct.brand}\n ${selectedProduct.productName}\n정말 구매할까요?`
    : '정말 구매할까요?';

  const modalBody = selectedProduct
    ? `${selectedProduct.price}P가 차감됩니다.\n구매 후 잔여포인트: ${
        point - selectedProduct.price
      }P`
    : '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <Title>포인트 사용하기</Title>
        <ScrollContent>
          <UsePointList rows={rows} point={point} onPressBuy={openBuyModal} />
        </ScrollContent>

        {/* 구매 확인 모달 */}
        <ActionModal
          visible={buyVisible}
          title={modalTitle}
          body={modalBody}
          confirmText="구매하기"
          cancelText="취소"
          onConfirm={handleBuyConfirm}
          onCancel={closeBuyModal}
          onRequestClose={closeBuyModal}
        />
      </Container>
    </SafeAreaView>
  );
};

export default UsePoint;

const Container = styled.View`
  flex: 1;
  padding: 0 20px 20px 20px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(24 * theme.fontScale)};
  font-weight: 600;
  text-align: center;
  margin-top: 8px;
`;

const ScrollContent = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    paddingBottom: 80,
  },
}))``;
