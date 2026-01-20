import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Pressable } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { getManualById } from './manuals.data';
import ArrowLeft from '../../assets/manuals/arrow_left.svg';
import ArrowRight from '../../assets/manuals/arrow_right.svg';
import BackButton from '../../components/common/BackButton';

type ManualDetailRouteParams = {
  ManualDetail: { manualId: string };
};

const ManualDetail = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ManualDetailRouteParams, 'ManualDetail'>>();

  const manual = useMemo(
    () => getManualById(route.params.manualId),
    [route.params.manualId],
  );
  const [page, setPage] = useState(0);

  if (!manual) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <BackButton />
        <NoManualContainer>
          <NoManualText>매뉴얼을 찾을 수 없습니다.</NoManualText>
          <BackBtn onPress={() => navigation.goBack()}>
            <BackBtnText>뒤로가기</BackBtnText>
          </BackBtn>
        </NoManualContainer>
      </SafeAreaView>
    );
  }

  const pages = manual.pages;
  const total = pages.length;
  const pageItem = pages[page];
  const PageSvg = pageItem.Image;
  const description = pageItem.description;

  const canPrev = page > 0;
  const canNext = page < total - 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />

      <Container>
        <HeaderContainer>
          <Title>{manual.title}</Title>
          <Indicator
            accessibilityRole="text"
            accessibilityLabel={`전체 ${total}페이지 중 ${page + 1}페이지`}
          >
            {page + 1} / {total}
          </Indicator>
        </HeaderContainer>
        <ContentContainer>
          <ImageWrapper>
            <PageSvg width="100%" height="100%" />
          </ImageWrapper>

          {description ? (
            <Description
              accessibilityRole="text"
              accessibilityLabel={`설명: ${description}`}
            >
              {description}
            </Description>
          ) : null}

          <ArrowOverlay pointerEvents="box-none">
            <Pressable
              onPress={() => canPrev && setPage(p => p - 1)}
              disabled={!canPrev}
              hitSlop={20}
              accessibilityRole="button"
              accessibilityLabel="이전으로 가기"
              accessibilityState={{ disabled: !canPrev }}
            >
              <ArrowLeft width={32} height={32} />
            </Pressable>

            <Pressable
              onPress={() => canNext && setPage(p => p + 1)}
              disabled={!canNext}
              hitSlop={20}
              accessibilityRole="button"
              accessibilityLabel="다음으로 가기"
              accessibilityState={{ disabled: !canNext }}
            >
              <ArrowRight width={32} height={32} />
            </Pressable>
          </ArrowOverlay>
        </ContentContainer>
      </Container>
    </SafeAreaView>
  );
};

export default ManualDetail;

const Container = styled.View`
  flex: 1;
  margin: 0 20px;
  align-items: center;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  gap: 10px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(24 * theme.fontScale)};
  font-weight: 600;
`;

const Indicator = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  color: ${({ theme }) => theme.colors.gray500};
`;

const ContentContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;

const ImageWrapper = styled.View`
  flex: 1;
  width: 90%;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};
  font-weight: 500;
  text-align: center;
  margin-bottom: 35px;
  line-height: ${({ theme }) => theme.scaleFont(30 * theme.fontScale)};
`;

const NoManualContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const NoManualText = styled.Text`
  font-size: 16px;
  margin-bottom: 12px;
`;

const BackBtn = styled.Pressable`
  padding: 10px 14px;
  border-radius: 10px;
  background-color: #111;
`;

const BackBtnText = styled.Text`
  color: white;
  font-weight: 600;
`;

const ArrowOverlay = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 45%;
  transform: translateY(-22px);
  flex-direction: row;
  justify-content: space-between;
`;
