import { api } from './api';

export const postMobilityCall = async (
  lat: number,
  lon: number,
  mobilityType: string,
) => {
  try {
    const response = await api.post(`/mobility/call`, {
      lat,
      lon,
      mobilityType,
    });
    return response;
  } catch (err: any) {
    console.error(
      '이동수단 불러오기 실패',
      err?.response?.data || err.message || err,
    );
    throw err;
  }
};
