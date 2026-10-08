import React, { useState } from 'react';
import { useRescue } from '../context/RescueContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import {
  Sparkles,
  Cpu,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Boxes,
  Building2,
  Navigation,
  Activity,
  Layers,
  Zap,
  Check
} from 'lucide-react';

interface AIInsightsPageProps {
  navigate: (path: string) => void;
}

export const AIInsightsPage: React.FC<AIInsightsPageProps> = ({ navigate }) => {
  const { 
    deployCommandRecommendation, 
    optimizeResourceShortage,
    addToast,
    addActivityEvent 
  } = useRescue();

  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({});

  const handleApply = (id: string, actionName: string, executeFn?: () => void) => {
    if (executeFn) executeFn();
    setAppliedActions(prev => ({ ...prev, [id]: true }));
    addToast('AI Recommendation Applied', `Executed: ${actionName}`, 'success');
    addActivityEvent({
      time: 'Just now',
      icon: '🤖',
      message: `AI Directive Applied: ${actionName}`,
      type: 'system'
    });
  };

  const insights = [
    {
      id: 'INS-01',
      category: 'CLUSTER ANALYSIS',
      title: 'CRITICAL CLUSTER DETECTED',
      description: 'Sector 14 has the highest concentration of critical emergencies.',
      recommendation: 'Deploy 2 additional rescue teams to Sector 14.',
      confidence: 96,
      priority: 'CRITICAL' as const,
      reason: 'Spatial regression model identified 4 rapid water elevation reports in a 600m radius with 8 trapped victims.',
      actionText: 'DEPLOY 2 RESCUE TEAMS',
      onAction: () => deployCommandRecommendation(),
      icon: AlertTriangle,
      color: 'red'
    },
    {
      id: 'INS-02',
      category: 'INVENTORY RISK',
      title: 'RESOURCE RISK',
      description: 'Medical kit inventory may fall below operational requirements.',
      recommendation: 'Reallocate 10 medical kits from Sector 18 to Sector 14.',
      confidence: 92,
      priority: 'HIGH' as const,
      reason: 'Projected demand in Sector 14 is 94 trauma packs within 2 hours, while local field cache currently holds 86.',
      actionText: 'REALLOCATE 10 KITS',
      onAction: () => optimizeResourceShortage('SHORT-01'),
      icon: Boxes,
      color: 'orange'
    },
    {
      id: 'INS-03',
      category: 'MEDICAL RECEIVING',
      title: 'HOSPITAL CAPACITY',
      description: 'Civil Hospital currently has sufficient capacity for incoming critical cases.',
      recommendation: 'Route primary trauma patients to Civil Hospital (18 beds, 4 ICU open).',
      confidence: 89,
      priority: 'MODERATE' as const,
      reason: 'Apex Institute is nearing critical ventilator saturation; Civil Hospital maintains 42% surplus reserve.',
      actionText: 'LOCK CIVIL HOSPITAL INGESTION',
      onAction: () => {},
      icon: Building2,
      color: 'blue'
    },
    {
      id: 'INS-04',
      category: 'EXTRACTION CORRIDOR',
      title: 'ROUTE RISK',
      description: 'Fastest route to RA-1024 passes through a high-risk flood zone.',
      recommendation: 'Use alternate low-risk route via Elevated Bypass 4B.',
      confidence: 95,
      priority: 'CRITICAL' as const,
      reason: 'Submerged Underpass 14 water depth is 2.1m (+0.4m in 15m), posing catastrophic hydro-stall risk.',
      actionText: 'ENFORCE SAFE ROUTE',
      onAction: () => navigate('/map'),
      icon: Navigation,
      color: 'emerald'
    }
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-7 min-h-[calc(100vh-4rem)]">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold">
              NEURAL SITUATIONAL AWARENESS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            RescueAI Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            AI-assisted insights for faster disaster-response decisions.
          </p>
        </div>

        {/* Telemetry counters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs text-slate-700">
            Inference: <strong className="text-blue-600">42ms</strong>
          </div>
          <div className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs text-slate-700">
            Confidence Avg: <strong className="text-emerald-600">93.4%</strong>
          </div>
        </div>
      </div>

      {/* Top 4 Insight Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-bold">ACTIVE MODELS</div>
          <div className="text-2xl font-black text-slate-900 mt-1">4 Neural Pods</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">✓ Multi-stream inference active</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-bold">SECTOR HOTSPOT</div>
          <div className="text-2xl font-black text-red-600 mt-1">Sector 14</div>
          <div className="text-[11px] text-slate-500 mt-1">Density index: 8.8 / 10</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-bold">SUPPLY REBALANCING</div>
          <div className="text-2xl font-black text-amber-600 mt-1">1 Critical Needed</div>
          <div className="text-[11px] text-slate-500 mt-1">10 Kits Sector 18 → 14</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-bold">ROUTING BYPASS</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">Bypass 4B</div>
          <div className="text-[11px] text-slate-500 mt-1">Avoids 2.1m submerged pool</div>
        </div>
      </div>

      {/* 4 Main Insight Cards */}
      <div className="space-y-4">
        <div className="text-xs font-mono uppercase font-bold text-slate-500 tracking-wider">
          TACTICAL REAL-TIME DIRECTIVES
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {insights.map((item) => {
            const isApplied = appliedActions[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Header: Category + Badges */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {item.category}
                      </span>
                      <PriorityBadge priority={item.priority} size="sm" />
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      AI Confidence: <strong className="text-blue-600">{item.confidence}%</strong>
                    </span>
                  </div>

                  {/* Title & Core Description */}
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span>{item.title}</span>
                    </h3>
                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      "{item.description}"
                    </p>
                  </div>

                  {/* Scientific Reasoning */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed font-sans">
                    <strong className="block text-slate-800 text-[11px] uppercase font-mono mb-0.5">Telemetry Rationale:</strong>
                    {item.reason}
                  </div>

                  {/* Recommendation Directive */}
                  <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-xs text-blue-900 font-medium">
                    <strong className="block text-blue-700 text-[10px] uppercase font-mono font-bold mb-0.5">
                      RECOMMENDED ACTION:
                    </strong>
                    "{item.recommendation}"
                  </div>
                </div>

                {/* Action Trigger Button */}
                <div className="pt-2">
                  <button
                    disabled={isApplied}
                    onClick={() => handleApply(item.id, item.actionText, item.onAction)}
                    className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isApplied
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-98'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>✓ DIRECTIVE EXECUTED</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-current text-yellow-300" />
                        <span>[ {item.actionText} ]</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
