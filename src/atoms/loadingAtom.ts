import { atom } from 'jotai';

export const pendingAtom = atom(0);
export const isLoadingAtom = atom(get => get(pendingAtom) > 0);

export const incLoadingAtom = atom(null, (get, set) => {
  set(pendingAtom, get(pendingAtom) + 1);
});
export const decLoadingAtom = atom(null, (get, set) => {
  const next = get(pendingAtom) - 1;
  set(pendingAtom, next < 0 ? 0 : next);
});
