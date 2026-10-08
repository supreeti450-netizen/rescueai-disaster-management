import React, { useState, useEffect, useRef } from 'react';
import { useRescue } from '../../context/RescueContext';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Radio, 
  Zap, 
  RotateCcw,
  User, 
  Menu, 
  X,
  Search,
  Bell,
  CheckCircle2,
  ChevronDown,
  Building2,
  Ambulance,
  Home,
  Users,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { 
    soundEnabled, 
    toggleSound, 
    triggerFloodDemo, 
    resetDemo,
    alerts, 
    emergencies,
    rescueTeams,
    hospitals,
    shelters,
    notifications,
    unreadNotificationCount,
    markAllNotificationsRead
  } = useRescue();

  const [zuluTime, setZuluTime] = useState<string>('');
  const [localTime, setLocalTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setZuluTime(now.toISOString().substring(11, 19) + 'Z');
      setLocalTime(now.toLocaleTimeString([], { hour12: false }));
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResultsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isResponderRoute = [
    '/dashboard',
    '/emergencies',
    '/victims',
    '/map',
    '/rescue-teams',
    '/operations',
    '/hospitals',
    '/shelters',
    '/resources',
    '/alerts',
    '/ai-insights',
    '/analytics',
    '/settings',
  ].some((p) => currentPath.startsWith(p));

  const activeCriticalAlert = alerts.find((a) => a.severity === 'CRITICAL' && a.active);

  // Global search matching across entities (Part 9)
  const searchResults = React.useMemo(() => {
    if (!searchVal.trim() || searchVal.length < 2) return [];
    const q = searchVal.toLowerCase();
    const results: { type: string; label: string; sub: string; path: string }[] = [];

    // Emergencies
    emergencies.forEach((em) => {
      if (em.id.toLowerCase().includes(q) || em.location.address.toLowerCase().includes(q) || em.disasterType.toLowerCase().includes(q)) {
        results.push({
          type: 'EMERGENCY',
          label: `#${em.id} - ${em.disasterType}`,
          sub: `${em.priority} • ${em.location.address} (${em.peopleAffected} affected)`,
          path: `/emergencies?id=${em.id}`
        });
      }
    });

    // Victims
    emergencies.forEach((em) => {
      if (em.contactName && em.contactName.toLowerCase().includes(q)) {
        results.push({
          type: 'VICTIM',
          label: em.contactName,
          sub: `Distress Caller • Incident #${em.id} • ${em.contactPhone || 'No Phone'}`,
          path: `/victims`
        });
      }
    });

    // Teams
    rescueTeams.forEach((t) => {
      if (t.id.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.callSign.toLowerCase().includes(q)) {
        results.push({
          type: 'TEAM',
          label: `${t.id} - ${t.callSign}`,
          sub: `${t.name} • Status: ${t.status} • ${t.currentLocation.address}`,
          path: `/rescue-teams`
        });
      }
    });

    // Hospitals
    hospitals.forEach((h) => {
      if (h.name.toLowerCase().includes(q) || h.location.address.toLowerCase().includes(q)) {
        results.push({
          type: 'HOSPITAL',
          label: h.name,
          sub: `${h.status} • ${h.availableBeds} beds available • ICU: ${h.availableIcu}`,
          path: `/hospitals`
        });
      }
    });

    // Shelters
    shelters.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.location.address.toLowerCase().includes(q)) {
        results.push({
          type: 'SHELTER',
          label: s.name,
          sub: `${s.status} • Capacity: ${s.availableCapacity}/${s.capacity} available`,
          path: `/shelters`
        });
      }
    });

    return results.slice(0, 6);
  }, [searchVal, emergencies, rescueTeams, hospitals, shelters]);

  const handleDemoClick = () => {
    triggerFloodDemo();
    if (isResponderRoute) {
      navigate('/dashboard');
    } else {
      navigate('/ai-analysis?id=RA-1024');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 shadow-xs">
      {/* Top Incident Advisory Ticker */}
      {activeCriticalAlert && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-1.5 text-xs text-red-900 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
            </span>
            <span className="font-bold tracking-wider text-red-700 uppercase text-[10px] shrink-0 font-mono">
              ACTIVE DISASTER BROADCAST:
            </span>
            <span className="truncate text-red-900 font-medium text-xs">
              {activeCriticalAlert.title} — {activeCriticalAlert.message}
            </span>
          </div>
          <button 
            onClick={() => navigate('/alerts')} 
            className="text-[11px] font-semibold text-red-700 hover:text-red-900 underline shrink-0 ml-3 cursor-pointer"
          >
            Directives
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Mode Identification */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(isResponderRoute ? '/dashboard' : '/')} 
            className="flex items-center gap-2.5 text-left group shrink-0 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900">
                  Rescue<span className="text-blue-600">AI</span>
                </span>
                <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-md font-bold">
                  {isResponderRoute ? 'COMMAND' : 'CITIZEN'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                {isResponderRoute ? 'Disaster Command Center' : 'Civilian Distress Portal'}
              </p>
            </div>
          </button>

          {/* Current Disaster Status Pill */}
          {isResponderRoute && (
            <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
              </span>
              <div className="text-[11px] leading-tight">
                <span className="text-red-700 font-bold uppercase block font-mono">ACTIVE DISASTER</span>
                <span className="text-slate-700 text-[10px]">FLOOD OPERATION • SECTOR 14</span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Global Search Bar in Responder Mode (Part 9) */}
        {isResponderRoute ? (
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-2 relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  setSearchResultsOpen(true);
                }}
                onFocus={() => setSearchResultsOpen(true)}
                placeholder="Search emergency #ID, victim, team, hospital, or sector..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Global Search Results Dropdown */}
            {searchResultsOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in">
                <div className="text-[10px] font-mono uppercase font-bold text-slate-400 px-2 py-1">
                  MATCHING OPERATIONAL ENTITIES
                </div>
                {searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      navigate(res.path);
                      setSearchResultsOpen(false);
                      setSearchVal('');
                    }}
                    className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{res.label}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                          {res.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{res.sub}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">Overview</button>
            <button onClick={() => navigate('/report-emergency')} className="hover:text-blue-600 transition-colors">Report Emergency</button>
            <button onClick={() => navigate('/sos')} className="hover:text-blue-600 transition-colors text-red-600 font-bold">1-Tap SOS</button>
            <button onClick={() => navigate('/alerts')} className="hover:text-blue-600 transition-colors">Public Advisories</button>
          </div>
        )}

        {/* Right Section: Telemetry, Global Demo & Notification Center */}
        <div className="flex items-center gap-2.5">
          {/* Zulu & Local Clocks */}
          <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600">
            <span className="font-semibold">{localTime} IST</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">{zuluTime}</span>
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Alert Sound FX' : 'Enable Audio Feedback'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Part 10: Notification Center */}
          {isResponderRoute && (
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 relative transition-colors cursor-pointer"
                title="Operational Notifications"
              >
                <Bell className="w-4 h-4 text-slate-700" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900">NOTIFICATIONS</span>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border transition-all ${
                          n.read ? 'bg-slate-50/60 border-slate-100' : 'bg-blue-50/40 border-blue-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 text-[11px] flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              n.type === 'critical' ? 'bg-red-500' : n.type === 'team' ? 'bg-blue-500' : 'bg-amber-500'
                            }`} />
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Part 12: RESET DEMO BUTTON */}
          {isResponderRoute && (
            <button
              onClick={resetDemo}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors items-center gap-1.5 cursor-pointer"
              title="Reset prototype to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>RESET DEMO</span>
            </button>
          )}

          {/* Part 11: GLOBAL DEMO MODE BUTTON */}
          <button
            onClick={handleDemoClick}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Load Sector 14 Flood Scenario"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-yellow-300 animate-bounce" />
            <span>DEMO MODE</span>
          </button>

          {/* Switch to Civilian / Responder Portal */}
          <button
            onClick={() => navigate(isResponderRoute ? '/report-emergency' : '/dashboard')}
            className="hidden md:flex px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            {isResponderRoute ? 'Citizen Portal' : 'Command Center'}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3">
          <button
            onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700"
          >
            Citizen Home
          </button>
          <button
            onClick={() => { navigate('/report-emergency'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700"
          >
            Report Emergency
          </button>
          <button
            onClick={() => { navigate('/sos'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm font-bold text-red-600"
          >
            1-Tap Emergency SOS
          </button>
          <button
            onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm font-bold text-blue-600"
          >
            Command Center
          </button>
        </div>
      )}
    </header>
  );
};
