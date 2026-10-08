import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';

import {
  Users,
  HeartPulse,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Search,
  Filter,
  Navigation
} from 'lucide-react';

interface VictimsPageProps {
  navigate: (path: string) => void;
}

export const VictimsPage: React.FC<VictimsPageProps> = ({ navigate }) => {
  const { emergencies, updateEmergencyStatus } = useRescue();
  const [filterMode, setFilterMode] = useState<'ALL' | 'CRITICAL' | 'MEDICAL' | 'RESOLVED'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = emergencies.filter((em) => {
    if (filterMode === 'CRITICAL' && em.priority !== 'CRITICAL') return false;
    if (filterMode === 'MEDICAL' && !em.medicalEmergency) return false;
    if (filterMode === 'RESOLVED' && em.status !== 'Resolved') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        em.id.toLowerCase().includes(q) ||
        em.location.address.toLowerCase().includes(q) ||
        (em.contactName && em.contactName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalPeople = emergencies.reduce((acc, curr) => acc + curr.peopleAffected, 0);
  const totalInjured = emergencies.reduce((acc, curr) => acc + curr.injuredCount, 0);
  const criticalCases = emergencies.filter((e) => e.priority === 'CRITICAL').length;

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>HUMANITARIAN TRIAGE DIRECTORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Victims & Evacuees Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time tracking of stranded individuals, medical triage status, and evacuation records.
          </p>
        </div>

        {/* Triage Summary Chips */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-center shadow-sm">
            <span className="text-slate-500 text-[10px] uppercase font-semibold block">TOTAL IDENTIFIED</span>
            <span className="font-bold text-slate-900 text-sm">{totalPeople} Civilians</span>
          </div>
          <div className="bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl text-center shadow-sm">
            <span className="text-rose-700 text-[10px] uppercase font-semibold block">REPORTED INJURIES</span>
            <span className="font-bold text-rose-700 text-sm">{totalInjured} Casualties</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterMode === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Victims ({emergencies.length})
          </button>
          <button
            onClick={() => setFilterMode('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              filterMode === 'CRITICAL'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            Critical Triage ({criticalCases})
          </button>
          <button
            onClick={() => setFilterMode('MEDICAL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterMode === 'MEDICAL'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Urgent Medical
          </button>
          <button
            onClick={() => setFilterMode('RESOLVED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterMode === 'RESOLVED'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Evacuated
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search victim name or location..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((em) => {
          const isCritical = em.priority === 'CRITICAL';

          return (
            <div
              key={em.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between bg-white ${
                isCritical
                  ? 'border-rose-300 shadow-sm hover:shadow-md'
                  : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {em.id}
                    </span>
                    <PriorityBadge priority={em.priority} size="sm" />
                  </div>
                  <StatusBadge status={em.status} size="sm" />
                </div>

                {/* Victim Details */}
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>{em.peopleAffected} People Affected</span>
                    {em.injuredCount > 0 && (
                      <span className="text-rose-700 text-xs font-mono font-bold">
                        ({em.injuredCount} Injured)
                      </span>
                    )}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{em.location.address} ({em.location.sector})</span>
                  </div>
                </div>

                {/* Score & Urgency */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-500 text-[10px] block font-medium">AI SEVERITY</span>
                    <span className={`font-bold font-mono text-sm ${isCritical ? 'text-rose-600' : 'text-amber-600'}`}>
                      {em.aiScore} / 100
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-500 text-[10px] block font-medium">MEDICAL CARE</span>
                    <span className={`font-bold text-xs ${em.medicalEmergency ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {em.medicalEmergency ? 'REQUIRED' : 'STANDARD'}
                    </span>
                  </div>
                </div>

                {/* Caller Contact */}
                <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{em.contactName || 'Civilians'}</span>
                  <span className="text-slate-700 font-mono text-[11px] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{em.contactPhone || 'GPS Beacon'}</span>
                  </span>
                </div>
              </div>

              {/* Bottom actions */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Team: <strong className="text-blue-600">{em.assignedTeamId || 'Pending'}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/emergency-status?id=${em.id}`)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Track
                  </button>
                  {em.status !== 'Resolved' ? (
                    <button
                      onClick={() => updateEmergencyStatus(em.id, 'Resolved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Safe</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold font-mono">✓ EVACUATED</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-slate-800">
              No victims matching this triage level
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No civilian distress reports currently match the selected criteria or search query.
            </p>
            <button
              onClick={() => { setFilterMode('ALL'); setSearch(''); }}
              className="mt-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              Reset Triage Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
