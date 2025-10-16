import React from 'react';

interface PerformanceGaugeProps {
  score: number; // 0-100
}

const PerformanceGauge: React.FC<PerformanceGaugeProps> = ({ score }) => {
  const size = 120;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score > 80) return '#22c55e'; // green-500
    if (score > 50) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
          fill="transparent"
          stroke="currentColor"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          stroke={getColor()}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">{score}</span>
      </div>
    </div>
  );
};

export default PerformanceGauge;