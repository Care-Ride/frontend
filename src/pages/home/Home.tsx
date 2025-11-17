// Home.tsx
import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

// ↓ 아이콘 파일 경로/이름은 프로젝트에 맞게 조정
// 없으면 아래 FallbackIcon이 대신 렌더됨
import Handle from '../../assets/common/handle_black.svg';
import Transportation from '../../assets/common/transportation_black.svg';
import Record from '../../assets/common/transportation_black.svg';
import Setting from '../../assets/common/setting_black.svg';

const { width } = Dimensions.get('window');
const GAP = 16;
const TILE_SIZE = (width - 32 - GAP) / 2; // 좌우 패딩 16*2, 타일 사이 간격 GAP

const Home = () => {
  const today = new Date();
  const dateText = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const onPressRecord = () => {};
  const onPressAltTrans = () => {};
  const onPressStart = () => {};
  const onPressPoint = () => {};
  const onPressSetting = () => {};
  const onPressGuide = () => {};

  return (
    <Screen>
      <Scroll contentContainerStyle={{ paddingBottom: 40 }}>
        <Header>
          <DateText>{dateText}</DateText>
          <Greeting>안녕하세요, 운전자 님{'\n'}무엇을 시작할까요?</Greeting>
        </Header>

        <DashedDivider />

        <GridArea>
          <Row>
            <Tile onPress={onPressRecord} activeOpacity={0.8}>
              <IconWrap>
                {Record ? <Record /> : <FallbackIcon>📒</FallbackIcon>}
              </IconWrap>
              <TileLabel>나의 운전 기록</TileLabel>
            </Tile>

            <Tile onPress={onPressAltTrans} activeOpacity={0.8}>
              <IconWrap>
                {Transportation ? (
                  <Transportation />
                ) : (
                  <FallbackIcon>🚕</FallbackIcon>
                )}
              </IconWrap>
              <TileLabel>대체 이동 수단</TileLabel>
            </Tile>
          </Row>

          <Row>
            <Tile onPress={onPressPoint} activeOpacity={0.8}>
              <IconWrap>
                {/* 적절한 아이콘으로 바꿔도 됨 */}
                <FallbackIcon>🎯</FallbackIcon>
              </IconWrap>
              <TileLabel>포인트 얻기</TileLabel>
            </Tile>

            <Tile onPress={onPressSetting} activeOpacity={0.8}>
              <IconWrap>
                {Setting ? <Setting /> : <FallbackIcon>⚙️</FallbackIcon>}
              </IconWrap>
              <TileLabel>설정</TileLabel>
            </Tile>
          </Row>

          {/* 중앙 다이아몬드(겹침) */}
          <DiamondButton onPress={onPressStart} activeOpacity={0.9}>
            <Diamond>
              <DiamondInner>
                <DiamondIconWrap>
                  {Handle ? <Handle /> : <FallbackIcon>🚘</FallbackIcon>}
                </DiamondIconWrap>
                <DiamondLabel>운전 시작</DiamondLabel>
              </DiamondInner>
            </Diamond>
          </DiamondButton>
        </GridArea>

        {/* 사용법 안내 버튼 */}
        <GuideButton activeOpacity={0.9} onPress={onPressGuide}>
          <GuideText>사용법{'\n'}안내</GuideText>
        </GuideButton>
      </Scroll>
    </Screen>
  );
};

export default Home;

const Screen = styled.View`
  flex: 1;
  padding: 16px;
`;

const Scroll = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})``;

const Header = styled.View`
  gap: 10px;
  margin-top: 8px;
`;

const DateText = styled.Text`
  color: #6b7280;
  font-size: 14px;
`;

const Greeting = styled.Text`
  color: #0f172a;
  font-size: 22px;
  line-height: 30px;
  font-weight: 800;
`;

const DashedDivider = styled.View`
  margin: 18px 0 14px;
  border-top-width: 1px;
  border-style: dashed;
  border-color: #d1d5db;
`;

const GridArea = styled.View`
  margin-top: 6px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${GAP}px;
`;

const Tile = styled.TouchableOpacity`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  background-color: #081a2e; /* 진한 남색 */
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  padding: 14px;
`;

const IconWrap = styled.View`
  margin-bottom: 10px;
`;

const TileLabel = styled.Text`
  color: #d9b651; /* 골드 */
  font-size: 14px;
  font-weight: 700;
`;

const DiamondButton = styled.TouchableOpacity`
  position: absolute;
  top: ${TILE_SIZE - 28}px;
  align-self: center;
`;

const Diamond = styled.View`
  width: 100px;
  height: 100px;
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 8px;
  border-color: #081a2e;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 4;
`;

const DiamondInner = styled.View`
  align-items: center;
  justify-content: center;
`;

const DiamondIconWrap = styled.View`
  margin-bottom: 6px;
`;

const DiamondLabel = styled.Text`
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
`;

/* 사용법 안내 (오른쪽 아래) */
const GuideButton = styled.TouchableOpacity`
  position: absolute;
  right: 8px;
  bottom: 8px;
  background-color: #ffffff;
  border-width: 2px;
  border-color: #c7d2fe;
  border-radius: 22px;
  padding: 10px 12px;
  align-self: flex-end;

  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  shadow-offset: 0px 3px;
  elevation: 3;
`;

const GuideText = styled.Text`
  text-align: center;
  color: #1f2937;
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
`;

/* 아이콘 없을 때 임시 대체 */
const FallbackIcon = styled.Text`
  font-size: 22px;
`;
