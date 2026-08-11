import React, { useState } from 'react';
import { X, Play, Send, Bot, Users, Sparkles, RefreshCw, Lightbulb, ShieldAlert, Target, Cpu, CheckCircle2 } from 'lucide-react';
import { ProfileAnalysisResult } from '../types';
import { getAuthHeaders } from '../utils/apiKey';

interface SimulationSandboxModalProps {
  data: ProfileAnalysisResult;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  senderName: string;
  role: 'avatar' | 'user' | 'team_member';
  avatarInitials: string;
  content: string;
  timestamp: string;
  personaTitle?: string;
}

const SCENARIOS = [
  {
    id: 'problem_solving',
    icon: Target,
    title: 'Strategic Problem Solving',
    description: 'Scaling platform throughput 5x while reducing infrastructure unit cost by 30%',
    defaultPrompt: 'Team, we face a critical scaling challenge: server throughput needs to scale 5x next quarter, but executive finance requires a 30% reduction in unit costs. How do we structure this engineering and operational response?'
  },
  {
    id: 'decision_making',
    icon: Cpu,
    title: 'Executive Decision Making',
    description: 'Evaluating a pivot from traditional enterprise sales to Product-Led Growth (PLG)',
    defaultPrompt: 'We are debating whether to reallocate 40% of our enterprise sales budget into self-serve PLG viral loops. What is your decision-making framework for this trade-off?'
  },
  {
    id: 'forecasting',
    icon: ShieldAlert,
    title: 'Forecasting & Risk Assessment',
    description: 'Predicting market adoption, operational bottlenecks, and regulatory compliance risks',
    defaultPrompt: 'What major tail risks, adoption delays, or compliance bottlenecks do you forecast for our international market expansion over the next 12-18 months?'
  },
  {
    id: 'innovation',
    icon: Lightbulb,
    title: 'Innovation & Ideation',
    description: 'Brainstorming 10x AI-native capabilities for the 3-year platform roadmap',
    defaultPrompt: 'Let us ideate on breakthrough AI-native capabilities that could render our traditional competitors obsolete within 2 years. Where do you see the highest leverage opportunity?'
  }
];

