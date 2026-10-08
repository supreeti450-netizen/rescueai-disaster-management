import React, { useState } from 'react';
import { 
  MapPin, 
  Ambulance, 
  Building2, 
  Navigation, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  ShieldAlert, 
  Waves,
  Layers,
  Compass
} from 'lucide-react';

interface TacticalRouteMapProps {
  teamName?: string;
  teamCallsign?: string;
  teamEtaMinutes?: number;
  teamDistanceKm?: number;
  victimAddress?: string;
  hospitalName?: string;
  hospitalBeds?: number;
  hospitalIcu?: number;
  statusText?: string;
  heightClass?: string;
}

export const TacticalRouteMap: React.FC<TacticalRouteMapProps> = ({
  teamName = 'Team R-07',
  teamCallsign = 'AQUABOAT-1',
  teamEtaMinutes = 8,
  teamDistanceKm = 2.4,
  victimAddress = 'Sector 14 Block C, Ahmedabad',
  hospitalName = 'Civil Hospital & Trauma Emergency',
  hospitalBeds = 18,
  hospitalIcu = 4,
  statusText = 'EN ROUTE',
  heightClass = 'h-[420px]',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedNode, setSelectedNode] = useState<'team' | 'victim' | 'hospital' | null>('victim');
  const [showHazardLayer, setShowHazardLayer] = useState<boolean>(true);

  // Map coordinates in SVG viewBox (800x500)
  // Team R-07 Base: (180, 360)
  // Victim (Sector 14): (420, 240)
  // Hospital (Civil Hospital): (680, 150)
  // Underpass 14 Hazard: (350, 310)

  return (
    <div className={`relative w-full ${heightClass} bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm select-none`}>
      {/* HUD Header */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono pointer-events-auto shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span className="text-blue-700 font-bold">TACTICAL VECTOR DISPATCH MAP</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">SECTOR 14 GRID</span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-200 pointer-events-auto shadow-sm">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setSelectedNode('victim');
            }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title="Recenter"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowHazardLayer(!showHazardLayer)}
            className={`p-1.5 rounded-lg transition-colors ${
              showHazardLayer ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Toggle Flood Inundation Layer"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main SVG Vector Canvas */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="tacticalGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1" fill="#cbd5e1" opacity="0.8" />
            </pattern>

            {/* Glowing route filters */}
            <filter id="cyanRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="emeraldRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear gradients for routes */}
            <linearGradient id="route1Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <linearGradient id="route2Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="500" fill="#F1F5F9" />
          <rect width="800" height="500" fill="url(#tacticalGridPattern)" />

          {/* River / Flood Inundation Zone (Sabarmati floodplain basin) */}
          {showHazardLayer && (
            <g className="transition-opacity duration-300">
              <path
                d="M 50 480 Q 250 420, 360 320 T 520 220 T 780 180 L 800 500 L 0 500 Z"
                fill="#bfdbfe"
                opacity="0.45"
              />
              <path
                d="M 280 380 Q 360 310, 430 290 T 560 210 T 680 190"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="18"
                opacity="0.35"
                strokeLinecap="round"
              />
              {/* Flood Hazard Polygon around Sector 14 underpass */}
              <circle
                cx="370"
                cy="310"
                r="45"
                fill="#fef2f2"
                opacity="0.85"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text
                x="370"
                y="314"
                fill="#dc2626"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                ⚠ SUBMERGED UNDERPASS
              </text>
            </g>
          )}

          {/* Background Road Arterials */}
          <path
            d="M 100 200 L 750 200"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          <path
            d="M 180 400 L 180 80"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />
          <path
            d="M 420 450 L 420 50"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />
          <path
            d="M 680 450 L 680 50"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />

          {/* ==============================================
              ROUTE 1: RESCUE TEAM (180, 360) -> VICTIM (420, 240)
              (Elevated Bypass 4B avoiding Underpass at 370, 310)
             ============================================== */}
          {/* Outer glow aura */}
          <path
            d="M 180 360 C 230 330, 260 250, 420 240"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="8"
            opacity="0.5"
            strokeLinecap="round"
          />
          {/* Main animated path */}
          <path
            d="M 180 360 C 230 330, 260 250, 420 240"
            fill="none"
            stroke="url(#route1Gradient)"
            strokeWidth="3.5"
            strokeDasharray="7 5"
            strokeLinecap="round"
            filter="url(#cyanRouteGlow)"
            className="animate-pulse"
          />

          {/* Route 1 Waypoint Label */}
          <rect x="245" y="275" width="150" height="20" rx="4" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />
          <text x="320" y="289" fill="#1d4ed8" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            ROUTE 1: BYPASS 4B ({teamDistanceKm} km • {teamEtaMinutes}m)
          </text>

          {/* ==============================================
              ROUTE 2: VICTIM (420, 240) -> HOSPITAL (680, 150)
              (Direct Trauma Arterial)
             ============================================== */}
          {/* Outer glow aura */}
          <path
            d="M 420 240 C 490 230, 560 170, 680 150"
            fill="none"
            stroke="#a7f3d0"
            strokeWidth="8"
            opacity="0.5"
            strokeLinecap="round"
          />
          {/* Main animated path */}
          <path
            d="M 420 240 C 490 230, 560 170, 680 150"
            fill="none"
            stroke="url(#route2Gradient)"
            strokeWidth="3.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            filter="url(#emeraldRouteGlow)"
          />

          {/* Route 2 Waypoint Label */}
          <rect x="490" y="175" width="145" height="20" rx="4" fill="#ffffff" stroke="#10b981" strokeWidth="1.2" />
          <text x="562" y="189" fill="#047857" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            ROUTE 2: TRAUMA CORRIDOR (3.8 km)
          </text>

          {/* ==============================================
              NODE 1: RESCUE TEAM (180, 360)
             ============================================== */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedNode('team')}
            transform="translate(180, 360)"
          >
            {/* Pulsing ring */}
            <circle cx="0" cy="0" r="26" fill="#2563eb" opacity="0.15" className="animate-ping" />
            <circle cx="0" cy="0" r="18" fill="#3b82f6" opacity="0.2" />
            <circle cx="0" cy="0" r="14" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
            {/* Ambulance icon representation */}
            <text x="0" y="5" fontSize="13" textAnchor="middle">🚑</text>

            {/* Label Pin */}
            <g transform="translate(0, -28)">
              <rect x="-60" y="-18" width="120" height="22" rx="6" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />
              <text x="0" y="-3" fill="#1d4ed8" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {teamName} [{teamCallsign}]
              </text>
            </g>
          </g>

          {/* ==============================================
              NODE 2: VICTIM LOCATION (420, 240)
             ============================================== */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedNode('victim')}
            transform="translate(420, 240)"
          >
            {/* Critical alert pulsing rings */}
            <circle cx="0" cy="0" r="34" fill="#ef4444" opacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="22" fill="#ef4444" opacity="0.25" />
            <circle cx="0" cy="0" r="15" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
            <text x="0" y="5" fontSize="13" textAnchor="middle">📍</text>

            {/* Label Pin */}
            <g transform="translate(0, -32)">
              <rect x="-70" y="-20" width="140" height="24" rx="6" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
              <text x="0" y="-4" fill="#dc2626" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                ★ VICTIM: SECTOR 14 (4 PPL)
              </text>
            </g>
          </g>

          {/* ==============================================
              NODE 3: HOSPITAL (680, 150)
             ============================================== */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedNode('hospital')}
            transform="translate(680, 150)"
          >
            <circle cx="0" cy="0" r="22" fill="#10b981" opacity="0.2" />
            <circle cx="0" cy="0" r="14" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
            <text x="0" y="5" fontSize="13" textAnchor="middle">🏥</text>

            {/* Label Pin */}
            <g transform="translate(0, -28)">
              <rect x="-65" y="-18" width="130" height="22" rx="6" fill="#ffffff" stroke="#10b981" strokeWidth="1.2" />
              <text x="0" y="-3" fill="#047857" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                CIVIL HOSPITAL (18 BEDS)
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Bottom Telemetry Card */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 text-xs shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-lg shrink-0">
            🚑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{teamName}</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
                {statusText}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              Vehicle: Jet Boat • Water Level: 1.4m • ETA: <strong className="text-emerald-700 font-bold">{teamEtaMinutes} mins</strong> ({teamDistanceKm} km)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-left sm:text-right">
            <span className="text-slate-500 block text-[10px]">EVACUATION RECEPTION</span>
            <span className="text-emerald-700 font-bold">{hospitalName}</span>
          </div>
          <div className="text-left sm:text-right bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px]">AVAILABLE BEDS</span>
            <span className="text-blue-700 font-bold">{hospitalBeds} Beds ({hospitalIcu} ICU)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
