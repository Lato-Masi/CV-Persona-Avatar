import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { CvUploadForm } from './components/CvUploadForm';
import { FormattedMarkdownReport } from './components/FormattedMarkdownReport';
import { ProfileHeaderCard } from './components/ProfileHeaderCard';
import { ExperienceSummaryCard } from './components/ExperienceSummaryCard';
import { SkillsCard } from './components/SkillsCard';
import { PersonalitySpeculationCard } from './components/PersonalitySpeculationCard';
import { LeadershipStyleCard } from './components/LeadershipStyleCard';
import { EndorsementsCard } from './components/EndorsementsCard';
import { GroundingSourcesCard } from './components/GroundingSourcesCard';
import { CandidateCompareView } from './components/CandidateCompareView';
import { SavedHistoryDrawer } from './components/SavedHistoryDrawer';
import { AnydocDocumentConverter } from './components/AnydocDocumentConverter';
import { SimulationAvatarCard } from './components/SimulationAvatarCard';
import { SimulationSandboxModal } from './components/SimulationSandboxModal';
import { PersonaEditorModal } from './components/PersonaEditorModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { getAuthHeaders } from './utils/apiKey';
import { AnalyzeRequest, ProfileAnalysisResult } from './types';
import { Sparkles, AlertCircle, RefreshCw, FileText, LayoutDashboard, UploadCloud, Zap, ShieldCheck, Sliders } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'linkedin_profile_summaries_v2';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'app'>('landing');
  const [activeAnalysis, setActiveAnalysis] = useState<ProfileAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ProfileAnalysisResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAnydocConverterOpen, setIsAnydocConverterOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [displayMode, setDisplayMode] = useState<'markdown' | 'cards'>('markdown');

  const handleSavePersona = (updatedResult: ProfileAnalysisResult) => {
    setActiveAnalysis(updatedResult);
    setHistory(prev => {
      const updated = prev.map(item => item.id === updatedResult.id ? updatedResult : item);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update history in storage:', err);
      }
      return updated;
    });
  };

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setActiveAnalysis(parsed[0]);
          return;
        }
      }
      setHistory([]);
    } catch {
      setHistory([]);
    }
  }, []);

  const saveToHistory = (result: ProfileAnalysisResult) => {
    setHistory((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === result.id || p.profile.name === result.profile.name);
      let updated;
      if (existsIndex >= 0) {
        updated = [...prev];
        updated[existsIndex] = result;
      } else {
        updated = [result, ...prev];
      }
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save history:', err);
      }
      return updated;
    });
  };

  const resetActiveSession = () => {
    setActiveAnalysis(null);
    setCompareMode(false);
    setIsSandboxOpen(false);
    setIsEditorOpen(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    resetActiveSession();
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const targetItem = history.find((item) => item.id === id);

    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to remove item:', err);
      }
      return updated;
    });

    if (
      activeAnalysis &&
      (activeAnalysis.id === id || (targetItem && activeAnalysis.profile.name === targetItem.profile.name))
    ) {
      resetActiveSession();
    }
  };

  const handleToggleSaveHistory = (result: ProfileAnalysisResult) => {
    const isSaved = history.some((h) => h.id === result.id || h.profile.name === result.profile.name);
    if (isSaved) {
      handleDeleteHistoryItem(result.id);
    } else {
      saveToHistory(result);
    }
  };

  const handleAnalyzeCv = async (formData: FormData) => {
    setActiveView('app');
    setIsLoading(true);
    setError(null);
    setLoadingStep('Extracting PDF CV text & converting to Markdown...');

    try {
      const stepTimer1 = setTimeout(() => {
        setLoadingStep('Initiating targeted web search for candidate online footprint...');
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        setLoadingStep('Verifying entity alignment & compiling formatted Markdown executive report...');
      }, 4000);

      const res = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text().catch(() => '');
        console.error('Non-JSON response received:', textResponse.substring(0, 300));
        throw new Error('The server returned an invalid response. Please try again or paste the candidate details directly.');
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      const result: ProfileAnalysisResult = await res.json();
      setActiveAnalysis(result);
      saveToHistory(result);

      setTimeout(() => {
        const el = document.getElementById('analysis-results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: unknown) {
      console.error('CV Analysis failed:', err);
      const msg = err instanceof Error ? err.message : 'Failed to process CV file.';
      setError(msg);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleAnalyzeRequest = async (request: AnalyzeRequest) => {
    const formData = new FormData();
    if (request.pastedText) {
      formData.append('cvText', request.pastedText);
    }
    if (request.focusArea) {
      formData.append('focusArea', request.focusArea);
    }
    await handleAnalyzeCv(formData);
  };

  const isSavedInHistory = activeAnalysis
    ? history.some((h) => h.id === activeAnalysis.id || h.profile.name === activeAnalysis.profile.name)
    : false;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans flex flex-col relative overflow-x-hidden">
      {/* Background Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[15%] w-[30%] h-[30%] bg-fuchsia-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content Area OR Landing Page */}
      {activeView === 'landing' ? (
        <LandingPage onEnterApp={() => setActiveView('app')} />
      ) : (
        <>
          {/* Application Navigation Bar */}
          <Navbar
            onOpenHistory={() => setIsHistoryOpen(true)}
            savedCount={history.length}
            compareMode={compareMode}
            onToggleCompare={() => setCompareMode(!compareMode)}
            activeProfileName={activeAnalysis?.profile.name}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            activeView={activeView}
            onSelectView={setActiveView}
          />

          <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* CV Upload & Web Research Form */}
            <section>
              <CvUploadForm
                onAnalyzeCv={handleAnalyzeCv}
                onAnalyzeRequest={handleAnalyzeRequest}
                isLoading={isLoading}
                onOpenAnydocConverter={() => setIsAnydocConverterOpen(true)}
              />
            </section>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center space-y-4 shadow-2xl animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Processing Candidate CV & Searching Web</h3>
              <p className="text-sm font-medium text-emerald-400">{loadingStep}</p>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Converting CV to Markdown format, executing entity-verified web search, and generating formatted executive report.
            </p>
          </div>
        )}

        {/* Error Notification */}
        {error && !isLoading && (
          <div className="bg-rose-950/40 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-6 text-rose-200 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm text-rose-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Processing Error</span>
            </div>
            <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Initial Empty State prompt when no active report exists */}
        {!activeAnalysis && !isLoading && !error && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base font-bold text-white">Ready for Candidate Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload a candidate PDF CV or paste resume text above. Gemini AI will convert the document into formatted Markdown, execute verified web searches, and compile an executive profile report.
              </p>
            </div>
          </div>
        )}

        {/* Compare Mode */}
        {compareMode && activeAnalysis && (
          <section id="compare-section">
            <CandidateCompareView
              currentProfile={activeAnalysis}
              allHistory={history}
              onClose={() => setCompareMode(false)}
            />
          </section>
        )}

        {/* Active Results Display */}
        {activeAnalysis && !isLoading && (
          <section id="analysis-results-section" className="space-y-6">
            {/* View Mode Switcher Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Candidate Report: {activeAnalysis.profile.name}</span>
                  {activeAnalysis.uploadedFileName && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      📄 {activeAnalysis.uploadedFileName}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Toggle between the Formatted Markdown Document Report and Interactive Visual Cards.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10">
                <button
                  type="button"
                  id="display-markdown-mode-btn"
                  onClick={() => setDisplayMode('markdown')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    displayMode === 'markdown'
                      ? 'bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Formatted Markdown Report</span>
                </button>

                <button
                  type="button"
                  id="display-cards-mode-btn"
                  onClick={() => setDisplayMode('cards')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    displayMode === 'cards'
                      ? 'bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Visual Dashboard Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditorOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-semibold transition shadow-md"
                >
                  <Sliders className="w-3.5 h-3.5 text-purple-300" />
                  <span>Edit Persona & Methods</span>
                </button>
              </div>
            </div>

            {/* Render View Based on Selection */}
            {displayMode === 'markdown' ? (
              <FormattedMarkdownReport data={activeAnalysis} />
            ) : (
              <div className="space-y-6">
                <ProfileHeaderCard
                  data={activeAnalysis}
                  onSaveHistory={handleToggleSaveHistory}
                  isSaved={isSavedInHistory}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ExperienceSummaryCard experienceBullets={activeAnalysis.experienceSummary} />
                  <SkillsCard skills={activeAnalysis.skills} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PersonalitySpeculationCard personality={activeAnalysis.personalitySpeculation} />
                  <LeadershipStyleCard leadership={activeAnalysis.leadershipStyle} />
                </div>
                <SimulationAvatarCard
                  data={activeAnalysis}
                  onOpenSandbox={() => setIsSandboxOpen(true)}
                  onOpenEditor={() => setIsEditorOpen(true)}
                />
                {activeAnalysis.endorsementsInferences && activeAnalysis.endorsementsInferences.length > 0 && (
                  <EndorsementsCard endorsementsInferences={activeAnalysis.endorsementsInferences} />
                )}
                {activeAnalysis.sources && activeAnalysis.sources.length > 0 && (
                  <GroundingSourcesCard sources={activeAnalysis.sources} />
                )}
              </div>
            )}
          </section>
        )}
        </main>
        </>
      )}

      {/* Anydoc WASM Document Converter Modal */}
      {isAnydocConverterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <AnydocDocumentConverter
            isModal={true}
            onClose={() => setIsAnydocConverterOpen(false)}
            onSendToProfiler={(markdown, fileName) => {
              setIsAnydocConverterOpen(false);
              const formData = new FormData();
              formData.append('cvText', markdown);
              formData.append('anydocMarkdown', markdown);
              formData.append('uploadedFileName', fileName);
              handleAnalyzeCv(formData);
            }}
          />
        </div>
      )}

      {/* History Drawer */}
      {isHistoryOpen && (
        <SavedHistoryDrawer
          history={history}
          onSelectResult={(res) => {
            setActiveAnalysis(res);
            setActiveView('app');
            setIsHistoryOpen(false);
          }}
          onClearHistory={handleClearHistory}
          onDeleteOne={handleDeleteHistoryItem}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Behavioral Simulation Sandbox Modal */}
      {isSandboxOpen && activeAnalysis && (
        <SimulationSandboxModal
          data={activeAnalysis}
          onClose={() => setIsSandboxOpen(false)}
        />
      )}

      {/* Persona Editor Modal */}
      {isEditorOpen && activeAnalysis && (
        <PersonaEditorModal
          data={activeAnalysis}
          onSave={handleSavePersona}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {/* BYOK API Key Modal */}
      {isApiKeyModalOpen && (
        <ApiKeyModal
          onClose={() => setIsApiKeyModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/80 backdrop-blur-md text-slate-400 py-6 text-xs border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">Executive CV Profiler & Web Intelligence</span>
          </div>
          <p className="text-slate-400 text-[11px] text-center sm:text-right">
            Converts CVs to Formatted Markdown & gathers verified web research via Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
