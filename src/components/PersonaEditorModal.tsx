import React, { useState } from 'react';
import { X, Save, RefreshCw, Sparkles, Sliders, User, Brain, Shield, MessageSquare, Briefcase, CheckCircle2 } from 'lucide-react';
import { ProfileAnalysisResult, PersonalityTrait } from '../types';
import { generateAvatarSystemPrompt } from '../utils/promptGenerator';

interface PersonaEditorModalProps {
  data: ProfileAnalysisResult;
  onSave: (updatedData: ProfileAnalysisResult) => void;
  onClose: () => void;
}

const ARCHETYPE_OPTIONS = [
  'Strategic Leader',
  'Technical Architect & Systems Thinker',
  'Growth Strategist & Scaler',
  'Product Visionary & User Champion',
  'Operational Scale Master',
  'Innovation Inventor & R&D Lead',
  'Legal, Risk & Governance Lead',
  'Agile Executioner & Operator',
  'Analytical Researcher & Data Specialist'
];

const RISK_PROFILE_OPTIONS = [
  'Calculated & Analytical Risk',
  'High-Growth Aggressive Risk-Taking',
  'Balanced & Evidence-Based',
  'Conservative & Risk-Averse',
  'Experimental & Risk-Tolerant',
  'Governance & Compliance Focused'
];

const TEAM_ROLE_OPTIONS = [
  'Task & Goal Leader',
  'Innovator & Ideator',
  'Skeptic & Risk Auditor',
  'Harmonizer & Team Builder',
  'Executive Facilitator & Driver',
  'Technical Specialist & Advisor'
];

const COMMUNICATION_OPTIONS = [
  'Direct & Concise',
  'Data-Driven & Formal',
  'Socratic & Questioning',
  'Inspirational & Storytelling',
  'Collaborative & Empathetic',
  'Pragmatic & Execution-Oriented'
];

const LEADERSHIP_STYLE_OPTIONS = [
  'Adaptive Leadership',
  'Visionary & Transformational',
  'Servant Leadership',
  'Pacesetting & Execution-Focused',
  'Democratic & Consensus-Driven',
  'Strategic & Analytical'
];

const DECISION_MAKING_OPTIONS = [
  'Evidence-based & Metric-driven',
  'Intuitive & Fast-paced',
  'Consensus-driven & Inclusive',
  'Risk-averse & Precedent-based',
  'Hypothesis-driven & Experimental'
];

