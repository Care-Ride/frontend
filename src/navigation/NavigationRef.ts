import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export const navigateFromOutside = (name: string, params?: any) => {
  if (navigationRef.isReady()) {
    (navigationRef.navigate as any)(name, params);
  }
};
