import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, ShieldCheck, CheckCircle2, Eye, EyeOff, Trash2, Sparkles, Info } from 'lucide-react';
import { getByokApiKey, setByokApiKey } from '../utils/apiKey';

interface ApiKeyModalProps {
  onClose: () => void;
  onKeyUpdated?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onKeyUpdated }) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const existingKey = getByokApiKey();
    setApiKeyInput(existingKey);
  }, []);

  const handleSave = () => {
    setByokApiKey(apiKeyInput);
    setIsSaved(true);
    if (onKeyUpdated) onKeyUpdated();
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setByokApiKey('');
    setApiKeyInput('');
    if (onKeyUpdated) onKeyUpdated();
  };

  const currentKey = getByokApiKey();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-bold">
              <Key className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Bring Your Own Key (BYOK)</span>
                {currentKey && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Configure your personal Google Gemini API key for higher rate limits.
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

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          
          {/* Direct Key Generation Link Banner */}
          <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-900/80 border border-indigo-500/30 p-4 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Need a free Gemini API key?</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Google provides free API keys for developers with fast response times and generous rate limits.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition shadow-md shadow-indigo-500/20 mt-1"
            >
              <span>Get a Gemini API Key quickly in Google AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-200" />
            </a>
          </div>

          {/* Key Input Field */}
          <div className="space-y-2">
            <label className="block text-slate-200 font-medium">
              Enter Your Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="e.g. AIzaSy..."
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-white pr-10 focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Your key is stored securely in your browser's local storage and sent directly to Gemini API endpoints.</span>
            </p>
          </div>

          {/* Advantages list */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 space-y-1.5">
            <span className="font-semibold text-slate-200 block">Why bring your own key?</span>
            <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
              <li>Eliminates shared queue rate-limiting (HTTP 429).</li>
              <li>Unlocks high-throughput multimodal document parsing.</li>
              <li>Fast, zero-wait real-time persona simulation chats.</li>
            </ul>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between">
          {currentKey ? (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Key</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/20 flex items-center space-x-1.5"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Key Saved!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save API Key</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
