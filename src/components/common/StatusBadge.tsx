import React from 'react';
import { EmergencyStatus } from '../../types';
import { Clock, Cpu, UserCheck, Navigation, Activity, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: EmergencyStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<EmergencyStatus, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    Reported: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      icon: <Clock className="w-3 h-3" />,
    },
    Analyzing: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      icon: <Cpu className="w-3 h-3 animate-pulse" />,
    },
    Assigned: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <UserCheck className="w-3 h-3" />,
    },
    'En Route': {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Navigation className="w-3 h-3 animate-bounce" />,
    },
    'In Progress': {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: <Activity className="w-3 h-3 animate-pulse" />,
    },
    Evacuating: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: <Navigation className="w-3 h-3" />,
    },
    Resolved: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    Closed: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
  };

  const current = configs[status] || configs.Reported;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${current.bg} ${current.text} ${current.border} ${padding}`}>
      {current.icon}
      <span>{status}</span>
    </span>
  );
};
