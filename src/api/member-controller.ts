import { api } from './api';

export const postLinkGenerate = async () => {
  try {
    const response = await api.post(`/api/member/link/generate`);
    return response;
  } catch (err: any) {
    console.error('링크 생성 실패', err?.response?.data || err.message || err);
  }
};

export const postLinkConnect = async (code: string) => {
  try {
    const response = await api.post(`/api/member/link/connect`, { code });
    return response;
  } catch (err: any) {
    console.error('링크 연결 실패', err?.response?.data || err.message || err);
    throw err;
  }
};

export const postDeviceSetting = async (
  fontLevel: number,
  volumeLevel: number,
) => {
  try {
    const response = await api.post(`/api/member/device-setting`, {
      fontLevel,
      volumeLevel,
    });
    return response;
  } catch (err: any) {
    console.error(
      '디바이스 설정 실패',
      err?.response?.data || err.message || err,
    );
    throw err;
  }
};

export const getMember = async () => {
  try {
    const response = await api.get(`/api/member/me`);
    console.log(response);
    return response;
  } catch (err: any) {
    console.error(
      '내 정보 조회 실패',
      err?.response?.data || err.message || err,
    );
  }
};

export const getDeviceSetting = async (deviceId: string) => {
  try {
    const response = await api.get(`/api/member/device-setting/${deviceId}`);
    console.log(response);
    return response;
  } catch (err: any) {
    console.error(
      '디바이스 설정 조회 실패',
      err?.response?.data || err.message || err,
    );
  }
};

export const patchMemberLinkInfo = async (
  relationType: string,
  customSenoirName: string,
) => {
  try {
    const response = await api.patch(`/api/member/link/info`, {
      relationType,
      customSenoirName,
    });
    console.log(response);
    return response;
  } catch (err: any) {
    console.error('정보 수정 실패', err?.response?.data || err.message || err);
  }
};

export const getMemberLinkSenior = async () => {
  try {
    const response = await api.get(`/api/member/link/senior`);
    return response;
  } catch (err: any) {
    const status = err?.response?.status;
    const code = err?.response?.data?.code;

    if (status === 404 && code === 'CONNECT-403') {
      return { data: { data: null } } as any;
    }
    console.error(
      '운전자 정보 조회 실패',
      err?.response?.data || err.message || err,
    );
  }
};

export const getMemberLinkGuardian = async () => {
  try {
    const response = await api.get(`/api/member/link/guardian`);
    return response;
  } catch (err: any) {
    const status = err?.response?.status;
    const code = err?.response?.data?.code;

    if (status === 404 && code === 'CONNECT-403') {
      return { data: { data: null } } as any;
    }
    console.error(
      '보호자 정보 조회 실패',
      err?.response?.data || err.message || err,
    );
  }
};

export const deleteMemberlink = async () => {
  try {
    const response = await api.delete(`/api/member/link`);
    return response;
  } catch (err: any) {
    console.error('연동 해제 실패', err?.response?.data || err.message || err);
  }
};
