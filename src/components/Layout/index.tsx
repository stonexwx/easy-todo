import React from 'react';
import { LayoutProps } from './types';
import './style.scss';

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return <div className={`layout ${className}`}>{children}</div>;
};

export default Layout;
