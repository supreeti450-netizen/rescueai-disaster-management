import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import { AlertSeverity, DisasterType, DisasterAlert } from '../types';
import {
  BellRing,
  Send,
  AlertTriangle,
  ShieldAlert,
  Radio,
  CheckCircle2,
  X,
  Volume2,
  Smartphone,
  MapPin,
  Users,
  Activity,
  Plus,
  RefreshCw,
  Clock,
  Check,
  Megaphone,
  RadioTower,
  Eye
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, broadcastNewAlert, addToast, addActivityEvent } = useRescue();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFO'>('ALL');

  // New alert form fields
  const [title, setTitle] = useState('');
  const [disasterType, setDisasterType] = useState<DisasterType>('Flood');
  const [severity, setSeverity] = useState<AlertSeverity>('CRITICAL');
  const [zones, setZones] = useState('Sector 14, Sector 15');
  const [message, setMessage] = useState('');
  const [instructionText, setInstructionText] = useState('Move to second floor or higher. Avoid flooded streets. Disconnect power main.');
  type AlertChannel = 'SMS' | 'SIREN' | 'RADIO' | 'APP_PUSH';
  const [selectedChannels, setSelectedChannels] = useState<AlertChannel[]>(['SMS', 'SIREN', 'RADIO', 'APP_PUSH']);

  // Summary Metrics
  const activeAlertsCount = alerts.length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highAlertsCount = alerts.filter(a => a.severity === 'HIGH').length;
  const totalPeopleReached = 48250 + (alerts.length - 4) * 12500;
  const sectorsSet = new Set<string>();
  alerts.forEach(a => a.affectedZones.forEach(z => sectorsSet.add(z)));
  const areasCoveredCount = Math.max(6, sectorsSet.size);

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MODERATE':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'INFO':
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const handleChannelToggle = (channel: AlertChannel) => {
    if (selectedChannels.includes(channel)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter(c => c !== channel));
      }
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    broadcastNewAlert({
      title,
      disasterType,
      severity,
      affectedZones: zones.split(',').map((z) => z.trim()),
      message,
      instructions: instructionText.split('.').map(s => s.trim()).filter((s) => s.length > 0),
      issuedBy: 'Incident Commander • SDMA Command HQ',
      channels: selectedChannels,
    });

    addToast(
      'Emergency alert broadcast successfully.',
      `Broadcast sent to ${zones} across ${selectedChannels.join(', ')}.`,
      'success'
    );

    addActivityEvent({
      time: 'Just now',
      icon: 'Radio',
      message: `Evacuation alert sent to ${zones}.`,
      type: 'alert'
    });

    setCreateModalOpen(false);
    setTitle('');
    setMessage('');
  };

  const handleRetransmit = (alert: DisasterAlert) => {
    addToast(
      'Alert Retransmitted',
      `Re-broadcasted ${alert.id} to all sirens and cellular repeaters in ${alert.affectedZones.join(', ')}.`,
      'info'
    );
    addActivityEvent({
      time: 'Just now',
      icon: 'Radio',
      message: `Carrier uplink re-broadcast of "${alert.title}" triggered.`,
      type: 'alert'
    });
  };

  const filteredAlerts = alerts.filter(a => {
    if (activeTab === 'ALL') return true;
    return a.severity === activeTab;
  });

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 mb-1.5">
            <RadioTower className="w-3.5 h-3.5" />
            <span>COMMON ALERTING PROTOCOL (CAP 1.2) NETWORK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Alert & Communication Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Broadcast emergency alerts, sirens, cellular push notifications, and civil safety directives.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ CREATE ALERT</span>
        </button>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Alerts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeAlertsCount}</div>
          <p className="text-xs text-slate-500 mt-1">Broadcasting across channels</p>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Critical Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-700">{criticalAlertsCount}</div>
          <p className="text-xs text-rose-600 mt-1">Immediate life threat active</p>
        </div>

        {/* People Reached */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">People Reached</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalPeopleReached.toLocaleString()}</div>
          <p className="text-xs text-emerald-600 mt-1">98.2% cellular delivery ack</p>
        </div>

        {/* Areas Covered */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Areas Covered</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{areasCoveredCount} Sectors</div>
          <p className="text-xs text-slate-500 mt-1">Geofenced transmission zones</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'ALL'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab('CRITICAL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'CRITICAL'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-rose-700 hover:bg-rose-50 border border-slate-200'
          }`}
        >
          Critical ({criticalAlertsCount})
        </button>
        <button
          onClick={() => setActiveTab('HIGH')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'HIGH'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'bg-white text-orange-700 hover:bg-orange-50 border border-slate-200'
          }`}
        >
          High ({highAlertsCount})
        </button>
        <button
          onClick={() => setActiveTab('MODERATE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'MODERATE'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-amber-700 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          Moderate
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alt) => (
          <div
            key={alt.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {alt.id}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getSeverityBadge(alt.severity)}`}>
                    {alt.severity}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Issued {alt.timestamp}
                  </span>
                  <span className="text-xs text-slate-400 font-normal">
                    by {alt.issuedBy}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{alt.title}</h3>
              </div>

              {/* Channels badge */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium mr-1">Channels:</span>
                {alt.channels.map((ch) => (
                  <span
                    key={ch}
                    className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold flex items-center gap-1"
                  >
                    {ch === 'SIREN' && <Volume2 className="w-3 h-3" />}
                    {ch === 'SMS' && <Smartphone className="w-3 h-3" />}
                    {ch === 'RADIO' && <Radio className="w-3 h-3" />}
                    {ch === 'APP_PUSH' && <BellRing className="w-3 h-3" />}
                    {ch}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {alt.message}
            </div>

            {/* Affected zones */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Target Zones:
              </span>
              {alt.affectedZones.map((z, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
                >
                  {z}
                </span>
              ))}
            </div>

            {/* Instructions */}
            {alt.instructions.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Civil Directives:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {alt.instructions.map((inst, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 text-emerald-900"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleRetransmit(alt)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span>Retransmit / Re-broadcast</span>
              </button>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <BellRing className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-slate-800">
              No active alerts
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no active emergency broadcasts matching this severity filter.
            </p>
            <button
              onClick={() => setActiveTab('ALL')}
              className="mt-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              Show All Alerts
            </button>
          </div>
        )}
      </div>

      {/* Broadcast Alert Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 text-slate-900 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
                  PUBLIC SAFETY TRANSMITTER
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Issue Emergency Broadcast Alert
                </h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Alert title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Flash Flood Evacuation Notice: Sector 14"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="CRITICAL">CRITICAL (Immediate Evac)</option>
                    <option value="HIGH">HIGH (Dangerous Hazard)</option>
                    <option value="MODERATE">MODERATE (Advisory)</option>
                    <option value="INFO">INFO (Status Update)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Alert Type</label>
                  <select
                    value={disasterType}
                    onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Flood">Flood Warning</option>
                    <option value="Building Collapse">Evacuation</option>
                    <option value="Landslide">Road Closure</option>
                    <option value="Cyclone">Medical Emergency</option>
                    <option value="Storm">Severe Weather</option>
                    <option value="Earthquake">Shelter Update</option>
                    <option value="Other">General Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Affected area</label>
                <input
                  type="text"
                  value={zones}
                  onChange={(e) => setZones(e.target.value)}
                  placeholder="e.g. Sector 14, Sector 15, Sector 16"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Recipients (Channels)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {([
                    { id: 'SMS', label: 'Cell Broadcast / SMS' },
                    { id: 'SIREN', label: 'Municipal Sirens' },
                    { id: 'RADIO', label: 'Emergency Radio FM' },
                    { id: 'APP_PUSH', label: 'Citizen App Push' }
                  ] as const).map((ch) => {
                    const isSelected = selectedChannels.includes(ch.id);
                    return (
                      <button
                        type="button"
                        key={ch.id}
                        onClick={() => handleChannelToggle(ch.id)}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <span>{ch.id}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="State the hazard clearly, recommended actions, and safe corridors..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Protective Actions (Period-separated)
                </label>
                <input
                  type="text"
                  value={instructionText}
                  onChange={(e) => setInstructionText(e.target.value)}
                  placeholder="Turn off electricity. Move to roof. Do not drive through water."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SEND ALERT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
