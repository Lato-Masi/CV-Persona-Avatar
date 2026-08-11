import React from 'react';
import { ThumbsUp, Quote } from 'lucide-react';

interface EndorsementsCardProps {
  endorsementsInferences: string[];
}

export const EndorsementsCard: React.FC<EndorsementsCardProps> = ({ endorsementsInferences }) => {
  if (!endorsementsInferences || endorsementsInferences.length === 0) return null;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl p-6 space-y-4">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
          <ThumbsUp className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Endorsements & Recommendation Signals</h3>
          <p className="text-xs text-slate-400">Inferences drawn from skill commendations and peer validations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {endorsementsInferences.map((inf, idx) => (
          <div key={idx} className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-start space-x-2.5 text-xs text-slate-200 backdrop-blur-md">
            <Quote className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{inf}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
