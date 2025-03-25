import { CSSProperties, ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  title?: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  customStyle?: CSSProperties;
} 