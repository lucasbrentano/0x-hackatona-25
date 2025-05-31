import { ReactNode } from 'react';

export interface SnackbarProps {
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  children: ReactNode;
  className?: string;
}