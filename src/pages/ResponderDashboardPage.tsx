import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import { TacticalMap } from '../components/map/TacticalMap';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmergencyCase } from '../types';
import {
  AlertTriangle,
  ShieldAlert,
  Ambulance,
  Users,
  Building2,
  Clock,
  ArrowRight,
  CheckCircle2,
  Eye,
  Navigation,
  Sparkles,
  Radio,
  TrendingUp,
  Activity,
  Cpu,
  ChevronRight,
  X,
  Compass,
  Droplets,
  Wind,
  Waves,
  Send,
  Zap,
  Phone,
  RotateCcw
} from 'lucide-react';

interface ResponderDashboardPageProps {
  navigate: (path: string) => void;
}

export const ResponderDashboardPage: React.FC<ResponderDashboardPageProps> = ({ navigate }) => {
  const {
    emergencies,
    rescueTeams,
    hospitals,
    activityEvents,
    activeEmergenciesTotal,
    criticalCasesTotal,
    activeTeamsTotal,
    peopleRescuedTotal,
    updateEmergencyStatus,
    assignTeamToEmergency,
    reassignTeamToEmergency,
    markRescueCompleted,
    triggerFloodDemo,
    resetDemo,
    deployCommandRecommendation,
    addToast,
    addActivityEvent
  } = useRescue();

  // Selected emergency for Map inspection
  const [selectedEmergencyId, setSelectedEmergencyId] = useState<string>('RA-1024');

  // Right-Side Emergency Detail Drawer state
  const [drawerEmergency, setDrawerEmergency] = useState<EmergencyCase | null>(null);

  // Active AI Recommendation deployed state
  const [aiDeployed, setAiDeployed] = useState(false);

  // Modals for Drawer actions
  const [showRescueConfirmModal, setShowRescueConfirmModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Open drawer helper
  const handleOpenDrawer = (emergencyId: string) => {
    const em = emergencies.find((e) => e.id === emergencyId);
    if (em) {
      setDrawerEmergency(em);
      setSelectedEmergencyId(emergencyId);
    }
  };

  // Priority distribution counts
  const priorityDistribution = [
    { label: 'Critical', count: 18, color: 'bg-rose-500', text: 'text-rose-700', percent: '15%' },
    { label: 'High', count: 31, color: 'bg-orange-500', text: 'text-orange-700', percent: '25%' },
    { label: 'Moderate', count: 46, color: 'bg-amber-400', text: 'text-amber-800', percent: '38%' },
    { label: 'Low', count: 27, color: 'bg-emerald-500', text: 'text-emerald-700', percent: '22%' },
  ];

  // Team status counts
  const teamStatusCounts = {
    available: 6,
    enRoute: 5,
    assigned: 8,
    offline: 1,
    total: 20
  };

  // Critical Response Queue list
  const criticalQueue = emergencies
    .filter((e) => e.priority === 'CRITICAL' && e.status !== 'Resolved')
    .slice(0, 5);

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ====================================================
          2. DISASTER STATUS HEADER
          ==================================================== */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Disaster Overview */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold uppercase tracking-wider">
                ACTIVE DISASTER
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold uppercase tracking-wider">
                STATUS: ACTIVE RESPONSE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
              <span>FLOOD RESPONSE OPERATION</span>
              <span className="text-slate-400 font-normal text-lg sm:text-xl">
                • Sector 14 • Ahmedabad Region
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Started:</span>
                <strong className="text-slate-700">10:42 AM</strong>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Last updated:</span>
                <strong className="text-blue-600 font-semibold">Just now</strong>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-blue-500" />
                <span>River Rise:</span>
                <strong className="text-amber-600 font-semibold">+2.4m Danger Mark</strong>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                <span>Rainfall:</span>
                <strong className="text-blue-700 font-semibold">48mm/hr</strong>
              </div>
            </div>
          </div>

          {/* Right: Quick Command Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
            <button
              onClick={() => {
                const demoCase = triggerFloodDemo();
                setSelectedEmergencyId('RA-1024');
                setDrawerEmergency(demoCase);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              title="Activate End-to-End Flood Scenario Demo"
            >
              <Zap className="w-4 h-4 fill-current text-yellow-300 animate-bounce" />
              <span>RUN DEMO SCENARIO</span>
            </button>

            <button
              onClick={() => {
                resetDemo();
                setDrawerEmergency(null);
                addToast('Demo State Reset', 'Emergency registry and SAR units restored to initial baseline.', 'info');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Reset application mock state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>RESET DEMO</span>
            </button>

            <button
              onClick={() => navigate('/alerts')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <span>Broadcast Siren</span>
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================
          3. FOUR LARGE KPI CARDS
          ==================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Emergencies */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              ACTIVE EMERGENCIES
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2 font-mono tracking-tight">
            {activeEmergenciesTotal}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-slate-500">Rate of change:</span>
            <span className="text-blue-600 font-semibold font-mono">+12 in last hour</span>
          </div>
        </div>

        {/* KPI 2: Critical Cases */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              CRITICAL CASES
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-rose-700 mt-2 font-mono tracking-tight">
            {criticalCasesTotal}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-slate-500">Triage Level:</span>
            <span className="text-rose-600 font-semibold font-mono">Immediate Life Threat</span>
          </div>
        </div>

        {/* KPI 3: Active Rescue Teams */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              ACTIVE RESCUE TEAMS
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Ambulance className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2 font-mono tracking-tight">
            {activeTeamsTotal} <span className="text-sm text-slate-400 font-normal">/ 20</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-slate-500">Fleet Deployment:</span>
            <span className="text-amber-700 font-semibold font-mono">14 Dispatched (6 Reserve)</span>
          </div>
        </div>

        {/* KPI 4: People Rescued */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              PEOPLE RESCUED
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-700 mt-2 font-mono tracking-tight">
            {peopleRescuedTotal}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-slate-500">Operation Target:</span>
            <span className="text-emerald-700 font-semibold font-mono">100% extraction survivability</span>
          </div>
        </div>
      </section>

      {/* ====================================================
          4. MAIN GRID: MAP (65%) + CRITICAL QUEUE & AI (35%)
          ==================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: TACTICAL MAP CONTAINER (65% width) */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                GEOSPATIAL DISASTER COMMAND MATRIX • SECTOR 14 INUNDATION BASIN
              </h2>
            </div>
            <span className="text-[11px] text-blue-600 font-medium hidden sm:inline">
              GRID ACCURACY ±2m • LIVE TELEMETRY STREAM
            </span>
          </div>

          {/* Interactive Tactical Map Container */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            <TacticalMap
              heightClass="h-[560px]"
              selectedEmergencyId={selectedEmergencyId}
              onSelectEmergency={(id) => setSelectedEmergencyId(id)}
              onOpenDetails={(id) => handleOpenDrawer(id)}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: CRITICAL RESPONSE QUEUE & AI INSIGHT (35% width) */}
        <div className="lg:col-span-4 space-y-4">
          {/* CRITICAL RESPONSE QUEUE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-rose-700">
                  CRITICAL RESPONSE QUEUE
                </h3>
              </div>
              <span className="text-[11px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-semibold">
                {criticalQueue.length} Active
              </span>
            </div>

            {/* Queue Items */}
            <div className="space-y-2">
              {criticalQueue.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenDrawer(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedEmergencyId === item.id
                      ? 'bg-rose-50/50 border-rose-300 shadow-sm ring-1 ring-rose-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        #{item.id}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {item.location.sector}
                      </span>
                      <span className="font-mono text-xs font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                        🔴 {item.aiScore}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 truncate">
                      {item.injuredCount > 0 ? `${item.injuredCount} injured` : 'Trapped civilians'} • {item.medicalEmergency ? 'Medical required' : 'Submerged'}
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-xs">
                    <div className="text-blue-600 font-bold">
                      {item.assignedTeamId || 'R-07'}
                    </div>
                    <div className="text-emerald-700 text-[11px]">
                      {item.etaMinutes || 8} min
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Emergencies Link */}
            <div className="pt-1 text-center">
              <button
                onClick={() => navigate('/emergencies')}
                className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-blue-600 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
              >
                <span>View All Emergencies →</span>
              </button>
            </div>
          </div>

          {/* AI COMMAND RECOMMENDATION */}
          <div className="bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/40 border border-blue-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-blue-900">
                  RESCUEAI RECOMMENDATION
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                HIGH DENSITY ALERT
              </span>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-blue-100 space-y-1">
              <div>"<strong>18 critical emergencies</strong> are currently active."</div>
              <div className="text-amber-800 font-medium">"Sector 14 has the highest emergency density."</div>
            </div>

            <div className="space-y-1 bg-blue-50/80 p-2.5 rounded-xl border border-blue-200">
              <div className="text-[10px] uppercase tracking-wider text-blue-800 font-bold">
                RECOMMENDED ACTION:
              </div>
              <div className="text-xs font-semibold text-slate-900">
                "Deploy 2 additional rescue teams and 1 ambulance to Sector 14."
              </div>
            </div>

            {/* AI Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  deployCommandRecommendation();
                  setAiDeployed(true);
                }}
                disabled={aiDeployed}
                className={`flex-1 py-2 px-2 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-sm transition-all ${
                  aiDeployed
                    ? 'bg-emerald-600 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <span>{aiDeployed ? '✓ DEPLOYED' : 'DEPLOY TEAMS'}</span>
              </button>

              <button
                onClick={() => navigate('/map')}
                className="flex-1 py-2 px-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 border border-slate-300 transition-colors shadow-sm"
              >
                <span>VIEW SECTOR</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          LOWER COMMAND ROW: ACTIVITY FEED, TEAMS, HOSPITALS, PRIORITY DISTRIB
          ==================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* REAL-TIME ACTIVITY FEED */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>REAL-TIME ACTIVITY</span>
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {activityEvents.slice(0, 6).map((evt) => (
              <div
                key={evt.id}
                className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                  evt.isNew
                    ? 'bg-blue-50/70 border-blue-200'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <span className="text-base leading-none shrink-0 mt-0.5">{evt.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-800 font-medium leading-tight">
                    {evt.message}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {evt.time} • relative timestamp
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RESCUE TEAM STATUS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Ambulance className="w-4 h-4 text-amber-600" />
                <span>RESCUE TEAM STATUS</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-semibold">
                20 TOTAL UNITS
              </span>
            </div>

            {/* Counts Matrix */}
            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Available</span>
                <span className="text-2xl font-bold text-emerald-700">{teamStatusCounts.available}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">En Route</span>
                <span className="text-2xl font-bold text-amber-700">{teamStatusCounts.enRoute}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Assigned</span>
                <span className="text-2xl font-bold text-blue-700">{teamStatusCounts.assigned}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Offline</span>
                <span className="text-2xl font-bold text-slate-400">{teamStatusCounts.offline}</span>
              </div>
            </div>

            {/* Status Progress Breakdown Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Fleet Allocation:</span>
                <span className="font-semibold text-slate-700">95% Operational</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                <div style={{ width: '30%' }} className="bg-emerald-500 h-full" title="Available: 6" />
                <div style={{ width: '25%' }} className="bg-amber-500 h-full" title="En Route: 5" />
                <div style={{ width: '40%' }} className="bg-blue-500 h-full" title="Assigned: 8" />
                <div style={{ width: '5%' }} className="bg-slate-300 h-full" title="Offline: 1" />
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/rescue-teams')}
            className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-blue-600 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
          >
            <span>View Teams →</span>
          </button>
        </div>

        {/* HOSPITAL CAPACITY */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>HOSPITAL CAPACITY</span>
              </h3>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                TRAUMA NET
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Civil Hospital */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-800 text-[11px]">CIVIL HOSPITAL</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">🟢 ACCEPTING</span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between">
                  <span>18 / 50 beds available</span>
                  <span className="text-blue-700 font-semibold">4 / 10 ICU</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: '64%' }} className="bg-emerald-500 h-full" />
                </div>
              </div>

              {/* Emergency Medical Center */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-800 text-[11px]">EMERGENCY MEDICAL CENTER</span>
                  <span className="text-[10px] text-amber-700 font-semibold">🟡 LIMITED</span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between">
                  <span>7 / 30 beds available</span>
                  <span className="text-amber-700 font-semibold">2 / 5 ICU</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: '77%' }} className="bg-amber-500 h-full" />
                </div>
              </div>

              {/* Metro General Hospital */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-800 text-[11px]">METRO GENERAL HOSPITAL</span>
                  <span className="text-[10px] text-rose-700 font-semibold">🔴 FULL</span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between">
                  <span>0 / 85 beds available</span>
                  <span className="text-rose-700 font-semibold">0 / 16 ICU</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: '100%' }} className="bg-rose-500 h-full" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/hospitals')}
            className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-blue-600 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
          >
            <span>View All Hospitals →</span>
          </button>
        </div>

        {/* EMERGENCY PRIORITY DISTRIBUTION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>PRIORITY BREAKDOWN</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-semibold">122 TOTAL</span>
            </div>

            {/* Distribution Rows */}
            <div className="space-y-2 text-xs">
              {priorityDistribution.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span>{item.label}</span>
                    </span>
                    <span className={`font-bold ${item.text}`}>{item.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: item.percent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/analytics')}
            className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-blue-600 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
          >
            <span>Operational Analytics →</span>
          </button>
        </div>
      </section>

      {/* ====================================================
          11. EMERGENCY DETAIL DRAWER (RIGHT-SIDE SLIDING DRAWER)
          ==================================================== */}
      {drawerEmergency && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border-l border-slate-200 h-full p-6 text-slate-900 space-y-5 overflow-y-auto shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="space-y-5">
              {/* Drawer Top Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">
                    INCIDENT ACTION DOSSIER
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                    <span>EMERGENCY #{drawerEmergency.id}</span>
                    <PriorityBadge priority={drawerEmergency.priority} size="sm" />
                  </h2>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {drawerEmergency.disasterType} • Reported {drawerEmergency.timestamp}
                  </div>
                </div>

                <button
                  onClick={() => setDrawerEmergency(null)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Severity & AI Score Banner */}
              <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-rose-700 font-bold block">
                    AI SEVERITY SCORE
                  </span>
                  <div className="text-3xl font-bold text-rose-700 font-mono mt-0.5">
                    {drawerEmergency.aiScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-500 block font-medium">CURRENT STATUS</span>
                  <div className="mt-1">
                    <StatusBadge status={drawerEmergency.status} size="sm" />
                  </div>
                </div>
              </div>

              {/* Location & Casualties Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">LOCATION</span>
                  <div className="font-bold text-slate-900 mt-1">{drawerEmergency.location.sector}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{drawerEmergency.location.address}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">AFFECTED / INJURED</span>
                  <div className="font-bold text-slate-900 mt-1">
                    {drawerEmergency.peopleAffected} People Affected
                  </div>
                  <div className="text-amber-700 font-semibold mt-0.5">
                    {drawerEmergency.injuredCount} Casualties Injured
                  </div>
                </div>
              </div>

              {/* Medical Requirement & Danger Conditions */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600 font-medium">Medical Requirement:</span>
                  <span className={drawerEmergency.medicalEmergency ? "text-rose-700 font-bold flex items-center gap-1" : "text-slate-600"}>
                    {drawerEmergency.medicalEmergency ? "YES (Immediate ALS Required)" : "Standard Evacuation"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1 font-semibold">DANGER CONDITIONS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {drawerEmergency.dangers.map((d, i) => (
                      <span key={i} className="text-[11px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Assigned Team & ETA */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-bold uppercase text-[10px]">ASSIGNED RESCUE TEAM</span>
                  <span className="text-emerald-700 font-bold font-mono">ETA: {drawerEmergency.etaMinutes || 8} min</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {drawerEmergency.assignedTeamId ? `Team ${drawerEmergency.assignedTeamId} (Amphibious Jet Boat)` : 'Team R-07 (Amphibious SAR)'}
                </div>
                <div className="text-[11px] text-slate-600">
                  Distance: 2.4 km • En route via Elevated Bypass 4B
                </div>
              </div>

              {/* Recommended Hospital & Safe Route */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-emerald-700 uppercase block font-bold">RECOMMENDED HOSPITAL</span>
                  <div className="text-slate-900 font-bold mt-0.5">Civil Hospital & Trauma Emergency</div>
                  <div className="text-[11px] text-slate-500">18 beds, 4 ICU ventilators available • Distance: 2.4 km</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-amber-700 uppercase block font-bold">RECOMMENDED SAFE ROUTE</span>
                  <div className="text-slate-700 mt-0.5">
                    {drawerEmergency.safeRouteNotes || 'Sector 14 Ring Arterial via Elevated Bypass 4B (avoid Submerged Underpass 14).'}
                  </div>
                </div>
              </div>

              {/* Caller details */}
              <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Caller Contact:</span>
                <span className="font-mono text-slate-900 font-semibold">{drawerEmergency.contactName} ({drawerEmergency.contactPhone})</span>
              </div>
            </div>

            {/* Action Buttons in Drawer */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {/* 1. [TRACK TEAM] */}
                <button
                  onClick={() => {
                    navigate(`/emergency-status?id=${drawerEmergency.id}`);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  title="Open live tracking map and team telemetry"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>TRACK TEAM</span>
                </button>

                {/* 2. [UPDATE STATUS] */}
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
                  title="Progress incident status"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>UPDATE STATUS</span>
                </button>

                {/* 3. [REASSIGN TEAM] */}
                <button
                  onClick={() => setShowReassignModal(true)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
                  title="Reassign to another response unit"
                >
                  <Ambulance className="w-3.5 h-3.5" />
                  <span>REASSIGN TEAM</span>
                </button>

                {/* 4. [MARK RESCUED] */}
                <button
                  onClick={() => setShowRescueConfirmModal(true)}
                  disabled={drawerEmergency.status === 'Resolved'}
                  className={`py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors ${
                    drawerEmergency.status === 'Resolved'
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                  title="Complete rescue operation"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>MARK RESCUED</span>
                </button>
              </div>

              {drawerEmergency.status === 'Resolved' && (
                <div className="w-full py-2 text-center text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                  ✓ INCIDENT RESCUED & SECURED
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: MARK RESCUED */}
      {showRescueConfirmModal && drawerEmergency && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 space-y-5 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-2xl text-emerald-600">
              ✓
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Confirm rescue completion?
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Emergency #{drawerEmergency.id} • {drawerEmergency.peopleAffected} People ({drawerEmergency.injuredCount} Injured)
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="text-slate-600">• Emergency status: <strong className="text-emerald-700">RESCUED</strong></div>
              <div className="text-slate-600">• People rescued counter: <strong className="text-slate-900">+{drawerEmergency.peopleAffected}</strong></div>
              <div className="text-slate-600">• Team {drawerEmergency.assignedTeamId || 'R-07'}: <strong className="text-blue-700">AVAILABLE</strong></div>
              <div className="text-slate-500">• Active emergencies counter will decrease by 1.</div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRescueConfirmModal(false)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  markRescueCompleted(drawerEmergency.id);
                  setDrawerEmergency((prev) => (prev ? { ...prev, status: 'Resolved' } : null));
                  setShowRescueConfirmModal(false);
                }}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              >
                Confirm Rescue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REASSIGN RESCUE TEAM */}
      {showReassignModal && drawerEmergency && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Reassign Rescue Team</h3>
              <button onClick={() => setShowReassignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {rescueTeams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => {
                    reassignTeamToEmergency(drawerEmergency.id, team.id);
                    setDrawerEmergency((prev) => (prev ? { ...prev, assignedTeamId: team.id } : null));
                    setShowReassignModal(false);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    drawerEmergency.assignedTeamId === team.id
                      ? 'bg-blue-50 border-blue-400 text-blue-900'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">{team.name} ({team.callSign})</div>
                    <div className="text-[11px] text-slate-500">{team.specialization} • {team.vehicle}</div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    {team.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE EMERGENCY STATUS */}
      {showStatusModal && drawerEmergency && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Update Case Status</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {(['Assigned', 'En Route', 'In Progress', 'Resolved', 'Closed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    if (st === 'Resolved') {
                      setShowStatusModal(false);
                      setShowRescueConfirmModal(true);
                    } else {
                      updateEmergencyStatus(drawerEmergency.id, st);
                      setDrawerEmergency((prev) => (prev ? { ...prev, status: st } : null));
                      setShowStatusModal(false);
                    }
                  }}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    drawerEmergency.status === st
                      ? 'bg-blue-50 border-blue-400 text-blue-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>→ Transition to: <strong>{st.toUpperCase()}</strong></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
