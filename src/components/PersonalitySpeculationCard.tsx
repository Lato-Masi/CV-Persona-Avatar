import React from 'react';
import { Brain, Sparkles, Compass, AlertCircle, MessageSquare, ShieldAlert, Heart, Layers, Target, Users } from 'lucide-react';
import { PersonalityAnalysis } from '../types';

interface PersonalitySpeculationCardProps {
  personality: PersonalityAnalysis;
}

export const PersonalitySpeculationCard: React.FC<PersonalitySpeculationCardProps> = ({ personality }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Personality Profile & BNF Framework</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">
                Speculative AI Analysis
              </span>
            </h3>
            <p className="text-xs text-slate-400">Inferred from career trajectory, role transitions, and credentials</p>
          </div>
        </div>

        {/* Primary Archetype Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold self-start sm:self-auto backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{personality.primaryArchetype}</span>
        </div>
      </div>

      {/* BNF Core Personality Framework Badges (Myers-Briggs, Enneagram, Team Role) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {personality.myersBriggs && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
              <Target className="w-3 h-3 text-indigo-400" /> Myers-Briggs
            </span>
            <p className="text-xs font-bold text-white font-mono">{personality.myersBriggs.replace('_', ' - ')}</p>
          </div>
        )}

        {personality.enneagram && (
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
              <Layers className="w-3 h-3 text-purple-400" /> Enneagram Core
            </span>
            <p className="text-xs font-bold text-white font-mono">{personality.enneagram.replace('wing_', 'w/ Wing ').replace('Type_', 'Type ')}</p>
          </div>
        )}

        {personality.teamRole && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-400" /> BNF Team Role
            </span>
            <p className="text-xs font-bold text-white font-mono">{personality.teamRole.replace(/_/g, ' ')}</p>
          </div>
        )}
      </div>

      {/* Big Five Breakdown if present */}
      {personality.bigFive && (
        <div className="p-4 bg-slate-900/60 rounded-xl border border-white/10 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Big Five Trait Spectrum
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Openness</div>
              <div className="font-mono font-bold text-amber-300 mt-0.5">{personality.bigFive.openness}</div>
            </div>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Conscientiousness</div>
              <div className="font-mono font-bold text-indigo-300 mt-0.5">{personality.bigFive.conscientiousness}</div>
            </div>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Extraversion</div>
              <div className="font-mono font-bold text-emerald-300 mt-0.5">{personality.bigFive.extraversion}</div>
            </div>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Agreeableness</div>
              <div className="font-mono font-bold text-purple-300 mt-0.5">{personality.bigFive.agreeableness}</div>
            </div>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Neuroticism</div>
              <div className="font-mono font-bold text-rose-300 mt-0.5">{personality.bigFive.neuroticism}</div>
            </div>
          </div>
        </div>
      )}

      {/* Overview Speculative Summary */}
      <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed backdrop-blur-md">
        <p className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-amber-400" />
          Personality Speculation Synthesis
        </p>
        <p className="text-slate-200">{personality.speculativeSummary}</p>
      </div>

      {/* Core Traits Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Inferred Trait Signals</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {personality.coreTraits.map((trait, idx) => (
            <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{trait.trait}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    trait.level === 'High'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : trait.level === 'Moderate'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                  }`}
                >
                  {trait.level}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">{trait.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Communication & Risk Profile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1 backdrop-blur-md">
          <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            Communication Style {personality.communicationPreference ? `(${personality.communicationPreference.replace(/_/g, ' ')})` : ''}
          </div>
          <p className="text-slate-300">{personality.communicationStyle}</p>
        </div>

        <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1 backdrop-blur-md">
          <div className="font-semibold text-rose-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Risk Tolerance Profile
          </div>
          <p className="text-slate-300">{personality.riskProfile}</p>
        </div>
      </div>

      {/* Motivators */}
      {personality.keyMotivators && personality.keyMotivators.length > 0 && (
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-rose-400" />
            Key Motivators & Drivers
          </h4>
          <div className="flex flex-wrap gap-2">
            {personality.keyMotivators.map((motivator, idx) => (
              <span key={idx} className="text-xs px-2.5 py-1 bg-white/5 text-slate-200 rounded-xl border border-white/10 font-medium backdrop-blur-md">
                {motivator}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Speculative Disclaimer */}
      <div className="flex items-start space-x-2 text-[11px] text-slate-400 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-300">Disclaimer:</strong> Personality traits are speculative AI inferences generated from publicly observable career moves, organization tenures, and skill endorsements mapped against the BNF Personality Framework.
        </span>
      </div>
    </div>
  );
};
