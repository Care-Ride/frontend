import { useState, useEffect } from 'react';
import { LevelSetting } from '../../components/common/LevelSetting';
import Vibration from '../../assets/setting/vibration.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import { SmallBottomButton } from '../../components/common/BottomButton';
import { useNavigation } from '@react-navigation/native';
import styled, { useTheme } from 'styled-components/native';
import SettingText from '../../components/common/SettingText';
import { FONT_LEVEL_SCALE } from '../../styles/fontLevel';
import { useFontLevel } from '../../FontLevelProvider';

const FontSetting = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { level: globalLevel, setLevel: setGlobalLevel } = useFontLevel();
  const [localLevel, setLocalLevel] = useState(globalLevel);

  // 전역 레벨이 바뀌면 화면 들어올 때 한 번 동기화
  useEffect(() => {
    setLocalLevel(globalLevel);
  }, [globalLevel]);

  const previewFontSize = theme.scaleFont(
    16 * (FONT_LEVEL_SCALE[localLevel] ?? 1),
  );
  const handleTest = () => {};

  const handleSave = () => {
    setGlobalLevel(localLevel);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <SettingText
          title="글자 크기 변경"
          description="단계별로 예시 화면에 표시되는 글자를 보고 적절한 글씨 크기로 설정하세요."
        />
        <LevelSetting
          level={localLevel}
          levelControl={true}
          onChangeLevel={setLocalLevel}
          onTestPress={handleTest}
          preview={
            <PreviewBox>
              <PreviewText style={{ fontSize: previewFontSize }}>
                글자가 이 크기로 표시됩니다.{'\n'}
                현재 {localLevel}단계입니다.{'\n'}
                적용 화면 예시입니다.
              </PreviewText>
            </PreviewBox>
          }
        />

        <SmallBottomButton text="저장" onPress={handleSave} />
      </Container>
    </SafeAreaView>
  );
};

export default FontSetting;

const Container = styled.View`
  flex: 1;
  align-items: center;
  margin: 0 20px;
`;
const PreviewBox = styled.View`
  align-self: stretch;
  margin-top: 16px;
  padding: 19px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.yellowSecondary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.yellowPrimary};
`;

const PreviewText = styled.Text`
  text-align: left;
  line-height: ${({ theme }) => theme.scaleFont(27)};
`;
