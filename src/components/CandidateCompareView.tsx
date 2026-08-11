import React, { useState } from 'react';
import { Scale, X, ArrowRight, UserCheck, ShieldCheck, Brain, Briefcase } from 'lucide-react';
import { ProfileAnalysisResult } from '../types';

interface CandidateCompareViewProps {
  currentProfile: ProfileAnalysisResult;
  allHistory: ProfileAnalysisResult[];
  onClose: () => void;
}

export const CandidateCompareView: React.FC<CandidateCompareViewProps> = ({
  currentProfile,
  allHistory,
  onClose,
}) => {
  // Candidate A is currentProfile. Candidate B is chosen by user or first history item
  const otherProfiles = allHistory.filter((p) => p.id !== currentProfile.id);
  const [candidateBId, setCandidateBId] = useState<string>(otherProfiles[0]?.id || '');

  const candidateB = allHistory.find((p) => p.id === candidateBId);

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Executive Candidate Comparison</h2>
            <p className="text-xs text-slate-400">Side-by-side analysis of experience, archetype, and leadership style</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Select Candidate B dropdown if multiple profiles exist */}
      {otherProfiles.length > 0 ? (
        <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/10 text-xs backdrop-blur-md">
          <span className="font-semibold text-slate-300">Compare {currentProfile.profile.name} against:</span>
          <select
            value={candidateBId}
            onChange={(e) => setCandidateBId(e.target.value)}
            className="flex-1 bg-slate-900/90 border border-white/10 rounded-lg px-3 py-1.5 font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {otherProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.profile.name} ({p.profile.currentTitle} at {p.profile.company})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center justify-between backdrop-blur-md">
          <span>Analyze or select a second sample profile to compare against {currentProfile.profile.name}.</span>
        </div>
      )}

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Candidate A Column */}
        <div className="space-y-4 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-bold text-lg flex items-center justify-center shadow-lg">
              {currentProfile.profile.avatarInitials}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Candidate A</span>
              <h3 className="text-base font-bold text-white">{currentProfile.profile.name}</h3>
              <p className="text-xs text-slate-400">{currentProfile.profile.currentTitle} at {currentProfile.profile.company}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Primary Archetype</span>
              <span className="font-bold text-white text-sm">{currentProfile.personalitySpeculation.primaryArchetype}</span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Leadership Style</span>
              <span className="font-bold text-emerald-400">{currentProfile.leadershipStyle.styleName}</span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Risk Profile</span>
              <span className="text-slate-200 font-medium">{currentProfile.personalitySpeculation.riskProfile}</span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Experience Highlights</span>
              <ul className="space-y-1 text-slate-300">
                {currentProfile.experienceSummary.slice(0, 3).map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Candidate B Column */}
        {candidateB ? (
          <div className="space-y-4 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold text-lg flex items-center justify-center shadow-lg">
                {candidateB.profile.avatarInitials}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Candidate B</span>
                <h3 className="text-base font-bold text-white">{candidateB.profile.name}</h3>
                <p className="text-xs text-slate-400">{candidateB.profile.currentTitle} at {candidateB.profile.company}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Primary Archetype</span>
                <span className="font-bold text-white text-sm">{candidateB.personalitySpeculation.primaryArchetype}</span>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Leadership Style</span>
                <span className="font-bold text-emerald-400">{candidateB.leadershipStyle.styleName}</span>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Risk Profile</span>
                <span className="text-slate-200 font-medium">{candidateB.personalitySpeculation.riskProfile}</span>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Experience Highlights</span>
                <ul className="space-y-1 text-slate-300">
                  {candidateB.experienceSummary.slice(0, 3).map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-dashed border-white/20 text-center space-y-2 backdrop-blur-md">
            <UserCheck className="w-8 h-8 text-slate-400" />
            <h4 className="text-sm font-semibold text-slate-300">No Candidate B Selected</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Select or analyze another profile to perform a side-by-side comparative leadership evaluation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
