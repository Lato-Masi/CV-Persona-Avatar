export interface ProfileSkillCategory {
  category: string;
  items: string[];
}

export interface PersonalityTrait {
  trait: string;
  level: 'High' | 'Moderate' | 'Balanced';
  explanation: string;
}

export interface BigFiveTraits {
  openness: string;
  conscientiousness: string;
  extraversion: string;
  agreeableness: string;
  neuroticism: string;
}

export interface PersonalityAnalysis {
  primaryArchetype: string;
  myersBriggs?: string;
  enneagram?: string;
  bigFive?: BigFiveTraits;
  coreTraits: PersonalityTrait[];
  communicationStyle: string;
  communicationPreference?: string;
  riskProfile: string;
  keyMotivators: string[];
  teamRole?: string;
  speculativeSummary: string;
  simulationAvatarPrompt?: string;
}

export interface LeadershipAnalysis {
  styleName: string;
  leadershipDevelopmentStage?: string;
  decisionMaking: string;
  managementApproach: string;
  teamCultureImpact: string;
  strengthsUnderPressure: string[];
  potentialBlindspots: string[];
  conflictResolutionStyle?: string;
  executivePresenceLevel?: string;
}

export interface ProfileInfo {
  name: string;
  currentTitle: string;
  company: string;
  location: string;
  headline: string;
  estimatedExperienceYears: string;
  industry: string;
  avatarInitials: string;
  linkedInUrl: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ProfileAnalysisResult {
  id: string;
  profile: ProfileInfo;
  experienceSummary: string[];
  skills: ProfileSkillCategory[];
  personalitySpeculation: PersonalityAnalysis;
  leadershipStyle: LeadershipAnalysis;
  endorsementsInferences: string[];
  sources?: GroundingSource[];
  analyzedAt: string;
  notes?: string;
  offlineSynthesized?: boolean;
  isUnverifiedOrNotFound?: boolean;
  fallbackNotice?: string;
  // Markdown & File Upload Fields
  cvMarkdown?: string;
  webIntelligenceMarkdown?: string;
  fullReportMarkdown?: string;
  uploadedFileName?: string;
  webVerificationConfidence?: 'High' | 'Medium' | 'Unverified';
}

export type FocusAreaLens = 
  | 'general' 
  | 'executive_readiness' 
  | 'tech_leadership' 
  | 'entrepreneurship'
  | 'sales_marketing'
  | 'innovation_inventor'
  | 'operations'
  | 'legal_finance';

export interface LensOption {
  id: FocusAreaLens;
  label: string;
  description: string;
  category: string;
}

export const LENS_OPTIONS: LensOption[] = [
  {
    id: 'general',
    label: 'Comprehensive Executive',
    description: 'General leadership, career growth, core capabilities, and overall management profile',
    category: 'General'
  },
  {
    id: 'executive_readiness',
    label: 'C-Suite & Board Readiness',
    description: 'Corporate governance, board presence, enterprise risk, and strategic capital allocation',
    category: 'Leadership'
  },
  {
    id: 'tech_leadership',
    label: 'Technical Architecture & Scale',
    description: 'Software architecture, engineering leadership, cloud infrastructure, AI, and R&D velocity',
    category: 'Technology'
  },
  {
    id: 'entrepreneurship',
    label: 'Founder & Venture Innovation',
    description: 'Zero-to-one product creation, VC fundraising, market validation, and pivot agility',
    category: 'Ventures'
  },
  {
    id: 'sales_marketing',
    label: 'Sales, Revenue & GTM Marketing',
    description: 'Go-To-Market strategy, enterprise sales, pipeline execution, customer acquisition, and ARR growth',
    category: 'Revenue'
  },
  {
    id: 'innovation_inventor',
    label: 'Innovation, R&D & Patents',
    description: 'Invention disclosures, patent portfolios, technology breakthroughs, and research leadership',
    category: 'R&D'
  },
  {
    id: 'operations',
    label: 'Operations, Supply Chain & Scaling',
    description: 'Process optimization, global supply chain, operational resilience, and cost efficiency',
    category: 'Operations'
  },
  {
    id: 'legal_finance',
    label: 'Legal, Corporate Governance & Finance',
    description: 'M&A due diligence, financial strategy, regulatory compliance, legal risk, and capital structure',
    category: 'Finance & Legal'
  }
];

export interface AnalyzeRequest {
  url: string;
  pastedText?: string;
  focusArea?: FocusAreaLens;
}

export interface SampleProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  url: string;
  avatarColor: string;
  description: string;
}
