import React from 'react';
import { IconType } from 'react-icons';

export function wrapIcon(Icon: IconType): React.FC {
  return () => <>{Icon({})}</>;
}