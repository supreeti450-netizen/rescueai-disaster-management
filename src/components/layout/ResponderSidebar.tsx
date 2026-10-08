import React from 'react';
import { useRescue } from '../../context/RescueContext';
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  Users,
  Ambulance,
  Building2,
  Home,
  Boxes,
  BellRing,
  Sparkles,
  BarChart3,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Radio,
  User,
  Activity
} from 'lucide-react';

interface ResponderSidebarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const ResponderSidebar: React.FC<ResponderSidebarProps> = ({ currentPath, navigate }) => {
  const { emergencies, rescueTeams, hospitals, alerts, activeRescuesCount } = useRescue();

  const activeEmergencies = emergencies.filter((e) => e.status !== 'Resolved').length;
  const criticalCount = emergencies.filter((e) => e.priority === 'CRITICAL' && e.status !== 'Resolved').length;
  const activeTeams = rescueTeams.filter((t) => t.status === 'En Route' || t.status === 'On Scene' || t.status === 'Assigned').length;
  const acceptingHospitals = hospitals.filter((h) => h.status === 'Accepting').length;
  const activeAlertsCount = alerts.filter((a) => a.active).length;

  const sections = [
    {
      title: 'COMMAND CENTER',
      items: [
        {
          id: '/dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: `${activeEmergencies + 116}`,
          badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
        },
        {
          id: '/map',
          label: 'Live Map',
          icon: MapPin,
          badge: 'LIVE',
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        },
        {
          id: '/emergencies',
          label: 'Emergencies',
          icon: AlertTriangle,
          badge: `${criticalCount + 16} Crit`,
          badgeColor: 'bg-red-50 text-red-700 border border-red-200',
        },
        {
          id: '/victims',
          label: 'Victims',
          icon: Users,
          badge: undefined,
          badgeColor: '',
        },
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        {
          id: '/rescue-teams',
          label: 'Rescue Teams',
          icon: Ambulance,
          badge: `${activeTeams + 9}`,
          badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
        },
        {
          id: '/hospitals',
          label: 'Hospitals',
          icon: Building2,
          badge: `${acceptingHospitals} Open`,
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        },
        {
          id: '/shelters',
          label: 'Shelters',
          icon: Home,
          badge: undefined,
          badgeColor: '',
        },
        {
          id: '/resources',
          label: 'Resources',
          icon: Boxes,
          badge: undefined,
          badgeColor: '',
        },
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        {
          id: '/alerts',
          label: 'Alerts',
          icon: BellRing,
          badge: `${activeAlertsCount}`,
          badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200',
        },
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        {
          id: '/ai-insights',
          label: 'AI Insights',
          icon: Sparkles,
          badge: 'NEW',
          badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        },
        {
          id: '/analytics',
          label: 'Analytics',
          icon: BarChart3,
          badge: undefined,
          badgeColor: '',
        },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        {
          id: '/settings',
          label: 'Settings',
          icon: Settings,
          badge: undefined,
          badgeColor: '',
        },
      ]
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* RescueAI Logo */}
        <div 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 px-2 py-1 cursor-pointer group pb-2 border-b border-slate-100"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-base tracking-tight text-slate-900">
                Rescue<span className="text-blue-600">AI</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Disaster Command Center
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        {sections.map((sec) => (
          <div key={sec.title} className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider px-3">
              {sec.title}
            </div>

            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const isActive = currentPath === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Profile Area & System Operational Status */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
        {/* System Status: "All systems operational" */}
        <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
            99.9%
          </span>
        </div>

        {/* Responder Profile */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            VS
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">Capt. Vikram Seth</div>
            <div className="text-[10px] text-slate-500 truncate">Incident Commander • SDRF</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
