import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import { Hospital, HospitalStatus } from '../types';
import {
  Building2,
  Bed,
  Activity,
  Ambulance,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  X
} from 'lucide-react';

export const HospitalsPage: React.FC = () => {
  const { hospitals, addToast } = useRescue();
  const [dispatchModalHospital, setDispatchModalHospital] = useState<Hospital | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const getStatusBadge = (status: HospitalStatus) => {
    switch (status) {
      case 'Accepting':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: '🟢 ACCEPTING',
        };
      case 'Limited':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          icon: '🟡 LIMITED',
        };
      case 'Full':
      default:
        return {
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          icon: '🔴 FULL',
        };
    }
  };

  const handleDispatch = (h: Hospital) => {
    addToast(
      'Ambulance Dispatched',
      `Ambulance from ${h.name} assigned to trauma corridor.`,
      'info'
    );
    setDispatchModalHospital(null);
  };

  const totalBeds = hospitals.reduce((acc, h) => acc + h.totalBeds, 0);
  const availBeds = hospitals.reduce((acc, h) => acc + h.availableBeds, 0);
  const totalIcu = hospitals.reduce((acc, h) => acc + h.totalIcu, 0);
  const availIcu = hospitals.reduce((acc, h) => acc + h.availableIcu, 0);

  const filteredHospitals = hospitals.filter((h) => {
    const matchesStatus = filterStatus === 'ALL' || h.status === filterStatus;
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>EMERGENCY MEDICAL & TRAUMA NETWORK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Hospital Bed & ICU Allocation
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time synchronization with regional hospitals, trauma centers, and field ICUs.
          </p>
        </div>

        {/* Global Capacity KPI */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-center shadow-sm">
            <span className="text-slate-500 text-[10px] uppercase font-semibold block">TOTAL BEDS AVAIL</span>
            <span className="font-bold text-emerald-700 text-sm font-mono">{availBeds} / {totalBeds}</span>
          </div>
          <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-center shadow-sm">
            <span className="text-slate-500 text-[10px] uppercase font-semibold block">ICU VENTILATORS</span>
            <span className="font-bold text-blue-700 text-sm font-mono">{availIcu} / {totalIcu}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospital name, sector or ID..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          {['ALL', 'Accepting', 'Limited', 'Full'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Hospitals' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHospitals.map((hosp) => {
          const statusInfo = getStatusBadge(hosp.status);
          const isCivil = hosp.id === 'H-01';

          return (
            <div
              key={hosp.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between bg-white ${
                isCivil
                  ? 'border-blue-300 shadow-md ring-1 ring-blue-300'
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {hosp.id}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold border border-slate-200">
                        TRAUMA LVL {hosp.traumaCenterLevel}
                      </span>
                      {isCivil && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-200">
                          PRIMARY TRAUMA
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{hosp.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{hosp.location.address} ({hosp.distanceKm} km)</span>
                    </div>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${statusInfo.badge}`}>
                    {statusInfo.icon}
                  </span>
                </div>

                {/* Capacity Metrics */}
                <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 block font-sans font-medium">TOTAL BEDS</span>
                    <span className="font-bold text-slate-900 text-base">{hosp.totalBeds}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">{hosp.availableBeds} Avail</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 block font-sans font-medium">ICU UNITS</span>
                    <span className="font-bold text-slate-900 text-base">{hosp.totalIcu}</span>
                    <span className="text-[10px] text-blue-700 font-semibold block">{hosp.availableIcu} Avail</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 block font-sans font-medium">AMBULANCE</span>
                    <span className="font-bold text-slate-900 text-base">{hosp.ambulances}</span>
                    <span className="text-[10px] text-slate-500 font-sans block">Units</span>
                  </div>
                </div>

                {/* Bed Utilization Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Bed Occupancy:</span>
                    <span className="font-semibold text-slate-700 font-mono">
                      {Math.round(((hosp.totalBeds - hosp.availableBeds) / hosp.totalBeds) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        hosp.status === 'Full'
                          ? 'bg-rose-500'
                          : hosp.status === 'Limited'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.round(((hosp.totalBeds - hosp.availableBeds) / hosp.totalBeds) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Emergency Desk:</span>
                  <span className="font-mono text-slate-900 font-semibold">{hosp.contactPhone}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setDispatchModalHospital(hosp)}
                  disabled={hosp.status === 'Full'}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Ambulance From Hospital</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredHospitals.length === 0 && (
          <div className="col-span-full py-16 bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-slate-800">
              No hospitals matching this filter
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No medical facilities currently match the selected admission triage status or search term.
            </p>
            <button
              onClick={() => { setFilterStatus('ALL'); setSearchQuery(''); }}
              className="mt-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              Reset Hospital Filters
            </button>
          </div>
        )}
      </div>

      {/* Dispatch confirmation modal */}
      {dispatchModalHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-slate-900 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-base text-slate-900">
                Dispatch Ambulance from {dispatchModalHospital.name}?
              </h3>
              <button
                onClick={() => setDispatchModalHospital(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              This will scramble 1 of {dispatchModalHospital.ambulances} available ambulances to Sector 14 triage corridor with Advanced Life Support (ALS) equipment.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setDispatchModalHospital(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDispatch(dispatchModalHospital)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
