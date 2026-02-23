import React from 'react';
import { StatusColor, StatusLabel, Colors } from '../constants/tokens';
import Badge from './Badge';

interface Props {
  status: string;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<Props> = ({ status, size = 'sm' }) => {
  const color = StatusColor[status] ?? Colors.statusNeutral;
  const label = StatusLabel[status] ?? status;

  return <Badge label={label} color={color} size={size} />;
};

export default StatusBadge;
