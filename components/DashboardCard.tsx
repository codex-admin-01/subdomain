
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl flex items-center gap-4 hover:border-white/20 transition-all group">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-white mt-0.5">{value}</h3>
      </div>
    </div>
  );
};

export default DashboardCard;
