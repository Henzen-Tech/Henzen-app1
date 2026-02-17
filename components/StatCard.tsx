
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon, colorClass }) => {
  return (
    <div className="flex-1 glass-card p-6 rounded-2xl shadow-lg border-l-4 border-l-solid" style={{ borderLeftColor: colorClass }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</span>
        <i className={`${icon} ${colorClass} text-xl`} style={{ color: colorClass }}></i>
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="ml-1 text-gray-400 font-medium">{unit}</span>
      </div>
    </div>
  );
};

export default StatCard;
