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
import Card from '../Card';
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
    <Card title={title} className={`bar-chart ${className}`} variant="elevated">
      <div className="bar-chart__container" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name">
              {xAxisLabel && <Label value={xAxisLabel} position="bottom" />}
            </XAxis>
            <YAxis>{yAxisLabel && <Label value={yAxisLabel} angle={-90} position="left" />}</YAxis>
            <Tooltip />
            {Object.keys(data[0] || {})
              .filter(key => key !== 'name')
              .map((key, index) => (
                <Bar key={key} dataKey={key} fill={defaultColors[index % defaultColors.length]} />
              ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default BarChart;
