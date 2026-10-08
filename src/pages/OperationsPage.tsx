import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { OperationStatus } from '../types';
import { OPERATION_STATUS_STEPS } from '../services/operationsEngine';
import {
  Activity,
  Ambulance,
  Building2,
  Navigation,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  MapPin,
  Play,
  RotateCcw,
  Zap,
  Check,
  ChevronRight,
  Sparkles,
  Users,
  Compass,
  AlertTriangle
} from 'lucide-react';

interface OperationsPageProps {
  navigate: (path: string) => void;
}

export const OperationsPage: React.FC<OperationsPageProps> = ({ navigate }) => {
  const {
    operations,
    emergencies,
    rescueTeams,
    hospitals,
    advanceOperationStatus,
    triggerFloodDemo,
    addToast
  } = useRescue();

  const [selectedOpId, setSelectedOpId] = useState<string>('OP-1024');
  const [autoPlaying, setAutoPlaying] = useState<boolean>(false);

  const activeOp = operations.find((o) => o.id === selectedOpId) || operations[0] || {
    id: 'OP-1024',
    emergencyId: 'RA-1024',
    status: 'TEAM ASSIGNED' as OperationStatus,
    priority: 'CRITICAL',
    victimsCount: 4,
    injuredCount: 2,
    assignedTeamId: 'R-07',
    allocatedResources: [
      { name: 'Rescue Boat', serial: 'Rescue Boat R-B04', assigned: true },
      { name: 'Medical Kit', serial: 'Medical Kit M-23', assigned: true },
      { name: 'Life Jackets', serial: 'Life Jackets L-18', assigned: true },
      { name: 'Emergency Radio', serial: 'Emergency Radio RAD-09', assigned: true },
    ],
    hospitalId: 'H-01',
    hospitalName: 'Civil Hospital',
    availableBeds: 18,
    availableIcu: 4,
    routeType: 'Safe Route (Elevated Bypass 4B)',
    distanceKm: 5.2,
    etaMinutes: 8,
    risk: 'LOW',
    updatedAt: 'Just now',
    history: []
  };

  const emergencyCase = emergencies.find((e) => e.id === activeOp.emergencyId);
  const assignedTeam = rescueTeams.find((t) => t.id === activeOp.assignedTeamId);
  const hospital = hospitals.find((h) => h.id === activeOp.hospitalId);

  // Status index for timeline
  const currentStepIndex = OPERATION_STATUS_STEPS.indexOf(activeOp.status);

  // Handle advancing next step
  const handleStepNext = () => {
    if (currentStepIndex < OPERATION_STATUS_STEPS.length - 1) {
      const nextStatus = OPERATION_STATUS_STEPS[currentStepIndex + 1];
      advanceOperationStatus(activeOp.id, nextStatus);
    }
  };

  // Reset operation
  const handleReset = () => {
    advanceOperationStatus(activeOp.id, 'PENDING');
    addToast('Operation Reset', 'Operation returned to PENDING state.', 'info');
  };

  // Auto-run simulation sequence
  const handleAutoRun = () => {
    if (autoPlaying) return;
    setAutoPlaying(true);
    let step = currentStepIndex;

    const interval = setInterval(() => {
      step++;
      if (step < OPERATION_STATUS_STEPS.length) {
        advanceOperationStatus(activeOp.id, OPERATION_STATUS_STEPS[step]);
      } else {
        clearInterval(interval);
        setAutoPlaying(false);
      }
    }, 1500);
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6 min-h-[calc(100vh-4rem)]">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>INCIDENT COMMAND SYSTEM • LIFECYCLE CONTROLLER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span>OPERATION #{activeOp.id}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
              🔴 {activeOp.priority}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            End-to-end tactical lifecycle: assignment, equipment provisioning, transit, rescue and triage transfer.
          </p>
        </div>

        {/* Demo Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 border border-slate-200 shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>RESET</span>
          </button>

          <button
            onClick={handleAutoRun}
            disabled={autoPlaying || currentStepIndex >= OPERATION_STATUS_STEPS.length - 1}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
            <span>{autoPlaying ? 'RUNNING DEMO...' : '⚡ AUTO-RUN DEMO SCENARIO'}</span>
          </button>

          <button
            onClick={handleStepNext}
            disabled={currentStepIndex >= OPERATION_STATUS_STEPS.length - 1}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
          >
            <span>NEXT STAGE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* OPERATION STATUS PROGRESSION TIMELINE */}
      <section className="bg-white border border-blue-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-700">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>MISSION TIMELINE & PROGRESSION STATUS ({currentStepIndex + 1} / {OPERATION_STATUS_STEPS.length})</span>
          </div>

          <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            CURRENT: {activeOp.status}
          </span>
        </div>

        {/* Progression Stepper */}
        <div className="grid grid-cols-3 md:grid-cols-9 gap-2 text-center text-xs">
          {OPERATION_STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isUpcoming = idx > currentStepIndex;

            return (
              <div
                key={step}
                onClick={() => advanceOperationStatus(activeOp.id, step)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-between min-h-[90px] ${
                  isCurrent
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400 shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent
                    ? 'bg-blue-600 text-white animate-pulse'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>

                <div className={`text-[10px] font-bold mt-1 uppercase leading-tight ${
                  isCurrent ? 'text-blue-900' : isCompleted ? 'text-emerald-800' : 'text-slate-500'
                }`}>
                  {step}
                </div>

                <div className="text-[9px] text-slate-400 mt-1 font-medium">
                  {isCurrent ? 'ACTIVE' : isCompleted ? 'DONE' : 'PENDING'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* OPERATION DETAIL BLOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* BLOCK 1: EMERGENCY INCIDENT */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
              TARGET EMERGENCY
            </span>
            <span className="text-base">🚨</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 font-mono">#{activeOp.emergencyId}</h3>
            <div className="text-xs text-slate-500 mt-0.5">Flood Inundation • Sector 14</div>
          </div>

          <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Priority:</span>
              <strong className="text-rose-700 font-bold">🔴 CRITICAL</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Victims:</span>
              <strong className="text-slate-900">{activeOp.victimsCount} Trapped</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Injured:</span>
              <strong className="text-amber-700 font-bold">{activeOp.injuredCount} Casualties</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px]">
              <span className="text-slate-500">Location:</span>
              <span className="text-slate-800 text-right">Rooftop, Plot 42</span>
            </div>
          </div>
        </div>

        {/* BLOCK 2: RESCUE TEAM */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              ASSIGNED RESCUE TEAM
            </span>
            <span className="text-base">🚑</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-blue-700 font-mono">{activeOp.assignedTeamId}</h3>
            <div className="text-xs text-slate-500 mt-0.5">Amphibious Rapid SAR</div>
          </div>

          <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Status:</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[10px]">
                {assignedTeam?.status.toUpperCase() || 'ASSIGNED'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ETA to Victim:</span>
              <strong className="text-emerald-700 font-bold font-mono">{activeOp.etaMinutes} min</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Vehicle:</span>
              <strong className="text-slate-800">Rescue Boat</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Members:</span>
              <strong className="text-slate-800">6 Personnel</strong>
            </div>
          </div>
        </div>

        {/* BLOCK 3: ALLOCATED RESOURCES */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              ALLOCATED RESOURCES
            </span>
            <span className="text-base">📦</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-emerald-700 font-mono">4 PROVISIONED</h3>
            <div className="text-xs text-slate-500 mt-0.5">Locked to Team {activeOp.assignedTeamId}</div>
          </div>

          <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
            {activeOp.allocatedResources.map((res, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700 font-medium">{res.name}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  ✓ <span className="text-slate-500 text-[10px]">{res.serial.split(' ')[1] || 'Assigned'}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCK 4: HOSPITAL RECEPTION & SAFE ROUTE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              HOSPITAL & SAFE ROUTE
            </span>
            <span className="text-base">🏥</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">{activeOp.hospitalName}</h3>
            <div className="text-xs text-emerald-700 mt-0.5">🟢 ACCEPTING (Level 1 Trauma)</div>
          </div>

          <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Available Beds:</span>
              <strong className="text-emerald-700 font-bold">{activeOp.availableBeds} beds</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ICU Ventilators:</span>
              <strong className="text-blue-700 font-bold">{activeOp.availableIcu} available</strong>
            </div>
            <div className="pt-1.5 border-t border-slate-200 flex justify-between">
              <span className="text-slate-500">Route Corridor:</span>
              <strong className="text-emerald-700">{activeOp.distanceKm} km ({activeOp.risk} RISK)</strong>
            </div>
            <div className="text-[10px] text-slate-500 italic">
              Via Elevated Bypass 4B (underpass avoided)
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITY HISTORY LOG */}
      <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="text-[11px] font-bold uppercase text-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>OPERATIONAL AUDIT TRAIL & LOGS</span>
          </div>
          <span className="text-[10px] text-slate-400">Live Timestamped</span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto">
          {activeOp.history.map((h, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                  {h.status}
                </span>
                <span className="text-slate-700">{h.note}</span>
              </div>
              <span className="text-slate-400 text-[10px] shrink-0 ml-2 font-mono">{h.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
