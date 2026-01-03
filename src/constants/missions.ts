export type MissionDetail = {
  id: string;
  title: string;
  detail: string;
  rewardPoint: number;
};

export const MISSIONS: MissionDetail[] = [
  {
    id: 'LINK_GUARDIAN',
    title: '보호자 연동하기',
    detail:
      '1. 보호자와 연동을 완료하세요.\n2. 연동이 완료되면 즉시 미션이 달성됩니다.',
    rewardPoint: 100,
  },
  {
    id: 'DRIVE_10KM_SAFE',
    title: '10km 안전운전',
    detail:
      '1. 10km 이상 안전하게 주행하세요.\n2. 운전 종료 시 안전 점수 80점 이상을 달성하세요.',
    rewardPoint: 50,
  },
  {
    id: 'DRIVE_20KM_SAFE',
    title: '20km 안전운전',
    detail:
      '1. 20km 이상 안전하게 주행하세요.\n2. 운전 종료 시 안전 점수 80점 이상을 달성하세요.',
    rewardPoint: 75,
  },
  {
    id: 'DRIVE_30KM_SAFE',
    title: '30km 안전운전',
    detail:
      '1. 30km 이상 안전하게 주행하세요.\n2. 운전 종료 시 안전 점수 80점 이상을 달성하세요.',
    rewardPoint: 100,
  },
];
