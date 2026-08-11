import React from 'react';
import { ShieldCheck, Zap, Users, ShieldAlert, CheckCircle, Award, Scale } from 'lucide-react';
import { LeadershipAnalysis } from '../types';

interface LeadershipStyleCardProps {
  leadership: LeadershipAnalysis;
}

export const LeadershipStyleCard: React.FC<LeadershipStyleCardProps> = ({ leadership }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Leadership Archetype & Governance</h3>
            <p className="text-xs text-slate-400">Management approach, decision framework, and BNF leadership dimensions</p>
          </div>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold backdrop-blur-md self-start sm:self-auto">
          {leadership.styleName}
        </span>
      </div>

      {/* BNF Leadership Competencies Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {leadership.leadershipDevelopmentStage && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
              <Award className="w-3 h-3 text-indigo-400" /> Leadership Stage
            </span>
            <p className="text-xs font-bold text-white font-mono">{leadership.leadershipDevelopmentStage.replace(/_/g, ' ')}</p>
          </div>
        )}

        {leadership.executivePresenceLevel && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" /> Executive Presence
            </span>
            <p className="text-xs font-bold text-white font-mono">{leadership.executivePresenceLevel.replace(/_/g, ' ')}</p>
          </div>
        )}

        {leadership.conflictResolutionStyle && (
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
              <Scale className="w-3 h-3 text-purple-400" /> Conflict Resolution
            </span>
            <p className="text-xs font-bold text-white font-mono">{leadership.conflictResolutionStyle.replace(/_/g, ' ')}</p>
          </div>
        )}
      </div>

      {/* Decision Making & Management Approach */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1 backdrop-blur-md">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Decision-Making Framework
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
            {leadership.decisionMaking}
          </p>
        </div>

        <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1 backdrop-blur-md">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Management & Governance Approach
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
            {leadership.managementApproach}
          </p>
        </div>
      </div>

      {/* Team Culture Impact */}
      {leadership.teamCultureImpact && (
        <div className="p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs sm:text-sm text-slate-200 backdrop-blur-md">
          <div className="font-semibold text-emerald-300 mb-0.5">Team Culture & Org Footprint</div>
          <p className="text-slate-200">{leadership.teamCultureImpact}</p>
        </div>
      )}

      {/* Strengths Under Pressure vs Potential Blindspots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Strengths */}
        {leadership.strengthsUnderPressure && leadership.strengthsUnderPressure.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Key Strengths Under Crisis / Pressure
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {leadership.strengthsUnderPressure.map((str, idx) => (
                <li key={idx} className="flex items-start space-x-2 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Blindspots */}
        {leadership.potentialBlindspots && leadership.potentialBlindspots.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Potential Blind Spots or Governance Risks
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {leadership.potentialBlindspots.map((spot, idx) => (
                <li key={idx} className="flex items-start space-x-2 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                  <span>{spot}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
