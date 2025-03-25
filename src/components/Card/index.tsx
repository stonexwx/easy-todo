import React from 'react';
import { CardProps } from './types';
import './style.scss';

const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  variant = 'default',
  padding = 'md',
  customStyle = {},
}) => {
  return (
    <div
      className={`card card--${variant} card--padding-${padding} ${className}`}
      style={customStyle}
    >
      {title && <div className="card__title">{title}</div>}
      <div className="card__content">{children}</div>
    </div>
  );
};

export default Card;
