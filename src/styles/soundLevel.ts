export const soundLevelToVolume = (level: number): number => {
  const map: Record<number, number> = {
    1: 0.2,
    2: 0.4,
    3: 0.6,
    4: 0.8,
    5: 1.0,
  };
  return map[level] ?? 0.6; // 기본값 3단계
};
