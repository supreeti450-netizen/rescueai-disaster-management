import React, { useState } from 'react';
import { useRescue } from '../../context/RescueContext';
import { EmergencyCase, RescueTeam, Hospital, Shelter } from '../../types';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Radio, 
  Ambulance, 
  Building2, 
  Home, 
  CheckCircle,
  Eye,
  Navigation,
  Activity
} from 'lucide-react';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';

interface TacticalMapProps {
  heightClass?: string;
  onSelectEmergency?: (emergencyId: string) => void;
  onOpenDetails?: (emergencyId: string) => void;
  selectedEmergencyId?: string;
  focusTarget?: { lat: number; lng: number };
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  heightClass = 'h-[580px]',
  onSelectEmergency,
  onOpenDetails,
  selectedEmergencyId,
}) => {
  const { emergencies, rescueTeams, hospitals, shelters, updateEmergencyStatus, assignTeamToEmergency } = useRescue();

  // Layer filters
  const [showCritical, setShowCritical] = useState(true);
  const [showHigh, setShowHigh] = useState(true);
  const [showModerate, setShowModerate] = useState(true);
  const [showLow, setShowLow] = useState(true);
  const [showTeams, setShowTeams] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showHazardZones, setShowHazardZones] = useState(true);
  const [showSafeRoutes, setShowSafeRoutes] = useState(true);
  const [showLayerControls, setShowLayerControls] = useState(true);
  const [radarActive, setRadarActive] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);


  // Inspector card state
  const [inspectItem, setInspectItem] = useState<{
    type: 'emergency' | 'team' | 'hospital' | 'shelter';
    data: EmergencyCase | RescueTeam | Hospital | Shelter;
  } | null>(() => {
    if (selectedEmergencyId) {
      const em = emergencies.find((e) => e.id === selectedEmergencyId);
      if (em) return { type: 'emergency', data: em };
    }
    const defaultEm = emergencies.find((e) => e.id === 'RA-1024') || emergencies[0];
    return defaultEm ? { type: 'emergency', data: defaultEm } : null;
  });

  // Coordinate projection mapping for SVG canvas (bounded roughly within 28.50 - 28.60 lat, 77.33 - 77.44 lng)
  const mapWidth = 900;
  const mapHeight = 560;

  const minLat = 28.5000;
  const maxLat = 28.5900;
  const minLng = 77.3350;
  const maxLng = 77.4350;

  const project = (lat: number, lng: number) => {
    // Invert lat for SVG Y axis
    const x = ((lng - minLng) / (maxLng - minLng)) * (mapWidth - 100) + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (mapHeight - 100) + 50;
    return { x: Math.max(30, Math.min(mapWidth - 30, x)), y: Math.max(30, Math.min(mapHeight - 30, y)) };
  };

  return (
    <div className={`relative w-full ${heightClass} bg-[#F1F5F9] rounded-xl border border-slate-200 overflow-hidden select-none`}>
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Top Map Bar: Status, Layer Toggles, Mode */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Coordinates & System Info */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-3 text-xs text-slate-700 font-mono pointer-events-auto shadow-sm">
          <div className="flex items-center gap-1.5 text-blue-600 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>GEO-RADAR GRID [28.54°N, 77.38°E]</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">ACTIVE TARGETS: {emergencies.length + rescueTeams.length}</span>
        </div>

        {/* Quick Layer Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-1 text-xs pointer-events-auto shadow-sm">
          <button
            onClick={() => setShowCritical(!showCritical)}
            className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-semibold transition-colors ${
              showCritical ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Toggle Critical Victims"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Crit ({emergencies.filter((e) => e.priority === 'CRITICAL').length})</span>
          </button>
          <button
            onClick={() => setShowHigh(!showHigh)}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
              showHigh ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Toggle High Priority"
          >
            <span>High ({emergencies.filter((e) => e.priority === 'HIGH').length})</span>
          </button>
          <button
            onClick={() => setShowTeams(!showTeams)}
            className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-semibold transition-colors ${
              showTeams ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Toggle Rescue Teams"
          >
            <Ambulance className="w-3 h-3 text-blue-600" />
            <span>Teams ({rescueTeams.length})</span>
          </button>
          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-semibold transition-colors ${
              showHospitals ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Toggle Hospitals"
          >
            <Building2 className="w-3 h-3 text-emerald-600" />
            <span>Hospitals ({hospitals.length})</span>
          </button>
          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-semibold transition-colors ${
              showShelters ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Toggle Shelters"
          >
            <Home className="w-3 h-3 text-purple-600" />
            <span>Shelters ({shelters.length})</span>
          </button>
          <button
            onClick={() => setShowHazardZones(!showHazardZones)}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
              showHazardZones ? 'bg-slate-100 text-slate-800 border border-slate-300' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Flood Inundation Polygon"
          >
            Hazard Zones
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full cursor-crosshair transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Radar gradient */}
            <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>

            {/* Flood zone pattern */}
            <pattern id="floodWaterPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 10 Q 5 5 10 10 T 20 10" fill="none" stroke="#0284c7" strokeWidth="1.2" opacity="0.3" />
            </pattern>
          </defs>

          {/* Sector outlines and river corridors */}
          <g className="sectors" stroke="#cbd5e1" strokeWidth="1.2" fill="none">
            {/* River flow curve */}
            <path
              d="M 50 180 Q 250 240 500 210 T 850 320"
              stroke="#93c5fd"
              strokeWidth="28"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M 50 180 Q 250 240 500 210 T 850 320"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity="0.6"
            />

            {/* Sector boundary polygons */}
            <polygon points="120,80 340,70 320,220 110,200" stroke="#cbd5e1" fill="#ffffff" fillOpacity="0.85" />
            <polygon points="340,70 600,60 580,210 320,220" stroke="#cbd5e1" fill="#ffffff" fillOpacity="0.85" />
            <polygon points="600,60 820,90 800,260 580,210" stroke="#cbd5e1" fill="#ffffff" fillOpacity="0.85" />
            <polygon points="110,200 320,220 300,480 90,440" stroke="#cbd5e1" fill="#ffffff" fillOpacity="0.85" />
            <polygon points="320,220 580,210 560,490 300,480" stroke="#cbd5e1" fill="#ffffff" fillOpacity="0.85" />
            <polygon points="580,210 800,260 780,500 560,490" stroke="#cbd5e1" fill="#ffffff" fillOpacity="0.85" />

            {/* Sector label watermarks */}
            <text x="210" y="140" fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1">SECTOR 11 (URBAN CORE)</text>
            <text x="440" y="130" fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1">SECTOR 12 (CIVIL LINES)</text>
            <text x="680" y="150" fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1">SECTOR 62 (INSTITUTIONAL)</text>
            <text x="180" y="320" fill="#2563eb" fontSize="13" fontWeight="800" letterSpacing="1">SECTOR 14 (FLOOD ZONE A)</text>
            <text x="430" y="340" fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1">SECTOR 15 (RESIDENTIAL)</text>
            <text x="660" y="360" fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1">SECTOR 16 (RIVER BASIN)</text>
          </g>

          {/* Animated Flood Hazard Polygons */}
          {showHazardZones && (
            <g className="hazard-zones">
              {/* Sector 14 Deep Flash Inundation Zone */}
              <polygon
                points="160,260 380,240 420,380 240,410 150,340"
                fill="#0284c7"
                fillOpacity="0.22"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <text x="220" y="275" fill="#0369a1" fontSize="10" fontWeight="bold">
                ⚠ FLASH FLOOD WATER INUNDATION DEPTH: 1.8M - 2.4M
              </text>

              {/* Secondary waterlogged perimeter */}
              <polygon
                points="420,240 590,230 630,350 420,380"
                fill="#0369a1"
                fillOpacity="0.14"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </g>
          )}

          {/* Safe Route Lines (Bypass 4B to Sector 14) */}
          {showSafeRoutes && (
            <g className="safe-routes">
              {/* Team R-07 to RA-1024 safe route */}
              <path
                d="M 380 230 Q 320 250 280 310"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
              {/* Route line to Civil Hospital */}
              <path
                d="M 280 310 Q 380 260 480 210"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.8"
              />
              <text x="290" y="270" fill="#059669" fontSize="10" fontWeight="bold">
                ELEVATED BYPASS 4B (SAFE ROUTE)
              </text>
            </g>
          )}

          {/* Radar Sweep Effect */}
          {radarActive && (
            <g transform="translate(450, 280)">
              <circle r="260" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0.2" />
              <circle r="180" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0.2" />
              <circle r="100" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0.25" />
              <line x1="-260" y1="0" x2="260" y2="0" stroke="#06b6d4" strokeWidth="0.5" opacity="0.15" />
              <line x1="0" y1="-260" x2="0" y2="260" stroke="#06b6d4" strokeWidth="0.5" opacity="0.15" />
              <g className="radar-sweep">
                <path d="M 0 0 L 260 0 A 260 260 0 0 0 184 -184 Z" fill="url(#radarSweep)" />
              </g>
            </g>
          )}

          {/* Shelters Layer */}
          {showShelters &&
            shelters.map((s) => {
              const { x, y } = project(s.location.lat, s.location.lng);
              const isSelected = inspectItem?.type === 'shelter' && inspectItem.data.id === s.id;
              return (
                <g
                  key={s.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => setInspectItem({ type: 'shelter', data: s })}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isSelected ? 16 : 12}
                    fill="#581c87"
                    stroke="#a855f7"
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all"
                  />
                  <text x="0" y="4" textAnchor="middle" fill="#f3e8ff" fontSize="10" fontWeight="bold">
                    🏠
                  </text>
                  <text
                    x="0"
                    y="22"
                    textAnchor="middle"
                    fill="#7e22ce"
                    fontSize="9"
                    fontWeight="600"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {s.name.substring(0, 16)}
                  </text>
                </g>
              );
            })}

          {/* Hospitals Layer */}
          {showHospitals &&
            hospitals.map((h) => {
              const { x, y } = project(h.location.lat, h.location.lng);
              const isSelected = inspectItem?.type === 'hospital' && inspectItem.data.id === h.id;
              const isAccepting = h.status === 'Accepting';
              return (
                <g
                  key={h.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => setInspectItem({ type: 'hospital', data: h })}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isSelected ? 18 : 14}
                    fill={isAccepting ? '#064e3b' : '#7f1d1d'}
                    stroke={isAccepting ? '#10b981' : '#ef4444'}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all"
                  />
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                    🏥
                  </text>
                  <text
                    x="0"
                    y="24"
                    textAnchor="middle"
                    fill="#047857"
                    fontSize="9"
                    fontWeight="bold"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {h.name.substring(0, 15)}
                  </text>
                </g>
              );
            })}

          {/* Rescue Teams Layer */}
          {showTeams &&
            rescueTeams.map((team) => {
              const { x, y } = project(team.currentLocation.lat, team.currentLocation.lng);
              const isSelected = inspectItem?.type === 'team' && inspectItem.data.id === team.id;
              const isEnRoute = team.status === 'En Route';
              const isDemoTeam = team.id === 'R-07';

              return (
                <g
                  key={team.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => setInspectItem({ type: 'team', data: team })}
                  className="cursor-pointer group"
                >
                  {/* Moving / radar pulse ring for active teams */}
                  {isEnRoute && (
                    <circle
                      r="22"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      className="animate-spin"
                    />
                  )}

                  <rect
                    x="-14"
                    y="-14"
                    width="28"
                    height="28"
                    rx="6"
                    fill={isDemoTeam ? '#0369a1' : '#1e293b'}
                    stroke={isDemoTeam ? '#38bdf8' : '#64748b'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all"
                  />
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="12">
                    🚑
                  </text>
                  <text
                    x="0"
                    y="-18"
                    textAnchor="middle"
                    fill="#0284c7"
                    fontSize="9"
                    fontWeight="bold"
                    className="font-mono"
                  >
                    {team.id}
                  </text>
                </g>
              );
            })}

          {/* Emergencies / Victims Layer */}
          {emergencies.map((em) => {
            if (em.priority === 'CRITICAL' && !showCritical) return null;
            if (em.priority === 'HIGH' && !showHigh) return null;
            if (em.priority === 'MODERATE' && !showModerate) return null;
            if (em.priority === 'LOW' && !showLow) return null;

            const { x, y } = project(em.location.lat, em.location.lng);
            const isSelected =
              (inspectItem?.type === 'emergency' && inspectItem.data.id === em.id) ||
              selectedEmergencyId === em.id;

            const isCritical = em.priority === 'CRITICAL';
            const isHigh = em.priority === 'HIGH';
            const isMod = em.priority === 'MODERATE';

            const fillColor = isCritical ? '#ef4444' : isHigh ? '#f97316' : isMod ? '#eab308' : '#10b981';
            const strokeColor = isCritical ? '#fca5a5' : isHigh ? '#fed7aa' : isMod ? '#fef08a' : '#a7f3d0';

            return (
              <g
                key={em.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => {
                  setInspectItem({ type: 'emergency', data: em });
                  if (onSelectEmergency) onSelectEmergency(em.id);
                }}
                className="cursor-pointer group"
              >
                {/* Critical ping wave */}
                {isCritical && (
                  <>
                    <circle r="26" fill="#ef4444" fillOpacity="0.15" className="animate-ping" />
                    <circle r="36" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
                  </>
                )}

                <circle
                  r={isSelected ? 16 : isCritical ? 13 : 10}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="transition-all"
                />

                <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">
                  {em.peopleAffected}
                </text>

                {/* Pin callout banner on hover or selected */}
                <g className={isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'}>
                  <rect x="-35" y="-36" width="70" height="18" rx="4" fill="#0f172a" stroke={fillColor} strokeWidth="1.2" />
                  <text x="0" y="-24" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" className="font-mono">
                    {em.id} • {em.priority}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Map Controls: +, −, Recenter, Layers */}
      <div className="absolute right-3 bottom-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 2.0))}
          className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg shadow-sm font-mono font-bold text-sm"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
          className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg shadow-sm font-mono font-bold text-sm"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={() => { setZoomLevel(1); }}
          className="px-2 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg shadow-sm text-[10px] font-mono font-bold"
          title="Recenter Map View"
        >
          Recenter
        </button>
        <button
          onClick={() => setShowLayerControls(!showLayerControls)}
          className={`px-2 py-1.5 border rounded-lg shadow-sm text-[10px] font-mono font-bold flex items-center justify-center gap-1 ${
            showLayerControls ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
          }`}
          title="Toggle Map Layers"
        >
          <Layers className="w-3 h-3 text-blue-600" />
          <span>Layers</span>
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute left-3 bottom-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 text-[11px] text-slate-700 font-mono hidden sm:block shadow-md">
        <div className="font-bold text-slate-500 uppercase text-[10px] mb-1.5 flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-blue-600" />
          <span>MAP LEGEND</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span>Critical Victim</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <span>Moderate Case</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Low Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm leading-none">🚑</span>
            <span>Rescue Team</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm leading-none">🏥</span>
            <span>Hospital</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm leading-none">🏠</span>
            <span>Evacuation Shelter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-500 shrink-0" />
            <span>Safe Route</span>
          </div>
        </div>
      </div>

      {/* Selected Marker Compact Information Card */}
      {inspectItem && (
        <div className="absolute top-14 right-3 z-30 max-w-sm w-full bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl text-xs text-slate-800 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-blue-600">
                INCIDENT TELEMETRY PIN
              </div>
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2 mt-0.5">
                {inspectItem.type === 'emergency' && (
                  <>
                    <span>EMERGENCY #{(inspectItem.data as EmergencyCase).id}</span>
                  </>
                )}
                {inspectItem.type === 'team' && (
                  <>
                    <span>{(inspectItem.data as RescueTeam).id}</span>
                    <span className="text-xs font-semibold text-blue-600">{(inspectItem.data as RescueTeam).name}</span>
                  </>
                )}
                {inspectItem.type === 'hospital' && (
                  <span>{(inspectItem.data as Hospital).name}</span>
                )}
                {inspectItem.type === 'shelter' && (
                  <span>{(inspectItem.data as Shelter).name}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setInspectItem(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {/* If Emergency */}
            {inspectItem.type === 'emergency' && (() => {
              const em = inspectItem.data as EmergencyCase;
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <PriorityBadge priority={em.priority} size="sm" />
                    <span className="text-xs font-semibold text-slate-600">
                      AI Score: <strong className="text-rose-600 font-mono">{em.aiScore}</strong>
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="font-semibold text-slate-900">
                      {em.peopleAffected} people affected
                    </div>
                    <div className="text-amber-700 font-semibold">
                      {em.injuredCount} injured
                    </div>
                    <div className={em.medicalEmergency ? "text-rose-700 font-semibold" : "text-slate-600"}>
                      {em.medicalEmergency ? "Medical assistance required" : "Standard evacuation"}
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      Location: {em.location.address}
                    </div>
                  </div>

                  <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-blue-800 font-semibold">
                      <Ambulance className="w-3.5 h-3.5 text-blue-600" />
                      <span>Team {em.assignedTeamId || 'R-07'}</span>
                    </div>
                    <span className="text-emerald-700 font-bold font-mono">
                      ETA: {em.etaMinutes || 8} min
                    </span>
                  </div>

                  {/* [VIEW DETAILS] button opens right-side drawer */}
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        if (onOpenDetails) {
                          onOpenDetails(em.id);
                        } else if (onSelectEmergency) {
                          onSelectEmergency(em.id);
                        }
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW DETAILS</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* If Team */}
            {inspectItem.type === 'team' && (() => {
              const team = inspectItem.data as RescueTeam;
              return (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Callsign & Status:</span>
                    <span className="font-mono text-blue-700 font-bold">{team.callSign} • {team.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Unit Leader:</span>
                    <span className="font-medium text-slate-800">{team.leaderName} ({team.membersCount} Crew)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Vehicle / Craft:</span>
                    <span className="text-slate-700 text-right">{team.vehicle}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Assigned Mission:</span>
                    <span className="font-mono text-amber-700 font-bold">{team.assignedEmergencyId || 'Standby Reserve'}</span>
                  </div>
                  {team.etaMinutes !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">ETA to Destination:</span>
                      <span className="font-mono text-emerald-700 font-bold">{team.etaMinutes} mins ({team.distanceKm} km)</span>
                    </div>
                  )}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-blue-700 font-bold text-[11px] block mb-1">Equipment Deployed:</span>
                    <div className="flex flex-wrap gap-1">
                      {team.equipment.map((eq, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* If Hospital */}
            {inspectItem.type === 'hospital' && (() => {
              const hosp = inspectItem.data as Hospital;
              return (
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Status & Triage:</span>
                    <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${
                      hosp.status === 'Accepting' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {hosp.status} (Trauma Level {hosp.traumaCenterLevel})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="text-slate-500 text-[10px]">AVAILABLE BEDS</div>
                      <div className="text-emerald-700 text-sm font-bold">{hosp.availableBeds} / {hosp.totalBeds}</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="text-slate-500 text-[10px]">ICU VENTILATORS</div>
                      <div className="text-blue-700 text-sm font-bold">{hosp.availableIcu} / {hosp.totalIcu}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-slate-500">Ambulance Fleet:</span>
                    <span className="font-bold text-slate-900">{hosp.ambulances} Active Units</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-slate-500">Emergency Contact:</span>
                    <span className="font-mono text-blue-700 font-semibold">{hosp.contactPhone}</span>
                  </div>
                </div>
              );
            })()}

            {/* If Shelter */}
            {inspectItem.type === 'shelter' && (() => {
              const sh = inspectItem.data as Shelter;
              return (
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Occupancy:</span>
                    <span className="font-mono text-amber-700 font-bold">{sh.occupied} / {sh.capacity} People</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${Math.round((sh.occupied / sh.capacity) * 100)}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-500 text-[10px] block">FOOD RESERVES</span>
                      <span className="text-slate-900 font-bold">{sh.foodSuppliesDays} Days</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-500 text-[10px] block">CLEAN WATER</span>
                      <span className="text-blue-700 font-bold">{sh.waterSuppliesLiters.toLocaleString()} L</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-slate-500">Medical Station:</span>
                    <span className={sh.medicalStation ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                      {sh.medicalStation ? '✓ Active Field Clinic' : 'None'}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
