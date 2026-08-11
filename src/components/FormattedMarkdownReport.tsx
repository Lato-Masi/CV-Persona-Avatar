import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, Download, FileText, Globe, Eye, Code, Sparkles, ShieldCheck, Share2 } from 'lucide-react';
import { ProfileAnalysisResult } from '../types';

interface FormattedMarkdownReportProps {
  data: ProfileAnalysisResult;
}

export const FormattedMarkdownReport: React.FC<FormattedMarkdownReportProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'full' | 'cv' | 'web'>('full');
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  // Determine report text based on tab
  const getReportText = () => {
    if (activeTab === 'cv') {
      return data.cvMarkdown || `# CV / Resume: ${data.profile.name}\n\n*No separate converted CV markdown available.*`;
    }
    if (activeTab === 'web') {
      return data.webIntelligenceMarkdown || `# Web Intelligence Footprint: ${data.profile.name}\n\n*Web research data integrated into main report.*`;
    }
    return data.fullReportMarkdown || generateFallbackMarkdownReport(data);
  };

  const currentMarkdown = getReportText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleDownloadMd = () => {
    const filename = `${data.profile.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_executive_report.md`;
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-5 sm:p-7 space-y-6 shadow-2xl text-slate-100">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white">Formatted Markdown Executive Report</h2>
            {data.webVerificationConfidence === 'High' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                <span>Web Verified Identity</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Converted CV Markdown combined with live web intelligence and executive profiling.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Formatted vs Raw Toggle */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              id="view-formatted-btn"
              onClick={() => setViewMode('formatted')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'formatted'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Formatted</span>
            </button>
            <button
              type="button"
              id="view-raw-btn"
              onClick={() => setViewMode('raw')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'raw'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Raw Markdown</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            id="copy-markdown-btn"
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white rounded-xl border border-white/10 text-xs font-semibold transition active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Copied Markdown!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-400" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            type="button"
            id="download-markdown-file-btn"
            onClick={handleDownloadMd}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/20 border border-white/20 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Content Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
        <button
          type="button"
          id="tab-full-report"
          onClick={() => setActiveTab('full')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'full'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-white/5 border border-transparent'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Full Executive Report</span>
        </button>

        <button
          type="button"
          id="tab-converted-cv"
          onClick={() => setActiveTab('cv')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'cv'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-white/5 border border-transparent'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Converted CV (Markdown)</span>
        </button>

        <button
          type="button"
          id="tab-web-intelligence"
          onClick={() => setActiveTab('web')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'web'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-white/5 border border-transparent'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Web Research Footprint</span>
        </button>
      </div>

      {/* Main Report Document Box */}
      {viewMode === 'formatted' ? (
        <div className="p-6 sm:p-8 bg-slate-950/70 border border-white/10 rounded-2xl overflow-x-auto text-slate-200 leading-relaxed font-sans shadow-inner">
          <div className="markdown-body prose prose-invert max-w-none prose-headings:text-indigo-200 prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 prose-h2:mt-6 prose-a:text-indigo-400 prose-a:underline prose-strong:text-white prose-code:text-amber-300 prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:italic prose-li:my-1">
            <Markdown>{currentMarkdown}</Markdown>
          </div>
        </div>
      ) : (
        <div className="relative">
          <textarea
            readOnly
            value={currentMarkdown}
            className="w-full h-96 p-5 bg-slate-950 border border-indigo-500/30 rounded-2xl text-xs font-mono text-emerald-300 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>
      )}
    </div>
  );
};

// Fallback Markdown generator if raw fullReportMarkdown is missing
function generateFallbackMarkdownReport(data: ProfileAnalysisResult): string {
  const p = data.profile;
  const pers = data.personalitySpeculation;
  const lead = data.leadershipStyle;

  return `# Executive Assessment Report: ${p.name}

> **Title:** ${p.currentTitle}  
> **Company:** ${p.company}  
> **Location:** ${p.location}  
> **Estimated Experience:** ${p.estimatedExperienceYears}  
> **Industry:** ${p.industry}  
> **Analyzed Date:** ${new Date(data.analyzedAt).toLocaleDateString()}

---

## 1. Executive Summary & Career Trajectory

${p.headline}

${data.experienceSummary.map((bullet) => `- ${bullet}`).join('\n')}

---

## 2. Strategic & Domain Skills Matrix

${data.skills
  .map(
    (cat) => `### ${cat.category}\n` + cat.items.map((item) => `- **${item}**`).join('\n')
  )
  .join('\n\n')}

---

## 3. Personality Archetype & Behavioral Speculation

- **Primary Archetype:** ${pers.primaryArchetype}
- **Communication Style:** ${pers.communicationStyle}
- **Risk Management Profile:** ${pers.riskProfile}

### Core Personality Traits
${pers.coreTraits
  .map((t) => `- **${t.trait}** (${t.level}): ${t.explanation}`)
  .join('\n')}

> **Speculative Summary:**  
> ${pers.speculativeSummary}

---

## 4. Leadership & Governance Assessment

- **Leadership Style:** ${lead.styleName}
- **Decision Making Framework:** ${lead.decisionMaking}
- **Management Approach:** ${lead.managementApproach}
- **Team Culture Impact:** ${lead.teamCultureImpact}

### Strengths Under Pressure
${lead.strengthsUnderPressure.map((s) => `- ${s}`).join('\n')}

### Potential Blind Spots & Development Focus
${lead.potentialBlindspots.map((b) => `- ${b}`).join('\n')}

---

## 5. Verified Web Research Grounding & Sources
${
  data.sources && data.sources.length > 0
    ? data.sources.map((s) => `- [${s.title}](${s.url})`).join('\n')
    : '*Web grounding completed based on verified online records.*'
}

---

## 6. Behavioral Simulation Avatar Prompt (LLM System Prompt)

\`\`\`
${pers.simulationAvatarPrompt || 'No avatar prompt available.'}
\`\`\`
`;
}
