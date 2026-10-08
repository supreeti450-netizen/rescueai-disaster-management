import React from 'react';
import { Shield, PhoneCall, Radio, HeartHandshake, ExternalLink } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Purpose */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight">RescueAI</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            AI-powered unified emergency response & disaster rescue coordination platform. Serving disaster authorities, hospitals, first responders, and citizens.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-blue-700 font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>DISASTER NET PROTOCOL v4.2 • SECURE ACTIVE</span>
          </div>
        </div>

        {/* Emergency Hotlines */}
        <div className="space-y-2.5">
          <h4 className="text-slate-900 font-bold tracking-wider uppercase text-[11px] flex items-center gap-1.5 font-mono">
            <PhoneCall className="w-3.5 h-3.5 text-red-600" />
            Emergency Direct Hotlines
          </h4>
          <ul className="space-y-1.5 font-mono text-slate-700 text-xs">
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span>National Disaster Helpline:</span>
              <span className="text-red-600 font-bold">1078 / 112</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span>NDRF Control Room:</span>
              <span className="text-blue-600 font-bold">011-24363260</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span>Medical Emergency / Ambulance:</span>
              <span className="text-emerald-600 font-bold">108 / 102</span>
            </li>
            <li className="flex justify-between">
              <span>RescueAI Satellite Uplink:</span>
              <span className="text-amber-700 font-bold">SAT-NET #09</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-2.5">
          <h4 className="text-slate-900 font-bold tracking-wider uppercase text-[11px] flex items-center gap-1.5 font-mono">
            <Radio className="w-3.5 h-3.5 text-blue-600" />
            Quick Portals
          </h4>
          <ul className="space-y-1.5 text-slate-600">
            <li>
              <button onClick={() => navigate('/sos')} className="text-red-600 font-semibold hover:underline">
                1-Tap Emergency SOS
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/report-emergency')} className="hover:text-blue-600">
                Citizen Incident Report
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600">
                Command Center Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/map')} className="hover:text-blue-600">
                Live Disaster Map
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/shelters')} className="hover:text-blue-600">
                Evacuation Shelters
              </button>
            </li>
          </ul>
        </div>

        {/* System & Protocols */}
        <div className="space-y-2.5">
          <h4 className="text-slate-900 font-bold tracking-wider uppercase text-[11px] flex items-center gap-1.5 font-mono">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
            Inter-Agency Coordination
          </h4>
          <p className="text-slate-500 text-xs leading-relaxed">
            Integrated with National Disaster Response Force (NDRF), State Disaster Management Authority (SDMA), and municipal health services.
          </p>
          <div className="text-[11px] text-slate-400 pt-1">
            © 2026 RescueAI Technologies. All systems operational.
          </div>
        </div>
      </div>
    </footer>
  );
};
