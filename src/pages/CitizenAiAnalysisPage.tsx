import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CircularSeverityGauge } from '../components/common/CircularSeverityGauge';
import { 
  ShieldAlert, 
  Ambulance, 
  Building2, 
  MapPin, 
  Users, 
  HeartPulse, 
  Navigation, 
  CheckCircle2, 
  ArrowRight,
  Activity,
  Layers,
  Clock,
  Sparkles,
  Cpu,
  AlertTriangle,
  X
} from 'lucide-react';

interface CitizenAiAnalysisPageProps {
  navigate: (path: string) => void;
  emergencyId?: string;
}

export const CitizenAiAnalysisPage: React.FC<CitizenAiAnalysisPageProps> = ({ navigate, emergencyId }) => {
  const { 
    emergencies, 
    rescueTeams, 
    hospitals, 
    currentCitizenEmergencyId, 
    assignTeamToEmergency,
    addToast 
  } = useRescue();

  const targetId = emergencyId || currentCitizenEmergencyId || 'RA-1024';
  const targetCase = emergencies.find((e) => e.id === targetId) || emergencies[0];

  // Confirmation modal state for ASSIGN TEAM R-07
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  if (!targetCase) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F8FAFC] text-slate-900 min-h-[60vh]">
        <div className="text-slate-600 mb-4 font-medium">Emergency case not found.</div>
        <button
          onClick={() => navigate('/report-emergency')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold text-xs shadow-sm transition-colors"
        >
          Report New Emergency
        </button>
      </div>
    );
  }

  const teamId = targetCase.assignedTeamId || 'R-07';
  const assignedTeam = rescueTeams.find((t) => t.id === teamId) || rescueTeams[0];
  const hospital = hospitals.find((h) => h.id === targetCase.recommendedHospitalId) || hospitals[0];

  const handleConfirmAssignment = () => {
    setIsAssigning(true);
    assignTeamToEmergency(targetCase.id, 'R-07');
    addToast('Team R-07 Assigned', 'Team R-07 assigned successfully.', 'success');

    setTimeout(() => {
      setIsAssigning(false);
      setShowAssignModal(false);
      navigate(`/emergency-status?id=${targetCase.id}`);
    }, 600);
  };

  // Structured reasoning cards for Section 4
  const reasoningBullets = [
    { text: 'Multiple people affected (4 trapped civilians)', impact: '+ High Density Hazard' },
    { text: '2 injured persons requiring urgent medical stabilization', impact: '+ Critical Casualty' },
    { text: 'Medical assistance required (ALS Emergency Protocol)', impact: '+ Paramedic Mandate' },
    { text: 'Rising flood water approaching dangerous depth', impact: '+ Environmental Peril' },
    { text: 'Limited evacuation access (Submerged Underpass 14)', impact: '+ High Impedance' },
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ====================================================
            3. AI ANALYSIS: RESCUEAI ASSESSMENT HEADER
            ==================================================== */}
        <div className="bg-white border border-rose-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 flex-1 text-left">
              <div className="flex items-center gap-2.5">
                <span className="text-xs px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-blue-700 font-bold tracking-wider">
                  CASE ID: #{targetCase.id}
                </span>
                <PriorityBadge priority={targetCase.priority} size="md" />
                <span className="text-[11px] text-slate-500 font-semibold">
                  SECTOR: {targetCase.location.sector || 'Sector 14'}
                </span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-blue-600 font-bold block mb-0.5">
                  DISASTER INTELLIGENCE TRIAGE
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  RESCUEAI ASSESSMENT
                </h1>
              </div>

              {/* Core Parameters Table / Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">DISASTER</span>
                  <span className="text-xs font-bold text-slate-900">{targetCase.disasterType}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">PEOPLE AFFECTED</span>
                  <span className="text-xs font-bold text-amber-700">{targetCase.peopleAffected} People</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">INJURED</span>
                  <span className="text-xs font-bold text-rose-700">{targetCase.injuredCount} Injured</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">MEDICAL ASSISTANCE</span>
                  <span className="text-xs font-bold text-rose-800">
                    {targetCase.medicalEmergency ? 'Required (Immediate ALS)' : 'Standard'}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl sm:col-span-2">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">DANGER</span>
                  <span className="text-xs font-bold text-orange-700 truncate block">
                    {targetCase.dangers.join(', ') || 'Rising water'}
                  </span>
                </div>
              </div>
            </div>

            {/* Circular Severity Gauge */}
            <div className="shrink-0 flex flex-col items-center justify-center bg-rose-50/60 p-4 rounded-2xl border border-rose-200 shadow-sm">
              <CircularSeverityGauge
                score={targetCase.aiScore || 92}
                priority={targetCase.priority}
                size={180}
                subtitle="AI SEVERITY SCORE"
              />
            </div>
          </div>
        </div>

        {/* ====================================================
            4. AI REASONING: WHY THIS CASE IS CRITICAL
            ==================================================== */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-rose-600 font-bold">
                TRIAGE FACTOR DECOMPOSITION
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                WHY THIS CASE IS CRITICAL
              </h2>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>AI-assisted risk assessment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {reasoningBullets.map((r, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 hover:border-slate-300 p-3.5 rounded-xl flex items-start gap-3 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 font-bold text-sm shrink-0 mt-0.5">
                  +
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    {r.text}
                  </div>
                  <div className="text-[10px] text-rose-700 font-semibold">
                    {r.impact}
                  </div>
                </div>
              </div>
            ))}

            {/* Note banner: rule-based transparency */}
            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl flex items-center gap-3 text-xs text-blue-900">
              <Activity className="w-5 h-5 text-blue-600 shrink-0" />
              <span>
                Calculated by RescueAI Multi-Factor Risk Engine (Casualties • Inundation • ALS Need • Egress Impedance).
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================
            6. AI RECOMMENDATION
            ==================================================== */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-600 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>RESCUEAI RECOMMENDATION</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <span>🚨 IMMEDIATE RESCUE REQUIRED</span>
              </h2>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-semibold">
              DISPATCH DIRECTIVE: PROTOCOL ALPHA
            </div>
          </div>

          {/* Allocation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recommended Rescue Team Card */}
            <div className="bg-blue-50/40 border border-blue-200 rounded-2xl p-5 space-y-3 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-blue-700 uppercase tracking-wider font-bold block">
                    RECOMMENDED RESCUE TEAM
                  </span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    TEAM R-07
                  </div>
                  <div className="text-xs text-slate-600">Amphibious Search & Rescue Craft</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-xl">
                  🚑
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">DISTANCE</span>
                  <span className="text-sm font-bold text-slate-900">2.4 km</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">EST. ARRIVAL</span>
                  <span className="text-sm font-bold text-emerald-700 animate-pulse">8 minutes</span>
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">ONBOARD EQUIPMENT:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Rescue Boat', 'First Aid', 'Life Jackets'].map((eq, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 rounded text-[11px] font-medium">
                      ✓ {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Medical Facility Card */}
            <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-5 space-y-3 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-emerald-700 uppercase tracking-wider font-bold block">
                    RECOMMENDED MEDICAL FACILITY
                  </span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    Civil Hospital
                  </div>
                  <div className="text-xs text-slate-600">Level-1 Trauma & Emergency Care</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xl">
                  🏥
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">AVAILABLE BEDS</span>
                  <span className="text-sm font-bold text-emerald-700">18 Beds</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">ICU BEDS</span>
                  <span className="text-sm font-bold text-blue-700">4 ICU Beds</span>
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">RECOMMENDED SAFE ROUTE:</span>
                <div className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 p-2 rounded-lg leading-relaxed font-medium">
                  Sector 14 Ring Arterial via Elevated Bypass 4B (avoid Submerged Underpass 14).
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation Directive Text */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-900 font-medium flex items-center gap-3">
            <span className="text-xl">📢</span>
            <div className="italic">
              "Deploy Team R-07 immediately and transport injured victims to Civil Hospital."
            </div>
          </div>

          {/* ====================================================
              7. RESCUE TEAM ASSIGNMENT ACTION BUTTON
              ==================================================== */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 font-semibold">
              STATUS: PENDING DISPATCH CONFIRMATION
            </div>

            <button
              onClick={() => setShowAssignModal(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wider uppercase shadow-md flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Ambulance className="w-5 h-5 text-white animate-pulse" />
              <span>ASSIGN RESCUE TEAM</span>
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================
          CONFIRMATION MODAL: ASSIGN TEAM R-07?
          ==================================================== */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 space-y-5 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                <h3 className="text-lg font-bold text-slate-900">
                  Assign Team R-07?
                </h3>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">Emergency:</span>
                <span className="font-bold text-slate-900">#{targetCase.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Distance:</span>
                  <span className="font-bold text-slate-900 text-sm">2.4 km</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">ETA:</span>
                  <span className="font-bold text-emerald-700 text-sm">8 minutes</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] mb-1 font-semibold uppercase">Equipment:</span>
                <div className="flex flex-wrap gap-1.5 text-slate-700">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">Rescue Boat</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">First Aid</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">Life Jackets</span>
                </div>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isAssigning}
                onClick={handleConfirmAssignment}
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isAssigning ? 'Dispatching...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
