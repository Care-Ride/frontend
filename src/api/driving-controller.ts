import { api } from './api';

export const postDriveStart = async (lat: string, lon: string) => {
  try {
    const response = await api.post(`/api/drive/start`, { lat, lon });
    console.log(response);
    return response;
  } catch (err: any) {
    console.error('운전 시작 실패', err?.response?.data || err.message || err);
  }
};

export const postDriveEnd = async (
  driveId: string,
  totalDistance: number,
  hardAccelCount: number,
  hardDecelCount: number,
  suddenStopCount: number,
  score: number,
  lat: string,
  lon: string,
) => {
  try {
    const response = await api.post(`/api/drive/end`, {
      driveId,
      totalDistance,
      hardAccelCount,
      hardDecelCount,
      suddenStopCount,
      score,
      lat,
      lon,
    });
    return response;
  } catch (err: any) {
    console.error('운전 종료 실패', err?.response?.data || err.message || err);
  }
};

export const postDriveDanger = async (lat: string, lon: string) => {
  try {
    const response = await api.post(`/api/drive/danger`, { lat, lon });
    return response;
  } catch (err: any) {
    console.error('운전 위험 실패', err?.response?.data || err.message || err);
  }
};

export const getDriveDestination = async (keyword: string) => {
  try {
    const response = await api.get(`/api/drive/dst/search/${keyword}`);
    console.log(response);
    return response;
  } catch (err: any) {
    console.error(
      '내 정보 조회 실패',
      err?.response?.data || err.message || err,
    );
  }
};

//일별 운전기록 조회
export const getDailyDrive = async (date: string) => {
  try {
    const response = await api.get(`/api/drive/daily/${date}`);
    return response;
  } catch (err: any) {
    console.error(
      '일별 운전 기록 조회 실패',
      err?.response?.data || err.message || err,
    );
  }
};

//월별 운전기록 조회
export const getMonthlyDrive = async (yearMonth: string) => {
  try {
    const response = await api.get(`/api/drive/monthly/${yearMonth}`);
    return response;
  } catch (err: any) {
    console.error(
      '월별 운전 기록 조회 실패',
      err?.response?.data || err.message || err,
    );
  }
};
