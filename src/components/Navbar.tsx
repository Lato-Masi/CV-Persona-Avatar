import React from 'react';
import { Linkedin, History, Scale, Key } from 'lucide-react';
import { getByokApiKey } from '../utils/apiKey';

interface NavbarProps {
  onOpenHistory: () => void;
  savedCount: number;
  compareMode: boolean;
  onToggleCompare: () => void;
  activeProfileName?: string;
  onOpenApiKeyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  savedCount,
  compareMode,
  onToggleCompare,
  onOpenApiKeyModal,
}) => {
  const hasCustomKey = Boolean(getByokApiKey());

  return (
    <header className="sticky top-0 z-40 bg-slate-900/70 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Linkedin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                PersonaScan AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Executive Profiler & Web Intelligence Search Engine
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* BYOK API Key Button */}
          <button
            id="byok-api-key-btn"
            onClick={onOpenApiKeyModal}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border backdrop-blur-md transition-all ${
              hasCustomKey
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 border-emerald-500/30'
                : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 border-indigo-500/30'
            }`}
          >
            <Key className={`w-3.5 h-3.5 ${hasCustomKey ? 'text-emerald-400' : 'text-indigo-400'}`} />
            <span className="hidden md:inline">{hasCustomKey ? 'Custom Key Active' : 'API Key (BYOK)'}</span>
            {hasCustomKey && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Compare Toggle Button */}
          <button
            id="compare-mode-toggle-btn"
            onClick={onToggleCompare}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border backdrop-blur-md transition-all ${
              compareMode
                ? 'bg-gradient-to-r from-indigo-500 to-emerald-500 text-white border-white/20 shadow-lg shadow-indigo-500/25'
                : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Compare Profiles</span>
          </button>

          {/* Saved History Button */}
          <button
            id="saved-history-drawer-btn"
            onClick={onOpenHistory}
            className="relative inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md transition-colors"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">History</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

