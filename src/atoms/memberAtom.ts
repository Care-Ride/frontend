import { atom } from 'jotai';

export type MemberRole = 'SENIOR' | 'GUARDIAN' | string;

export type Member = {
  nickname: string;
  role: MemberRole | null;
};

export const memberAtom = atom<Member>({
  nickname: '',
  role: null,
});