export const PersonaEditorModal: React.FC<PersonaEditorModalProps> = ({ data, onSave, onClose }) => {
  // Profile fields
  const [name, setName] = useState(data.profile.name || '');
  const [title, setTitle] = useState(data.profile.currentTitle || '');
  const [company, setCompany] = useState(data.profile.company || '');
  const [industry, setIndustry] = useState(data.profile.industry || '');

  // Personality & Behavioral Dropdown Method Selections
  const [primaryArchetype, setPrimaryArchetype] = useState(data.personalitySpeculation.primaryArchetype || ARCHETYPE_OPTIONS[0]);
  const [riskProfile, setRiskProfile] = useState(data.personalitySpeculation.riskProfile || RISK_PROFILE_OPTIONS[0]);
  const [teamRole, setTeamRole] = useState(data.personalitySpeculation.teamRole ? data.personalitySpeculation.teamRole.replace(/_/g, ' ') : TEAM_ROLE_OPTIONS[0]);
  const [communicationStyle, setCommunicationStyle] = useState(data.personalitySpeculation.communicationStyle || COMMUNICATION_OPTIONS[0]);
  const [leadershipStyleName, setLeadershipStyleName] = useState(data.leadershipStyle.styleName || LEADERSHIP_STYLE_OPTIONS[0]);
  const [decisionMaking, setDecisionMaking] = useState(data.leadershipStyle.decisionMaking || DECISION_MAKING_OPTIONS[0]);

  // Textual Descriptions
  const [speculativeSummary, setSpeculativeSummary] = useState(data.personalitySpeculation.speculativeSummary || '');
  
  const initialTraitsString = (data.personalitySpeculation.coreTraits || [])
    .map((t: any) => typeof t === 'string' ? t : t.trait)
    .join(', ');
  const [coreTraitsInput, setCoreTraitsInput] = useState(initialTraitsString);

  const [keyMotivatorsInput, setKeyMotivatorsInput] = useState((data.personalitySpeculation.keyMotivators || []).join(', '));
  const [managementApproach, setManagementApproach] = useState(data.leadershipStyle.managementApproach || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleApplyChanges = () => {
    const updatedTraitObjects: PersonalityTrait[] = coreTraitsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .map(traitName => ({
        trait: traitName,
        level: 'High' as const,
        explanation: 'Custom tuned trait'
      }));

    const updatedMotivators = keyMotivatorsInput.split(',').map(m => m.trim()).filter(Boolean);

    const updatedResult: ProfileAnalysisResult = {
      ...data,
      profile: {
        ...data.profile,
        name,
        currentTitle: title,
        company,
        industry
      },
      personalitySpeculation: {
        ...data.personalitySpeculation,
        primaryArchetype,
        riskProfile,
        teamRole,
        communicationStyle,
        speculativeSummary,
        coreTraits: updatedTraitObjects,
        keyMotivators: updatedMotivators
      },
      leadershipStyle: {
        ...data.leadershipStyle,
        styleName: leadershipStyleName,
        decisionMaking,
        managementApproach
      }
    };

    // Regenerate Avatar System Prompt from updated data
    const newAvatarPrompt = generateAvatarSystemPrompt(updatedResult);
    updatedResult.personalitySpeculation.simulationAvatarPrompt = newAvatarPrompt;

    onSave(updatedResult);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-bold text-sm">
              <Sliders className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Customize & Edit Persona Traits</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Interactive Tuning
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Modify personality selections and text descriptions before regenerating your character avatar prompt.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-950/60 text-xs">
          
          {/* Section 1: Core Candidate Identity */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-white/10 text-indigo-300 font-bold">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Core Candidate Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Current Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Company / Enterprise</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Domain / Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Personality Methods & Behavioral Dropdowns */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-indigo-500/30 space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-white/10 text-purple-300 font-bold">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Personality Methods & Behavioral Dropdown Selections</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Cognitive Archetype</label>
                <select
                  value={primaryArchetype}
                  onChange={(e) => setPrimaryArchetype(e.target.value)}
                  className="w-full bg-slate-950 border border-purple-500/40 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {ARCHETYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Risk Profile & Stance</label>
                <select
                  value={riskProfile}
                  onChange={(e) => setRiskProfile(e.target.value)}
                  className="w-full bg-slate-950 border border-purple-500/40 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {RISK_PROFILE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Simulation Group Role</label>
                <select
                  value={teamRole}
                  onChange={(e) => setTeamRole(e.target.value)}
                  className="w-full bg-slate-950 border border-purple-500/40 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {TEAM_ROLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Communication Style & Tone</label>
                <select
                  value={communicationStyle}
                  onChange={(e) => setCommunicationStyle(e.target.value)}
                  className="w-full bg-slate-950 border border-purple-500/40 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {COMMUNICATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Leadership Framework</label>
                <select
                  value={leadershipStyleName}
                  onChange={(e) => setLeadershipStyleName(e.target.value)}
                  className="w-full bg-slate-950 border border-purple-500/40 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {LEADERSHIP_STYLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Decision Making Approach</label>
                <select
                  value={decisionMaking}
                  onChange={(e) => setDecisionMaking(e.target.value)}
                  className="w-full bg-slate-950 border border-purple-500/40 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {DECISION_MAKING_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Textual Descriptions & Annotations */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-white/10 text-emerald-300 font-bold">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Textual Summaries & Annotated Traits</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Speculative Personality Summary
                </label>
                <textarea
                  rows={3}
                  value={speculativeSummary}
                  onChange={(e) => setSpeculativeSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Core Personality Traits (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={coreTraitsInput}
                    onChange={(e) => setCoreTraitsInput(e.target.value)}
                    placeholder="e.g. Strategic, Analytical, Resilient, Risk-Adjusted"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Key Motivators (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={keyMotivatorsInput}
                    onChange={(e) => setKeyMotivatorsInput(e.target.value)}
                    placeholder="e.g. High impact, Enterprise scale, Innovation"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Management Stance & Execution Strategy
                </label>
                <textarea
                  rows={2}
                  value={managementApproach}
                  onChange={(e) => setManagementApproach(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-400">
            Applying edits will immediately re-synthesize your LLM Character Avatar Prompt.
          </p>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyChanges}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Prompt Regenerated!</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 text-white" />
                  <span>Update & Regenerate Avatar Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
