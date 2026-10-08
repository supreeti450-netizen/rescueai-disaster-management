import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import { Shelter } from '../types';
import {
  Home,
  Users,
  Utensils,
  Droplets,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Search,
  Truck,
  Phone,
  UserCheck,
  X,
  ExternalLink,
  ChevronRight,
  HeartPulse,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export const SheltersPage: React.FC = () => {
  const { shelters, addToast, addActivityEvent, selectedShelterId, setSelectedShelterId } = useRescue();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Open' | 'Near Capacity' | 'Full'>('ALL');
  const [activeDrawerShelter, setActiveDrawerShelter] = useState<Shelter | null>(() => {
    if (selectedShelterId) {
      return shelters.find(s => s.id === selectedShelterId) || null;
    }
    return null;
  });

  // Calculate statistics
  const totalShelters = shelters.length;
  const openShelters = shelters.filter(s => s.status === 'Open').length;
  const nearCapacityShelters = shelters.filter(s => s.status === 'Near Capacity').length;
  const fullShelters = shelters.filter(s => s.status === 'Full').length;

  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + s.occupied, 0);
  const totalAvailable = totalCapacity - totalOccupied;
  const overallOccupancyPct = Math.round((totalOccupied / totalCapacity) * 100);

  // Filter logic
  const filteredShelters = shelters.filter(s => {
    const matchesFilter = filterStatus === 'ALL' || s.status === filterStatus;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.location.sector ? s.location.sector.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRouteConvoy = (shelter: Shelter, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToast(
      'Evacuee Convoy Dispatched',
      `Convoy Alpha-2 routed to ${shelter.name} (${shelter.availableCapacity} spots remaining).`,
      'success'
    );
    addActivityEvent({
      time: 'Just now',
      icon: 'Bus',
      message: `Civilian bus transport rerouted 40 evacuees to ${shelter.name}.`,
      type: 'status',
    });
  };

  const handleRequestSupplies = (shelter: Shelter, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToast(
      'Supply Replenishment Triggered',
      `Emergency water tankers and MRE crates dispatched to ${shelter.name}.`,
      'info'
    );
    addActivityEvent({
      time: 'Just now',
      icon: 'Package',
      message: `Depot mobilized 4,000L water and 200 food packs to ${shelter.name}.`,
      type: 'system',
    });
  };

  const openDrawer = (shelter: Shelter) => {
    setActiveDrawerShelter(shelter);
    if (setSelectedShelterId) {
      setSelectedShelterId(shelter.id);
    }
  };

  const closeDrawer = () => {
    setActiveDrawerShelter(null);
    if (setSelectedShelterId) {
      setSelectedShelterId(null);
    }
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <Home className="w-3.5 h-3.5" />
            <span>CIVIL EVACUATION & RELIEF NETWORK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Disaster Relief Shelters
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time occupancy tracking, ration reserves, drinking water telemetry, and evacuee intake management.
          </p>
        </div>

        {/* Global Occupancy Summary Badge */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-4">
          <div>
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Overall Occupancy</div>
            <div className="text-lg font-bold text-slate-900">
              {totalOccupied} / {totalCapacity} <span className="text-xs font-normal text-slate-500">({overallOccupancyPct}%)</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center font-bold text-xs text-blue-600 bg-blue-50">
            {totalAvailable}
            <span className="text-[9px] block text-slate-400 font-normal ml-0.5">free</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Shelters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Shelters</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalShelters}</div>
          <p className="text-xs text-slate-500 mt-1">Across 5 municipal sectors</p>
        </div>

        {/* Open Shelters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Open Shelters</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{openShelters}</div>
          <p className="text-xs text-emerald-600 mt-1">Intake active & accepting evacuees</p>
        </div>

        {/* Near Capacity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Near Capacity</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700">{nearCapacityShelters}</div>
          <p className="text-xs text-amber-600 mt-1">&gt; 90% space utilized</p>
        </div>

        {/* Full Shelters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Full Shelters</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-700">{fullShelters}</div>
          <p className="text-xs text-rose-600 mt-1">Intake paused; diverted to S-04</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Shelters ({shelters.length})
          </button>
          <button
            onClick={() => setFilterStatus('Open')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'Open'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Open ({openShelters})
          </button>
          <button
            onClick={() => setFilterStatus('Near Capacity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'Near Capacity'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Near Capacity ({nearCapacityShelters})
          </button>
          <button
            onClick={() => setFilterStatus('Full')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'Full'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            Full ({fullShelters})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search shelter name, sector, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredShelters.map((sh) => {
          const occPercent = Math.round((sh.occupied / sh.capacity) * 100);
          const isNear = occPercent >= 90 && sh.status !== 'Full';
          const isFull = sh.status === 'Full';
          const waterPercent = sh.id === 'S-04' ? 78 : Math.min(100, Math.round((sh.waterSuppliesLiters / 35000) * 100));
          const foodPercent = sh.id === 'S-04' ? 64 : Math.min(100, Math.round((sh.foodSuppliesDays / 7) * 100));

          return (
            <div
              key={sh.id}
              onClick={() => openDrawer(sh)}
              className="group bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all rounded-2xl p-5 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {sh.id}
                      </span>
                      {sh.id === 'S-04' && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          PRIMARY HUB
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">
                      {sh.name}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{sh.location.address}</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase border shrink-0 ${
                      isFull
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : isNear
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {sh.status.toUpperCase()}
                  </span>
                </div>

                {/* Occupancy Bar */}
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Occupancy</span>
                    <span className="text-slate-900 font-bold font-mono">
                      {sh.occupied} / {sh.capacity}{' '}
                      <span className="text-emerald-700 font-semibold">({sh.availableCapacity} available)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, occPercent)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>Capacity: {sh.capacity} • Occupied: {sh.occupied}</span>
                    <span className="text-emerald-700 font-bold">Available: {sh.availableCapacity}</span>
                  </div>
                </div>

                {/* Supplies Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Droplets className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block font-medium">WATER RESERVES</span>
                      <span className="font-bold text-slate-800 font-mono">
                        Water: {waterPercent}% <span className="text-[10px] text-slate-500 font-normal font-sans">({sh.waterSuppliesLiters.toLocaleString()}L)</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Utensils className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block font-medium">FOOD RESERVES</span>
                      <span className="font-bold text-slate-800 font-mono">
                        Food: {foodPercent}% <span className="text-[10px] text-slate-500 font-normal font-sans">({sh.foodSuppliesDays}d)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medical Station */}
                <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-slate-400" />
                    Field Medical Clinic:
                  </span>
                  <span
                    className={
                      sh.medicalStation
                        ? 'text-emerald-700 font-semibold flex items-center gap-1'
                        : 'text-slate-500 font-normal'
                    }
                  >
                    {sh.medicalStation ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Doctors Present</span>
                      </>
                    ) : (
                      'First Aid Station'
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={(e) => handleRouteConvoy(sh, e)}
                  disabled={isFull}
                  className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Route Convoy</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDrawer(sh);
                  }}
                  className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center transition-colors"
                  title="View shelter details"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredShelters.length === 0 && (
          <div className="col-span-full py-16 bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Home className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-slate-800">
              No shelters matching this filter
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No civil relief shelters match the current status filter or location search keyword.
            </p>
            <button
              onClick={() => { setFilterStatus('ALL'); setSearchQuery(''); }}
              className="mt-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              Reset Shelter Filter
            </button>
          </div>
        )}
      </div>

      {/* Interactive Shelter Detail Drawer / Slide-over Modal */}
      {activeDrawerShelter && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeDrawer}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {activeDrawerShelter.id}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                        activeDrawerShelter.status === 'Full'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : activeDrawerShelter.status === 'Near Capacity'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {activeDrawerShelter.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">
                    {activeDrawerShelter.name}
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    {activeDrawerShelter.location.address} ({activeDrawerShelter.location.sector})
                  </p>
                </div>

                <button
                  onClick={closeDrawer}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Capacity & Occupancy Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase">
                    <span>Intake & Capacity</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {activeDrawerShelter.occupied} / {activeDrawerShelter.capacity}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        activeDrawerShelter.status === 'Full'
                          ? 'bg-rose-500'
                          : activeDrawerShelter.occupied / activeDrawerShelter.capacity >= 0.9
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((activeDrawerShelter.occupied / activeDrawerShelter.capacity) * 100)
                        )}%`
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[10px] block font-medium">ADULTS</span>
                      <span className="font-bold text-slate-800">
                        {Math.round(activeDrawerShelter.occupied * 0.58)}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[10px] block font-medium">CHILDREN</span>
                      <span className="font-bold text-slate-800">
                        {Math.round(activeDrawerShelter.occupied * 0.26)}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[10px] block font-medium">SENIORS</span>
                      <span className="font-bold text-slate-800">
                        {Math.round(activeDrawerShelter.occupied * 0.16)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Supply Telemetry */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Supply Reserves & Logistics
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-1 text-blue-600">
                        <Droplets className="w-4 h-4" />
                        <span className="text-xs font-semibold text-slate-700">Drinking Water</span>
                      </div>
                      <div className="text-lg font-bold font-mono text-slate-900">
                        {activeDrawerShelter.waterSuppliesLiters.toLocaleString()} L
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Est. {Math.round(activeDrawerShelter.waterSuppliesLiters / 3000)} days safe reserve
                      </p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-1 text-amber-600">
                        <Utensils className="w-4 h-4" />
                        <span className="text-xs font-semibold text-slate-700">Food Rations</span>
                      </div>
                      <div className="text-lg font-bold font-mono text-slate-900">
                        {activeDrawerShelter.foodSuppliesDays} Days
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        MRE packs & ready cooked grains
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medical & Sanitation Unit */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Medical & Field Sanitation
                  </h3>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">On-Site Clinic:</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        {activeDrawerShelter.medicalStation ? 'Active Emergency Doctors' : 'First Aid Attendants'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Quarantine Wing:</span>
                      <span className="font-semibold text-slate-800">12 Isolation Beds</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Power Source:</span>
                      <span className="font-semibold text-slate-800">Diesel Generator (84% fuel)</span>
                    </div>
                  </div>
                </div>

                {/* Shelter Coordinator Contact */}
                <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Station Commander & Direct Hotline</span>
                  </div>
                  <div className="text-xs text-slate-700">
                    <div className="font-semibold text-slate-900">Officer Radhika Nair (SDRF Coordinator)</div>
                    <div className="font-mono text-slate-600 mt-0.5">+91 94100 88219 | VHF Ch 14</div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
                <button
                  onClick={() => handleRequestSupplies(activeDrawerShelter)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Request Supplies</span>
                </button>
                <button
                  onClick={() => handleRouteConvoy(activeDrawerShelter)}
                  disabled={activeDrawerShelter.status === 'Full'}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <Home className="w-4 h-4" />
                  <span>Route Evacuees</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
