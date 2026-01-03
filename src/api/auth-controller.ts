import { api } from './api';

export const postWithdraw = async () => {
  try {
    const response = await api.post(`/auth/withdraw`);
    return response;
  } catch (err: any) {
    console.error('회원 탈퇴 실패', err?.response?.data || err.message || err);
  }
};

export const postRole = async (role: string) => {
  try {
    const response = await api.post('/auth/role', { role });
    return response.data;
  } catch (err: any) {
    console.error(
      '사용자 유형 등록 실패',
      err?.response?.data || err.message || err,
    );
  }
};

export const postLogout = async () => {
  try {
    const response = await api.post(`/auth/logout`);
    return response;
  } catch (err: any) {
    console.error('로그아웃 실패', err?.response?.data || err.message || err);
  }
};
