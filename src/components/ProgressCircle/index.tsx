import React from 'react';
import { ProgressCircleProps } from './types';
import './style.scss';

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size = 100,
  strokeWidth = 8,
  circleColor,
  progressColor,
  textColor,
  textSize,
  className = '',
}) => {
  // 确保百分比在0-100之间
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));

  // 计算圆周
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // 根据百分比计算进度条长度
  const progressOffset = circumference - (normalizedPercentage / 100) * circumference;

  return (
    <div
      className={`progress-circle ${className}`}
      style={{ width: size, height: size }}
      data-testid="progress-circle"
    >
      <svg
        className="progress-circle__svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="progress-circle__background"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          style={{ stroke: circleColor || 'var(--color-divider)' }}
        />
        <circle
          className="progress-circle__progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          style={{ stroke: progressColor || 'var(--color-primary)' }}
        />
      </svg>
      <div
        className="progress-circle__text"
        style={{ color: textColor || 'var(--color-text-primary)' }}
      >
        <span
          className="progress-circle__text-value"
          style={{ fontSize: textSize || '1.25rem' }}
          data-testid="progress-value"
        >
          {Math.round(normalizedPercentage)}
        </span>
        <span className="progress-circle__text-percent">%</span>
      </div>
    </div>
  );
};

export default ProgressCircle;
