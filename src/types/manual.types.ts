import type React from 'react';

export type ManualId =
  | 'driving'
  | 'guardianLink'
  | 'pointsEarn'
  | 'pointsUse'
  | 'driverLink'
  | 'driverRecordCheck';

export type ManualPage = {
  Image: React.ComponentType<any>;
  description?: string;
};

export type ManualDoc = {
  id: ManualId;
  title: string;
  pages: ManualPage[];
};
