import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import {
  Boxes,
  Plus,
  Minus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Sparkles,
  Zap,
  ArrowRight,
  Truck,
  ShieldAlert,
  Check,
  X,
  Package,
  Layers,
  Activity,
  Droplets,
  Ambulance,
  Compass
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const {
    resources,
    allocatableResources,
    resourceShortages,
    resourceIntelligence,
    allocateResourcesToOperation,
    optimizeResourceShortage,
    executeResourceIntelligenceAction,
    updateResourceQuantity,
    addToast
  } = useRescue();

  // Resource Assignment State
  const [selectedEmergency, setSelectedEmergency] = useState<string>('RA-1024');
  const [selectedTeam, setSelectedTeam] = useState<string>('R-07');
  const [selectedResources, setSelectedResources] = useState<string[]>(['AL-01', 'AL-02', 'AL-03', 'AL-04']);

  const handleToggleResource = (id: string) => {
    setSelectedResources((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleAllocate = () => {
    allocateResourcesToOperation('OP-1024', selectedResources);
  };

  // Primary 8 KPI items
  const primaryKpiItems = [
    { label: 'AMBULANCES', available: 12, total: 20, unit: 'Vehicles', icon: '🚑' },
    { label: 'RESCUE BOATS', available: 8, total: 10, unit: 'Vessels', icon: '🚤' },
    { label: 'DRONES', available: 4, total: 6, unit: 'UAVs', icon: '🛸' },
    { label: 'MEDICAL KITS', available: 86, total: 120, unit: 'Trauma Packs', icon: '🩺' },
    { label: 'FOOD PACKETS', available: 3200, total: 5000, unit: 'Ration MREs', icon: '🍞' },
    { label: 'WATER SUPPLY', available: 850, total: 1000, unit: 'k Liters', icon: '💧' },
    { label: 'SHELTER TENTS', available: 120, total: 200, unit: 'Shelter Pods', icon: '⛺' },
    { label: 'BLANKETS', available: 600, total: 1000, unit: 'Thermal Units', icon: '🧣' },
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6 min-h-[calc(100vh-4rem)]">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <Boxes className="w-3.5 h-3.5" />
            <span>LOGISTICS COMMAND & INVENTORY REBALANCING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Strategic Resources & Allocation
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time fleet utilization, asset mobilization, and AI predictive supply rebalancing.
          </p>
        </div>

        <button
          onClick={() => {
            addToast('National Depot Alerted', 'State Disaster Reserves triggered replenishment logistics.', 'info');
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REQUEST STATE RESERVE RESTOCK</span>
        </button>
      </div>

      {/* RESOURCE SHORTAGE ALERT BANNER */}
      {resourceShortages.map((shortage) => (
        <div
          key={shortage.id}
          className={`rounded-2xl p-4 sm:p-5 border transition-all ${
            shortage.resolved
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 shrink-0">⚠️</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-rose-700 font-bold text-sm tracking-wide uppercase">
                    RESOURCE WARNING: {shortage.item.toUpperCase()}
                  </span>
                  {shortage.resolved && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      RESOLVED
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-700 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>Current: <strong>{shortage.current}</strong></span>
                  <span>Projected requirement: <strong className="text-rose-700">{shortage.projected}</strong></span>
                  <span>Shortage: <strong className="text-amber-800 font-bold">{shortage.shortage} kits</strong></span>
                </div>

                <p className="text-xs text-slate-600 mt-1">
                  Recommendation: <em>"{shortage.recommendation}"</em>
                </p>
              </div>
            </div>

            <div>
              <button
                disabled={shortage.resolved}
                onClick={() => optimizeResourceShortage(shortage.id)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all ${
                  shortage.resolved
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                }`}
              >
                <Zap className="w-4 h-4 fill-current text-yellow-300" />
                <span>{shortage.resolved ? '✓ RESOURCES OPTIMIZED' : 'OPTIMIZE RESOURCES'}</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* RESOURCE ALLOCATION KPI METRICS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-slate-600">
            <Boxes className="w-4 h-4 text-blue-600" />
            <span>CRITICAL LOGISTICS UTILIZATION METRICS</span>
          </div>
          <span className="text-[11px] text-slate-500">8 Critical Disaster Reserves Monitored</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {primaryKpiItems.map((item, idx) => {
            const used = item.total - item.available;
            const percentAvailable = Math.round((item.available / item.total) * 100);
            const isCriticalLow = percentAvailable < 30;

            return (
              <div
                key={idx}
                className={`bg-white border rounded-2xl p-4 shadow-sm space-y-3 ${
                  isCriticalLow ? 'border-amber-300 ring-1 ring-amber-300' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-bold text-slate-900">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isCriticalLow ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {percentAvailable}% AVAIL
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-2xl font-bold text-slate-900">
                      {item.available}
                    </span>
                    <span className="text-xs text-slate-500">
                      / {item.total} {item.unit}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCriticalLow
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${percentAvailable}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>In Use: {used} {item.unit}</span>
                  <span className="text-emerald-700 font-semibold">Operational</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MISSION RESOURCE ASSIGNMENT */}
      <section className="bg-white border border-blue-200 rounded-3xl p-5 sm:p-6 shadow-sm relative space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                📦 MISSION RESOURCE ASSIGNMENT
              </h2>
              <span className="text-xs text-slate-500">
                Lock and provision specialized kits for emergency dispatch teams.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-medium">
              Emergency: <strong className="text-slate-900 font-mono">#{selectedEmergency}</strong>
            </div>
            <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-blue-800 font-medium">
              Target Unit: <strong className="text-blue-900">Team {selectedTeam}</strong>
            </div>
          </div>
        </div>

        {/* Requirements and Available Inventory Matching */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Left: Required Resources */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
              REQUIRED FOR EMERGENCY #{selectedEmergency}:
            </div>

            <div className="space-y-2">
              {[
                { name: 'Rescue Boat', note: 'Zodiac watercraft required for rooftop inundation' },
                { name: 'Medical Kit', note: 'Advanced life support for 2 injured casualties' },
                { name: 'Life Jackets', note: 'Minimum 6 units for 4 civilians + 2 crew' },
                { name: 'Emergency Radio', note: 'Encrypted tactical VHF channel with Command' },
              ].map((req, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-emerald-600 text-sm font-bold mt-0.5">✓</span>
                  <div>
                    <strong className="text-slate-900 block">{req.name}</strong>
                    <span className="text-slate-500 text-[11px]">{req.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Available Resource Instances */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
              AVAILABLE DEPOT UNITS READY TO ALLOCATE:
            </div>

            <div className="space-y-2">
              {allocatableResources.slice(0, 4).map((res) => {
                const isSelected = selectedResources.includes(res.id);
                const isAssigned = res.status === 'ASSIGNED';

                return (
                  <div
                    key={res.id}
                    onClick={() => handleToggleResource(res.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <strong className="text-slate-900 block font-mono">{res.serial}</strong>
                        <span className="text-slate-500 text-[11px]">{res.depotLocation}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      isAssigned ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button: ALLOCATE RESOURCES */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleAllocate}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>ALLOCATE RESOURCES TO TEAM {selectedTeam}</span>
          </button>
        </div>
      </section>

      {/* AI RESOURCE OPTIMIZATION */}
      <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-900 uppercase tracking-wider">
                🤖 RESCUEAI RESOURCE INTELLIGENCE
              </h2>
              <span className="text-xs text-slate-500">
                Real-time predictive logistics, sector density analysis, and dynamic inventory rebalancing.
              </span>
            </div>
          </div>

          <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
            4 ACTIVE DIRECTIVES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resourceIntelligence.map((item) => {
            const isCritical = item.priority === 'CRITICAL';
            const isHigh = item.priority === 'HIGH';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all ${
                  item.applied
                    ? 'bg-slate-50 border-slate-200 opacity-70'
                    : isCritical
                    ? 'bg-rose-50/50 border-rose-200'
                    : isHigh
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-blue-50/50 border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isCritical
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : isHigh
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {item.priority} PRIORITY
                  </span>

                  <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Reason: {item.reason}
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                  <strong className="block text-blue-700 text-[10px] uppercase font-bold">Recommended Action:</strong>
                  "{item.recommendedAction}"
                </div>

                <div className="pt-1">
                  <button
                    disabled={item.applied}
                    onClick={() => executeResourceIntelligenceAction(item.actionKey)}
                    className={`w-full py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                      item.applied
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                  >
                    <span>{item.applied ? '✓ DIRECTIVE EXECUTED' : 'EXECUTE ACTION'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
