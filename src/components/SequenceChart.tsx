
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';
import { formatNumberWithPrecision } from '@/utils/sequenceUtils';

interface SequenceChartProps {
  sequence: number[];
  predictions: number[];
}

const SequenceChart: React.FC<SequenceChartProps> = ({ sequence, predictions }) => {
  const combinedData = [...sequence, ...predictions].map((value, index) => ({
    position: index + 1,
    value,
    type: index < sequence.length ? 'actual' : 'predicted'
  }));

  // Determine y-axis domain with some padding
  const allValues = [...sequence, ...predictions];
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const padding = Math.max(1, (maxVal - minVal) * 0.15);

  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={combinedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="position" 
            label={{ value: 'Position (n)', position: 'insideBottomRight', offset: -5 }} 
          />
          <YAxis 
            domain={[Math.floor(minVal - padding), Math.ceil(maxVal + padding)]}
            label={{ value: 'Value', angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip 
            formatter={(value: number) => [formatNumberWithPrecision(value), 'Value']}
            labelFormatter={(label) => `Position: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#1a365d"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              return payload.type === 'actual' ? (
                <circle cx={cx} cy={cy} r={4} fill="#1a365d" />
              ) : (
                <circle cx={cx} cy={cy} r={5} fill="#2C7A7B" stroke="#2C7A7B" strokeWidth={2} />
              );
            }}
            connectNulls
          />
          {predictions.map((_, index) => (
            <ReferenceDot
              key={index}
              x={sequence.length + index + 1}
              y={predictions[index]}
              r={6}
              fill="#2C7A7B"
              stroke="#2C7A7B"
              strokeOpacity={0.3}
              strokeWidth={8}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SequenceChart;
