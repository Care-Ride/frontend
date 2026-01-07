import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import BackButton from '../../components/common/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import GifticonHistory from '../../components/point/GifticonHistory';
import { getGifticonHistoryList, getGifticonBarcode } from '../../api/gifticon-controller';
import BarcodeModal from '../../components/point/BarcodeModal';

export type BoughtGificonListProps = {
  id: number; // 바코드 id
  picture: string;
  brand: string;
  productName: string;
};

const ReceivedGift = () => {
  const [rows, setRows] = useState<BoughtGificonListProps[]>([]);
  const [productCount, setProductCount] = useState<number>(0);

  const readGifticonHistory = async () => {
    try {
      const response = await getGifticonHistoryList();
      const data = response?.data.data;

      const histories = data?.histories ?? [];
      const totalElements = data?.pageInfo?.totalElements ?? 0;

      const mappedRows: BoughtGificonListProps[] = histories.map((h: any) => ({
        id: h.barcodeId,
        picture: h.productImageUrl,
        brand: h.brandName,
        productName: h.productName,
      }));

      setRows(mappedRows);
      setProductCount(totalElements);
    } catch (err) {
      console.error(err);
    }
  };

  // 바코드 모달창 보여주기
  const [barcodeVisible, setBarcodeVisible] = useState(false);
  const [barcodeImageUrl, setBarcodeImageUrl] = useState<string | null>(null);
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const [selectedBarcodeId, setSelectedBarcodeId] = useState<number | null>(null);

  const openBarcodeModal = async (row: BoughtGificonListProps) => {
    setSelectedBarcodeId(row.id);
    setBarcodeVisible(true);
    setBarcodeLoading(true);
    setBarcodeImageUrl(null);

    try {
      const response = await getGifticonBarcode(row.id);
      const data = response?.data.data;

      const imageUrl =
        data?.barcodeImageUrl ??
        data?.imageUrl ??
        null;

      setBarcodeImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
      setBarcodeImageUrl(null);
    } finally {
      setBarcodeLoading(false);
    }
  };

  const closeBarcodeModal = () => {
    setBarcodeVisible(false);
    setSelectedBarcodeId(null);
    setBarcodeImageUrl(null);
    setBarcodeLoading(false);
  };


  useEffect(() => {
    readGifticonHistory();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <Title>구매 내역</Title>
        <ScrollContent>
          <GifticonHistory
            rows={rows}
            productCount={productCount}
            onPressBuy={openBarcodeModal}
          />
        </ScrollContent>

        {/* 바코드 모달 */}
        <BarcodeModal
          visible={barcodeVisible}
          barcodeImageUrl={barcodeImageUrl}
          loading={barcodeLoading}
          onClose={closeBarcodeModal}
        />
      </Container>
    </SafeAreaView>
  );
};

export default ReceivedGift;

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
