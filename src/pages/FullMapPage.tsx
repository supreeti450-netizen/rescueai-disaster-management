import React, { useState, useMemo, useRef } from 'react';
import { useRescue } from '../context/RescueContext';
import { 
  EmergencyCase, 
  RescueTeam, 
  Hospital, 
  Shelter, 
  HazardZone, 
  BlockedRoad 
} from '../types';
import { analyzeRescueRoutes, RouteAnalysisResult } from '../services/routeEngine';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Radio, 
  Ambulance, 
  Building2, 
  Home, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Navigation, 
  Activity, 
  Search, 
  X, 
  Filter, 
  Crosshair, 
  ShieldAlert, 
  Cpu, 
  Zap, 
  Play, 
  Pause, 
  ChevronRight,
  Waves,
  Maximize2
} from 'lucide-react';

interface FullMapPageProps {
  navigate?: (path: string) => void;
}

export const FullMapPage: React.FC<FullMapPageProps> = ({ navigate }) => {
  const { 
    emergencies, 
    rescueTeams, 
    hospitals, 
    shelters, 
    hazardZones, 
    blockedRoads, 
    activeEmergenciesTotal,
    criticalCasesTotal,
    activeTeamsTotal,
    addToast,
    triggerFloodDemo
  } = useRescue();

  // ==========================================
  // 2. LAYER CONTROLS (7 layers)
  // ==========================================
  const [layerEmergencies, setLayerEmergencies] = useState(true);
  const [layerTeams, setLayerTeams] = useState(true);
  const [layerHospitals, setLayerHospitals] = useState(true);
  const [layerShelters, setLayerShelters] = useState(true);
  const [layerHazards, setLayerHazards] = useState(true);
  const [layerSafeRoutes, setLayerSafeRoutes] = useState(true);
  const [layerBlockedRoads, setLayerBlockedRoads] = useState(true);

  // Layer popup panel toggle
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  // ==========================================
  // 13. MAP FILTERS
  // ==========================================
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterDisaster, setFilterDisaster] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // ==========================================
  // 14. MAP SEARCH
  // ==========================================
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  // ==========================================
  // MAP CANVAS INTERACTION (Zoom & Pan)
  // ==========================================
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // ==========================================
  // POPUP & INSPECTION STATE
  // ==========================================
  type PopupEntity = 
    | { type: 'emergency'; data: EmergencyCase }
    | { type: 'team'; data: RescueTeam }
    | { type: 'hospital'; data: Hospital }
    | { type: 'shelter'; data: Shelter }
    | { type: 'hazard'; data: HazardZone }
    | { type: 'blockedRoad'; data: BlockedRoad };

  const [activePopup, setActivePopup] = useState<PopupEntity | null>(() => {
    const defaultEm = emergencies.find((e) => e.id === 'RA-1024') || emergencies[0];
    return defaultEm ? { type: 'emergency', data: defaultEm } : null;
  });

  // ==========================================
  // 9, 10, 11. AI SAFE ROUTE SYSTEM
  // ==========================================
  const [showRouteAnalysisModal, setShowRouteAnalysisModal] = useState(false);
  const [activeRouteOption, setActiveRouteOption] = useState<'safest' | 'fastest'>('safest');
  const [routeAnalysis, setRouteAnalysis] = useState<RouteAnalysisResult>(() => 
    analyzeRescueRoutes('RA-1024', 'R-07', 'H-01')
  );
  const [navigationActive, setNavigationActive] = useState(false);
  const [navigationStep, setNavigationStep] = useState(1);

  // Map canvas coordinate system (1000 x 650)
  const mapWidth = 1000;
  const mapHeight = 650;

  // Fixed Anchor Coordinates for key operational nodes
  const fixedPositions: Record<string, { x: number; y: number }> = {
    // Emergencies
    'RA-1024': { x: 370, y: 340 }, // Sector 14 Plot 42
    'RA-1027': { x: 230, y: 140 }, // Sector 11 Market Complex
    'RA-1031': { x: 640, y: 120 }, // Sector 18 Metro Heights
    'RA-1035': { x: 840, y: 370 }, // Sector 16 River View Colony
    'RA-1021': { x: 210, y: 175 }, // Sector 11 North
    'RA-1019': { x: 440, y: 440 }, // Sector 15 Crossroad
    'RA-1008': { x: 500, y: 490 }, // Sector 8 Market
    // Teams
    'R-07': { x: 190, y: 260 }, // Bypass 4B Junction
    'R-01': { x: 520, y: 150 }, // Central Staging
    'R-02': { x: 420, y: 430 }, // Sector 15 Crossroad
    'R-03': { x: 220, y: 160 }, // Sector 11 Market
    'R-04': { x: 280, y: 230 }, // West Bypass
    'R-05': { x: 620, y: 110 }, // Sector 18
    'R-06': { x: 740, y: 450 }, // Ridge East
    // Hospitals
    'H-01': { x: 730, y: 220 }, // Civil Hospital & Trauma Emergency
    'H-02': { x: 580, y: 160 }, // Apex Institute
    'H-03': { x: 800, y: 140 }, // Metro Emergency Hospital
    'H-04': { x: 480, y: 530 }, // Red Cross Field Hospital
    'H-05': { x: 860, y: 210 }, // St. Jude Memorial
    // Shelters
    'S-01': { x: 310, y: 120 }, // Sector 9 Community Center
    'S-02': { x: 540, y: 90 },  // Indira Stadium Camp
    'S-03': { x: 760, y: 470 }, // Model High School
    'S-04': { x: 160, y: 400 }, // Shelter A-04 (Sector 13 Arena)
    'S-05': { x: 880, y: 430 }, // East River Community Hall
    // Hazards
    'HZ-01': { x: 370, y: 340 }, // Sector 14 Flood
    'HZ-02': { x: 280, y: 305 }, // Submerged Underpass 14
    'HZ-03': { x: 240, y: 140 }, // Sector 11 Collapse
    'HZ-04': { x: 820, y: 380 }, // Transformer Fire
    'HZ-05': { x: 770, y: 480 }, // Mudslide
    // Blocked Roads
    'BR-01': { x: 280, y: 305 }, // Underpass 14
    'BR-02': { x: 800, y: 400 }, // Riverbank Arterial
    'BR-03': { x: 235, y: 155 }, // Sector 11 Service Lane
  };

  // Projection fallback
  const getCoordinates = (id: string, lat?: number, lng?: number) => {
    if (fixedPositions[id]) return fixedPositions[id];
    if (lat && lng) {
      const minLat = 28.5100;
      const maxLat = 28.5850;
      const minLng = 77.3400;
      const maxLng = 77.4350;
      const x = ((lng - minLng) / (maxLng - minLng)) * 800 + 100;
      const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 80;
      return { x: Math.max(50, Math.min(950, x)), y: Math.max(50, Math.min(600, y)) };
    }
    return { x: 500, y: 300 };
  };

  // Filtered emergencies
  const filteredEmergencies = useMemo(() => {
    return emergencies.filter((em) => {
      if (filterPriority !== 'ALL' && em.priority !== filterPriority) return false;
      if (filterDisaster !== 'ALL' && em.disasterType !== filterDisaster) return false;
      if (filterStatus === 'Unassigned' && em.assignedTeamId) return false;
      if (filterStatus === 'Assigned' && em.status !== 'Assigned') return false;
      if (filterStatus === 'En Route' && em.status !== 'En Route') return false;
      if (filterStatus === 'Rescue in Progress' && em.status !== 'In Progress') return false;
      if (filterStatus === 'Resolved' && em.status !== 'Resolved') return false;
      return true;
    });
  }, [emergencies, filterPriority, filterDisaster, filterStatus]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { label: string; sub: string; type: PopupEntity['type']; entity: any }[] = [];

    // Emergencies
    emergencies.forEach((em) => {
      if (
        em.id.toLowerCase().includes(q) ||
        em.location.address.toLowerCase().includes(q) ||
        (em.location.sector && em.location.sector.toLowerCase().includes(q))
      ) {
        results.push({
          label: `Emergency #${em.id}`,
          sub: `${em.priority} • ${em.disasterType} • ${em.location.sector}`,
          type: 'emergency',
          entity: em,
        });
      }
    });

    // Teams
    rescueTeams.forEach((t) => {
      if (t.id.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.callSign.toLowerCase().includes(q)) {
        results.push({
          label: t.name,
          sub: `Callsign: ${t.callSign} • ${t.status}`,
          type: 'team',
          entity: t,
        });
      }
    });

    // Hospitals
    hospitals.forEach((h) => {
      if (h.name.toLowerCase().includes(q) || h.location.address.toLowerCase().includes(q)) {
        results.push({
          label: h.name,
          sub: `Beds: ${h.availableBeds}/${h.totalBeds} • ${h.status}`,
          type: 'hospital',
          entity: h,
        });
      }
    });

    // Shelters
    shelters.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.location.address.toLowerCase().includes(q)) {
        results.push({
          label: s.name,
          sub: `Available: ${s.availableCapacity}/${s.capacity} • ${s.status}`,
          type: 'shelter',
          entity: s,
        });
      }
    });

    return results.slice(0, 6);
  }, [searchQuery, emergencies, rescueTeams, hospitals, shelters]);

  // Handle Finding Safest Rescue Route
  const handleTriggerRouteAnalysis = (emergencyId: string = 'RA-1024') => {
    const analysis = analyzeRescueRoutes(emergencyId, 'R-07', 'H-01');
    setRouteAnalysis(analysis);
    setActiveRouteOption('safest');
    setShowRouteAnalysisModal(true);
    setLayerSafeRoutes(true);
    addToast('AI Safe Route Computed', 'Analyzed hydrological hazards and blocked roads.', 'info');
  };

  // Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 flex flex-col min-h-[calc(100vh-4rem)] relative select-none overflow-hidden">
      {/* ====================================================
          15. MAP HEADER
          ==================================================== */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 z-30 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>LIVE DISASTER MAP</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold uppercase tracking-wider">
              Active Disaster: Flood Response
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            Real-time operational view of emergencies, rescue teams, hospitals, shelters and hazardous zones.
          </p>
        </div>

        {/* Header Telemetry Pills */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 flex items-center gap-2">
            <span className="text-slate-400">Updated:</span>
            <span className="text-emerald-700 font-bold">Just now</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 flex items-center gap-2">
            <span className="text-slate-400">Active emergencies:</span>
            <span className="text-blue-700 font-bold">{activeEmergenciesTotal}</span>
          </div>

          <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-rose-700 flex items-center gap-2">
            <span className="text-rose-500">Critical:</span>
            <span className="text-rose-700 font-bold">{criticalCasesTotal}</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 hidden md:flex items-center gap-2">
            <span className="text-slate-400">Rescue teams:</span>
            <span className="text-emerald-700 font-bold">{activeTeamsTotal} active</span>
          </div>

          {/* Quick Demo Trigger Button */}
          <button
            onClick={() => {
              triggerFloodDemo();
              handleTriggerRouteAnalysis('RA-1024');
              setActivePopup({
                type: 'emergency',
                data: emergencies.find((e) => e.id === 'RA-1024') || emergencies[0],
              });
            }}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Demonstrate Sector 14 Flood Scenario with AI Route"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-yellow-300 animate-bounce" />
            <span className="hidden lg:inline">⚡ Demo Scenario</span>
          </button>
        </div>
      </div>

      {/* ====================================================
          SUB-BAR: SEARCH, FILTERS & LAYER TOGGLE
          ==================================================== */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 z-20 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: 14. Search Field */}
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchResultsOpen(true);
            }}
            onFocus={() => setSearchResultsOpen(true)}
            placeholder="Search emergency, team, hospital or location..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResultsOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {searchResultsOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 space-y-1">
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setActivePopup({ type: res.type, data: res.entity });
                    setSearchResultsOpen(false);
                    // Center and zoom towards entity
                    const coords = getCoordinates(res.entity.id, res.entity.location?.lat, res.entity.location?.lng);
                    setPanOffset({ x: 500 - coords.x, y: 325 - coords.y });
                    setZoomLevel(1.2);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{res.label}</div>
                    <div className="text-[10px] text-slate-500">{res.sub}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Middle: 13. Map Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority filter */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer"
            >
              <option value="ALL">All</option>
              <option value="CRITICAL">🔴 Critical</option>
              <option value="HIGH">🟠 High</option>
              <option value="MODERATE">🟡 Moderate</option>
              <option value="LOW">🟢 Low</option>
            </select>
          </div>

          {/* Disaster filter */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Disaster:</span>
            <select
              value={filterDisaster}
              onChange={(e) => setFilterDisaster(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer"
            >
              <option value="ALL">All</option>
              <option value="Flood">Flood</option>
              <option value="Building Collapse">Collapse</option>
              <option value="Fire">Fire</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Landslide">Landslide</option>
              <option value="Cyclone">Cyclone</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer"
            >
              <option value="ALL">All</option>
              <option value="Unassigned">Unassigned</option>
              <option value="Assigned">Assigned</option>
              <option value="En Route">En Route</option>
              <option value="Rescue in Progress">Rescue in Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Right: Layers Toggle Button & Navigation status */}
        <div className="flex items-center gap-2">
          {navigationActive && (
            <div className="px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center gap-1.5 animate-pulse text-xs font-semibold">
              <Navigation className="w-3.5 h-3.5" />
              <span>NAVIGATION ACTIVE: 5.2 km</span>
            </div>
          )}

          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors font-semibold text-xs shadow-sm ${
              showLayerPanel
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Map Layers</span>
          </button>
        </div>
      </div>

      {/* ====================================================
          2. MAP LAYERS FLOATING CONTROL PANEL
          ==================================================== */}
      {showLayerPanel && (
        <div className="absolute top-28 right-4 z-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl w-64 space-y-2.5 text-xs text-slate-800 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Map Layer Visibility</span>
            <button onClick={() => setShowLayerPanel(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={layerEmergencies}
              onChange={(e) => setLayerEmergencies(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4"
            />
            <span>Emergency Reports ({filteredEmergencies.length})</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={layerTeams}
              onChange={(e) => setLayerTeams(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4"
            />
            <span>Rescue Teams ({rescueTeams.length})</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={layerHospitals}
              onChange={(e) => setLayerHospitals(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4"
            />
            <span>Hospitals ({hospitals.length})</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={layerShelters}
              onChange={(e) => setLayerShelters(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4"
            />
            <span>Shelters ({shelters.length})</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={layerHazards}
              onChange={(e) => setLayerHazards(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4"
            />
            <span>Hazard Zones ({hazardZones.length})</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={layerSafeRoutes}
              onChange={(e) => setLayerSafeRoutes(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4"
            />
            <span>Safe Routes (AI Analyzed)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={layerBlockedRoads}
              onChange={(e) => setLayerBlockedRoads(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4"
            />
            <span>Blocked Roads ({blockedRoads.length})</span>
          </label>
        </div>
      )}

      {/* ====================================================
          17. MAP CONTROLS (ZOOM, RECENTER, FOCUS SHORTCUTS)
          ==================================================== */}
      <div className="absolute top-28 left-4 z-30 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-1 flex flex-col gap-1 shadow-lg">
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.2, z + 0.2))}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title="Recenter Map"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Focus Shortcuts */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-1.5 flex flex-col gap-1 text-[10px] shadow-lg">
          <span className="text-slate-400 px-1 text-[9px] uppercase font-semibold">Focus Node:</span>
          <button
            onClick={() => {
              const pos = fixedPositions['RA-1024'];
              setPanOffset({ x: 500 - pos.x, y: 325 - pos.y });
              setZoomLevel(1.3);
              setActivePopup({
                type: 'emergency',
                data: emergencies.find((e) => e.id === 'RA-1024') || emergencies[0],
              });
            }}
            className="px-2 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-left font-bold transition-colors"
          >
            #RA-1024
          </button>

          <button
            onClick={() => {
              const pos = fixedPositions['R-07'];
              setPanOffset({ x: 500 - pos.x, y: 325 - pos.y });
              setZoomLevel(1.3);
              setActivePopup({
                type: 'team',
                data: rescueTeams.find((t) => t.id === 'R-07') || rescueTeams[0],
              });
            }}
            className="px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-left font-bold transition-colors"
          >
            Team R-07
          </button>

          <button
            onClick={() => {
              const pos = fixedPositions['H-01'];
              setPanOffset({ x: 500 - pos.x, y: 325 - pos.y });
              setZoomLevel(1.3);
              setActivePopup({
                type: 'hospital',
                data: hospitals.find((h) => h.id === 'H-01') || hospitals[0],
              });
            }}
            className="px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-left font-bold transition-colors"
          >
            Civil Hospital
          </button>
        </div>
      </div>

      {/* ====================================================
          16. MAP FLOATING LEGEND
          ==================================================== */}
      <div className="absolute bottom-4 left-4 z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3.5 shadow-xl text-[11px] space-y-2 hidden sm:block max-w-[210px] text-slate-800">
        <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-100">
          OPERATIONAL MAP LEGEND
        </div>

        {/* Emergencies */}
        <div className="space-y-1">
          <div className="text-[9px] text-slate-400 uppercase font-bold">EMERGENCIES</div>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-700">
            <span className="flex items-center gap-1.5"><span className="text-red-500">🔴</span> Critical</span>
            <span className="flex items-center gap-1.5"><span className="text-orange-500">🟠</span> High</span>
            <span className="flex items-center gap-1.5"><span className="text-amber-500">🟡</span> Moderate</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-500">🟢</span> Low</span>
          </div>
        </div>

        {/* Operations */}
        <div className="space-y-1 pt-1 border-t border-slate-100">
          <div className="text-[9px] text-slate-400 uppercase font-bold">OPERATIONS</div>
          <div className="grid grid-cols-1 gap-0.5 text-[10px] text-slate-700">
            <span className="flex items-center gap-1.5">🚑 Rescue Team</span>
            <span className="flex items-center gap-1.5">🏥 Hospital Reception</span>
            <span className="flex items-center gap-1.5">🏠 Evac Shelter</span>
          </div>
        </div>

        {/* Risks & Routes */}
        <div className="space-y-1 pt-1 border-t border-slate-100">
          <div className="text-[9px] text-slate-400 uppercase font-bold">RISKS & ROUTES</div>
          <div className="space-y-0.5 text-[10px] text-slate-700">
            <span className="flex items-center gap-1.5">⚠️ Hazard Inundation</span>
            <span className="flex items-center gap-1.5">🚧 Blocked Road</span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">── Safest Route (Low)</span>
            <span className="flex items-center gap-1.5 text-rose-600 font-bold">- - High Risk Route</span>
          </div>
        </div>
      </div>

      {/* ====================================================
          MAIN INTERACTIVE SVG MAP CANVAS
          ==================================================== */}
      <div
        className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full object-cover transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Tactical Grid Pattern */}
            <pattern id="gisGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1" fill="#cbd5e1" opacity="0.6" />
            </pattern>

            {/* Glowing route filters */}
            <filter id="safeRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" />
            </filter>

            <filter id="hazardRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ef4444" />
            </filter>

            {/* Gradients */}
            <linearGradient id="safeRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <linearGradient id="fastRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Background Map Canvas */}
          <rect width={mapWidth} height={mapHeight} fill="#F1F5F9" />
          <rect width={mapWidth} height={mapHeight} fill="url(#gisGrid)" />

          {/* Sector Boundaries & Background Labels */}
          <g className="sectors" stroke="#cbd5e1" strokeWidth="1.2" fill="none">
            {/* Sector Polygons */}
            <polygon points="50,40 340,30 320,200 60,180" fill="#ffffff" fillOpacity="0.8" />
            <polygon points="340,30 680,30 650,200 320,200" fill="#ffffff" fillOpacity="0.8" />
            <polygon points="680,30 960,60 920,240 650,200" fill="#ffffff" fillOpacity="0.8" />
            <polygon points="60,180 320,200 300,450 50,420" fill="#ffffff" fillOpacity="0.8" />
            <polygon points="320,200 650,200 620,470 300,450" fill="#ffffff" fillOpacity="0.8" />
            <polygon points="650,200 920,240 900,490 620,470" fill="#ffffff" fillOpacity="0.8" />

            {/* Geographic Sector Watermarks */}
            <text x="180" y="100" fill="#64748b" fontSize="12" fontFamily="sans-serif" fontWeight="bold">SECTOR 11 (URBAN CORE)</text>
            <text x="480" y="90" fill="#64748b" fontSize="12" fontFamily="sans-serif" fontWeight="bold">SECTOR 12 (CIVIL LINES)</text>
            <text x="780" y="110" fill="#64748b" fontSize="12" fontFamily="sans-serif" fontWeight="bold">SECTOR 18 (METRO HUB)</text>
            <text x="140" y="320" fill="#64748b" fontSize="12" fontFamily="sans-serif" fontWeight="bold">SECTOR 13 (ELEVATED RIDGE)</text>
            <text x="420" y="380" fill="#0284c7" fontSize="13" fontFamily="sans-serif" fontWeight="bold">SECTOR 14 (ACTIVE FLOOD BASIN)</text>
            <text x="740" y="370" fill="#64748b" fontSize="12" fontFamily="sans-serif" fontWeight="bold">SECTOR 16 (RIVER BASIN)</text>
          </g>

          {/* Sabarmati River Corridor & Inundation Flow */}
          <g className="river-floodplain">
            <path
              d="M 20, 230 Q 250, 320 500, 280 T 980, 420"
              fill="none"
              stroke="#bfdbfe"
              strokeWidth="42"
              strokeLinecap="round"
              opacity="0.65"
            />
            <path
              d="M 20, 230 Q 250, 320 500, 280 T 980, 420"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="20"
              strokeLinecap="round"
              opacity="0.45"
            />
            <path
              d="M 20, 230 Q 250, 320 500, 280 T 980, 420"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              opacity="0.85"
            />
          </g>

          {/* Road Network Arterials */}
          <g className="road-network" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="6 6" fill="none">
            {/* Horizontal Ring Arterials */}
            <path d="M 60, 160 L 940, 160" />
            <path d="M 50, 280 L 950, 280" />
            <path d="M 50, 420 L 950, 420" />
            {/* Vertical Arterials */}
            <path d="M 230, 40 L 230, 600" />
            <path d="M 480, 40 L 480, 600" />
            <path d="M 730, 40 L 730, 600" />
          </g>

          {/* ====================================================
              7. HAZARD ZONES (Translucent Overlays)
              ==================================================== */}
          {layerHazards && (
            <g className="hazard-layer">
              {/* Sector 14 Deep Flash Flood Inundation Polygon */}
              <polygon
                points="240,270 470,260 520,410 310,430 220,360"
                fill="#0284c7"
                fillOpacity="0.22"
                stroke="#0284c7"
                strokeWidth="2"
                strokeDasharray="5 4"
                className="cursor-pointer hover:fill-opacity-35 transition-all"
                onClick={() => setActivePopup({ type: 'hazard', data: hazardZones[0] })}
              />
              <text x="360" y="290" fill="#0369a1" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                ⚠ HIGH FLOOD RISK (SECTOR 14) • DEPTH 1.8M - 2.4M
              </text>

              {/* Submerged Underpass 14 Hazard Circle */}
              <circle
                cx="280"
                cy="305"
                r="38"
                fill="#fee2e2"
                fillOpacity="0.6"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="4 3"
                className="cursor-pointer hover:fill-opacity-70 transition-all animate-pulse"
                onClick={() => setActivePopup({ type: 'hazard', data: hazardZones[1] })}
              />
              <text x="280" y="309" fill="#b91c1c" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                ⚠ SUBMERGED UNDERPASS 14
              </text>

              {/* Collapsed Building Hazard in Sector 11 */}
              <circle
                cx="240"
                cy="140"
                r="30"
                fill="#ffedd5"
                fillOpacity="0.6"
                stroke="#f97316"
                strokeWidth="1.5"
                className="cursor-pointer"
                onClick={() => setActivePopup({ type: 'hazard', data: hazardZones[2] })}
              />
              <text x="240" y="144" fill="#c2410c" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                ⚠️ COLLAPSE
              </text>

              {/* Transformer Fire Hazard in Sector 16 */}
              <circle
                cx="820"
                cy="380"
                r="32"
                fill="#fee2e2"
                fillOpacity="0.6"
                stroke="#ef4444"
                strokeWidth="1.5"
                className="cursor-pointer"
                onClick={() => setActivePopup({ type: 'hazard', data: hazardZones[3] })}
              />
              <text x="820" y="384" fill="#b91c1c" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                🔥 FIRE HAZARD
              </text>
            </g>
          )}

          {/* ====================================================
              8. BLOCKED ROADS
              ==================================================== */}
          {layerBlockedRoads && (
            <g className="blocked-roads-layer">
              {blockedRoads.map((br) => {
                const pos = fixedPositions[br.id] || { x: 280, y: 305 };
                return (
                  <g
                    key={br.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer group"
                    onClick={() => setActivePopup({ type: 'blockedRoad', data: br })}
                  >
                    {/* Road Barrier Cross Indicator */}
                    <line x1="-18" y1="-18" x2="18" y2="18" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                    <line x1="-18" y1="18" x2="18" y2="-18" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="14" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
                    <text x="0" y="4" textAnchor="middle" fontSize="11">🚧</text>
                    <text
                      x="0"
                      y="-22"
                      textAnchor="middle"
                      fill="#b91c1c"
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-white"
                    >
                      ROAD BLOCKED ({br.name.substring(0, 14)})
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* ====================================================
              10. ROUTE VISUALIZATION (Safest vs Fastest)
              ==================================================== */}
          {layerSafeRoutes && (
            <g className="routes-layer">
              {/* -------------------------------------------
                  DANGEROUS / FASTEST ROUTE (4.1 km, Risk: HIGH)
                  Straight through flooded underpass (280, 305)
                 ------------------------------------------- */}
              <path
                d="M 190 260 L 280 305 L 370 340"
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                strokeDasharray="6 6"
                strokeLinecap="round"
                filter="url(#hazardRouteGlow)"
                className="opacity-80"
              />
              {/* Dangerous Route High Risk Warning Badge */}
              <g transform="translate(255, 335)">
                <rect x="-42" y="-10" width="84" height="20" rx="4" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.2" />
                <text x="0" y="3" fill="#b91c1c" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  ⚠️ HIGH RISK
                </text>
              </g>

              {/* -------------------------------------------
                  SAFEST ROUTE (5.2 km, Risk: LOW) - RECOMMENDED
                  R-07 (190, 260) → Elevated Bypass 4B → RA-1024 (370, 340) → Civil Hospital (730, 220)
                 ------------------------------------------- */}
              {/* Segment 1: Team R-07 to Victim (Via Bypass 4B) */}
              <path
                d="M 190 260 C 190 190, 260 175, 300 210 S 350 280, 370 340"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                opacity="0.3"
                strokeLinecap="round"
              />
              <path
                d="M 190 260 C 190 190, 260 175, 300 210 S 350 280, 370 340"
                fill="none"
                stroke="url(#safeRouteGradient)"
                strokeWidth="4"
                strokeDasharray={navigationActive ? '10 5' : 'none'}
                strokeLinecap="round"
                filter="url(#safeRouteGlow)"
                className={navigationActive ? 'animate-pulse' : ''}
              />

              {/* Segment 2: Victim to Civil Hospital (Trauma Corridor) */}
              <path
                d="M 370 340 C 450 320, 560 230, 730 220"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                opacity="0.25"
                strokeLinecap="round"
              />
              <path
                d="M 370 340 C 450 320, 560 230, 730 220"
                fill="none"
                stroke="url(#safeRouteGradient)"
                strokeWidth="3.5"
                strokeDasharray="8 5"
                strokeLinecap="round"
                filter="url(#safeRouteGlow)"
              />

              {/* Safest Route Recommendation Badge on Path */}
              <g transform="translate(270, 190)">
                <rect x="-85" y="-12" width="170" height="24" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                <text x="0" y="3" fill="#065f46" fontSize="9.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  SAFE ROUTE ✓ (BYPASS 4B • 5.2 km)
                </text>
              </g>

              {/* Segment 2 Label */}
              <g transform="translate(540, 260)">
                <rect x="-70" y="-10" width="140" height="20" rx="5" fill="#ffffff" stroke="#10b981" strokeWidth="1" />
                <text x="0" y="3" fill="#047857" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  TRAUMA CORRIDOR TO HOSPITAL
                </text>
              </g>
            </g>
          )}

          {/* ====================================================
              6. SHELTER MARKERS (🏠)
              ==================================================== */}
          {layerShelters &&
            shelters.map((s) => {
              const pos = fixedPositions[s.id] || getCoordinates(s.id, s.location.lat, s.location.lng);
              const isSelected = activePopup?.type === 'shelter' && activePopup.data.id === s.id;

              return (
                <g
                  key={s.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => setActivePopup({ type: 'shelter', data: s })}
                >
                  <circle
                    r={isSelected ? 18 : 13}
                    fill="#7e22ce"
                    stroke="#c084fc"
                    strokeWidth={isSelected ? 3 : 1.8}
                    className="transition-all"
                  />
                  <text x="0" y="4.5" textAnchor="middle" fontSize="11">🏠</text>
                  <text
                    x="0"
                    y="22"
                    textAnchor="middle"
                    fill="#6b21a8"
                    fontSize="9"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white"
                  >
                    {s.name.substring(0, 15)}
                  </text>
                </g>
              );
            })}

          {/* ====================================================
              5. HOSPITAL MARKERS (🏥)
              ==================================================== */}
          {layerHospitals &&
            hospitals.map((h) => {
              const pos = fixedPositions[h.id] || getCoordinates(h.id, h.location.lat, h.location.lng);
              const isSelected = activePopup?.type === 'hospital' && activePopup.data.id === h.id;
              const isAccepting = h.status === 'Accepting';

              return (
                <g
                  key={h.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => setActivePopup({ type: 'hospital', data: h })}
                >
                  <circle
                    r={isSelected ? 20 : 15}
                    fill={isAccepting ? '#059669' : '#dc2626'}
                    stroke={isAccepting ? '#34d399' : '#f87171'}
                    strokeWidth={isSelected ? 3.5 : 2}
                    className="transition-all"
                  />
                  <text x="0" y="5" textAnchor="middle" fontSize="12">🏥</text>
                  {/* Pin label */}
                  <g transform="translate(0, -22)">
                    <rect x="-55" y="-14" width="110" height="18" rx="4" fill="#ffffff" stroke="#10b981" strokeWidth="1.2" />
                    <text x="0" y="-2" fill="#047857" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                      {h.name.substring(0, 14)} ({h.availableBeds})
                    </text>
                  </g>
                </g>
              );
            })}

          {/* ====================================================
              4. RESCUE TEAM MARKERS (🚑)
              ==================================================== */}
          {layerTeams &&
            rescueTeams.map((t) => {
              const pos = fixedPositions[t.id] || getCoordinates(t.id, t.currentLocation?.lat, t.currentLocation?.lng);
              const isSelected = activePopup?.type === 'team' && activePopup.data.id === t.id;
              const isEnRoute = t.status === 'En Route';

              return (
                <g
                  key={t.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => setActivePopup({ type: 'team', data: t })}
                >
                  {/* Radar pulse for En Route team */}
                  {isEnRoute && (
                    <circle cx="0" cy="0" r="26" fill="#0284c7" opacity="0.25" className="animate-ping" />
                  )}
                  <circle
                    r={isSelected ? 20 : 15}
                    fill="#0284c7"
                    stroke="#38bdf8"
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all"
                  />
                  <text x="0" y="5" textAnchor="middle" fontSize="13">🚑</text>

                  {/* Callsign Pin */}
                  <g transform="translate(0, -22)">
                    <rect x="-45" y="-14" width="90" height="18" rx="4" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" />
                    <text x="0" y="-2" fill="#0369a1" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                      {t.id} [{t.status}]
                    </text>
                  </g>
                </g>
              );
            })}

          {/* ====================================================
              3. EMERGENCY MARKERS (🔴 🟠 🟡 🟢)
              ==================================================== */}
          {layerEmergencies &&
            filteredEmergencies.map((em) => {
              const pos = fixedPositions[em.id] || getCoordinates(em.id, em.location.lat, em.location.lng);
              const isSelected = activePopup?.type === 'emergency' && activePopup.data.id === em.id;
              const isCritical = em.priority === 'CRITICAL';
              const isHigh = em.priority === 'HIGH';
              const isModerate = em.priority === 'MODERATE';

              const fill = isCritical
                ? '#dc2626'
                : isHigh
                ? '#ea580c'
                : isModerate
                ? '#d97706'
                : '#059669';

              const stroke = isCritical
                ? '#ef4444'
                : isHigh
                ? '#f97316'
                : isModerate
                ? '#eab308'
                : '#10b981';

              return (
                <g
                  key={em.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => setActivePopup({ type: 'emergency', data: em })}
                >
                  {/* Subtle pulsing animation for critical cases */}
                  {isCritical && (
                    <circle cx="0" cy="0" r="32" fill="#ef4444" opacity="0.2" className="animate-ping" />
                  )}

                  <circle
                    r={isSelected ? 22 : 16}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected ? 3.5 : 2}
                    className="transition-all"
                  />

                  {/* Incident number or icon */}
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                    {em.peopleAffected}
                  </text>

                  {/* ID Pin */}
                  <g transform="translate(0, -24)">
                    <rect
                      x="-45"
                      y="-15"
                      width="90"
                      height="19"
                      rx="4"
                      fill={isCritical ? '#fef2f2' : '#ffffff'}
                      stroke={stroke}
                      strokeWidth="1.2"
                    />
                    <text
                      x="0"
                      y="-2"
                      fill={isCritical ? '#b91c1c' : '#334155'}
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      #{em.id} ({em.aiScore})
                    </text>
                  </g>
                </g>
              );
            })}
        </svg>

        {/* ====================================================
            NAVIGATION ACTIVE TURN-BY-TURN HUD
            ==================================================== */}
        {/* ====================================================
            NAVIGATION ACTIVE TURN-BY-TURN HUD
            ==================================================== */}
        {navigationActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-blue-200 rounded-2xl p-4 shadow-xl max-w-lg w-full text-xs space-y-2 text-slate-800 animate-in fade-in zoom-in">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-blue-700 font-bold">
                <Navigation className="w-4 h-4 animate-spin text-blue-600" />
                <span>MISSION NAVIGATION ACTIVE • TEAM R-07</span>
              </div>
              <button
                onClick={() => setNavigationActive(false)}
                className="text-slate-400 hover:text-slate-700 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold"
              >
                [STOP]
              </button>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Heading: <strong className="text-slate-900">142° SE</strong></span>
              <span>Speed: <strong className="text-blue-700">42 km/h</strong></span>
              <span>ETA to Victim: <strong className="text-emerald-700">8 minutes</strong></span>
            </div>

            <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200 text-blue-950 flex items-start gap-2">
              <span className="text-base text-blue-600">↗</span>
              <div>
                <strong className="block text-blue-900 font-bold">Next Maneuver in 400m:</strong>
                <span className="text-slate-700">Merge onto Elevated Bypass 4B. Avoid Submerged Underpass 14 exit (Water depth 2.1m).</span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            POPUP WINDOWS (Exact specs for Emergency, Team, Hospital, Shelter, Hazard, Blocked)
            ==================================================== */}
        {activePopup && (
          <div className="absolute bottom-6 right-6 z-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-5 shadow-2xl max-w-md w-full text-xs animate-in fade-in slide-in-from-bottom-2 space-y-3.5 text-slate-800">
            {/* 3. EMERGENCY POPUP */}
            {activePopup.type === 'emergency' && (
              <div className="space-y-3">
                <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="text-[10px] text-blue-600 font-bold uppercase">INCIDENT DOSSIER</div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                      <span>EMERGENCY #{activePopup.data.id}</span>
                      <PriorityBadge priority={activePopup.data.priority} size="sm" />
                    </h3>
                  </div>
                  <button onClick={() => setActivePopup(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">DISASTER & SECTOR</span>
                    <span className="font-bold text-slate-900">{activePopup.data.disasterType} • {activePopup.data.location.sector}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">CASUALTIES</span>
                    <span className="font-bold text-amber-700">{activePopup.data.peopleAffected} people ({activePopup.data.injuredCount} injured)</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">AI SEVERITY SCORE</span>
                    <span className="font-bold text-rose-700 text-sm">{activePopup.data.aiScore} / 100</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">ASSIGNED TEAM & ETA</span>
                    <span className="font-bold text-blue-700">{activePopup.data.assignedTeamId || 'R-07'} • {activePopup.data.etaMinutes || 8} min</span>
                  </div>
                </div>

                {/* Popup Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => handleTriggerRouteAnalysis(activePopup.data.id)}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>[FIND SAFEST ROUTE]</span>
                  </button>

                  <button
                    onClick={() => {
                      if (navigate) navigate(`/emergency-status?id=${activePopup.data.id}`);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] uppercase tracking-wider border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>[VIEW DETAILS]</span>
                  </button>
                </div>
              </div>
            )}

            {/* 4. RESCUE TEAM POPUP */}
            {activePopup.type === 'team' && (
              <div className="space-y-3">
                <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="text-[10px] text-blue-600 font-bold uppercase">RESCUE TEAM UNIT</div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {activePopup.data.name}
                    </h3>
                  </div>
                  <button onClick={() => setActivePopup(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-500">Status:</span>
                    <strong className="text-blue-700 uppercase">{activePopup.data.status}</strong>
                  </div>
                  <div className="flex justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-500">Current location:</span>
                    <span className="text-slate-800 font-semibold">2.4 km from emergency</span>
                  </div>
                  <div className="flex justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-500">Assigned:</span>
                    <span className="text-emerald-700 font-bold">#{activePopup.data.assignedEmergencyId || 'RA-1024'}</span>
                  </div>
                  <div className="flex justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-500">ETA:</span>
                    <span className="text-emerald-700 font-bold">{activePopup.data.etaMinutes || 8} minutes</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Equipment:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activePopup.data.equipment.map((eq, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-medium">
                        ✓ {eq}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerRouteAnalysis(activePopup.data.assignedEmergencyId || 'RA-1024')}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>[FIND SAFEST ROUTE TO MISSION]</span>
                </button>
              </div>
            )}

            {/* 5. HOSPITAL POPUP */}
            {activePopup.type === 'hospital' && (
              <div className="space-y-3">
                <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="text-[10px] text-emerald-700 font-bold uppercase">MEDICAL FACILITY</div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {activePopup.data.name}
                    </h3>
                  </div>
                  <button onClick={() => setActivePopup(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">TOTAL BEDS</span>
                    <span className="font-bold text-slate-800">{activePopup.data.totalBeds} total</span>
                    <span className="text-emerald-700 font-bold block text-sm mt-0.5">Available: {activePopup.data.availableBeds}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">ICU VENTILATORS</span>
                    <span className="font-bold text-slate-800">{activePopup.data.totalIcu} total</span>
                    <span className="text-blue-700 font-bold block text-sm mt-0.5">Available: {activePopup.data.availableIcu}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-500">Ambulances on duty: <strong className="text-slate-900">{activePopup.data.ambulances}</strong></span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                    🟢 {activePopup.data.status.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* 6. SHELTER POPUP */}
            {activePopup.type === 'shelter' && (
              <div className="space-y-3">
                <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="text-[10px] text-purple-700 font-bold uppercase">EVACUATION RECEPTION</div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {activePopup.data.name}
                    </h3>
                  </div>
                  <button onClick={() => setActivePopup(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">CAPACITY</span>
                    <span className="font-bold text-slate-900">{activePopup.data.capacity}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">OCCUPIED</span>
                    <span className="font-bold text-amber-700">{activePopup.data.occupied}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">AVAILABLE</span>
                    <span className="font-bold text-emerald-700">{activePopup.data.availableCapacity}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-500">Water supplies:</span> <strong className="text-blue-700">78%</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-500">Food supplies:</span> <strong className="text-amber-700">64%</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-500">Operational Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                    🟢 OPEN
                  </span>
                </div>
              </div>
            )}

            {/* 7. HAZARD ZONE POPUP */}
            {activePopup.type === 'hazard' && (
              <div className="space-y-3">
                <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="text-[10px] text-rose-700 font-bold uppercase">HAZARD PERIMETER ALERT</div>
                    <h3 className="text-base font-bold text-rose-700 mt-0.5">
                      ⚠️ {activePopup.data.name}
                    </h3>
                  </div>
                  <button onClick={() => setActivePopup(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
                    <span className="text-slate-600">Water depth:</span>
                    <strong className="text-blue-800">{activePopup.data.waterDepth || '1.8m'}</strong>
                  </div>
                  <div className="flex justify-between bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
                    <span className="text-slate-600">Vehicle access:</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                      {activePopup.data.vehicleAccess}
                    </span>
                  </div>
                  <div className="flex justify-between bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
                    <span className="text-slate-600">Pedestrian access:</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                      {activePopup.data.pedestrianAccess}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {activePopup.data.description}
                </p>
              </div>
            )}

            {/* 8. BLOCKED ROAD POPUP */}
            {activePopup.type === 'blockedRoad' && (
              <div className="space-y-3">
                <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="text-[10px] text-amber-700 font-bold uppercase">TACTICAL ROUTE IMPEDANCE</div>
                    <h3 className="text-base font-bold text-amber-700 mt-0.5">
                      🚧 ROAD BLOCKED
                    </h3>
                  </div>
                  <button onClick={() => setActivePopup(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                    <span className="text-slate-600">Location:</span>
                    <strong className="text-slate-900">{activePopup.data.name}</strong>
                  </div>
                  <div className="flex justify-between bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                    <span className="text-slate-600">Reason:</span>
                    <span className="text-rose-700 font-bold">{activePopup.data.reason}</span>
                  </div>
                  <div className="flex justify-between bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                    <span className="text-slate-600">Since:</span>
                    <span className="text-slate-800 font-semibold">{activePopup.data.since}</span>
                  </div>
                  <div className="flex justify-between bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                    <span className="text-slate-600">Estimated clearance:</span>
                    <span className="text-amber-800 font-bold">{activePopup.data.estimatedClearance}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====================================================
          9, 11. AI SAFE ROUTE MODAL & RECOMMENDATION PANEL
          ==================================================== */}
      {showRouteAnalysisModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 space-y-5 text-xs text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-blue-600 animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    RescueAI Route Analysis
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Multi-Variable Hazard Optimization • Sector 14 Emergency Extraction
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowRouteAnalysisModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Route Comparison Cards (Fastest vs Safest) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Fastest Route Card */}
              <div
                onClick={() => setActiveRouteOption('fastest')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activeRouteOption === 'fastest'
                    ? 'bg-rose-50/50 border-rose-300 ring-2 ring-rose-200'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase text-rose-700">Direct Route</span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-200">
                    Risk: HIGH
                  </span>
                </div>
                <div className="text-base font-bold text-slate-900">{routeAnalysis.fastestRoute.distanceKm} km</div>
                <div className="text-xs text-slate-500">ETA: {routeAnalysis.fastestRoute.etaMinutes} min</div>
                <div className="mt-3 text-[11px] text-rose-800 leading-tight">
                  ⚠ {routeAnalysis.fastestRoute.reason}
                </div>
              </div>

              {/* Safest Route Card (Recommended) */}
              <div
                onClick={() => setActiveRouteOption('safest')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                  activeRouteOption === 'safest'
                    ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-200 shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Safest Route (Recommended ✓)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                    Risk: LOW
                  </span>
                </div>
                <div className="text-base font-bold text-emerald-800">{routeAnalysis.safestRoute.distanceKm} km</div>
                <div className="text-xs text-slate-600">ETA: {routeAnalysis.safestRoute.etaMinutes} min</div>
                <div className="mt-3 text-[11px] text-emerald-900 leading-tight font-medium">
                  ✓ {routeAnalysis.safestRoute.reason}
                </div>
              </div>
            </div>

            {/* AI Reasoning Directive Banner */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-3">
              <span className="text-xl shrink-0">📢</span>
              <p className="italic font-medium">
                "{routeAnalysis.aiAnalysisSummary}"
              </p>
            </div>

            {/* Route Detail Breakdown */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-700 uppercase text-[10px]">
                AI ROUTE RECOMMENDATION SPECIFICATIONS:
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>From: <strong className="text-slate-900">{routeAnalysis.teamName}</strong></div>
                <div>To: <strong className="text-slate-900">Emergency #{routeAnalysis.emergencyId}</strong></div>
                <div>Distance: <strong className="text-slate-900">{routeAnalysis.safestRoute.distanceKm} km</strong></div>
                <div>ETA: <strong className="text-emerald-700">{routeAnalysis.safestRoute.etaMinutes} minutes</strong></div>
                <div>Hazards avoided: <strong className="text-emerald-700">{routeAnalysis.safestRoute.hazardsAvoided}</strong></div>
                <div>Blocked roads avoided: <strong className="text-emerald-700">{routeAnalysis.safestRoute.blockedRoadsAvoided}</strong></div>
                <div className="col-span-2">Hospital Reception: <strong className="text-blue-700">{routeAnalysis.hospitalName}</strong></div>
              </div>
            </div>

            {/* Waypoints Ticker */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Safe Corridor Waypoints:</span>
              <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto">
                {routeAnalysis.safeRouteWaypoints.map((wp) => (
                  <div key={wp.step} className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                        {wp.step}
                      </span>
                      <span className="text-slate-700 font-medium">{wp.instruction}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[10px] shrink-0 ml-2">{wp.distance}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRouteAnalysisModal(false)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  setNavigationActive(true);
                  setShowRouteAnalysisModal(false);
                  addToast('Navigation Active', 'Deploying Team R-07 along Elevated Bypass 4B.', 'success');
                }}
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Start Navigation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
