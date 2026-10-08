import React from 'react';
import { useRescue } from '../../context/RescueContext';
import { AlertTriangle, CheckCircle2, Info, X, ShieldAlert } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useRescue();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isCritical = toast.type === 'critical';
        const isWarning = toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        let borderClass = 'border-slate-200 bg-white text-slate-800 shadow-lg border-l-4 border-l-blue-600';
        let icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;

        if (isCritical) {
          borderClass = 'border-rose-200 bg-white text-slate-800 shadow-lg border-l-4 border-l-rose-600';
          icon = <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 animate-pulse" />;
        } else if (isWarning) {
          borderClass = 'border-amber-200 bg-white text-slate-800 shadow-lg border-l-4 border-l-amber-500';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
        } else if (isSuccess) {
          borderClass = 'border-emerald-200 bg-white text-slate-800 shadow-lg border-l-4 border-l-emerald-600';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border p-3.5 flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm tracking-wide text-slate-900 flex items-center justify-between">
                <span>{toast.title}</span>
                <span className="text-[10px] text-slate-400 font-mono font-normal">
                  {toast.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <p className="text-xs mt-0.5 text-slate-600 leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
