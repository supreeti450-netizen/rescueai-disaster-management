import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import {
  Settings,
  Volume2,
  VolumeX,
  Radio,
  ShieldCheck,
  Sliders,
  Bell,
  CheckCircle2,
  RefreshCw,
  User,
  Building,
  Phone,
  Compass,
  MapPin,
  Cpu,
  Layers,
  Save,
  RotateCcw,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { soundEnabled, toggleSound, addToast, resetDemo } = useRescue();

  // Responder Profile State
  const [commanderName, setCommanderName] = useState('Capt. Vikram Seth');
  const [commanderRole, setCommanderRole] = useState('Incident Commander • Emergency Operations Lead');
  const [commanderOrg, setCommanderOrg] = useState('State Disaster Response Force (SDRF) / NDRF');
  const [commanderCallSign, setCommanderCallSign] = useState('COMMAND-ALPHA');
  const [commanderPhone, setCommanderPhone] = useState('+91 94100 00100');
  const [dutyStatus, setDutyStatus] = useState<'ON_DUTY' | 'STANDBY'>('ON_DUTY');

  // Notification Preferences
  const [desktopAlerts, setDesktopAlerts] = useState(true);
  const [smsDispatches, setSmsDispatches] = useState(true);
  const [vhfChimes, setVhfChimes] = useState(true);

  // Emergency & AI Preferences
  const [criticalThreshold, setCriticalThreshold] = useState(80);
  const [autoAssignHighSeverity, setAutoAssignHighSeverity] = useState(true);
  const [autoRerouteFullHospitals, setAutoRerouteFullHospitals] = useState(true);

  // Map & Telemetry
  const [autoRefreshSecs, setAutoRefreshSecs] = useState(15);
  const [routeMode, setRouteMode] = useState<'safest' | 'fastest' | 'balanced'>('safest');
  const [showFloodHazardsDefault, setShowFloodHazardsDefault] = useState(true);

  const handleSave = () => {
    addToast(
      'System Preferences Saved',
      'Commander profile and tactical operating parameters updated successfully.',
      'success'
    );
  };

  const handleResetToDefaults = () => {
    resetDemo();
    addToast(
      'Settings & Demo Reset',
      'Operating preferences restored to factory incident response baseline.',
      'info'
    );
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <Settings className="w-3.5 h-3.5" />
            <span>COMMAND CENTER CONFIGURATION & PROFILE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            System & Tactical Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure responder credentials, acoustic telemetry alarms, AI triage thresholds, and map routing preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDefaults}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Restore Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl space-y-6">
        {/* 1. Responder Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>1. Incident Commander & Responder Profile</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {dutyStatus === 'ON_DUTY' ? 'ACTIVE ON DUTY' : 'STANDBY'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Full Name & Rank</label>
              <input
                type="text"
                value={commanderName}
                onChange={(e) => setCommanderName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Incident Role</label>
              <input
                type="text"
                value={commanderRole}
                onChange={(e) => setCommanderRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Organization / Division</label>
              <input
                type="text"
                value={commanderOrg}
                onChange={(e) => setCommanderOrg(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Call Sign</label>
                <input
                  type="text"
                  value={commanderCallSign}
                  onChange={(e) => setCommanderCallSign(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Tactical Hotline</label>
                <input
                  type="text"
                  value={commanderPhone}
                  onChange={(e) => setCommanderPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Audio & Notification Preferences */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>2. Notification & Acoustic Alarm Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-bold text-slate-900 text-sm">Critical Audio Chimes</div>
                <div className="text-slate-500 mt-0.5">
                  Play acoustic synthesizer alerts on Tier-1 critical cases.
                </div>
              </div>
              <button
                onClick={toggleSound}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 border transition-all ${
                  soundEnabled
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-400 border-slate-300'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundEnabled ? 'ON' : 'MUTED'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-bold text-slate-900 text-sm">Desktop Push Notifications</div>
                <div className="text-slate-500 mt-0.5">
                  Display browser native notifications when minimized.
                </div>
              </div>
              <button
                onClick={() => setDesktopAlerts(!desktopAlerts)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 border transition-all ${
                  desktopAlerts
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-400 border-slate-300'
                }`}
              >
                <span>{desktopAlerts ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-bold text-slate-900 text-sm">SMS Carrier Broadcasts</div>
                <div className="text-slate-500 mt-0.5">
                  Auto-relay high priority alerts to citizen cell phones.
                </div>
              </div>
              <button
                onClick={() => setSmsDispatches(!smsDispatches)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 border transition-all ${
                  smsDispatches
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-400 border-slate-300'
                }`}
              >
                <span>{smsDispatches ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-bold text-slate-900 text-sm">VHF Radio Relay Chimes</div>
                <div className="text-slate-500 mt-0.5">
                  Send tone pulses through repeater channel 14.
                </div>
              </div>
              <button
                onClick={() => setVhfChimes(!vhfChimes)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 border transition-all ${
                  vhfChimes
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-400 border-slate-300'
                }`}
              >
                <span>{vhfChimes ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. AI Decision Engine & Triage Preferences */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>3. AI Decision Engine & Triage Automation</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Range Slider */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-semibold">Critical Priority Classification Score:</span>
                <span className="text-rose-600 font-extrabold text-sm font-mono">{criticalThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>70 (Aggressive Triage)</span>
                <span className="font-semibold text-blue-600">80 (Recommended Baseline)</span>
                <span>95 (Strict Life Threat Only)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Auto-Assign Nearest Team</div>
                  <div className="text-slate-500 mt-0.5">
                    Trigger automated team dispatch if AI score &ge; 85.
                  </div>
                </div>
                <button
                  onClick={() => setAutoAssignHighSeverity(!autoAssignHighSeverity)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 border transition-all ${
                    autoAssignHighSeverity
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-400 border-slate-300'
                  }`}
                >
                  <span>{autoAssignHighSeverity ? 'ENABLED' : 'MANUAL'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Hospital Capacity Reroute</div>
                  <div className="text-slate-500 mt-0.5">
                    Divert ambulances when emergency ICU beds &le; 2.
                  </div>
                </div>
                <button
                  onClick={() => setAutoRerouteFullHospitals(!autoRerouteFullHospitals)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 border transition-all ${
                    autoRerouteFullHospitals
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-400 border-slate-300'
                  }`}
                >
                  <span>{autoRerouteFullHospitals ? 'ENABLED' : 'OFF'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Map & Telemetry Preferences */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>4. Tactical Map & Safe-Route Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-semibold">GIS Telemetry Polling Rate:</span>
                <span className="text-blue-600 font-extrabold text-sm font-mono">{autoRefreshSecs}s</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={autoRefreshSecs}
                onChange={(e) => setAutoRefreshSecs(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>5s (High Frequency)</span>
                <span>15s (Optimal)</span>
                <span>60s (Low Bandwidth)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-700 font-semibold block">Default Safe-Route Algorithm:</span>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['safest', 'fastest', 'balanced'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setRouteMode(mode)}
                    className={`py-2 rounded-lg font-bold capitalize text-xs border transition-colors ${
                      routeMode === mode
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {routeMode === 'safest' && 'Strictly detours around all water depths > 0.5m & fallen debris.'}
                {routeMode === 'fastest' && 'Optimizes strictly for minimal minutes with all-terrain vehicles.'}
                {routeMode === 'balanced' && 'Weighs water depth penalty vs response arrival ETA.'}
              </p>
            </div>
          </div>
        </div>

        {/* 5. System Information & Diagnostics */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>5. System Telemetry & Environment Information</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">SOFTWARE BUILD</span>
              <div className="font-bold text-slate-900 mt-0.5">RescueAI v2.4.0</div>
              <span className="text-[11px] text-slate-500">Enterprise Edition</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">AI CORE ENGINE</span>
              <div className="font-bold text-slate-900 mt-0.5">NeuralTriage 4X</div>
              <span className="text-[11px] text-emerald-600 font-medium">96% Classification Conf.</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">NETWORK UPLINK</span>
              <div className="font-bold text-emerald-600 mt-0.5">Operational (18ms)</div>
              <span className="text-[11px] text-slate-500">99.98% Service Uptime</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">SECURITY PROTOCOL</span>
              <div className="font-bold text-slate-900 mt-0.5">TLS 1.3 + CAP 1.2</div>
              <span className="text-[11px] text-slate-500">Encrypted Telemetry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
