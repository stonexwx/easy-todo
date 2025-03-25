export interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: DataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
  height?: number;
  className?: string;
} 