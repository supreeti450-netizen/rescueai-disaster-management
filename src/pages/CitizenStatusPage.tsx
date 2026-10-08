import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import { EmergencyStatus } from '../types';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { TacticalRouteMap } from '../components/map/TacticalRouteMap';
import { 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Ambulance, 
  Building2, 
  Phone, 
  Radio, 
  ShieldCheck, 
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  MapPin,
  X,
  Compass,
  ArrowRight
} from 'lucide-react';

interface CitizenStatusPageProps {
  navigate: (path: string) => void;
  emergencyId?: string;
}

export const CitizenStatusPage: React.FC<CitizenStatusPageProps> = ({ navigate, emergencyId }) => {
  const { 
    emergencies, 
    rescueTeams, 
    hospitals, 
    updateEmergencyStatus, 
    markRescueCompleted,
    currentCitizenEmergencyId 
  } = useRescue();

  const targetId = emergencyId || currentCitizenEmergencyId || 'RA-1024';
  const currentCase = emergencies.find((e) => e.id === targetId) || emergencies[0];

  const assignedTeam = rescueTeams.find((t) => t.id === currentCase?.assignedTeamId) || rescueTeams[0];
  const hospital = hospitals.find((h) => h.id === currentCase?.recommendedHospitalId) || hospitals[0];

  const [callActive, setCallActive] = useState(false);
  const [showRescueConfirmModal, setShowRescueConfirmModal] = useState(false);

  if (!currentCase) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F8FAFC] text-slate-900 min-h-[60vh]">
        <div className="text-slate-600 mb-4 font-medium">No active emergency case found.</div>
        <button
          onClick={() => navigate('/report-emergency')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold text-xs shadow-sm transition-colors"
        >
          Report an Emergency
        </button>
      </div>
    );
  }

  // 8-stage Timeline lifecycle matching Section 8:
  // ✓ SOS RECEIVED
  // ✓ AI ANALYSIS COMPLETE
  // ✓ PRIORITY: CRITICAL
  // ✓ RESCUE TEAM ASSIGNED
  // ● TEAM EN ROUTE
  // ○ RESCUE IN PROGRESS
  // ○ RESCUED
  // ○ CASE CLOSED
  const timelineStages = [
    { id: 1, label: 'SOS RECEIVED', statusKey: 'Reported', sub: 'Distress ping logged' },
    { id: 2, label: 'AI ANALYSIS COMPLETE', statusKey: 'Analyzing', sub: 'Multi-factor risk computed' },
    { id: 3, label: `PRIORITY: ${currentCase.priority}`, statusKey: 'Analyzing', sub: `Score: ${currentCase.aiScore}/100` },
    { id: 4, label: 'RESCUE TEAM ASSIGNED', statusKey: 'Assigned', sub: `Matched: ${assignedTeam.name}` },
    { id: 5, label: 'TEAM EN ROUTE', statusKey: 'En Route', sub: 'In transit via Bypass 4B' },
    { id: 6, label: 'RESCUE IN PROGRESS', statusKey: 'In Progress', sub: 'On-scene extraction' },
    { id: 7, label: 'RESCUED', statusKey: 'Resolved', sub: `${currentCase.peopleAffected} People secured` },
    { id: 8, label: 'CASE CLOSED', statusKey: 'Closed', sub: 'Debrief complete' },
  ];

  // Helper to determine stage status
  const getStageState = (stageIndex: number) => {
    // Current status index mapping
    let currentIdx = 4; // default En Route
    switch (currentCase.status) {
      case 'Reported':
        currentIdx = 1;
        break;
      case 'Analyzing':
        currentIdx = 2;
        break;
      case 'Assigned':
        currentIdx = 3;
        break;
      case 'En Route':
        currentIdx = 4;
        break;
      case 'In Progress':
        currentIdx = 5;
        break;
      case 'Resolved':
        currentIdx = 6;
        break;
      case 'Closed':
        currentIdx = 7;
        break;
      default:
        currentIdx = 4;
    }

    if (stageIndex < currentIdx) return 'completed';
    if (stageIndex === currentIdx) return 'active';
    return 'pending';
  };

  // Progression handler: ASSIGNED → EN ROUTE → RESCUE IN PROGRESS → RESCUED → CLOSED
  const handleAdvanceStatus = () => {
    const progression: Record<EmergencyStatus, EmergencyStatus> = {
      Reported: 'Assigned',
      Analyzing: 'Assigned',
      Assigned: 'En Route',
      'En Route': 'In Progress',
      'In Progress': 'Resolved',
      Evacuating: 'Resolved',
      Resolved: 'Closed',
      Closed: 'Closed',
    };

    const next = progression[currentCase.status] || 'En Route';
    if (next === 'Resolved') {
      setShowRescueConfirmModal(true);
    } else {
      updateEmergencyStatus(currentCase.id, next);
    }
  };

  const handleConfirmRescue = () => {
    markRescueCompleted(currentCase.id);
    setShowRescueConfirmModal(false);
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 py-8 px-4 sm:px-6 lg:px-8 space-y-6 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-blue-700 font-bold">
                EMERGENCY #{currentCase.id}
              </span>
              <PriorityBadge priority={currentCase.priority} size="sm" />
              <StatusBadge status={currentCase.status} size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Live Emergency Tracking
            </h1>
            <p className="text-xs text-slate-600">
              {currentCase.location.address} ({currentCase.location.sector}) • {currentCase.peopleAffected} People ({currentCase.injuredCount} Injured)
            </p>
          </div>

          {/* Quick Life-Cycle Progression Controls */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl self-start md:self-center">
            {currentCase.status !== 'Resolved' && currentCase.status !== 'Closed' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdvanceStatus}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>ADVANCE STATUS</span>
                </button>

                <button
                  onClick={() => setShowRescueConfirmModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>MARK RESCUED</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => updateEmergencyStatus(currentCase.id, 'En Route')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET DEMO WORKFLOW</span>
              </button>
            )}
          </div>
        </div>

        {/* ====================================================
            8. EMERGENCY STATUS TIMELINE
            ==================================================== */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              EMERGENCY STATUS TIMELINE
            </span>
            <span className="text-xs text-slate-600">
              ACTIVE STAGE: <strong className="text-slate-900">{currentCase.status.toUpperCase()}</strong>
            </span>
          </div>

          {/* Horizontal / Grid Timeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 relative">
            {timelineStages.map((stage, idx) => {
              const state = getStageState(idx);

              return (
                <div
                  key={stage.id}
                  className={`p-3 rounded-xl border flex flex-col justify-between text-left transition-all ${
                    state === 'active'
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                      : state === 'completed'
                      ? 'bg-emerald-50 border-emerald-200 text-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-400 font-semibold">0{stage.id}</span>
                    {state === 'completed' && (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                    {state === 'active' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                    )}
                    {state === 'pending' && (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                    )}
                  </div>

                  <div>
                    <div
                      className={`text-[11px] font-bold tracking-tight leading-tight uppercase ${
                        state === 'active'
                          ? 'text-blue-900'
                          : state === 'completed'
                          ? 'text-emerald-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {state === 'completed' ? `✓ ${stage.label}` : state === 'active' ? `● ${stage.label}` : `○ ${stage.label}`}
                    </div>
                    <div className="text-[9.5px] text-slate-500 line-clamp-1 mt-1 font-medium">
                      {stage.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ====================================================
            9. LIVE TRACKING
            ==================================================== */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">
                GEOSPATIAL FLEET TELEMETRY
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Live Mission Tracking
              </h2>
            </div>
            <div className="text-xs text-slate-500">
              UPDATED: <span className="text-emerald-700 font-semibold">1 SEC AGO</span> • REFRESH: REALTIME
            </div>
          </div>

          {/* Tactical Vector Map */}
          <TacticalRouteMap
            teamName={assignedTeam.name}
            teamCallsign={assignedTeam.callSign}
            teamEtaMinutes={currentCase.status === 'Resolved' || currentCase.status === 'Closed' ? 0 : 8}
            teamDistanceKm={2.4}
            victimAddress={currentCase.location.address}
            hospitalName={hospital.name}
            hospitalBeds={hospital.availableBeds}
            hospitalIcu={hospital.availableIcu}
            statusText={currentCase.status.toUpperCase()}
            heightClass="h-[460px]"
          />
        </div>

        {/* ====================================================
            TEAM & MEDICAL RESPONSE CARDS
            ==================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team R-07 Status Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-blue-700 uppercase tracking-wider font-bold">
                  ASSIGNED UNIT
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {assignedTeam.name}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">
                  CALLSIGN: <span className="text-blue-700 font-bold">{assignedTeam.callSign}</span> • LEADER: {assignedTeam.leaderName}
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl">
                🚑
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">DISTANCE</span>
                <span className="text-base font-bold text-slate-900">2.4 km</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">EST. ARRIVAL</span>
                <span className="text-base font-bold text-emerald-700 animate-pulse">
                  {currentCase.status === 'Resolved' || currentCase.status === 'Closed' ? '0 min' : '8 mins'}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">CREW SIZE</span>
                <span className="text-base font-bold text-blue-700">{assignedTeam.membersCount} Crew</span>
              </div>
            </div>

            <div className="text-xs text-slate-700 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-semibold text-slate-900">{assignedTeam.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Specialization:</span>
                <span className="text-amber-800 font-semibold">{assignedTeam.specialization}</span>
              </div>
            </div>

            {/* Direct Radio Channel */}
            <div className="pt-1">
              <button
                onClick={() => setCallActive(!callActive)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  callActive
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>{callActive ? 'RADIO FREQUENCY CONNECTED (CH-14)' : 'OPEN DIRECT RADIO CHANNEL WITH TEAM'}</span>
              </button>
              {callActive && (
                <div className="mt-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium">
                  🔊 Dispatcher Audio: "Team R-07 approaching Sector 14 via Bypass 4B. Water jet boat deployed. Stay on rooftop, we have visual."
                </div>
              )}
            </div>
          </div>

          {/* Hospital & Evacuation Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-emerald-700 uppercase tracking-wider font-bold">
                  ALLOCATED MEDICAL RECEPTION
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {hospital.name}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {hospital.location.address} • Trauma Center Level {hospital.traumaCenterLevel}
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl">
                🏥
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">AVAILABLE BEDS</span>
                <span className="text-base font-bold text-emerald-700">{hospital.availableBeds} / {hospital.totalBeds}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">ICU VENTILATORS</span>
                <span className="text-base font-bold text-blue-700">{hospital.availableIcu} Available</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>On-Scene Civilian Safety Directives:</span>
              </div>
              <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                <li>Stay on rooftop or upper levels; avoid basements and underground structures.</li>
                <li>Avoid moving water currents deeper than 15 cm.</li>
                <li>Flash a light or signal with reflective clothing for airborne and watercraft spotters.</li>
                <li>Keep medical prescription drugs and emergency kits dry in sealed bags.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
          CONFIRMATION MODAL: MARK RESCUED
          ==================================================== */}
      {showRescueConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 space-y-5 text-center text-slate-800">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-2xl text-emerald-700 font-bold">
              ✓
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Confirm rescue completion?
              </h3>
              <p className="text-xs text-slate-500">
                Emergency #{currentCase.id} • {currentCase.peopleAffected} People ({currentCase.injuredCount} Injured)
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="text-slate-600">• Status will transition to: <strong className="text-emerald-700">RESCUED</strong></div>
              <div className="text-slate-600">• People rescued counter: <strong className="text-slate-900">+{currentCase.peopleAffected}</strong></div>
              <div className="text-slate-600">• Team R-07 status: <strong className="text-blue-700">AVAILABLE</strong></div>
              <div className="text-slate-600">• Activity event will be broadcast to command center feed.</div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRescueConfirmModal(false)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmRescue}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Confirm Rescue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
