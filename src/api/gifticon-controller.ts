import { api } from './api';

// 기프티콘 목록 조회
export const getGifticonProductList = async (
    page: number = 0, 
    size: number = 20
) => {
  try {
    const response = await api.get('/api/gifticon', {
      params: {
        page,
        size,
      },
    });
    return response;
  } catch (err: any) {
    console.error(
        '기프티콘 조회 실패', 
        err?.response?.data || err.message || err
    );
  }
};