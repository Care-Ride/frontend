import Sound from 'react-native-sound';

// 사운드 파일은 android/app/src/main/res/raw, iOS는 bundle에 넣어두고 사용
// 예시로 'test_sound.mp3' 파일을 사용한다고 가정

let testSound: Sound | null = null;

export const initSounds = () => {
  // iOS에서 카테고리 지정 (필요 시)
  Sound.setCategory('Playback');

  testSound = new Sound('test_sound.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('Failed to load sound', error);
      return;
    }
    console.log('Test sound loaded');
  });
};

export const playTestSound = (volume: number) => {
  if (!testSound) {
    console.log('Test sound not loaded yet');
    return;
  }

  // 볼륨 0.0 ~ 1.0
  const clampedVolume = Math.max(0, Math.min(1, volume));
  testSound.setVolume(clampedVolume);

  // 여러 번 눌렀을 때 처음부터 재생하도록
  testSound.stop(() => {
    testSound?.play(success => {
      if (!success) {
        console.log('Sound playback failed');
      }
    });
  });
};
