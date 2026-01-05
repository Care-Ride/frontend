import Sound from 'react-native-sound';

let testSound: Sound | null = null;

export const initSounds = () => {
  Sound.setCategory('Playback');

  testSound = new Sound('test_sound.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('Failed to load sound', error);
      return;
    }
    console.log('Test sound loaded');
  });
};

export const playTestSound = () => {
  if (!testSound) {
    console.log('Test sound not loaded yet');
    return;
  }

  testSound.stop(() => {
    testSound?.play(success => {
      if (!success) {
        console.log('Sound playback failed');
      }
    });
  });
};
