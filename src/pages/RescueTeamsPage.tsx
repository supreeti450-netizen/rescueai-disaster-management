import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import { RescueTeam, TeamStatus, EmergencyCase } from '../types';
import { getTeamRecommendations, getHospitalRecommendations } from '../services/operationsEngine';
import {
  Ambulance,
  MapPin,
  Users,
  Wrench,
  BatteryMedium,
  Radio,
  CheckCircle2,
  Navigation,
  Compass,
  Search,
  Cpu,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Eye,
  Crosshair,
  Building2,
  Check,
  X,
  Truck,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

interface RescueTeamsPageProps {
  navigate: (path: string) => void;
}

export const RescueTeamsPage: React.FC<RescueTeamsPageProps> = ({ navigate }) => {
  const {
    rescueTeams,
    emergencies,
    hospitals,
    assignRecommendedTeam,
    assignTeamToEmergency,
    availableTeamsCount,
    enRouteTeamsCount,
    activeRescuesCount,
    availableVehiclesCount,
    addToast
  } = useRescue();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmergencyId, setSelectedEmergencyId] = useState<string>('RA-1024');

  // Modals
  const [viewTeamModal, setViewTeamModal] = useState<RescueTeam | null>(null);
  const [assignmentConfirmation, setAssignmentConfirmation] = useState<{
    teamId: string;
    emergencyId: string;
    reason: string;
    distance: string;
    eta: string;
    risk: 'LOW' | 'MODERATE' | 'HIGH';
    match: string;
  } | null>(null);

  // Filtered teams
  const filteredTeams = rescueTeams.filter((t) => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchId = t.id.toLowerCase().includes(q);
      const matchCall = t.callSign.toLowerCase().includes(q);
      const matchLoc = t.currentLocation.address.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchCall && !matchLoc) return false;
    }
    return true;
  });

  const activeEmergency = emergencies.find((e) => e.id === selectedEmergencyId) || emergencies[0];
  const teamRecommendations = getTeamRecommendations(selectedEmergencyId, rescueTeams, activeEmergency);
  const hospitalRecommendations = getHospitalRecommendations(selectedEmergencyId, hospitals);

  const getStatusBadge = (status: TeamStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'En Route':
        return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      case 'Assigned':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'On Scene':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleOpenAssignModal = (teamId: string, emergencyId: string = selectedEmergencyId) => {
    const isR07 = teamId === 'R-07';
    setAssignmentConfirmation({
      teamId,
      emergencyId,
      reason: isR07
        ? 'Amphibious vessel suitable for swift flood currents, nearest distance with 8 min ETA, fully equipped with medical kit & life jackets.'
        : 'Assigned as tactical response unit based on proximity and operational availability.',
      distance: isR07 ? '2.4 km' : '3.8 km',
      eta: isR07 ? '8 mins' : '14 mins',
      risk: isR07 ? 'LOW' : 'MODERATE',
      match: isR07 ? '94%' : '88%'
    });
  };

  const handleConfirmAssignment = () => {
    if (!assignmentConfirmation) return;
    assignTeamToEmergency(assignmentConfirmation.emergencyId, assignmentConfirmation.teamId);
    addToast(
      'Team Dispatched',
      `${assignmentConfirmation.teamId} assigned to Emergency #${assignmentConfirmation.emergencyId}. ETA: ${assignmentConfirmation.eta}.`,
      'success'
    );
    setAssignmentConfirmation(null);
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6 min-h-[calc(100vh-4rem)]">
      {/* 1. RESCUE OPERATIONS CENTER HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <Ambulance className="w-3.5 h-3.5" />
            <span>TACTICAL DEPLOYMENT & DISPATCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Rescue Operations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Coordinate teams, equipment, and multi-agency emergency response operations.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <button
            onClick={() => navigate('/operations')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Activity className="w-4 h-4 text-white" />
            <span>OPERATIONS HUD (#OP-1024)</span>
          </button>

          <button
            onClick={() => navigate('/resources')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2 border border-slate-200 shadow-sm transition-colors"
          >
            <Truck className="w-4 h-4 text-blue-600" />
            <span>ALLOCATE DEPOT RESOURCES</span>
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Available Teams */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>AVAILABLE TEAMS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-700 mt-2 font-mono">
            {availableTeamsCount || 6}
          </div>
          <div className="text-xs text-emerald-600 mt-1">Ready for instant dispatch</div>
        </div>

        {/* Teams En Route */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>TEAMS EN ROUTE</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <div className="text-3xl font-bold text-amber-700 mt-2 font-mono">
            {enRouteTeamsCount || 5}
          </div>
          <div className="text-xs text-amber-600 mt-1">Navigating extraction corridors</div>
        </div>

        {/* Active Rescues */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>ACTIVE RESCUES</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <div className="text-3xl font-bold text-rose-700 mt-2 font-mono">
            {activeRescuesCount || 8}
          </div>
          <div className="text-xs text-rose-600 mt-1">On-scene casualty stabilization</div>
        </div>

        {/* Available Vehicles */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>AVAILABLE VEHICLES</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-700 mt-2 font-mono">
            {availableVehiclesCount || 11}
          </div>
          <div className="text-xs text-blue-600 mt-1">Boats, ALS rovers, UAV swarms</div>
        </div>
      </div>

      {/* AI TEAM RECOMMENDATION & HOSPITAL MATCHING */}
      <section className="bg-white border border-blue-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                🤖 RESCUEAI TEAM RECOMMENDATION
              </h2>
              <span className="text-xs text-slate-500">
                Multi-variable optimization: distance, equipment match, route risk, and capacity.
              </span>
            </div>
          </div>

          {/* Emergency Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Target Incident:</span>
            <select
              value={selectedEmergencyId}
              onChange={(e) => setSelectedEmergencyId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {emergencies.map((em) => (
                <option key={em.id} value={em.id}>
                  #{em.id} - {em.priority} ({em.disasterType} in {em.location.sector || 'Sector 14'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Incident Summary strip */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-700">
          <div>
            Emergency: <strong className="text-slate-900 font-mono">#{activeEmergency.id}</strong> ({activeEmergency.disasterType})
          </div>
          <div>
            Location: <strong className="text-blue-700">{activeEmergency.location.address}</strong>
          </div>
          <div>
            Victims: <strong className="text-amber-700">{activeEmergency.peopleAffected}</strong> ({activeEmergency.injuredCount} injured)
          </div>
          <div>
            AI Score: <strong className="text-rose-700 font-mono">{activeEmergency.aiScore}/100</strong> ({activeEmergency.priority})
          </div>
        </div>

        {/* 3 Ranked AI Team Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamRecommendations.map((rec, idx) => (
            <div
              key={rec.teamId}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                rec.isBestMatch
                  ? 'bg-blue-50/50 border-blue-300 shadow-sm ring-1 ring-blue-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    rec.isBestMatch
                      ? 'bg-blue-600 text-white shadow-sm'
                      : idx === 1
                      ? 'bg-slate-100 text-slate-700 border border-slate-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {rec.isBestMatch ? 'BEST MATCH' : idx === 1 ? 'SECOND BEST' : 'THIRD BEST'}
                  </span>

                  <span className="text-xs font-semibold text-slate-600">
                    Match: <strong className={rec.isBestMatch ? 'text-blue-700' : 'text-slate-900'}>{rec.matchScore}%</strong>
                  </span>
                </div>

                {/* Team Name */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-mono">{rec.teamId}</h3>
                  <div className="text-xs text-slate-500">{rec.name}</div>
                </div>

                {/* Key Spec highlights */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span>📍</span>
                    <span>{rec.distanceKm} km away</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🚤</span>
                    <span>Vehicle: <strong className="text-slate-800">{rec.vehicle}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>👥</span>
                    <span>Capacity: <strong className="text-slate-800">{rec.membersCount} members</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>Route Risk: <strong className={rec.routeRisk === 'LOW' ? 'text-emerald-700' : 'text-amber-700'}>{rec.routeRisk}</strong></span>
                  </div>
                </div>

                {/* Equipment Badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {rec.equipment.map((eq, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 border border-slate-200">
                      ✓ {eq}
                    </span>
                  ))}
                </div>

                {/* Recommendation Label */}
                {rec.isBestMatch && (
                  <div className="bg-blue-100/70 border border-blue-200 p-2 rounded-xl text-center text-[10px] font-bold text-blue-800 tracking-wider">
                    ★ RECOMMENDED BY RESCUEAI
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <button
                  onClick={() => handleOpenAssignModal(rec.teamId, selectedEmergencyId)}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
                    rec.isBestMatch
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{rec.isBestMatch ? 'ASSIGN RECOMMENDED TEAM' : `ASSIGN ${rec.teamId}`}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* AI HOSPITAL RECOMMENDATION STRIP */}
        {activeEmergency.injuredCount > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>AI HOSPITAL RECOMMENDATION (INJURED CASUALTIES: {activeEmergency.injuredCount})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitalRecommendations.slice(0, 2).map((hosp) => (
                <div
                  key={hosp.hospitalId}
                  className={`p-3.5 rounded-2xl border text-xs flex items-start justify-between gap-3 ${
                    hosp.isRecommended
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{hosp.name}</span>
                      {hosp.isRecommended && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      Distance: <strong className="text-slate-800">{hosp.distanceKm} km</strong> • Available beds: <strong className="text-emerald-700">{hosp.availableBeds}</strong> • ICU: <strong className="text-blue-700">{hosp.availableIcu}</strong> • Ambulances: <strong className="text-slate-800">{hosp.ambulances}</strong>
                    </div>
                    <div className="text-slate-500 text-[10px] pt-1">
                      Status: <strong className="text-emerald-700">🟢 {hosp.status.toUpperCase()}</strong>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-emerald-700 font-mono block">
                      {hosp.matchScore}%
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">Match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* RESCUE TEAM CARDS GRID */}
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team ID, name, sector or vehicle..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Status filter buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {['ALL', 'Available', 'Assigned', 'En Route', 'On Scene'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.map((team) => {
            const isAssigned = team.status === 'Assigned';
            const isEnRoute = team.status === 'En Route';
            const isAvailable = team.status === 'Available';

            return (
              <div
                key={team.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between bg-white ${
                  team.id === 'R-07'
                    ? 'border-blue-300 ring-1 ring-blue-300 shadow-sm'
                    : 'border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Team ID & Status Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">
                        TACTICAL CALLSIGN • {team.callSign}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mt-0.5 font-mono">
                        TEAM {team.id}
                      </h3>
                      <div className="text-xs text-slate-500">{team.name}</div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase border flex items-center gap-1.5 ${getStatusBadge(team.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isAvailable ? 'bg-emerald-500' : isAssigned ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'
                      }`} />
                      <span>{team.status.toUpperCase()}</span>
                    </span>
                  </div>

                  {/* Core Telemetry Specs */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Location:</span>
                      <strong className="text-slate-800">{team.currentLocation.address}</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Assigned:</span>
                      <strong className={team.assignedEmergencyId ? 'text-rose-600 font-mono' : 'text-slate-400'}>
                        {team.assignedEmergencyId ? `#${team.assignedEmergencyId}` : 'Unassigned'}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Distance:</span>
                      <strong className="text-blue-700 font-mono">{team.distanceKm || 2.4} km</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">ETA:</span>
                      <strong className="text-emerald-700 font-mono">{team.etaMinutes || 8} min</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Members:</span>
                      <strong className="text-slate-800">{team.membersCount}</strong>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Vehicle:</span>
                      <strong className="text-blue-700">{team.vehicle}</strong>
                    </div>
                  </div>

                  {/* Equipment Badges */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Equipment:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {team.equipment.map((eq, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px]">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3 Buttons: [VIEW], [TRACK], [ASSIGN] */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 mt-4 text-xs">
                  <button
                    onClick={() => setViewTeamModal(team)}
                    className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>VIEW</span>
                  </button>

                  <button
                    onClick={() => navigate('/map')}
                    className="py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold flex items-center justify-center gap-1 border border-blue-200 transition-colors"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>TRACK</span>
                  </button>

                  <button
                    onClick={() => handleOpenAssignModal(team.id, selectedEmergencyId)}
                    className="py-2 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>ASSIGN</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTeams.length === 0 && (
            <div className="col-span-full py-16 bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Ambulance className="w-6 h-6" />
              </div>
              <div className="text-base font-bold text-slate-800">
                No rescue teams available
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All deployed rescue units under this status filter are currently committed to active operations.
              </p>
              <button
                onClick={() => { setFilterStatus('ALL'); setSearchQuery(''); }}
                className="mt-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                Clear Team Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ASSIGNMENT OPTIMIZATION CONFIRMATION MODAL */}
      {assignmentConfirmation && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 space-y-5 text-xs text-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    ASSIGN {assignmentConfirmation.teamId} TO #{assignmentConfirmation.emergencyId}?
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    RescueAI Assignment Optimization Directive
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAssignmentConfirmation(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Reason Box */}
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
              <strong className="block text-blue-800 mb-1 uppercase text-[10px]">Reason:</strong>
              <p className="italic">
                "{assignmentConfirmation.reason}"
              </p>
            </div>

            {/* Spec Metrics */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Distance:</span>
                <strong className="text-slate-900 font-mono">{assignmentConfirmation.distance}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">ETA:</span>
                <strong className="text-emerald-700 font-mono">{assignmentConfirmation.eta}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Risk:</span>
                <strong className={assignmentConfirmation.risk === 'LOW' ? 'text-emerald-700' : 'text-amber-700'}>
                  {assignmentConfirmation.risk}
                </strong>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-500">Equipment match:</span>
                <strong className="text-blue-700 font-bold font-mono">{assignmentConfirmation.match}</strong>
              </div>
            </div>

            {/* Confirmation Buttons: CANCEL / CONFIRM ASSIGNMENT */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAssignmentConfirmation(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs uppercase tracking-wider transition-colors"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleConfirmAssignment}
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>CONFIRM ASSIGNMENT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEAM DETAIL / TELEMETRY MODAL (VIEW) */}
      {viewTeamModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 space-y-4 text-xs text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] text-blue-600 uppercase font-bold">TACTICAL PROFILE</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {viewTeamModal.name} ({viewTeamModal.id})
                </h3>
              </div>
              <button onClick={() => setViewTeamModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-slate-700">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div>Leader: <strong className="text-slate-900">{viewTeamModal.leaderName}</strong></div>
                <div>Callsign: <strong className="text-blue-700 font-mono">{viewTeamModal.callSign}</strong></div>
                <div>Specialization: <strong className="text-slate-900">{viewTeamModal.specialization}</strong></div>
                <div>Battery / Fuel: <strong className="text-emerald-700 font-mono">{viewTeamModal.batteryOrFuelPercent}%</strong></div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Equipment & Lifelines:</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewTeamModal.equipment.map((eq, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white text-slate-800 border border-slate-200 text-[11px]">
                      ✓ {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewTeamModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
