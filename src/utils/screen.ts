import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// 디자인 가이드 기준(예: iPhone 11 기준 375×812)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const SCREEN = {
  WIDTH: SCREEN_WIDTH,
  HEIGHT: SCREEN_HEIGHT,
};

// 너비 기준 스케일 비율
export const PX = SCREEN_WIDTH / BASE_WIDTH;
// 높이 기준 스케일 비율
export const PY = SCREEN_HEIGHT / BASE_HEIGHT;

/**
 * 너비 기준으로 크기를 스케일링합니다.
 * 디자인 가이드(375px 기준)의 px 값을 입력하면 현재 기기에 맞게 변환됩니다.
 *
 * @param size - 디자인 가이드 기준 크기 (px)
 * @returns 스케일링된 크기
 *
 * @example
 * width: ${scale(100)}px; // 375px 기준 100px → 현재 기기 크기로 변환
 */
export const scale = (size: number): number => {
  return size * PX;
};

/**
 * 높이 기준으로 크기를 스케일링합니다.
 * 세로 방향 요소에 사용 (일반적으로는 scale 사용 권장)
 *
 * @param size - 디자인 가이드 기준 크기 (px)
 * @returns 스케일링된 크기
 */
export const scaleVertical = (size: number): number => {
  return size * PY;
};

/**
 * 폰트 크기를 스케일링합니다.
 * 너무 작거나 큰 폰트의 변화를 제한하여 가독성을 유지합니다.
 *
 * @param size - 디자인 가이드 기준 폰트 크기 (px)
 * @returns 스케일링된 폰트 크기
 */
export const scaleFont = (size: number): number => {
  const scaleFactor = PX;
  // 최소/최대 스케일 제한 (선택사항)
  const minScale = 0.8;
  const maxScale = 1.2;
  const limitedScale = Math.max(minScale, Math.min(maxScale, scaleFactor));
  return size * limitedScale;
};
