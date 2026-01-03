import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

import Handle from '../../assets/common/handle_yellow.svg';
import Transportation from '../../assets/common/transportation_yellow.svg';
import Record from '../../assets/common/record_yellow.svg';
import Point from '../../assets/common/point_yellow.svg';
import Setting from '../../assets/common/setting_yellow.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Car from '../../assets/drivingRecord/car.svg';

const { width } = Dimensions.get('window');

const HORIZONTAL_PADDING = 20;
const GAP = 10;
const TILE_SIZE = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;

const DIAMOND_SIZE = 140;
const DIAMOND_TOP = TILE_SIZE + GAP / 2 - DIAMOND_SIZE / 2;

const Home = () => {
  const today = new Date();
  const dateText = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const navigation = useNavigation();
  const route = useRoute<any>();

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <Scroll
        contentContainerStyle={{
          paddingHorizontal: HORIZONTAL_PADDING,
          paddingBottom: 40,
          justifyContent: 'center',
        }}
      >
        <Header>
          <DateText>{dateText}</DateText>
          <Greeting>안녕하세요 운전자 님, 무엇을 시작할까요?</Greeting>

          <RightIconWrapper>
            <Car />
          </RightIconWrapper>
          <DashedDivider />
        </Header>

        <GridArea>
          <Row>
            <Tile
              activeOpacity={0.8}
              onPress={() => navigation.navigate('DrivingRecord' as never)}
              style={{ paddingBottom: 40, paddingRight: 40 }}
            >
              <IconWrap>
                <Record />
              </IconWrap>
              <TileLabel>기록</TileLabel>
            </Tile>

            <Tile
              onPress={() =>
                navigation.navigate('AlternativeTransportation' as never)
              }
              activeOpacity={0.8}
              style={{ paddingBottom: 40, paddingLeft: 40 }}
            >
              <IconWrap>
                <Transportation />
              </IconWrap>
              <TileLabel>이동</TileLabel>
            </Tile>
          </Row>

          <Row>
            <Tile
              onPress={() => navigation.navigate('Point' as never)}
              activeOpacity={0.8}
              style={{ paddingTop: 40, paddingRight: 40 }}
            >
              <IconWrap>
                <Point />
              </IconWrap>
              <TileLabel>포인트</TileLabel>
            </Tile>

            <Tile
              onPress={() => navigation.navigate('Setting' as never)}
              activeOpacity={0.8}
              style={{ paddingTop: 40, paddingLeft: 40 }}
            >
              <IconWrap>
                <Setting />
              </IconWrap>
              <TileLabel>설정</TileLabel>
            </Tile>
          </Row>

          <DiamondButton
            onPress={() => navigation.navigate('DrivingAction' as never)}
            activeOpacity={0.9}
          >
            <Diamond style={{ transform: [{ rotate: '45deg' }] }}>
              <DiamondInner style={{ transform: [{ rotate: '-45deg' }] }}>
                <DiamondIconWrap>
                  <Handle />
                </DiamondIconWrap>
                <DiamondLabel>운전</DiamondLabel>
              </DiamondInner>
            </Diamond>
          </DiamondButton>
        </GridArea>
      </Scroll>
      <GuideWrapper>
        <GuideButton
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Manual' as never)}
        >
          <GuideText>사용법{'\n'}안내</GuideText>
        </GuideButton>
      </GuideWrapper>
      <PolicyContainer>
        {/* <PolicyButton onPress={() => navigation.navigate('Policy' as never)}>
          <PolicyText>이용약관</PolicyText>
        </PolicyButton> */}

        <PolicyButton onPress={() => navigation.navigate('Privacy' as never)}>
          <PolicyText>개인정보처리방침</PolicyText>
        </PolicyButton>
      </PolicyContainer>
    </SafeAreaView>
  );
};

export default Home;

const Scroll = styled.ScrollView.attrs({})``;

const Header = styled.View`
  width: 100%;
  margin-top: 100px;
  position: relative;
`;

const DateText = styled.Text`
  color: #6b7280;
  font-size: ${({ theme }) => theme.scaleFont(22 * theme.fontScale)};
`;

const Greeting = styled.Text`
  color: #0f172a;
  font-size: ${({ theme }) => theme.scaleFont(30 * theme.fontScale)};
  line-height: 45px;
  font-weight: 700;
  margin-top: 6px;
  margin-right: 60px;
  margin-bottom: 20px;
`;

const RightIconWrapper = styled.View`
  position: absolute;
  right: 0;
  bottom: 14;
  opacity: 0.4;
`;
const DashedDivider = styled.View`
  margin: 18px 0 14px;
  border-top-width: 1px;
  border-style: dashed;
  border-color: #d1d5db;
`;

const GridArea = styled.View`
  margin-top: 6px;
  padding-bottom: 32px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${GAP}px;
`;

const Tile = styled.TouchableOpacity`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  background-color: #081a2e;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  padding: 14px;
`;

const IconWrap = styled.View`
  margin-bottom: 15px;
`;

const TileLabel = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  font-weight: 600;
`;

const DiamondButton = styled.TouchableOpacity`
  position: absolute;
  top: ${DIAMOND_TOP}px;
  align-self: center;
`;

const Diamond = styled.View`
  width: ${DIAMOND_SIZE}px;
  height: ${DIAMOND_SIZE}px;
  background-color: #081a2e;
  border-radius: 20px;
  border-width: 8px;
  border-color: #fff;
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
  margin-bottom: 10px;
`;

const DiamondLabel = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  font-weight: 600;
  color: white;
`;

const GuideWrapper = styled.View`
  position: absolute;
  bottom: 70px;
  right: 20px;
  z-index: 999;
`;

const GuideButton = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  background-color: #ffffff;
  border-width: 3px;
  border-color: #396bb0;
  border-radius: 1000px;

  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  shadow-offset: 0px 3px;
  elevation: 3;
`;

const GuideText = styled.Text`
  text-align: center;
  color: #396bb0;
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  line-height: 22px;
  font-weight: 700;
`;

const PolicyContainer = styled.View`
  margin-top: ${({ theme }) => theme.scale(6)}px;
  margin-bottom: ${({ theme }) => theme.scale(10)}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PolicyButton = styled.TouchableOpacity``;

const PolicyText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(11)}px;
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.gray400};
`;
