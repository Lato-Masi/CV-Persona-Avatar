import React from 'react';
import { Layers, Tag } from 'lucide-react';
import { ProfileSkillCategory } from '../types';

interface SkillsCardProps {
  skills: ProfileSkillCategory[];
}

export const SkillsCard: React.FC<SkillsCardProps> = ({ skills }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl p-6 space-y-4">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Core Skills & Domain Expertise</h3>
          <p className="text-xs text-slate-400">Categorized competencies and technical strengths</p>
        </div>
      </div>

      <div className="space-y-4">
        {skills.map((cat, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-emerald-400" />
              {cat.category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 hover:border-indigo-400/40 text-slate-200 border border-white/10 backdrop-blur-md transition"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