export const SimulationSandboxModal: React.FC<SimulationSandboxModalProps> = ({ data, onClose }) => {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [userMessage, setUserMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const candidateName = data.profile.name;
  const candidateTitle = data.profile.currentTitle;
  const avatarInitials = data.profile.avatarInitials || 'EP';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      senderName: candidateName,
      role: 'avatar',
      avatarInitials,
      content: `Hello team. I'm ready to tackle this ${selectedScenario.title.toLowerCase()} challenge. Based on my track record in ${data.profile.industry || 'enterprise technology'}, let's look at the underlying variables first.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      personaTitle: candidateTitle
    }
  ]);

  const systemPrompt = data.personalitySpeculation.simulationAvatarPrompt || '';

  const handleScenarioChange = (sc: typeof SCENARIOS[0]) => {
    setSelectedScenario(sc);
    setMessages([
      {
        id: `init-${Date.now()}`,
        senderName: candidateName,
        role: 'avatar',
        avatarInitials,
        content: `Ready for the ${sc.title} session. ${sc.defaultPrompt}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        personaTitle: candidateTitle
      }
    ]);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || userMessage;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      senderName: 'Group Moderator',
      role: 'user',
      avatarInitials: 'GM',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setUserMessage('');
    setIsGenerating(true);

    try {
      const historyForApi = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content
      }));

      const res = await fetch('/api/simulate-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          systemPrompt,
          scenario: `${selectedScenario.title}: ${selectedScenario.description}`,
          userMessage: textToSend,
          conversationHistory: historyForApi,
          candidateName
        })
      });

      if (!res.ok) {
        throw new Error('Simulation endpoint error');
      }

      const json = await res.json();

      const avatarReply: ChatMessage = {
        id: `avatar-${Date.now()}`,
        senderName: candidateName,
        role: 'avatar',
        avatarInitials,
        content: json.reply || 'Let me review the metrics before confirming our course of action.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        personaTitle: candidateTitle
      };

      setMessages(prev => [...prev, avatarReply]);
    } catch (err) {
      console.error('Simulation error:', err);
      const fallbackReply: ChatMessage = {
        id: `avatar-err-${Date.now()}`,
        senderName: candidateName,
        role: 'avatar',
        avatarInitials,
        content: `From an execution perspective, we must prioritize quantifiable ROI and clear milestones. Let's break down the technical trade-offs before committing resources.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        personaTitle: candidateTitle
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-sm">
              {avatarInitials}
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Group Activity Simulation: {candidateName}</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Behavioral Avatar
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {candidateTitle} • Testing authentic thought patterns, biases, and language
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

        {/* Scenario Selection Tabs */}
        <div className="px-6 py-3 bg-slate-950 border-b border-white/10 flex items-center space-x-2 overflow-x-auto shrink-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" /> Activity:
          </span>
          {SCENARIOS.map((sc) => {
            const Icon = sc.icon;
            const isSelected = selectedScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleScenarioChange(sc)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sc.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Scenario Context Banner */}
        <div className="px-6 py-2.5 bg-indigo-950/40 border-b border-indigo-500/20 text-xs text-slate-300 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-white">Active Activity Context:</strong> {selectedScenario.description}
            </span>
          </div>
          <button
            onClick={() => handleSendMessage(selectedScenario.defaultPrompt)}
            disabled={isGenerating}
            className="text-[11px] font-bold text-indigo-300 hover:text-white underline shrink-0 ml-2"
          >
            Re-trigger Group Prompt
          </button>
        </div>

        {/* Message Chat Stream Area */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-slate-950/50">
          {messages.map((msg) => {
            const isAvatar = msg.role === 'avatar';
            return (
              <div
                key={msg.id}
                className={`flex space-x-3 ${isAvatar ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                {/* Avatar Badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border shadow-md ${
                    isAvatar
                      ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white border-indigo-400/40'
                      : 'bg-slate-800 text-slate-200 border-white/10'
                  }`}
                >
                  {msg.avatarInitials}
                </div>

                {/* Bubble */}
                <div className={`space-y-1 max-w-2xl ${isAvatar ? '' : 'items-end'}`}>
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="font-bold text-white">{msg.senderName}</span>
                    {msg.personaTitle && (
                      <span className="text-slate-400 text-[10px]">({msg.personaTitle})</span>
                    )}
                    <span className="text-slate-500 text-[10px]">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isAvatar
                        ? 'bg-slate-900 border border-indigo-500/30 text-slate-100 shadow-lg'
                        : 'bg-indigo-600 text-white shadow-lg'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex space-x-3 items-center text-xs text-indigo-300 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <span>{candidateName} avatar is evaluating behavioral response...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-6 py-2 bg-slate-900/90 border-t border-white/10 flex items-center space-x-2 overflow-x-auto text-xs shrink-0">
          <span className="text-[11px] text-slate-400 font-semibold shrink-0">Ask Avatar:</span>
          <button
            type="button"
            onClick={() => handleSendMessage("How do you handle disagreement when the team pushes for a solution that risks system stability?")}
            disabled={isGenerating}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg border border-white/10 text-[11px] whitespace-nowrap"
          >
            "How do you handle team disagreement on system stability?"
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage("What metrics or proof points do you require before greenlighting a major strategic shift?")}
            disabled={isGenerating}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg border border-white/10 text-[11px] whitespace-nowrap"
          >
            "What proof points do you require before pivoting strategy?"
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center space-x-3 shrink-0">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Type a scenario prompt or question for ${candidateName}...`}
            className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isGenerating || !userMessage.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>

      </div>
    </div>
  );
};
