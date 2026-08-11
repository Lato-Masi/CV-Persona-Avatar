import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import { GroundingSource } from '../types';

interface GroundingSourcesCardProps {
  sources?: GroundingSource[];
}

export const GroundingSourcesCard: React.FC<GroundingSourcesCardProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-5 space-y-3 shadow-2xl">
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
        <Globe className="w-4 h-4 text-emerald-400" />
        <span>Verified Public Search Grounding Sources ({sources.length})</span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {sources.map((src, idx) => (
          <a
            key={idx}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-indigo-300 hover:border-indigo-400/40 backdrop-blur-md transition max-w-xs truncate"
          >
            <span className="truncate">{src.title}</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};
