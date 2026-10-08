import React from 'react';
import { useRescue } from '../context/RescueContext';
import { 
  ShieldAlert, 
  Flame, 
  AlertOctagon, 
  Radio, 
  MapPin, 
  Ambulance, 
  Building2, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Navigation,
  Activity,
  Bell,
  Compass,
  Sparkles
} from 'lucide-react';
import { PriorityBadge } from '../components/common/PriorityBadge';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  const { triggerFloodDemo, emergencies, rescueTeams } = useRescue();

  const handleLaunchDemo = () => {
    triggerFloodDemo();
    navigate('/ai-analysis');
  };

  const activeCritical = emergencies.filter((e) => e.priority === 'CRITICAL' && e.status !== 'Resolved').length;

  return (
    <div className="flex-1 bg-white text-slate-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200 bg-gradient-to-b from-blue-50/40 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Live operational badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className="font-semibold text-slate-800">NDRF & STATE DISASTER PROTOCOL ACTIVE</span>
              <span className="text-slate-300">|</span>
              <span className="text-blue-700 font-semibold">{activeCritical} Critical In-Field Cases</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI-POWERED DISASTER RESPONSE & RESCUE</span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-slate-900">
                Rescue<span className="text-blue-600">AI</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              From emergency detection to coordinated rescue, RescueAI helps responders make faster, safer and smarter decisions.
            </p>

            {/* Main CTA buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/report-emergency')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>REPORT EMERGENCY</span>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-bold text-sm tracking-wide border border-slate-200 shadow-sm flex items-center justify-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
              >
                <Radio className="w-4 h-4 text-blue-600" />
                <span>OPEN COMMAND CENTER</span>
              </button>

              <button
                onClick={handleLaunchDemo}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 border border-blue-200 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-sm"
                title="Launch Sector 14 Flood Scenario"
              >
                <Play className="w-3.5 h-3.5 fill-current text-blue-600" />
                <span>RUN DEMO SCENARIO</span>
              </button>
            </div>
          </div>

          {/* Hero Command Center Preview Visual Card */}
          <div className="mt-12 max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden relative group">
            {/* Window header */}
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-slate-500 text-[11px] font-semibold">
                  RESCUE-AI // DISASTER INCIDENT COMMAND MATRIX [LIVE]
                </span>
              </div>
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-[11px]">
                <Activity className="w-3.5 h-3.5 animate-pulse text-blue-600" />
                <span>NEURAL AI DISPATCH ONLINE</span>
              </div>
            </div>

            {/* Preview Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/40">
              {/* Quick KPI Preview */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    AI Active Incident Queue
                  </div>
                  <div className="text-3xl font-black text-slate-900 mt-1">122 <span className="text-xs font-normal text-slate-500">Total Cases</span></div>
                  <div className="mt-3 flex gap-2">
                    <PriorityBadge priority="CRITICAL" size="sm" />
                    <PriorityBadge priority="HIGH" size="sm" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Flood Rescue Demo Target
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">Incident #RA-1024 • Sector 14</div>
                  <div className="text-xs text-rose-600 font-semibold mt-1">
                    AI Severity Score: 92/100 (CRITICAL)
                  </div>
                  <div className="text-[11px] text-slate-600 mt-2">
                    Team R-07 En Route • ETA: 8 minutes • Civil Hospital
                  </div>
                </div>
              </div>

              {/* Tactical Mini Map Mockup */}
              <div className="md:col-span-2 bg-slate-100/80 rounded-xl border border-slate-200 p-4 relative overflow-hidden flex flex-col justify-between min-h-[260px] shadow-inner">
                <div className="flex justify-between items-center text-xs text-slate-600 font-semibold z-10">
                  <span>RADAR GRID: SECTOR 14 INUNDATION BASIN</span>
                  <span className="text-blue-700 font-bold">SAFE ROUTE: BYPASS 4B</span>
                </div>

                {/* Vector radar visual */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-blue-300 relative flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border border-blue-200" />
                    <div className="w-16 h-16 rounded-full border border-blue-200" />
                    
                    {/* Pulsing incident pins */}
                    <div className="absolute top-8 left-12 flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping absolute" />
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-600 relative flex items-center justify-center text-[8px] font-bold text-white">4</span>
                      <span className="text-[10px] bg-white text-rose-700 px-1.5 py-0.5 rounded border border-rose-200 font-bold shadow-sm">
                        RA-1024
                      </span>
                    </div>

                    {/* Team pin */}
                    <div className="absolute bottom-10 right-8 flex items-center gap-1">
                      <span className="text-lg">🚑</span>
                      <span className="text-[10px] bg-white text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-bold shadow-sm">
                        R-07 (8m)
                      </span>
                    </div>

                    {/* Hospital pin */}
                    <div className="absolute top-10 right-10 flex items-center gap-1">
                      <span className="text-lg">🏥</span>
                      <span className="text-[10px] bg-white text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-bold shadow-sm">
                        Civil Hosp (18 Beds)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs z-10 pt-2 border-t border-slate-200">
                  <span className="text-slate-600">4 Civilians Trapped • 2 Injured • Rising Water</span>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Command Center</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section: How RescueAI Works */}
      <section className="py-20 border-b border-slate-200 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Life-Saving Pipeline
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How RescueAI Coordinates Disasters
            </h3>
            <p className="text-slate-600 text-sm">
              An end-to-end autonomous triage and coordination pipeline connecting victims to rapid responders in seconds.
            </p>
          </div>

          {/* Workflow Step Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold mb-4 text-sm">
                01
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                Emergency Report
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Citizens submit distress SOS with GPS coordinates, disaster type (Flood, Fire, etc.), casualties, and hazard conditions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-blue-300 ring-2 ring-blue-500/10 shadow-md transition-shadow relative">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800 font-bold mb-4 text-sm">
                02
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-600" />
                AI Severity Engine
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-variable neural algorithm computes a 0-100 severity score, classifying into Critical, High, Moderate, or Low priority.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold mb-4 text-sm">
                03
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Ambulance className="w-4 h-4 text-amber-600" />
                SAR Fleet Dispatch
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Matches the nearest qualified team (e.g. Amphibious Jet Boat R-07) and calculates safe transit route avoiding hazard zones.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold mb-4 text-sm">
                04
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Hospital & Shelter
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time bed telemetry reserves trauma ICU spots and routes evacuees to stocked relief shelters until mission completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Priority Classification Showcase */}
      <section className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                AI Decision Engine
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Deterministic 4-Tier <br />
                Priority Classification
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                In disaster environments, subjective prioritization creates bottlenecks. RescueAI continuously analyzes 6 key variables:
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Number of people trapped</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Reported casualty injuries</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Urgent medical requirements</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Hazard: water, fire, collapse</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Accessibility & road blockage</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Hydrological & terrain risk</span>
                </div>
              </div>
            </div>

            {/* Visual Priority Tier Cards */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-rose-800">CRITICAL [80 - 100]</span>
                    <PriorityBadge priority="CRITICAL" size="sm" />
                  </div>
                  <p className="text-xs text-rose-900/80 mt-1">
                    Direct life peril, active bleeding/injuries, trapped in rising water or collapsed structure. Instant Tier-1 SAR dispatch.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-orange-800">HIGH [60 - 79]</span>
                    <PriorityBadge priority="HIGH" size="sm" />
                  </div>
                  <p className="text-xs text-orange-900/80 mt-1">
                    Multiple civilians stranded, surrounding water rising, urgent evacuation required before routes submerge.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-amber-800">MODERATE [30 - 59]</span>
                    <PriorityBadge priority="MODERATE" size="sm" />
                  </div>
                  <p className="text-xs text-amber-900/80 mt-1">
                    No physical casualties, egress roads partially blocked, shelter relocation and ration distribution needed.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-emerald-800">LOW [0 - 29]</span>
                    <PriorityBadge priority="LOW" size="sm" />
                  </div>
                  <p className="text-xs text-emerald-900/80 mt-1">
                    Minor waterlogging, informational queries, advisory broadcast monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Experience Pillars */}
      <section className="py-20 border-b border-slate-200 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Designed For Both Frontlines
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Two Integrated Experiences
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Citizen Experience */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 hover:border-amber-400 transition-colors shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <AlertOctagon className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-slate-900">1. Citizen Experience</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Simple, accessible, and fast interface for individuals and families in distress during disasters.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant 1-Tap SOS with auto-detected GPS location</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Report disaster type, victim count, injuries & medical needs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time AI Severity feedback and assigned team notification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live rescue progress tracker with team distance & ETA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Actionable evacuation instructions and safety guidelines</span>
                </li>
              </ul>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => navigate('/report-emergency')}
                  className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  Report Distress
                </button>
                <button
                  onClick={() => navigate('/sos')}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                >
                  1-Tap SOS
                </button>
              </div>
            </div>

            {/* Responder Experience */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 hover:border-blue-400 transition-colors shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <Radio className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-slate-900">2. Responder & Authority Command</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Mission-control dashboard for NDRF, municipal authorities, hospitals, and disaster commanders.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Disaster Command Center with live KPIs and priority queue</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Interactive tactical map with radar sweep and hazard zones</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Fleet management: assign, reroute, and monitor rescue boats/trucks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Hospital bed and ICU ventilator capacity allocation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Emergency public broadcast system and analytical trends</span>
                </li>
              </ul>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  Open Command Center
                </button>
                <button
                  onClick={() => navigate('/map')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Tactical Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* College / Hackathon Evaluation Banner */}
      <section className="py-14 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 border-b border-slate-200 text-center text-white">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/20">
            Recommended Hackathon Evaluator Flow
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            End-to-End Demo Scenario: Sector 14 Flood Rescue
          </h3>
          <p className="text-sm text-blue-100 max-w-xl mx-auto">
            Click below to instantly trigger the end-to-end flood rescue case. Watch the AI calculate a 92/100 Critical score, assign Rescue Team R-07 (ETA 8 mins), allocate Civil Hospital, and display live updates on both citizen and authority dashboards.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleLaunchDemo}
              className="px-8 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm tracking-wide shadow-lg flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-blue-600" />
              <span>Launch Flood Rescue Demo</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
