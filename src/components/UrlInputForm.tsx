import React, { useState } from 'react';
import { Search, Sparkles, FileText, ChevronDown, ChevronUp, AlertCircle, Linkedin, Filter } from 'lucide-react';
import { AnalyzeRequest, FocusAreaLens, LENS_OPTIONS } from '../types';

interface UrlInputFormProps {
  onAnalyze: (request: AnalyzeRequest) => void;
  isLoading: boolean;
  onSelectSample: (sampleId: string) => void;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({
  onAnalyze,
  isLoading,
  onSelectSample,
}) => {
  const [url, setUrl] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [focusArea, setFocusArea] = useState<FocusAreaLens>('general');
  const [showSupplemental, setShowSupplemental] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!url.trim() && !pastedText.trim()) {
      setErrorMsg('Please enter a LinkedIn profile URL or paste profile/resume details.');
      return;
    }

    if (url.trim() && !url.includes('linkedin.com') && !url.startsWith('http')) {
      // If user typed e.g. "satyanadella" or "linkedin.com/in/satyanadella", auto prepend https://www.linkedin.com/in/
      const formattedUrl = url.startsWith('linkedin.com') 
        ? `https://www.${url.trim()}`
        : `https://www.linkedin.com/in/${url.trim().replace(/^@/, '')}`;
      onAnalyze({ url: formattedUrl, pastedText: pastedText.trim() || undefined, focusArea });
    } else {
      onAnalyze({ url: url.trim(), pastedText: pastedText.trim() || undefined, focusArea });
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-5 sm:p-7 space-y-5 shadow-2xl text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Linkedin className="w-4 h-4" />
            </div>
            Analyze Executive Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter a LinkedIn profile URL to summarize experience, skills, and speculate on leadership style.
          </p>
        </div>

        {/* Focus Area selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 bg-white/5 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center space-x-1.5 px-2">
            <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-300">Lens Perspective:</span>
          </div>
          <select
            id="focus-area-select"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value as FocusAreaLens)}
            className="text-xs font-semibold text-indigo-200 bg-slate-900/90 border border-indigo-500/30 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-xs"
          >
            {LENS_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-100 py-1">
                [{opt.category}] {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-indigo-400" />
            </div>
            <input
              id="linkedin-url-input"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. https://www.linkedin.com/in/satyanadella or satyanadella"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition"
              disabled={isLoading}
            />
          </div>

          <button
            id="analyze-profile-submit-btn"
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 active:scale-98 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 border border-white/20 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed min-w-[150px]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Analysis</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2 text-xs text-rose-300 bg-rose-950/50 p-2.5 rounded-xl border border-rose-500/30">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Helper Note for Private / Auth-Wall LinkedIn Profiles */}
        <div className="flex items-start space-x-2 text-[11px] text-slate-400 bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-500/20">
          <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-200">Tip for custom LinkedIn links:</strong> LinkedIn restricts automated reading of private profiles. For custom candidates, pasting their LinkedIn "About" section or resume text guarantees 100% accurate, unhallucinated evaluation.
          </span>
        </div>

        {/* Supplemental Text Expandable Drawer */}
        <div className="pt-1">
          <button
            type="button"
            id="toggle-supplemental-text-btn"
            onClick={() => setShowSupplemental(!showSupplemental)}
            className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 flex items-center space-x-1.5 transition bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/30"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showSupplemental ? 'Hide' : 'Paste'} Candidate "About" / Resume / Bio Text ({pastedText ? 'Added' : 'Recommended for accuracy'})</span>
            {showSupplemental ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showSupplemental && (
            <div className="mt-3 space-y-2">
              <label htmlFor="supplemental-profile-text" className="block text-xs text-slate-300 font-medium">
                Paste candidate's LinkedIn "About" section, work experience bullets, recommendations, or resume text:
              </label>
              <textarea
                id="supplemental-profile-text"
                rows={4}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste candidate bio, work history, or recommendation text here for exact extraction..."
                className="w-full p-3 bg-white/5 border border-indigo-500/30 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Quick Sample Triggers */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Test Candidates:</span>
          <button
            type="button"
            id="sample-chip-satya-nadella"
            onClick={() => onSelectSample('satya-nadella')}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 hover:border-indigo-400/40 text-slate-300 rounded-lg border border-white/10 font-medium transition"
          >
            Satya Nadella (Microsoft)
          </button>
          <button
            type="button"
            id="sample-chip-sam-altman"
            onClick={() => onSelectSample('sam-altman')}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 hover:border-emerald-400/40 text-slate-300 rounded-lg border border-white/10 font-medium transition"
          >
            Sam Altman (OpenAI)
          </button>
          <button
            type="button"
            id="sample-chip-jensen-huang"
            onClick={() => onSelectSample('jensen-huang')}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 hover:border-amber-400/40 text-slate-300 rounded-lg border border-white/10 font-medium transition"
          >
            Jensen Huang (NVIDIA)
          </button>
          <button
            type="button"
            id="sample-chip-reshma-saujani"
            onClick={() => onSelectSample('reshma-saujani')}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 hover:border-rose-400/40 text-slate-300 rounded-lg border border-white/10 font-medium transition"
          >
            Reshma Saujani (Girls Who Code)
          </button>
        </div>
      </form>
    </div>
  );
};
