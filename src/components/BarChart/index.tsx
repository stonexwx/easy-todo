import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { BarChartProps } from './types';
import './style.scss';

const defaultColors = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-accent)',
  'var(--color-warning)',
];

const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisLabel,
  yAxisLabel,
  title,
  height = 300,
  className = '',
}) => {
  return (
    <div className={`bar-chart ${className}`} data-testid="bar-chart">
      {title && (
        <h3 className="bar-chart__title" data-testid="chart-title">
          {title}
        </h3>
      )}

      <div className="bar-chart__container" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name">
              {xAxisLabel && (
                <Label value={xAxisLabel} position="bottom" style={{ textAnchor: 'middle' }} />
              )}
            </XAxis>
            <YAxis>
              {yAxisLabel && (
                <Label
                  value={yAxisLabel}
                  angle={-90}
                  position="left"
                  style={{ textAnchor: 'middle' }}
                />
              )}
            </YAxis>
            <Tooltip />
            <Bar
              dataKey="value"
              fill="var(--color-primary)"
              isAnimationActive={true}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Bar
                  key={`bar-${entry.name}`}
                  dataKey="value"
                  name={entry.name}
                  fill={entry.color || defaultColors[index % defaultColors.length]}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
