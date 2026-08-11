import React, { useState } from 'react';
import { ExternalLink, Bookmark, Check, Share2, Briefcase, MapPin, Building2, Calendar, Award, AlertTriangle } from 'lucide-react';
import { ProfileAnalysisResult } from '../types';

interface ProfileHeaderCardProps {
  data: ProfileAnalysisResult;
  onSaveHistory: (result: ProfileAnalysisResult) => void;
  isSaved: boolean;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  data,
  onSaveHistory,
  isSaved,
}) => {
  const { profile, personalitySpeculation, leadershipStyle } = data;
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const textToCopy = `
=== EXECUTIVE PROFILE SUMMARY: ${profile.name} ===
Title: ${profile.currentTitle} at ${profile.company}
Location: ${profile.location} | Industry: ${profile.industry}
Estimated Experience: ${profile.estimatedExperienceYears}

--- CAREER & EXPERIENCE SUMMARY ---
${data.experienceSummary.map((bullet) => `• ${bullet}`).join('\n')}

--- KEY SKILLS & EXPERTISE ---
${data.skills.map((s) => `${s.category}: ${s.items.join(', ')}`).join('\n')}

--- PERSONALITY & ARCHETYPE (SPECULATION) ---
Primary Archetype: ${personalitySpeculation.primaryArchetype}
Communication Style: ${personalitySpeculation.communicationStyle}
Risk Profile: ${personalitySpeculation.riskProfile}
Summary: ${personalitySpeculation.speculativeSummary}

--- LEADERSHIP STYLE ---
Style: ${leadershipStyle.styleName}
Decision Making: ${leadershipStyle.decisionMaking}
Management Approach: ${leadershipStyle.managementApproach}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
      {/* Top Decorative Banner */}
      <div className="h-28 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-emerald-950/80 relative p-4 flex items-end justify-end border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        <div className="relative z-10 flex items-center space-x-2">
          <button
            id="copy-summary-report-btn"
            onClick={handleCopySummary}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-md border border-white/20 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-indigo-300" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            id="save-profile-history-btn"
            onClick={() => onSaveHistory(data)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md border transition ${
              isSaved
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isSaved ? 'Saved in History' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Details */}
      <div className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between -mt-12 mb-4 gap-4">
          <div className="flex items-end space-x-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-500 text-white flex items-center justify-center font-black text-2xl shadow-xl border-4 border-[#0f172a]">
              {profile.avatarInitials || 'EP'}
            </div>
            <div className="pt-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">{profile.name}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Profile Analyzed
                </span>
                {data.isUnverifiedOrNotFound ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    LinkedIn Auth Wall Protected
                  </span>
                ) : data.offlineSynthesized ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Offline Model Mode
                  </span>
                ) : null}
              </div>
              <p className="text-sm font-semibold text-indigo-300 mt-0.5">
                {profile.currentTitle} {profile.company ? `at ${profile.company}` : ''}
              </p>
            </div>
          </div>

          {profile.linkedInUrl && (
            <a
              href={profile.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md self-start md:self-auto transition"
            >
              <span>View LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-300" />
            </a>
          )}
        </div>

        {/* Headline */}
        {profile.headline && (
          <p className="text-sm text-slate-300 italic mb-4 bg-white/5 p-3.5 rounded-xl border border-white/10 backdrop-blur-md">
            "{profile.headline}"
          </p>
        )}

        {/* Unverified / Login Wall Warning Notice */}
        {data.isUnverifiedOrNotFound && (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border border-amber-500/30 text-slate-200 text-xs space-y-2 backdrop-blur-md shadow-lg">
            <div className="flex items-center space-x-2 font-bold text-amber-300 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <span>LinkedIn Profile Login Wall Protected</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              LinkedIn restricts direct automated scraping of private profiles. To prevent fabricating generic or fake details, we do not hallucinate work history.
            </p>
            <div className="pt-1 font-semibold text-white flex flex-wrap items-center gap-2">
              <span className="text-indigo-300">💡 How to analyze this candidate with 100% accuracy:</span>
              <span className="text-amber-200 font-normal">Copy their LinkedIn "About" section or resume text and paste it in the "Add Supplemental Text" box above.</span>
            </div>
          </div>
        )}

        {/* Key Metadata Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Company</div>
              <div className="font-semibold text-slate-200 truncate">{profile.company || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Location</div>
              <div className="font-semibold text-slate-200 truncate">{profile.location || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Tenure</div>
              <div className="font-semibold text-slate-200 truncate">{profile.estimatedExperienceYears || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Industry</div>
              <div className="font-semibold text-slate-200 truncate">{profile.industry || 'Tech'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
