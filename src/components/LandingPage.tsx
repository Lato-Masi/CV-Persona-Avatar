import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Target,
  Users,
  Brain,
  Clock,
  ShieldCheck,
  Zap,
  Search,
  Bot,
  FileText,
  BarChart3,
  HelpCircle,
  Briefcase,
  Layers,
  Award,
  Globe,
  Play,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onSelectSample?: (sampleName: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background Subtle Mesh / Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-24">
        
        {/* Navigation Bar inside Landing Page */}
        <header className="flex items-center justify-between py-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                CV Persona Avatar
              </span>
              <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Executive Edition
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
            <button onClick={() => scrollToSection('what-is-it')} className="hover:text-white transition">What It Is</button>
            <button onClick={() => scrollToSection('who-is-it-for')} className="hover:text-white transition">Who It's For</button>
            <button onClick={() => scrollToSection('why-created')} className="hover:text-white transition">Why Created</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition">How It Works</button>
            <button onClick={() => scrollToSection('benefits')} className="hover:text-white transition">Benefits</button>
            <button onClick={() => scrollToSection('use-cases')} className="hover:text-white transition">Use Cases</button>
          </div>

          <button
            onClick={onEnterApp}
            className="group inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 hover:opacity-95 text-white shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>Launch Profiler</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </header>

        {/* HERO SECTION */}
        <section className="text-center space-y-8 pt-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Executive Intelligence & Persona Avatar Simulation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Transform Static Resumes into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400">
              Dynamic Behavioral AI Personas
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            CV Persona Avatar combines deep document parsing, real-time Google Web grounding, psychological speculation, and interactive avatar simulations to evaluate executive talent with unprecedented speed and depth.
          </p>

          {/* Action Call To Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Enter Application Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-sm transition-all"
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Learn How It Works</span>
            </button>
          </div>

          {/* Feature Badges Ticker */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-2xl font-black text-indigo-400">80%</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Faster Executive Due-Diligence</div>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-2xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Live Web Search Grounded</div>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-2xl font-black text-purple-400">5-Axis</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Psychological Speculation (DISC / Big Five)</div>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-2xl font-black text-amber-400">Live AI</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Interview Sandbox Avatar</div>
            </div>
          </div>
        </section>

        {/* 1. WHAT IS IT? SECTION */}
        <section id="what-is-it" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Core Overview
            </span>
            <h2 className="text-3xl font-extrabold text-white">What is CV Persona Avatar?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              An all-in-one Executive Profiling and Web Intelligence Engine that transforms static resume documents into structured, multi-dimensional executive intelligence reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10 space-y-3 hover:border-indigo-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Format CV & OCR Ingestion</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Accepts PDF, Word documents, plain text, scanned image resumes via OCR, or live LinkedIn profile links to instantly extract raw career experience.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10 space-y-3 hover:border-purple-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Live Web Search Grounding</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cross-references the candidate's public footprint on Google, verifying published articles, conference keynotes, patent filings, and news mentions.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10 space-y-3 hover:border-emerald-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Behavioral & Leadership Archetyping</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generates Big Five personality speculations, leadership style models, decision-making philosophies under pressure, and custom interview scenario probes.
              </p>
            </div>
          </div>
        </section>

        {/* 2. WHO IS IT FOR? SECTION */}
        <section id="who-is-it-for" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Target Audience
            </span>
            <h2 className="text-3xl font-extrabold text-white">Who is CV Persona Avatar For?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Designed specifically for professionals who make critical talent, investment, and executive placement decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Executive Headhunters</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prepare rich, highly differentiated candidate briefing decks for clients beyond standard resume forwardings.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">VC & PE Investors</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Conduct leadership due diligence on startup founders and C-suite executives prior to capital allocation.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Hiring Managers & HR Directors</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generate sharp, tailored behavioral interview questions aligned with target leadership competencies.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">C-Suite Executives & Candidates</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Audit your own digital narrative, practice crisis interviews with an AI avatar replica, and refine market positioning.
              </p>
            </div>
          </div>
        </section>

        {/* 3. WHY WAS IT CREATED? SECTION */}
        <section id="why-created" className="bg-slate-900/80 rounded-3xl border border-white/10 p-8 sm:p-12 space-y-8 scroll-mt-20">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              The Mission
            </span>
            <h2 className="text-3xl font-black text-white">Why Was CV Persona Avatar Created?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl space-y-3">
              <div className="text-red-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <span>⚠️ The Problem With Traditional Hiring</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Standard resumes are static lists of self-reported claims and buzzwords. They fail to reveal how a leader operates under severe market stress, how they resolve team conflicts, or whether their claims match public industry records.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 pt-2">
                <li className="flex items-center gap-2">❌ Surface-level keyword matching ignores soft skills.</li>
                <li className="flex items-center gap-2">❌ Unverified candidate claims lead to bad hires.</li>
                <li className="flex items-center gap-2">❌ Unstructured interviews suffer from confirmation bias.</li>
              </ul>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl space-y-3">
              <div className="text-emerald-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <span>✅ The CV Persona Avatar Solution</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                CV Persona Avatar synthesizes multi-modal candidate inputs into a living, interactive avatar model. It grounds candidate accomplishments in real-time web search results and lets recruiters simulate real crisis interviews in a sandbox before making high-stakes decisions.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li className="flex items-center gap-2 text-emerald-300"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Deep psychological & leadership style speculation.</li>
                <li className="flex items-center gap-2 text-emerald-300"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Live Google search web grounding verification.</li>
                <li className="flex items-center gap-2 text-emerald-300"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Interactive AI Avatar sandbox for scenario testing.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. WHEN TO USE IT? SECTION */}
        <section id="when-to-use" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Key Timings
            </span>
            <h2 className="text-3xl font-extrabold text-white">When Should You Use CV Persona Avatar?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Integrates into every major milestone of the executive recruitment and talent evaluation lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider">Phase 1</div>
              <h3 className="text-lg font-bold text-white">Initial Executive Screening</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                When evaluating dozens of inbound CVs or LinkedIn links, parse them instantly into formatted executive Markdown summaries to shortlist top contenders.
              </p>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="text-purple-400 font-bold text-xs uppercase tracking-wider">Phase 2</div>
              <h3 className="text-lg font-bold text-white">Interview Preparation & Probes</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Before key interviews, review the candidate's decision-making style and auto-generated scenario test questions to ask targeted behavioral questions.
              </p>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Phase 3</div>
              <h3 className="text-lg font-bold text-white">Finalist Side-by-Side Comparison</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                When choosing between the top 2-3 final candidates, use the Candidate Compare View to matrix leadership style, skills, and web grounding side by side.
              </p>
            </div>
          </div>
        </section>

        {/* 5. HOW DOES IT WORK? SECTION */}
        <section id="how-it-works" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Process Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-white">How Does CV Persona Avatar Work?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              A seamless 5-step pipeline that transforms raw candidate information into comprehensive intelligence.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/70 p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-lg border border-indigo-500/30">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Data Ingestion & Extraction</h3>
                  <p className="text-xs text-slate-300">Upload PDF/DOCX CVs, paste LinkedIn URLs, or convert document images with OCR.</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Input Stage</span>
            </div>

            <div className="bg-slate-900/70 p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-lg border border-purple-500/30">
                  2
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Google Gemini AI & Web Search Grounding</h3>
                  <p className="text-xs text-slate-300">Gemini models search live public sources to cross-verify company history, keynotes, and press mentions.</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">Analysis Stage</span>
            </div>

            <div className="bg-slate-900/70 p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg border border-emerald-500/30">
                  3
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Multi-Dimensional Report Generation</h3>
                  <p className="text-xs text-slate-300">Synthesizes Big Five traits, DISC profile, leadership archetype, and verified endorsements.</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Output Stage</span>
            </div>

            <div className="bg-slate-900/70 p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-black text-lg border border-amber-500/30">
                  4
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Interactive Avatar Sandbox Simulation</h3>
                  <p className="text-xs text-slate-300">Engage in live interactive conversations with an AI avatar replica calibrated to the candidate's style.</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">Interactive Stage</span>
            </div>

            <div className="bg-slate-900/70 p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-lg border border-cyan-500/30">
                  5
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Export & Comparative Matrix</h3>
                  <p className="text-xs text-slate-300">Save profile reports, compare finalists side-by-side, or export raw markdown briefs for investment committees.</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Sharing Stage</span>
            </div>
          </div>
        </section>

        {/* 6. WHAT ARE THE BENEFITS? SECTION */}
        <section id="benefits" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Key Value
            </span>
            <h2 className="text-3xl font-extrabold text-white">What Are the Key Benefits?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Delivering measurable time savings, deeper objectivity, and reduced risk for executive placements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-3">
              <Clock className="w-8 h-8 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Massive Time Savings</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dramatically reduces hours spent manually reading lengthy CVs and researching candidate companies online down to seconds.
              </p>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-3">
              <Target className="w-8 h-8 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Reduced Bad Hire Risk</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                By uncovering behavioral patterns, management tendencies, and cross-verified web facts before hiring, you avoid costly leadership misfits.
              </p>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-3">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
              <h3 className="text-base font-bold text-white">BYOK Privacy & Security</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bring Your Own Key (BYOK) architecture ensures all Gemini API requests can use your private keys with client-controlled local storage.
              </p>
            </div>
          </div>
        </section>

        {/* 7. USE CASES SECTION */}
        <section id="use-cases" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Applications
            </span>
            <h2 className="text-3xl font-extrabold text-white">Where Can It Be Used? (Use Cases)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs text-indigo-400 font-bold uppercase">Use Case 1</span>
              <h3 className="text-base font-bold text-white">C-Suite Executive Hiring</h3>
              <p className="text-xs text-slate-300">Vetting CEO, CTO, CFO, and VP candidates with behavioral archetypes and verified history.</p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs text-purple-400 font-bold uppercase">Use Case 2</span>
              <h3 className="text-base font-bold text-white">VC Founder Assessment</h3>
              <p className="text-xs text-slate-300">Venture capital due diligence on technical founders and executive leadership teams.</p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs text-emerald-400 font-bold uppercase">Use Case 3</span>
              <h3 className="text-base font-bold text-white">Headhunting Client Decks</h3>
              <p className="text-xs text-slate-300">Generating polished executive profiles to send to enterprise clients with candidate comparison matrices.</p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs text-amber-400 font-bold uppercase">Use Case 4</span>
              <h3 className="text-base font-bold text-white">M&A Talent Audit</h3>
              <p className="text-xs text-slate-300">Evaluating key executive talent retention during mergers and corporate acquisitions.</p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs text-cyan-400 font-bold uppercase">Use Case 5</span>
              <h3 className="text-base font-bold text-white">Succession Planning</h3>
              <p className="text-xs text-slate-300">Comparing internal candidates for promotion to senior leadership roles against external benchmarks.</p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs text-rose-400 font-bold uppercase">Use Case 6</span>
              <h3 className="text-base font-bold text-white">Candidate Self-Audit</h3>
              <p className="text-xs text-slate-300">Executives auditing their own online persona, preparing for crisis interviews, and identifying narrative gaps.</p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-emerald-900/80 rounded-3xl border border-white/20 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Experience Next-Gen Executive Intelligence?
            </h2>
            <p className="text-sm text-slate-200">
              Start analyzing CVs, generating psychological persona avatars, and running live interview simulations right now.
            </p>
            <div className="pt-2">
              <button
                onClick={onEnterApp}
                className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-sm shadow-2xl transition-all transform hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current text-indigo-600" />
                <span>Launch Application Workspace</span>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-200">CV Persona Avatar</span>
            <span>— Executive CV Profiler & Web Intelligence Search Engine</span>
          </div>
          <div>
            Powered by Google Gemini AI & AnyDoc OCR
          </div>
        </footer>

      </div>
    </div>
  );
};
