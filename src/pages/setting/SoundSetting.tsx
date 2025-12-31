import { useState } from 'react';
import { LevelSetting } from '../../components/common/LevelSetting';
import Sound from '../../assets/setting/sound.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import { SmallBottomButton } from '../../components/common/BottomButton';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import SettingText from '../../components/common/SettingText';

const SoundSetting = () => {
  const [level, setLevel] = useState(3);
  const navigation = useNavigation();

  const handleTest = () => {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <SettingText
          title="소리 크기 설정"
          description="단계별로 예시 소리를 듣고 적절한 소리 크기로 설정하세요"
        />
        <LevelSetting
          level={level}
          onChangeLevel={setLevel}
          onTestPress={handleTest}
          Icon={<Sound />}
          cardText="위의 버튼을 눌러 소리를 들어보세요."
        />

        <SmallBottomButton text="저장" onPress={() => navigation.goBack()} />
      </Container>
    </SafeAreaView>
  );
};

export default SoundSetting;

const Container = styled.View`
  flex: 1;
  align-items: center;
  margin: 0 20px;
`;
