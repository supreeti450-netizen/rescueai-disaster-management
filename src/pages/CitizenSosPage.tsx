import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import { 
  AlertOctagon, 
  MapPin, 
  Radio, 
  HeartHandshake, 
  Waves, 
  Building2, 
  Flame, 
  Compass
} from 'lucide-react';

interface CitizenSosPageProps {
  navigate: (path: string) => void;
}

export const CitizenSosPage: React.FC<CitizenSosPageProps> = ({ navigate }) => {
  const { createEmergency } = useRescue();
  const [selectedQuickTag, setSelectedQuickTag] = useState<string>('Trapped in Rising Water');
  const [isActivating, setIsActivating] = useState(false);

  const quickTags = [
    { label: 'Trapped in Rising Water', icon: <Waves className="w-4 h-4 text-cyan-400" />, disaster: 'Flood' as const },
    { label: 'Structural Collapse / Pinned', icon: <Building2 className="w-4 h-4 text-amber-400" />, disaster: 'Building Collapse' as const },
    { label: 'Severe Bleeding / Trauma', icon: <HeartHandshake className="w-4 h-4 text-red-400" />, disaster: 'Flood' as const },
    { label: 'Surrounded by Active Fire', icon: <Flame className="w-4 h-4 text-orange-400" />, disaster: 'Fire' as const },
  ];

  const handleTriggerSOS = () => {
    setIsActivating(true);
    const chosen = quickTags.find((t) => t.label === selectedQuickTag) || quickTags[0];

    const newCase = createEmergency({
      disasterType: chosen.disaster,
      address: 'Sector 14 Block C, Ahmedabad (23.0338° N, 72.5467° E)',
      lat: 23.0338,
      lng: 72.5467,
      peopleAffected: 4,
      injuredCount: 2,
      medicalEmergency: true,
      dangers: ['Rising water', 'Trapped', 'Road blocked'],
      additionalNotes: `1-Tap SOS Beacon: ${selectedQuickTag}. Immediate extraction requested.`,
      contactName: 'SOS Civilian Distress Beacon',
      contactPhone: '+91 98765 43210'
    });

    setTimeout(() => {
      setIsActivating(false);
      navigate(`/ai-analysis?id=${newCase.id}`);
    }, 500);
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden min-h-[calc(100vh-4rem)]">
      <div className="max-w-md w-full relative z-10 text-center space-y-6">
        {/* Header telemetry badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>INSTANT TACTICAL SOS BEACON</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Emergency 1-Tap SOS
          </h1>
          <p className="text-xs text-slate-600">
            Press and hold the button below to dispatch immediate rescue teams to your exact coordinates.
          </p>
        </div>

        {/* Current GPS Telemetry Pill */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs shadow-sm">
          <div className="flex items-center gap-2 text-blue-700 font-semibold">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>28.5355° N, 77.3910° E</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">SECTOR 14 (ACCURACY ±3m)</span>
        </div>

        {/* Emergency Condition Quick Selector */}
        <div className="space-y-2 text-left">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Quick Emergency Tag (Optional):
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickTags.map((tag) => {
              const active = selectedQuickTag === tag.label;
              return (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => setSelectedQuickTag(tag.label)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tag.icon}
                  <span className="line-clamp-2 leading-tight">{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Giant Pulsing SOS Button */}
        <div className="py-6 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Pulsing rings */}
            <div className="absolute w-64 h-64 rounded-full border border-rose-300/40 animate-ping" />
            <div className="absolute w-52 h-52 rounded-full border border-rose-300/60 animate-pulse" />
            <div className="absolute w-44 h-44 rounded-full bg-rose-500/10 blur-md" />

            {/* Main Action Circle */}
            <button
              onClick={handleTriggerSOS}
              disabled={isActivating}
              className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 border-4 border-rose-300 shadow-2xl shadow-rose-600/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 text-white disabled:opacity-50"
            >
              <AlertOctagon className="w-10 h-10 animate-bounce" />
              <span className="font-black text-2xl tracking-widest">SOS</span>
              <span className="text-[10px] tracking-wider opacity-90 font-bold">TAP TO DISPATCH</span>
            </button>
          </div>
        </div>

        {/* Alternate link */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200">
          <button
            onClick={() => navigate('/report-emergency')}
            className="hover:text-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <Radio className="w-3.5 h-3.5 text-blue-600" />
            <span>Detailed Emergency Report</span>
          </button>
          <button
            onClick={() => navigate('/emergency-status')}
            className="hover:text-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Track Existing SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
