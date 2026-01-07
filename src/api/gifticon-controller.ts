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

// 기프티콘 구매
export const purchaseGifticon = async (productId: number) => {
  try {
    const response = await api.post(`/api/gifticon/purchase`, { productId });
    return response;
  } catch (err: any) {
    console.error(
        '기프티콘 구매 실패', 
        err?.response?.data || err.message || err);
    throw err;
  }
};

// 구매한 기프티콘 내역 조회
export const getGifticonHistoryList = async (
    page: number = 0, 
    size: number = 20
) => {
  try {
    const response = await api.get('/api/gifticon/history', {
      params: {
        page,
        size,
      },
    });
    return response;
  } catch (err: any) {
    console.error(
        '구매한 기프티콘 내역 조회 실패', 
        err?.response?.data || err.message || err
    );
  }
};

// 기프티콘 바코드 이미지 조회
export const getGifticonBarcode = async (barcodeId: number) => {
  try {
    const response = await api.post(`/api/gifticon/barcode`, { barcodeId });
    return response;
  } catch (err: any) {
    console.error(
        '기프티콘 바코드 이미지 조회 실패', 
        err?.response?.data || err.message || err);
    throw err;
  }
};