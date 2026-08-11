import React, { useState } from 'react';
import { History, X, Search, Trash2, ArrowUpRight, Calendar, Building2 } from 'lucide-react';
import { ProfileAnalysisResult } from '../types';

interface SavedHistoryDrawerProps {
  history: ProfileAnalysisResult[];
  onSelectResult: (result: ProfileAnalysisResult) => void;
  onClearHistory: () => void;
  onDeleteOne: (id: string) => void;
  onClose: () => void;
}

export const SavedHistoryDrawer: React.FC<SavedHistoryDrawerProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  onDeleteOne,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = history.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.profile.name.toLowerCase().includes(q) ||
      item.profile.company.toLowerCase().includes(q) ||
      item.profile.currentTitle.toLowerCase().includes(q) ||
      item.personalitySpeculation.primaryArchetype.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl text-white h-full shadow-2xl flex flex-col border-l border-white/10">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/80 text-white">
          <div className="flex items-center space-x-2.5">
            <History className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold">Analysis History</h2>
              <p className="text-xs text-slate-400">{history.length} Profiles Saved</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="relative">
            <Search className="w-4 h-4 text-indigo-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by candidate name, company, title..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <History className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-300">No saved profiles found</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Profiles you analyze or save will appear here for easy access and comparison.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white/5 rounded-xl border border-white/10 hover:border-indigo-400/40 hover:bg-white/10 transition group flex items-start justify-between gap-3 backdrop-blur-md"
              >
                <button
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                  className="flex-1 text-left space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white group-hover:text-indigo-300 transition">
                      {item.profile.name}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{item.profile.currentTitle}</span>
                    {item.profile.company && <span className="text-slate-400">at {item.profile.company}</span>}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-2 pt-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-slate-200 font-medium">
                      {item.personalitySpeculation.primaryArchetype}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.analyzedAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => onDeleteOne(item.id)}
                  title="Remove from history"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {history.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <span className="text-[11px] text-slate-400">{history.length} saved</span>
          </div>
        )}
      </div>
    </div>
  );
};
