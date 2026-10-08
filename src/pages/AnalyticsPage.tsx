import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Users,
  Clock,
  ShieldCheck,
  Activity,
  BarChart3,
  Building2,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { emergencies, hospitals, resources, rescueTeams, activeEmergenciesTotal, peopleRescuedTotal } = useRescue();

  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D'>('24H');
  const [selectedDisasterFilter, setSelectedDisasterFilter] = useState<string>('ALL');

  // Multiplier for time range simulation
  const timeMultiplier = timeRange === '24H' ? 1 : timeRange === '7D' ? 4.2 : 12.8;

  // 1. Emergencies & Extractions timeline (Last 8 intervals)
  const timelineData = [
    { time: timeRange === '24H' ? '06:00' : 'Mon', reported: Math.round(14 * timeMultiplier), rescued: Math.round(8 * timeMultiplier) },
    { time: timeRange === '24H' ? '08:00' : 'Tue', reported: Math.round(22 * timeMultiplier), rescued: Math.round(15 * timeMultiplier) },
    { time: timeRange === '24H' ? '10:00' : 'Wed', reported: Math.round(35 * timeMultiplier), rescued: Math.round(26 * timeMultiplier) },
    { time: timeRange === '24H' ? '12:00' : 'Thu', reported: Math.round(48 * timeMultiplier), rescued: Math.round(39 * timeMultiplier) },
    { time: timeRange === '24H' ? '14:00' : 'Fri', reported: Math.round(62 * timeMultiplier), rescued: Math.round(51 * timeMultiplier) },
    { time: timeRange === '24H' ? '16:00' : 'Sat', reported: Math.round(85 * timeMultiplier), rescued: Math.round(68 * timeMultiplier) },
    { time: timeRange === '24H' ? '18:00' : 'Sun', reported: Math.round(104 * timeMultiplier), rescued: Math.round(82 * timeMultiplier) },
    { time: timeRange === '24H' ? '20:00' : 'Today', reported: Math.round(122 * timeMultiplier), rescued: Math.round(98 * timeMultiplier) },
  ];

  // 2. Priority distribution data
  const priorityData = [
    { name: 'CRITICAL', count: 18, fill: '#ef4444' },
    { name: 'HIGH', count: 31, fill: '#f97316' },
    { name: 'MODERATE', count: 46, fill: '#f59e0b' },
    { name: 'LOW', count: 27, fill: '#10b981' },
  ];

  // 3. Disaster category distribution
  const disasterCounts: Record<string, number> = {
    Flood: 48,
    Fire: 22,
    'Building Collapse': 18,
    Cyclone: 14,
    Landslide: 12,
    Other: 8,
  };
  const disasterChartData = Object.entries(disasterCounts).map(([name, value]) => ({
    name,
    value: Math.round(value * (timeRange === '24H' ? 1 : timeRange === '7D' ? 3.5 : 9.5)),
  }));
  const PIE_COLORS = ['#3b82f6', '#ef4444', '#f97316', '#06b6d4', '#eab308', '#8b5cf6'];

  // 4. Response time by sector (mins)
  const responseTimeData = [
    { sector: 'Sector 14', time: 8.2, target: 10 },
    { sector: 'Sector 11', time: 6.4, target: 10 },
    { sector: 'Sector 16', time: 11.1, target: 12 },
    { sector: 'Phase 2', time: 7.5, target: 10 },
    { sector: 'Ridge Area', time: 14.8, target: 15 },
    { sector: 'Sector 8', time: 9.1, target: 12 },
  ];

  // 5. Victims Rescued by Age / Triage Segment
  const victimsRescuedData = [
    { group: 'Pediatric (<12)', count: 22, evacuated: 22 },
    { group: 'Adults (18-59)', count: 44, evacuated: 42 },
    { group: 'Elderly (60+)', count: 16, evacuated: 16 },
    { group: 'Critically Injured', count: 6, evacuated: 6 },
  ];

  // 6. Hospital Bed & ICU Utilization
  const hospitalData = hospitals.map((h) => ({
    name: h.name.replace(' Hospital & Trauma Emergency', '').replace(' Super Specialty Institute', '').replace(' Emergency City Hospital', '').replace(' Field Relief Hospital', '').replace(' Memorial Health Center', ''),
    TotalBeds: h.totalBeds,
    Occupied: h.totalBeds - h.availableBeds,
    AvailableICU: h.availableIcu,
  }));

  // 7. Resource Allocation & Utilization
  const resourceUtilizationData = [
    { name: 'Rescue Boats', inUse: 14, reserve: 6 },
    { name: 'Ambulances', inUse: 12, reserve: 4 },
    { name: 'Drones', inUse: 9, reserve: 3 },
    { name: 'Pumps / Gensets', inUse: 22, reserve: 8 },
    { name: 'Medical Crates', inUse: 45, reserve: 15 },
  ];

  // 8. Rescue Team Performance (Rescues Completed)
  const teamPerformanceData = [
    { team: 'Team R-07', rescues: 24, hoursActive: 14 },
    { team: 'Team R-01', rescues: 18, hoursActive: 12 },
    { team: 'Team R-03', rescues: 16, hoursActive: 16 },
    { team: 'Team R-02', rescues: 14, hoursActive: 11 },
    { team: 'Team R-06', rescues: 9, hoursActive: 8 },
    { team: 'Team R-11', rescues: 5, hoursActive: 6 },
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>DISASTER TELEMETRY & MULTI-AGENCY INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Disaster Analytics & Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time rescue response telemetry, priority triage distributions, hospital bed loads, and resource optimization metrics.
          </p>
        </div>

        {/* Global Key Ratios & Export */}
        <div className="flex items-center gap-3">
          {/* Time Filter Pills */}
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-sm">
            {[
              { id: '24H' as const, label: '24 Hours' },
              { id: '7D' as const, label: '7 Days' },
              { id: '30D' as const, label: '30 Days' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTimeRange(id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  timeRange === id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Disaster Type Filter */}
          <div className="relative">
            <select
              value={selectedDisasterFilter}
              onChange={(e) => setSelectedDisasterFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Disasters</option>
              <option value="Flood">Flood (Active)</option>
              <option value="Fire">Fire</option>
              <option value="Building Collapse">Building Collapse</option>
              <option value="Cyclone">Cyclone</option>
              <option value="Landslide">Landslide</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Emergencies */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Emergencies</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {timeRange === '24H' ? activeEmergenciesTotal : Math.round(activeEmergenciesTotal * timeMultiplier)}
          </div>
          <p className="text-xs text-blue-600 font-medium mt-1">+38 in last 2 hours</p>
        </div>

        {/* People Rescued */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">People Rescued</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            {timeRange === '24H' ? peopleRescuedTotal : Math.round(peopleRescuedTotal * timeMultiplier)}
          </div>
          <p className="text-xs text-emerald-600 mt-1">100% extraction survivability</p>
        </div>

        {/* Avg Response Time */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Response Time</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">8.4 min</div>
          <p className="text-xs text-slate-500 mt-1">Target benchmark: &lt; 12 mins</p>
        </div>

        {/* Success Rate */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Success Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">94.2%</div>
          <p className="text-xs text-emerald-600 mt-1">Multi-agency verified</p>
        </div>
      </div>

      {/* 8 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Emergencies Over Time (Area Chart) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>1. Incident Volume vs Successful Rescues (Timeline)</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              {timeRange} TREND
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorReportedLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="colorRescuedLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="reported" stroke="#ef4444" fillOpacity={1} fill="url(#colorReportedLight)" name="Reported SOS" strokeWidth={2} />
                <Area type="monotone" dataKey="rescued" stroke="#10b981" fillOpacity={1} fill="url(#colorRescuedLight)" name="Rescued Civilians" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Priority Distribution (Bar Chart) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-rose-600" />
              <span>2. Emergencies by Priority Classification</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              AI CLASSIFIED
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Incident Count">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Emergencies by Disaster Category (Donut Chart) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>3. Emergencies by Disaster Category</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              FLOOD DOMINANT
            </span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={disasterChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {disasterChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Rescue Response Time by Sector (Bar Chart) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>4. Average Response Time by Sector (Minutes)</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              &lt; 10 MIN TARGET
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="sector" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="time" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Actual Response (min)" />
                <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Target Limit (min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Victims Rescued Demographics */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>5. Victims Rescued by Demographic Segment</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
              86 EXTRACTED
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={victimsRescuedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="group" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="evacuated" fill="#6366f1" radius={[6, 6, 0, 0]} name="Civilians Secured" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Hospital Bed & ICU Utilization */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-rose-600" />
              <span>6. Hospital Capacity & Bed Occupancy</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700">
              TRAUMA BEDS
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hospitalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="TotalBeds" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Total Capacity" />
                <Bar dataKey="Occupied" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Occupied Beds" />
                <Bar dataKey="AvailableICU" fill="#10b981" radius={[4, 4, 0, 0]} name="Available ICU" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7: Resource Inventory & Deployment */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>7. Resource Equipment Deployment & Reserves</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
              LOGISTICS
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="inUse" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Deployed in Field" />
                <Bar dataKey="reserve" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Ready Reserve" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 8: Rescue Team Performance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>8. Rescue Teams Extractions Completed</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              TOP PERFORMERS
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="team" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="rescues" fill="#10b981" radius={[4, 4, 0, 0]} name="Missions Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
