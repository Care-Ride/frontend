import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { LevelSetting } from '../../components/common/LevelSetting';
import Sound from '../../assets/setting/sound.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import SettingText from '../../components/common/SettingText';
import StepIndicator from '../../components/login/StepIndicator';
import BottomStepButtons from '../../components/common/BottomStepButton';

import { playTestSound, initSounds } from '../../utils/soundPlayer';

const FirstSoundSetting = () => {
  const route = useRoute<any>();
  const [soundLevel, setSoundLevel] = useState(3);
  const navigation = useNavigation();

  useEffect(() => {
    initSounds();
  }, []);

  const handleTest = () => {
    setTimeout(() => playTestSound(), 300);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <StepIndicator currentStep={2} />
        <SettingText
          title="소리 크기 설정"
          description="기기의 볼륨 조절 버튼을 눌러 적절한 소리 크기로 설정하세요"
          showRange={false}
        />
        <LevelSetting
          level={soundLevel}
          levelControl={false}
          onChangeLevel={setSoundLevel}
          onTestPress={handleTest}
          Icon={<Sound />}
          cardText="위의 버튼을 눌러 소리를 들어보세요."
        />
        <BottomStepButtons
          onPressPrev={() => navigation.goBack()}
          onPressNext={() => navigation.navigate('SettingDone', { soundLevel })}
          prevText="뒤로가기"
          nextText="다음"
        />
      </Container>
    </SafeAreaView>
  );
};

export default FirstSoundSetting;

const Container = styled.View`
  flex: 1;
  align-items: center;
  margin: 0 20px;
`;
