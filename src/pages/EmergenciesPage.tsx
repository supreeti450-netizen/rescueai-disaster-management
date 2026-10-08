import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { DisasterType, PriorityLevel, EmergencyCase } from '../types';

import {
  Search,
  Filter,
  SlidersHorizontal,
  Eye,
  CheckCircle2,
  Ambulance,
  AlertTriangle,
  Building2,
  Navigation,
  ArrowUpDown,
  X,
  Phone,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';

interface EmergenciesPageProps {
  navigate: (path: string) => void;
}

export const EmergenciesPage: React.FC<EmergenciesPageProps> = ({ navigate }) => {
  const { emergencies, rescueTeams, hospitals, assignTeamToEmergency, updateEmergencyStatus } = useRescue();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [disasterFilter, setDisasterFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'people' | 'time'>('score');
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);
  const [assigningTeamForId, setAssigningTeamForId] = useState<string | null>(null);

  // Filter & Sort
  const filtered = emergencies
    .filter((em) => {
      if (priorityFilter !== 'ALL' && em.priority !== priorityFilter) return false;
      if (disasterFilter !== 'ALL' && em.disasterType !== disasterFilter) return false;
      if (statusFilter === 'ACTIVE' && em.status === 'Resolved') return false;
      if (statusFilter === 'RESOLVED' && em.status !== 'Resolved') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          em.id.toLowerCase().includes(q) ||
          em.location.address.toLowerCase().includes(q) ||
          (em.location.sector && em.location.sector.toLowerCase().includes(q)) ||
          em.disasterType.toLowerCase().includes(q) ||
          (em.contactName && em.contactName.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.aiScore - a.aiScore;
      if (sortBy === 'people') return b.peopleAffected - a.peopleAffected;
      return 0;
    });

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>TRIAGE & DISPATCH REGISTRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Emergency Cases Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Total {emergencies.length} registered incidents • Showing {filtered.length} filtered records
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, sector, caller name, landmark..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Priority filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">🔴 Critical Only</option>
              <option value="HIGH">🟠 High Only</option>
              <option value="MODERATE">🟡 Moderate Only</option>
              <option value="LOW">🟢 Low Only</option>
            </select>
          </div>

          {/* Disaster Type filter */}
          <div>
            <select
              value={disasterFilter}
              onChange={(e) => setDisasterFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="ALL">All Disaster Types</option>
              <option value="Flood">Flood</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Fire">Fire</option>
              <option value="Building Collapse">Building Collapse</option>
              <option value="Landslide">Landslide</option>
              <option value="Cyclone">Cyclone</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="score">Sort: AI Severity Score</option>
              <option value="people">Sort: Casualties / People</option>
              <option value="time">Sort: Timestamp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Emergencies Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="text-[11px] font-semibold uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Emergency ID</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Disaster</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-center">Affected</th>
                <th className="py-3 px-3 text-center">Injured</th>
                <th className="py-3 px-3">AI Score</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Assigned Team</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((em) => (
                <tr key={em.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    <span className="text-blue-600">{em.id}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 font-mono">{em.timestamp}</td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">{em.disasterType}</td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-800">{em.location.sector}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{em.location.address}</div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800">
                    {em.peopleAffected}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-rose-600">
                    {em.injuredCount}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold">
                    <span className={em.aiScore >= 80 ? 'text-rose-600' : em.aiScore >= 60 ? 'text-orange-600' : 'text-amber-600'}>
                      {em.aiScore}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <PriorityBadge priority={em.priority} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 font-mono">
                    {em.assignedTeamId ? (
                      <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {em.assignedTeamId}
                      </span>
                    ) : (
                      <button
                        onClick={() => setAssigningTeamForId(em.id)}
                        className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold transition-colors"
                      >
                        + Assign
                      </button>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={em.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedCase(em)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        title="View Incident Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {em.status !== 'Resolved' && (
                        <button
                          onClick={() => updateEmergencyStatus(em.id, 'Resolved')}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                          title="Mark Resolved"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div className="text-base font-bold text-slate-800">
                        {priorityFilter === 'CRITICAL' ? 'No critical emergencies' : 'No emergencies found matching criteria'}
                      </div>
                      <p className="text-xs text-slate-500 max-w-sm">
                        All incidents under this filter have been triaged or resolved. Monitor real-time feeds for incoming SOS reports.
                      </p>
                      <button
                        onClick={() => { setPriorityFilter('ALL'); setSearchQuery(''); setDisasterFilter('ALL'); }}
                        className="mt-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        Reset Search Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Details Drawer / Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 text-slate-900 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-blue-600">
                  TACTICAL DOSSIER • {selectedCase.id}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedCase.disasterType} • {selectedCase.location.sector}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-medium">AI SCORE</span>
                <span className="text-base font-bold text-rose-600 font-mono">{selectedCase.aiScore}/100</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-medium">AFFECTED</span>
                <span className="text-base font-bold text-slate-900 font-mono">{selectedCase.peopleAffected}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-medium">INJURED</span>
                <span className="text-base font-bold text-amber-600 font-mono">{selectedCase.injuredCount}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-medium">MEDICAL</span>
                <span className="text-base font-bold text-rose-600">{selectedCase.medicalEmergency ? 'YES' : 'NO'}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-blue-700 text-[11px]">AI DIAGNOSTIC REASONING:</span>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                {selectedCase.aiReasoning.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700">
                    <span className="text-blue-600 font-bold">›</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-500 text-[11px]">CALLER NOTES:</span>
              <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 italic text-slate-700">
                "{selectedCase.additionalNotes}"
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                Caller: <strong className="text-slate-700">{selectedCase.contactName}</strong> ({selectedCase.contactPhone})
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/emergency-status?id=${selectedCase.id}`)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Track Live</span>
                </button>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Team Modal */}
      {assigningTeamForId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-slate-900 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-base text-slate-900">
                Assign Rescue Team ({assigningTeamForId})
              </h3>
              <button
                onClick={() => setAssigningTeamForId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {rescueTeams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => {
                    assignTeamToEmergency(assigningTeamForId, team.id);
                    setAssigningTeamForId(null);
                  }}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                      <span className="text-blue-600 font-mono">{team.id}</span>
                      <span>{team.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{team.vehicle}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    team.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {team.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
