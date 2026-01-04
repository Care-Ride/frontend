export const getCurrentYearMonth = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};

export const addMonthsToYearMonth = (ym: string, delta: number) => {
  const [yStr, mStr] = ym.split('-');
  const y = Number(yStr);
  const m = Number(mStr);
  const d = new Date(y, m - 1 + delta, 1);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yy}-${mm}`;
};

export const formatYearMonthKR = (ym: string) => {
  const [y, m] = ym.split('-');
  const monthNum = Number(m);
  if (!y || Number.isNaN(monthNum)) return ym;
  return `${y}년 ${monthNum}월`;
};
