import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components/native';
import BackButton from '../../components/common/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import UsePointList from '../../components/point/UsePointList';
import { useRoute } from '@react-navigation/native';

export type BuyStatus = '구매하기' | '구매불가';
export type UsePointListProps = {
  picture: string;
  brand: string;
  productName: string;
  price: number;
  status: BuyStatus;
};

const UsePoint = () => {
  const route = useRoute();
  const { point } = route.params as { point: number };

  const rows: UsePointListProps[] = useMemo(() => {
    const items: UsePointListProps[] = [
      {
        picture: 'https://picsum.photos/200/200?random=1',
        brand: '스타벅스',
        productName: '아메리카노 Tall',
        price: 4500,
        status: '구매불가',
      },
      {
        picture: 'https://picsum.photos/200/200?random=2',
        brand: '배스킨라빈스',
        productName: '싱글레귤러',
        price: 3900,
        status: '구매하기',
      },
      {
        picture: 'https://picsum.photos/200/200?random=3',
        brand: 'GS25',
        productName: '모바일 상품권 5,000원',
        price: 5000,
        status: '구매하기',
      },
      {
        picture: 'https://picsum.photos/200/200?random=4',
        brand: '교촌치킨',
        productName: '허니콤보',
        price: 23000,
        status: '구매하기',
      },
    ];
    return items;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <Title>포인트 사용하기</Title>
        <ScrollContent>
          <UsePointList rows={rows} point={point} />
        </ScrollContent>
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
