import React from 'react';
import { Briefcase, CheckCircle2, TrendingUp } from 'lucide-react';

interface ExperienceSummaryCardProps {
  experienceBullets: string[];
}

export const ExperienceSummaryCard: React.FC<ExperienceSummaryCardProps> = ({ experienceBullets }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Professional Experience Summary</h3>
            <p className="text-xs text-slate-400">Concise overview of career progression and key milestones</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          {experienceBullets.length} Milestones
        </span>
      </div>

      <ul className="space-y-3">
        {experienceBullets.map((bullet, idx) => (
          <li key={idx} className="flex items-start space-x-3 text-sm text-slate-200 leading-relaxed group">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1 group-hover:scale-110 transition-transform" />
            <div className="flex-1 bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition backdrop-blur-md">
              {bullet}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
