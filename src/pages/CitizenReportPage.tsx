import React, { useState, useMemo } from 'react';
import { useRescue } from '../context/RescueContext';
import { DisasterType } from '../types';
import { calculatePriorityScore } from '../services/aiEngine';
import { 
  Flame, 
  MapPin, 
  Users, 
  HeartPulse, 
  AlertTriangle, 
  Upload, 
  Send, 
  CheckCircle2, 
  Info,
  Waves,
  Building,
  Wind,
  Mountain,
  Zap,
  Activity,
  Cpu,
  ShieldAlert,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

interface CitizenReportPageProps {
  navigate: (path: string) => void;
}

export const CitizenReportPage: React.FC<CitizenReportPageProps> = ({ navigate }) => {
  const { createEmergency, addToast } = useRescue();

  // Form State matching specification
  const [disasterType, setDisasterType] = useState<DisasterType>('Flood');
  const [locationText, setLocationText] = useState('Sector 14 Block C, Ahmedabad (23.0338° N, 72.5467° E)');
  const [lat] = useState(23.0338);
  const [lng] = useState(72.5467);
  const [peopleAffected, setPeopleAffected] = useState<number>(4);
  const [injuredCount, setInjuredCount] = useState<number>(2);
  const [medicalEmergency, setMedicalEmergency] = useState<boolean>(true);
  const [dangers, setDangers] = useState<string[]>([
    'Rising water',
    'Trapped',
    'Blocked route'
  ]);
  const [additionalNotes, setAdditionalNotes] = useState<string>(
    'Flood waters entered ground floor rapidly. 2 persons injured. Trapped on rooftop with rising current.'
  );
  const [contactName, setContactName] = useState<string>('Rohit Sharma');
  const [contactPhone, setContactPhone] = useState<string>('+91 98765 43210');
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
  );

  // Submission multi-step processing modal state (2-4 seconds)
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(1);
  const [createdCaseId, setCreatedCaseId] = useState<string>('RA-1024');

  // Disaster Type options
  const disasterOptions: { type: DisasterType; icon: React.ReactNode; desc: string }[] = [
    { type: 'Flood', icon: <Waves className="w-5 h-5 text-blue-400" />, desc: 'Rising water, river inundation' },
    { type: 'Earthquake', icon: <Mountain className="w-5 h-5 text-amber-400" />, desc: 'Structural shaking & damage' },
    { type: 'Cyclone', icon: <Wind className="w-5 h-5 text-cyan-400" />, desc: 'High-speed storm & gales' },
    { type: 'Landslide', icon: <Mountain className="w-5 h-5 text-yellow-400" />, desc: 'Mud flow, blocked slopes' },
    { type: 'Fire', icon: <Flame className="w-5 h-5 text-red-400" />, desc: 'Structural fire, smoke danger' },
    { type: 'Building Collapse', icon: <Building className="w-5 h-5 text-orange-400" />, desc: 'Debris & trapped victims' },
    { type: 'Other', icon: <AlertTriangle className="w-5 h-5 text-slate-400" />, desc: 'Hazardous event / Hazmat' },
  ];

  // Danger Condition options
  const dangerOptions = [
    { label: 'Rising water', emoji: '🌊' },
    { label: 'Building collapse', emoji: '🏚️' },
    { label: 'Fire', emoji: '🔥' },
    { label: 'Trapped', emoji: '🚧' },
    { label: 'Electrical hazard', emoji: '⚡' },
    { label: 'Blocked route', emoji: '🛣️' },
    { label: 'Other', emoji: '❓' },
  ];

  const toggleDanger = (label: string) => {
    setDangers((prev) =>
      prev.includes(label) ? prev.filter((d) => d !== label) : [...prev, label]
    );
  };

  // Real-time dynamic calculation from priority engine
  const livePreview = useMemo(() => {
    return calculatePriorityScore({
      disasterType,
      peopleAffected,
      injuredCount,
      medicalEmergency,
      dangers,
      locationText,
    });
  }, [disasterType, peopleAffected, injuredCount, medicalEmergency, dangers, locationText]);

  // Demo auto-fill helper
  const fillDemoFlood = () => {
    setDisasterType('Flood');
    setLocationText('Sector 14 Block C, Ahmedabad (23.0338° N, 72.5467° E)');
    setPeopleAffected(4);
    setInjuredCount(2);
    setMedicalEmergency(true);
    setDangers(['Rising water', 'Trapped', 'Blocked route']);
    setAdditionalNotes('Flood waters entered ground floor rapidly. 2 persons injured. Trapped on rooftop with rising current.');
    setContactName('Rohit Sharma');
    setContactPhone('+91 98765 43210');
    addToast('Demo Values Loaded', 'Preloaded Sector 14 Flood Scenario.', 'info');
  };

  // Handle SOS submission with simulated multi-step AI sequence (3 seconds)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep(1);

    // Create the case in context
    const newCase = createEmergency({
      disasterType,
      address: locationText,
      lat,
      lng,
      peopleAffected,
      injuredCount,
      medicalEmergency,
      dangers,
      additionalNotes,
      contactName,
      contactPhone,
      isDemoCase: disasterType === 'Flood' && peopleAffected === 4 && injuredCount === 2,
    });
    setCreatedCaseId(newCase.id);

    // Sequence Step 1 -> Step 2 after 1000ms
    setTimeout(() => {
      setProcessingStep(2);
    }, 1000);

    // Sequence Step 2 -> Step 3 after 2100ms
    setTimeout(() => {
      setProcessingStep(3);
    }, 2100);

    // Transition to /ai-analysis after 3400ms
    setTimeout(() => {
      setIsProcessing(false);
      navigate(`/ai-analysis?id=${newCase.id}`);
    }, 3400);
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ====================================================
            HEADER
            ==================================================== */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>CITIZEN EMERGENCY REPORTING</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Emergency Assistance
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Tell us what is happening. RescueAI will assess the situation and prioritize your request.
            </p>
          </div>

          <button
            type="button"
            onClick={fillDemoFlood}
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:text-blue-800 hover:bg-blue-100 text-xs font-bold tracking-wider transition-all flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
          >
            <span>⚡ AUTO-FILL DEMO SCENARIO</span>
          </button>
        </div>

        {/* ====================================================
            FORM
            ==================================================== */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FIELD 1: DISASTER TYPE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3.5 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              DISASTER TYPE <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {disasterOptions.map((opt) => {
                const active = disasterType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setDisasterType(opt.type)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      active
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {opt.icon}
                      {active && <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />}
                    </div>
                    <div>
                      <div className={`font-bold text-xs ${active ? 'text-blue-900' : 'text-slate-800'}`}>
                        {opt.type}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FIELD 2: LOCATION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                LOCATION
              </label>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                <span>📍 Location detected</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
              <input
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                className="w-full bg-transparent border-none text-slate-900 font-medium text-xs focus:outline-none"
                placeholder="Enter exact address or landmark..."
              />
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
              <span>LAT: 23.0338° N • LNG: 72.5467° E</span>
              <span className="text-blue-700 font-semibold">SECTOR 14 (ACCURACY ±3m)</span>
            </div>
          </div>

          {/* FIELD 3 & 4: PEOPLE AFFECTED & INJURED PEOPLE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                PEOPLE AFFECTED <span className="text-rose-600">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={peopleAffected}
                  onChange={(e) => setPeopleAffected(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold text-lg focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-1.5">
                  {[1, 2, 4, 8].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPeopleAffected(n)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        peopleAffected === n
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-slate-500">Total trapped or endangered persons</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                INJURED PEOPLE <span className="text-rose-600">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max={peopleAffected}
                  value={injuredCount}
                  onChange={(e) => setInjuredCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-amber-700 font-bold text-lg focus:outline-none focus:border-amber-500"
                />
                <div className="flex gap-1.5">
                  {[0, 1, 2, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setInjuredCount(n)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        injuredCount === n
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-slate-500">Individuals with visible trauma or wounds</span>
            </div>
          </div>

          {/* FIELD 5: MEDICAL ASSISTANCE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              MEDICAL ASSISTANCE <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMedicalEmergency(true)}
                className={`py-3.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  medicalEmergency
                    ? 'bg-rose-50 border-rose-300 text-rose-800 ring-2 ring-rose-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <span>YES — URGENT MEDICAL REQUIRED</span>
              </button>

              <button
                type="button"
                onClick={() => setMedicalEmergency(false)}
                className={`py-3.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  !medicalEmergency
                    ? 'bg-blue-50 border-blue-300 text-blue-800 ring-2 ring-blue-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>NO — STANDARD EVACUATION ONLY</span>
              </button>
            </div>
          </div>

          {/* FIELD 6: CURRENT DANGER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              CURRENT DANGER <span className="text-slate-400 text-[11px] font-normal">(Select all that apply)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {dangerOptions.map((opt) => {
                const selected = dangers.includes(opt.label);
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => toggleDanger(opt.label)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      selected
                        ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-base">{opt.emoji}</span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FIELD 7: ADDITIONAL INFORMATION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              ADDITIONAL INFORMATION
            </label>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none font-sans"
              placeholder="Provide specific notes (e.g. trapped on roof, children present, road access cut off, specific landmark)..."
            />
          </div>

          {/* FIELD 8: UPLOAD IMAGE (OPTIONAL) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                UPLOAD IMAGE <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <span className="text-[11px] text-slate-500">AI Visual Damage Triage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors cursor-pointer bg-slate-50">
                <Upload className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-slate-800">Click or drag image here</span>
                <span className="text-[10px] text-slate-500">Supports JPG, PNG up to 10MB</span>
              </div>

              {imagePreview && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-24 sm:h-auto">
                  <img src={imagePreview} alt="Damage Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 right-1 bg-white/90 px-2 py-0.5 rounded text-[9px] font-bold text-blue-700 shadow-sm">
                    ATTACHED
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC PRIORITY ENGINE PREVIEW */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shrink-0">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-blue-900 uppercase">
                  AI-Assisted Risk Engine • Live Prediction
                </div>
                <div className="text-[11px] text-slate-600">
                  Dynamic multi-variable analysis will score and classify priority immediately upon submission.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">EST. SEVERITY</span>
                <span className="text-xl font-black text-rose-700">{livePreview.score} / 100</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wider">
                {livePreview.priority}
              </div>
            </div>
          </div>

          {/* ====================================================
              SUBMIT BUTTON: 🔴 SEND EMERGENCY SOS
              ==================================================== */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-base tracking-widest uppercase shadow-2xl shadow-red-900/60 hover:shadow-red-700/80 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] border-2 border-red-400/80 cursor-pointer"
            >
              <span className="w-3.5 h-3.5 rounded-full bg-white animate-ping" />
              <span>🔴 SEND EMERGENCY SOS</span>
            </button>
          </div>
        </form>
      </div>

      {/* ====================================================
          2. SOS SUBMISSION PROCESSING MODAL (2-4 seconds)
          ==================================================== */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300 text-slate-800">
            {/* AI Core Animation */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-rose-200 border-t-rose-600 animate-spin" />
              <div
                className="absolute inset-2 rounded-full border-2 border-blue-200 border-b-blue-600 animate-spin"
                style={{ animationDirection: 'reverse' }}
              />
              <Cpu className="w-10 h-10 text-blue-600 animate-pulse" />
            </div>

            <div className="space-y-1 relative z-10">
              <span className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">
                TACTICAL EMERGENCY PIPELINE
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Dispatching Emergency Distress
              </h2>
            </div>

            {/* 3 Step Sequence Card */}
            <div className="space-y-3 text-left relative z-10">
              {/* Step 1: SOS RECEIVED */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                  processingStep >= 1
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs font-bold text-emerald-800 shrink-0">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">Step 1: SOS RECEIVED</div>
                  <div className="text-[11px] text-emerald-700">✓ Emergency report successfully received.</div>
                </div>
              </div>

              {/* Step 2: VERIFYING LOCATION */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                  processingStep >= 2
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    processingStep >= 2
                      ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                      : 'bg-slate-100 border border-slate-200 text-slate-400'
                  }`}
                >
                  {processingStep >= 2 ? '✓' : '2'}
                </div>
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">Step 2: VERIFYING LOCATION</div>
                  <div className={`text-[11px] ${processingStep >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {processingStep >= 2 ? '📍 Location confirmed.' : 'Triangulating GPS coordinates...'}
                  </div>
                </div>
              </div>

              {/* Step 3: ANALYZING EMERGENCY */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                  processingStep >= 3
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    processingStep >= 3
                      ? 'bg-blue-100 border border-blue-300 text-blue-700 animate-spin'
                      : 'bg-slate-100 border border-slate-200 text-slate-400'
                  }`}
                >
                  {processingStep >= 3 ? '⚙' : '3'}
                </div>
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">Step 3: ANALYZING EMERGENCY</div>
                  <div className={`text-[11px] ${processingStep >= 3 ? 'text-blue-700 font-semibold' : 'text-slate-400'}`}>
                    🤖 RescueAI AI engine analyzing severity...
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 relative z-10 pt-1">
              Synchronizing with NDRF Command Core • Calculating optimal response vectors
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
