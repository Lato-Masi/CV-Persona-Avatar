import React, { useState } from 'react';
import { Bot, Copy, Check, Play, Sparkles, Terminal, ShieldCheck, Zap, Sliders } from 'lucide-react';
import { ProfileAnalysisResult } from '../types';

interface SimulationAvatarCardProps {
  data: ProfileAnalysisResult;
  onOpenSandbox: () => void;
  onOpenEditor?: () => void;
}

export const SimulationAvatarCard: React.FC<SimulationAvatarCardProps> = ({ data, onOpenSandbox, onOpenEditor }) => {
  const [copied, setCopied] = useState(false);

  const promptText = data.personalitySpeculation.simulationAvatarPrompt || '';

  const handleCopy = () => {
    if (!promptText) return;
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-indigo-500/30 shadow-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 border border-indigo-400/40 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Behavioral Simulation Avatar Prompt</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Multi-Agent Ready
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Concise system prompt for LLMs (Gemini, Claude, ChatGPT, AutoGen) to simulate this persona in group activities
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onOpenEditor && (
            <button
              type="button"
              onClick={onOpenEditor}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-semibold backdrop-blur-md transition shadow-md"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-300" />
              <span>Edit Persona & Methods</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 text-xs font-semibold backdrop-blur-md transition shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied Prompt!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-300" />
                <span>Copy System Prompt</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSandbox}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/25 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Launch Group Simulation</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
          <span className="text-[10px] font-bold text-indigo-300 uppercase">Decision Biases</span>
          <p className="text-slate-200 font-medium truncate">{data.personalitySpeculation.riskProfile || 'Calculated Risk'}</p>
        </div>
        <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
          <span className="text-[10px] font-bold text-purple-300 uppercase">Cognitive Stance</span>
          <p className="text-slate-200 font-medium truncate">{data.personalitySpeculation.primaryArchetype || 'Strategic Leader'}</p>
        </div>
        <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
          <span className="text-[10px] font-bold text-emerald-300 uppercase">Group Role</span>
          <p className="text-slate-200 font-medium truncate">{data.personalitySpeculation.teamRole?.replace(/_/g, ' ') || 'Task Leader'}</p>
        </div>
        <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
          <span className="text-[10px] font-bold text-amber-300 uppercase">Vocabulary & Tone</span>
          <p className="text-slate-200 font-medium truncate">{data.personalitySpeculation.communicationPreference?.replace(/_/g, ' ') || 'Strategic'}</p>
        </div>
      </div>

      {/* Prompt Display Terminal Box */}
      <div className="relative bg-slate-950/90 rounded-2xl border border-indigo-500/30 overflow-hidden shadow-inner">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/10 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-300">system_prompt.txt</span>
            <span className="text-[10px] text-slate-500">({data.profile.name} Persona)</span>
          </div>
          <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
            <ShieldCheck className="w-3 h-3" /> Ready for API/Agent Injection
          </span>
        </div>

        <div className="p-4 max-h-64 overflow-y-auto font-mono text-xs text-indigo-200 whitespace-pre-wrap leading-relaxed select-all">
          {promptText}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            This prompt guarantees true-to-life behavior, speech patterns, and problem-solving biases during group interactions.
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenSandbox}
          className="text-xs font-bold text-indigo-300 hover:text-white underline shrink-0 ml-2"
        >
          Test in Group Activity →
        </button>
      </div>
    </div>
  );
};
