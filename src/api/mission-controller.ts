import { api } from './api';

export const postMissionClaim = async (missionCode: string) => {
  try {
    const response = await api.post(`/missions/${missionCode}/clain`);
    return response;
  } catch (err: any) {
    console.error('미션 요청 실패', err?.response?.data || err.message || err);
    throw err;
  }
};

export const postPointUse = async (amount: number) => {
  try {
    const response = await api.post(`/missions/points/use`, { amount });
    return response;
  } catch (err: any) {
    console.error(
      '포인트 사용 실패',
      err?.response?.data || err.message || err,
    );
    throw err;
  }
};

export const getMissions = async () => {
  try {
    const response = await api.get(`/missions`);
    return response;
  } catch (err: any) {
    console.error('미션 조회 실패', err?.response?.data || err.message || err);
    throw err;
  }
};

export const getPointsHistory = async (
  page: number,
  size: number,
  yearMonth: string,
) => {
  try {
    const response = await api.get(`/missions/points/history`, {
      params: {
        page,
        size,
        yearMonth,
      },
    });
    return response;
  } catch (err: any) {
    console.error(
      '포인트 기록 조회 실패',
      err?.response?.data || err.message || err,
    );
    throw err;
  }
};

export const getPointsBalance = async () => {
  try {
    const response = await api.get(`/missions/points/balance`);
    return response;
  } catch (err: any) {
    console.error(
      '잔여 포인트 조회 실패',
      err?.response?.data || err.message || err,
    );
    throw err;
  }
};
