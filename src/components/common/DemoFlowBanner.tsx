import React from 'react';
import { Sparkles, Award } from 'lucide-react';

interface DemoFlowBannerProps {
  currentStep: number;
  onNavigateStep: (step: number) => void;
  onOpenAssessment: () => void;
}

export const DemoFlowBanner: React.FC<DemoFlowBannerProps> = ({
  currentStep,
  onNavigateStep,
  onOpenAssessment,
}) => {
  const steps = [
    { number: 1, title: '1. Skill Assessment', desc: 'Calibrate estimated skill level 1–5', tab: 'profile' },
    { number: 2, title: '2. Profile Updated', desc: 'View assessed vs self-reported skills', tab: 'profile' },
    { number: 3, title: '3. Project Requirements', desc: 'Inspect project skills & min levels', tab: 'projects' },
    { number: 4, title: '4. Deterministic Match', desc: 'Rank candidates by multi-factor score', tab: 'matches' },
    { number: 5, title: '5. Why Match & Message', desc: 'View match reasoning & send message', tab: 'messages' },
    { number: 6, title: '6. Team Dashboard', desc: 'Audit team coverage & gap detector', tab: 'team' },
    { number: 7, title: '7. Find Missing Skill', desc: 'Filter recommendations for gaps', tab: 'matches' },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 py-2 shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-bold shrink-0 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Demo Guide:</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {steps.map(s => {
              const isCurrent = currentStep === s.number;
              const isPast = currentStep > s.number;

              return (
                <button
                  key={s.number}
                  onClick={() => onNavigateStep(s.number)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all ${
                    isCurrent
                      ? 'bg-brand-600 text-white font-bold shadow-2xs'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-medium">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => onOpenAssessment()}
          className="shrink-0 hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
        >
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          Test React / Python
        </button>
      </div>
    </div>
  );
};
