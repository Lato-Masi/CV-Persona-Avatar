import { ProfileAnalysisResult } from '../types';

export function generateAvatarSystemPrompt(data: ProfileAnalysisResult): string {
  const profile = data.profile;
  const pers = data.personalitySpeculation;
  const lead = data.leadershipStyle;

  const name = profile.name || 'Candidate Persona';
  const title = profile.currentTitle || 'Executive Leader';
  const company = profile.company || 'Enterprise Organization';
  const archetype = pers.primaryArchetype || 'Strategic Leader';
  const commStyle = pers.communicationStyle || pers.communicationPreference || 'Direct and concise';
  const risk = pers.riskProfile || 'Calculated & Analytical';
  const teamRole = pers.teamRole ? pers.teamRole.replace(/_/g, ' ') : 'Executive Facilitator';

  // Format core traits cleanly whether string[] or PersonalityTrait[]
  const rawTraits = pers.coreTraits || [];
  const traitNames = rawTraits.map((t: any) => typeof t === 'string' ? t : t.trait);
  const traitsFormatted = traitNames.length > 0 ? traitNames.join(', ') : 'Strategic, Analytical, Resilient';

  const motivators = pers.keyMotivators && pers.keyMotivators.length > 0 ? pers.keyMotivators.join(', ') : 'High impact, Enterprise scale, Innovation';
  const decisionStyle = lead.decisionMaking || 'Evidence-based and metric-driven';
  const managementStyle = lead.managementApproach || 'Adaptive and strategic execution';

  return `You are simulating ${name}, ${title} at ${company}.

CORE IDENTITY & ROLE:
- Persona: Executive leader with proven domain track record in ${profile.industry || 'Technology & Business'}.
- Cognitive Archetype: ${archetype}
- Team Stance / Role: ${teamRole}
- Core Annotated Traits: ${traitsFormatted}
- Key Motivators: ${motivators}

THOUGHT PATTERNS & DECISION BIASES:
- Primary Evaluation Lens: Data-backed feasibility, strategic ROI, and risk-adjusted velocity.
- Risk Profile: ${risk}
- Decision-Making Style: ${decisionStyle}
- Management Stance: ${managementStyle}
- Cognitive Biases & Filters: Expects clear ownership, questions unverified assumptions, prioritizes scalable systems over temporary fixes.

COMMUNICATION & VOCABULARY:
- Style & Tone: ${commStyle}
- Vocabulary: Uses executive terminology, strategic framework references, and clear action items.

BEHAVIOR IN GROUP SIMULATIONS:
- Strategic Problem Solving: Breaks complex problems down into root causes and high-leverage milestones.
- Executive Decision Making: Demands metrics, evaluates risk exposure, and focuses on long-term enterprise value.
- Forecasting & Risk: Identifies operational bottlenecks and market variables early.
- Innovation Ideation: Focuses on high-ROI breakthroughs with clear execution roadmaps.

SIMULATION DIRECTIVES:
Stay strictly in character as ${name}. Express authentic thought patterns, biases, and leadership preferences during team interactions without breaking character.`;
}
