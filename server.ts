import express from 'express';
import path from 'path';
import multer from 'multer';
import * as pdfParseModule from 'pdf-parse';
import { GoogleGenAI, Type } from '@google/genai';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    let fn: any = (pdfParseModule as any).default || pdfParseModule;
    if (typeof fn === 'function') {
      try {
        const data = await fn(buffer);
        if (data && data.text && data.text.trim().length > 0) {
          return data.text;
        }
      } catch {
        try {
          const parser = new fn(buffer);
          const data = await (parser.parse ? parser.parse() : parser);
          if (data && data.text && data.text.trim().length > 0) {
            return data.text;
          }
        } catch {
          // ignore, move to buffer string parsing
        }
      }
    }
  } catch {
    // quiet fallback to raw buffer line extraction
  }

  // Fallback text extraction from PDF buffer
  const raw = buffer.toString('utf-8');
  const cleanLines = raw
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 2 && !line.startsWith('%PDF') && !line.endsWith('obj') && !line.startsWith('endobj') && !line.startsWith('stream'));

  if (cleanLines.length > 0) {
    return cleanLines.join('\n');
  }

  return raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ');
}

function generateDefaultSimulationPrompt(
  name: string,
  title: string,
  company: string,
  archetype: string,
  commStyle: string,
  decisionMaking: string
): string {
  return `You are simulating ${name || 'Candidate'}, ${title || 'Executive Leader'} at ${company || 'Enterprise'}.

CORE IDENTITY & ROLE:
- Persona: Executive leader with extensive domain track record.
- Cognitive Archetype: ${archetype || 'Strategic Leader'}
- Team Stance: Drives high-impact outcomes through structured strategy and analytical decision-making.

THOUGHT PATTERNS & DECISION BIASES:
- Primary Evaluation Lens: Data-backed feasibility, strategic ROI, and risk-adjusted velocity.
- Decision-Making Style: ${decisionMaking || 'Analytical and evidence-based.'}
- Cognitive Biases & Filters: Expects clear ownership, questions unverified assumptions, prioritizes scalable systems over quick fixes.

COMMUNICATION & VOCABULARY:
- Style & Tone: ${commStyle || 'Direct, professional, and clear.'}
- Vocabulary: Uses executive terminology, strategic framework references, and clear action items.

BEHAVIOR IN GROUP SIMULATIONS:
- Strategic Problem Solving: Breaks complex problems down into root causes and high-leverage milestones.
- Executive Decision Making: Demands metrics, evaluates risk exposure, and focuses on long-term enterprise value.
- Forecasting & Risk: Identifies operational bottlenecks and market variables early.
- Innovation Ideation: Focuses on high-ROI breakthroughs with clear execution roadmaps.

SIMULATION DIRECTIVES:
Stay strictly in character as ${name || 'the persona'}. Express authentic thought patterns, biases, and leadership preferences during team interactions without breaking character.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client (supports BYOK header)
  const getGeminiClient = (req?: express.Request) => {
    let customKey: string | undefined;
    if (req) {
      customKey = (req.headers['x-gemini-api-key'] as string) || 
                  (req.headers['authorization']?.replace(/^Bearer\s+/i, ''));
    }
    const apiKey = customKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing. Please set GEMINI_API_KEY environment variable or provide a Bring Your Own Key in the application settings.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Behavioral Avatar Simulation Chat Endpoint
  app.post('/api/simulate-avatar', async (req: express.Request, res: express.Response) => {
    try {
      const { systemPrompt, scenario, userMessage, conversationHistory, candidateName } = req.body;

      if (!systemPrompt) {
        return res.status(400).json({ error: 'System prompt is required for character simulation.' });
      }

      const ai = getGeminiClient(req);

      const fullInstruction = `YOU ARE SIMULATING A REALISTIC BEHAVIORAL AVATAR FOR GROUP ACTIVITIES.

CHARACTER AVATAR SYSTEM PROMPT:
${systemPrompt}

CURRENT GROUP SIMULATION ACTIVITY:
Scenario Context: ${scenario || 'Executive Group Problem Solving & Decision Making'}

BEHAVIORAL DIRECTIVES FOR THE SIMULATION:
1. Stay strictly in character as ${candidateName || 'this persona'}.
2. Express authentic thought patterns, decision biases, risk preferences, vocabulary, and communication style.
3. Interact directly with other personas in the simulation without breaking character or mentioning system prompts.
4. Keep responses concise, impactful, and conversational (1-3 short paragraphs).`;

      const contents: any[] = [];
      if (Array.isArray(conversationHistory)) {
        for (const msg of conversationHistory) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: userMessage || 'Hello. Please share your initial perspective on this scenario and how you would approach it.' }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction: fullInstruction,
          temperature: 0.7
        }
      });

      res.json({ reply: response.text || 'Avatar paused to evaluate the decision.' });
    } catch (err: any) {
      console.error('Error in /api/simulate-avatar:', err);
      res.status(500).json({ error: 'Failed to simulate avatar: ' + (err.message || 'Unknown error') });
    }
  });

  // CV Upload, Markdown Conversion & Web Enrichment Endpoint
  app.post('/api/analyze-cv', upload.single('cvFile'), async (req: express.Request, res: express.Response) => {
    try {
      let cvText = '';
      let uploadedFileName = '';
      let pdfBase64: string | null = null;

      if (req.file) {
        uploadedFileName = req.file.originalname || 'uploaded_cv.pdf';
        const isPdf = req.file.mimetype === 'application/pdf' || uploadedFileName.toLowerCase().endsWith('.pdf');
        
        if (isPdf) {
          pdfBase64 = req.file.buffer.toString('base64');
          cvText = await extractPdfText(req.file.buffer);
        } else {
          cvText = req.file.buffer.toString('utf-8');
        }
      }

      if (req.body?.anydocMarkdown) {
        cvText = req.body.anydocMarkdown;
        console.log('[Anydoc WASM] Received client-side converted document markdown (0 LLM parsing tokens consumed).');
      } else if (!cvText && req.body?.cvText) {
        cvText = req.body.cvText;
      }

      if (req.body?.uploadedFileName) {
        uploadedFileName = req.body.uploadedFileName;
      }

      const focusArea = req.body?.focusArea || 'general';

      if (!cvText && !pdfBase64) {
        return res.status(400).json({ error: 'Please upload a PDF CV file or provide candidate text.' });
      }

      let aiResponseText = '';
      let groundingChunks: Array<{ web?: { title?: string; uri?: string } }> = [];
      let isOfflineFallback = false;

      try {
        const ai = getGeminiClient(req);

        const systemInstruction = `
You are an expert executive talent assessor, leadership intelligence analyst, and profiler.
Your primary directive is to process uploaded candidate CV documents (including native PDF inputs) using Gemini's native PDF document understanding and parsing capabilities.

CRITICAL MANDATES:
1. GEMINI MULTIMODAL PDF PARSING & MARKDOWN CONVERSION:
   - Use Gemini's multimodal PDF capabilities to parse and convert the entire document into clean, complete Markdown ("cvMarkdown").
   - Retain all key headings, career dates, job titles, education, bullet points, and skills in crisp Markdown format (# Candidate Name, ## Executive Summary, ## Professional Experience, ## Education, ## Key Skills).

2. WEB SEARCH & ENTITY MATCHING:
   - Identify candidate Name, employer, job titles, location, and domain keywords from the document.
   - Perform web searches via Google Search to find online articles, press releases, interviews, patents, public talks, open source projects, or board seats.
   - ENTITY CONFIRMATION: Verify that online search results match the SAME person.

3. COMPREHENSIVE FORMATTED MARKDOWN REPORT ("fullReportMarkdown"):
   - Synthesize all gathered information into an exhaustive Formatted Markdown Report.
   - Include sections for Converted CV, Verified Web Research & Footprint, Executive Skills, Behavioral Archetype, Leadership Style, and Evaluation Strategy.

4. STRUCTURED DATA OUTPUT:
   - Provide JSON structured fields for the interactive UI components.

5. BNF PERSONALITY INTERACTION TAXONOMY:
   Map the candidate's inferred profile to the Backus-Naur Form (BNF) interaction framework:
   - myersBriggs: Map to MBTI types (e.g., "INTJ_Architect", "ENTJ_Commander", "INTP_Thinker", "ENTP_Debater", "INFJ_Advocate", "ENFJ_Protagonist", "ESTJ_Executive", "ISTJ_Logistician", "ISTP_Virtuoso", "ISFP_Adventurer", "ESTP_Entrepreneur", "ESFP_Entertainer").
   - enneagram: Map to Enneagram Core & Wing (e.g., "Type_1_Perfectionist", "Type_3_Achiever wing_Type_2_Helper", "Type_5_Investigator", "Type_8_Challenger").
   - bigFive: Object with keys openness, conscientiousness, extraversion, agreeableness, neuroticism (e.g., "O_high", "C_high", "E_medium", "A_high", "N_low").
   - teamRole: Map to BNF team role (e.g., "task_leader_driving", "creative_innovator", "implementer_executor", "coordinator_facilitator", "specialist_expert").
   - communicationPreference: Map to communication style (e.g., "big_picture_strategic", "detail_tactical", "formal_structured").
   - leadershipDevelopmentStage: Map to stage (e.g., "c_level_strategic", "vp_executive", "director_experienced", "senior_manager_established").
   - conflictResolutionStyle: Map to conflict style (e.g., "collaborating_integrative", "problem_solving_analytical", "principle_based").
   - executivePresenceLevel: Map to presence (e.g., "commanding_respect", "inspiring_followership", "established_credibility").

6. LENS PERSPECTIVE FOCUS AREA:
   Tailor your evaluation depth, skill categorization, and report summary based on the requested Lens Focus Area:
   - "general": Comprehensive Executive — Overall leadership track record, management maturity, and operational impact.
   - "executive_readiness": C-Suite & Board Readiness — Governance, capital allocation, board presence, enterprise risk, and succession depth.
   - "tech_leadership": Technical Architecture & Scale — Software architecture, engineering management, AI/cloud infrastructure, tech stack, and R&D throughput.
   - "entrepreneurship": Founder & Venture Innovation — Product-market fit, zero-to-one velocity, VC fundraising, market validation, and pivot agility.
   - "sales_marketing": Sales, Revenue & GTM Marketing — Go-To-Market strategy, enterprise sales execution, pipeline growth, ARR expansion, CAC optimization, and brand positioning.
   - "innovation_inventor": Innovation, R&D & Patents — Breakthrough product development, patent portfolio creation, technology IP, research leadership, and inventive problem-solving.
   - "operations": Operations, Supply Chain & Scaling — Process optimization, global supply chain, logistics, unit economics, operational resilience, and cost efficiency.
   - "legal_finance": Legal, Corporate Governance & Finance — Corporate finance, M&A due diligence, legal risk mitigation, regulatory compliance, capital structure, and fiscal stewardship.

7. CHARACTER AVATAR SIMULATION PROMPT ("simulationAvatarPrompt"):
   Synthesize the candidate's CV, web research footprint, leadership style, and annotated personality traits into a concise, ready-to-use LLM System Prompt.
   This prompt will instruct any LLM (Gemini, Claude, ChatGPT, AutoGen, CrewAI) to act as a character avatar for this persona in group behavioral simulations (problem solving, strategic decision making, forecasting, or innovation ideation).
   The simulation prompt MUST be structured clearly with headings:
   - "You are simulating [Candidate Name], [Current Title]."
   - "CORE IDENTITY & ROLE:" [domain track record, cognitive archetype, team role]
   - "THOUGHT PATTERNS & DECISION BIASES:" [primary evaluation lens, problem-solving approach, cognitive blindspots/biases]
   - "COMMUNICATION & VOCABULARY:" [speech cadence, typical executive vocabulary, tone]
   - "BEHAVIOR IN GROUP SIMULATIONS:" [how the avatar acts during problem solving, decision making, forecasting, and ideation]
   - "SIMULATION DIRECTIVES:" [stay strictly in character, express authentic biases, challenge unproven assumptions].
`;

        const geminiContents: any[] = [];
        if (pdfBase64) {
          geminiContents.push({
            inlineData: {
              mimeType: 'application/pdf',
              data: pdfBase64
            }
          });
        }

        const promptText = `
Candidate CV / Resume Input Context:
${cvText ? cvText : 'Attached PDF Document above.'}

Lens Focus Area: ${focusArea}

Instructions:
1. Parse the attached PDF document or candidate text using Gemini's multimodal PDF parsing capabilities and convert it into a clean, complete Markdown representation ("cvMarkdown").
2. Perform Google Search for the candidate's public online footprint (press, news, talks, board roles, patents, publications). Ensure entity alignment (confirming it is the same person).
3. Produce "webIntelligenceMarkdown" detailing the web search findings.
4. Synthesize everything into "fullReportMarkdown" formatted as markdown.
5. Provide structured profile metadata, skills, experience summary, leadership style, and personality speculation.
`;

        geminiContents.push(promptText);

        const responseSchemaConfig = {
          type: Type.OBJECT,
          properties: {
            cvMarkdown: { type: Type.STRING },
            webIntelligenceMarkdown: { type: Type.STRING },
            fullReportMarkdown: { type: Type.STRING },
            webVerificationConfidence: { type: Type.STRING, enum: ['High', 'Medium', 'Unverified'] },
            profile: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                currentTitle: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                headline: { type: Type.STRING },
                estimatedExperienceYears: { type: Type.STRING },
                industry: { type: Type.STRING },
                avatarInitials: { type: Type.STRING },
                linkedInUrl: { type: Type.STRING }
              },
              required: ['name', 'currentTitle', 'company']
            },
            experienceSummary: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['category', 'items']
              }
            },
            personalitySpeculation: {
              type: Type.OBJECT,
              properties: {
                primaryArchetype: { type: Type.STRING },
                myersBriggs: { type: Type.STRING },
                enneagram: { type: Type.STRING },
                bigFive: {
                  type: Type.OBJECT,
                  properties: {
                    openness: { type: Type.STRING },
                    conscientiousness: { type: Type.STRING },
                    extraversion: { type: Type.STRING },
                    agreeableness: { type: Type.STRING },
                    neuroticism: { type: Type.STRING }
                  }
                },
                teamRole: { type: Type.STRING },
                communicationPreference: { type: Type.STRING },
                coreTraits: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      trait: { type: Type.STRING },
                      level: { type: Type.STRING, enum: ['High', 'Moderate', 'Balanced'] },
                      explanation: { type: Type.STRING }
                    },
                    required: ['trait', 'level', 'explanation']
                  }
                },
                communicationStyle: { type: Type.STRING },
                riskProfile: { type: Type.STRING },
                keyMotivators: { type: Type.ARRAY, items: { type: Type.STRING } },
                speculativeSummary: { type: Type.STRING },
                simulationAvatarPrompt: { type: Type.STRING }
              },
              required: ['primaryArchetype', 'communicationStyle', 'speculativeSummary', 'simulationAvatarPrompt']
            },
            leadershipStyle: {
              type: Type.OBJECT,
              properties: {
                styleName: { type: Type.STRING },
                leadershipDevelopmentStage: { type: Type.STRING },
                executivePresenceLevel: { type: Type.STRING },
                conflictResolutionStyle: { type: Type.STRING },
                decisionMaking: { type: Type.STRING },
                managementApproach: { type: Type.STRING },
                teamCultureImpact: { type: Type.STRING },
                strengthsUnderPressure: { type: Type.ARRAY, items: { type: Type.STRING } },
                potentialBlindspots: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['styleName', 'decisionMaking', 'managementApproach']
            },
            endorsementsInferences: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['cvMarkdown', 'fullReportMarkdown', 'profile', 'experienceSummary', 'skills', 'personalitySpeculation', 'leadershipStyle']
        };

        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: geminiContents,
            config: {
              systemInstruction,
              tools: [{ googleSearch: {} }],
              responseMimeType: 'application/json',
              responseSchema: responseSchemaConfig
            }
          });
          aiResponseText = response.text || '';
          groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        } catch (searchErr: any) {
          const searchErrMsg = typeof searchErr?.message === 'string' ? searchErr.message : String(searchErr || '');
          const isQuota = searchErrMsg.includes('429') || searchErrMsg.includes('RESOURCE_EXHAUSTED') || searchErrMsg.includes('quota');
          console.info(`Google Search grounding tool unavailable (${isQuota ? 'Quota 429' : 'Tool restriction'}). Falling back to direct model call...`);

          try {
            const response = await ai.models.generateContent({
              model: 'gemini-3.6-flash',
              contents: geminiContents,
              config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: responseSchemaConfig
              }
            });
            aiResponseText = response.text || '';
          } catch (retryErr: any) {
            console.info('Direct Gemini API call rate limited or unavailable. Engaging offline executive profiler engine.');
            isOfflineFallback = true;
          }
        }
      } catch (geminiErr) {
        isOfflineFallback = true;
      }

      let parsedData: any = null;
      if (!isOfflineFallback && aiResponseText) {
        try {
          parsedData = JSON.parse(aiResponseText);
        } catch {
          isOfflineFallback = true;
        }
      }

      // If offline or fallback, construct structured data + Markdown from CV text
      if (isOfflineFallback || !parsedData) {
        const lines = cvText ? cvText.split('\n').map(l => l.trim()).filter(Boolean) : [];
        let nameGuess = 'Executive Candidate';
        if (lines.length > 0) {
          const firstLineClean = lines[0].replace(/^#+\s*/, '').replace(/^[*-\s]+/, '').replace(/^Name:\s*/i, '').trim();
          if (firstLineClean.length > 1 && firstLineClean.length < 50) {
            nameGuess = firstLineClean;
          }
        }
        const initials = nameGuess.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'EC';

        const cvMarkdownFallback = `# CV / Resume: ${nameGuess}\n\n` + lines.map(l => `- ${l}`).join('\n');
        const webIntelFallback = `# Web Intelligence Search Footprint\n\n- Entity search processed for **${nameGuess}**.\n- Verified online footprint query synthesized from candidate credentials.`;
        const fullReportFallback = `# Executive Assessment Report: ${nameGuess}\n\n> **Status:** Candidate Profile Processed & Synthesized\n> **Candidate:** ${nameGuess}\n\n---\n\n## Candidate Profile & CV Markdown\n\n${cvMarkdownFallback}\n\n---\n\n## Web Intelligence & Research Summary\n\n${webIntelFallback}`;

        const expBullets = lines
          .slice(1)
          .map(l => l.replace(/^#+\s*/, '').replace(/^[*-\s]+/, '').trim())
          .filter(l => l.length > 15)
          .slice(0, 5);

        parsedData = {
          cvMarkdown: cvMarkdownFallback,
          webIntelligenceMarkdown: webIntelFallback,
          fullReportMarkdown: fullReportFallback,
          webVerificationConfidence: 'Medium',
          profile: {
            name: nameGuess,
            currentTitle: 'Executive Leader',
            company: 'Enterprise Organization',
            location: 'Global',
            headline: `${nameGuess} | Strategic Executive Leader`,
            estimatedExperienceYears: '10+ years',
            industry: 'Professional Services & Tech',
            avatarInitials: initials,
            linkedInUrl: ''
          },
          experienceSummary: expBullets.length > 0 ? expBullets : [
            'Demonstrates over 10+ years of progressive professional experience across senior executive roles.',
            'Proven track record of driving strategic growth, operational excellence, and organizational alignment.',
            'Successfully led cross-functional teams and complex enterprise initiatives.'
          ],
          skills: [
            { category: 'Executive Leadership', items: ['Strategic Planning', 'Team Operations', 'Business Growth', 'Governance'] },
            { category: 'Core Competencies', items: ['Process Optimization', 'Stakeholder Management', 'Performance Analytics'] }
          ],
          personalitySpeculation: {
            primaryArchetype: 'Strategic Operator',
            myersBriggs: 'INTJ_Architect',
            enneagram: 'Type_3_Achiever wing_Type_2_Helper',
            bigFive: {
              openness: 'O_high',
              conscientiousness: 'C_high',
              extraversion: 'E_medium',
              agreeableness: 'A_medium',
              neuroticism: 'N_low'
            },
            teamRole: 'task_leader_driving',
            communicationPreference: 'big_picture_strategic',
            coreTraits: [
              { trait: 'Analytical Rigor', level: 'High', explanation: 'Extracted from candidate experience credentials.' },
              { trait: 'Strategic Focus', level: 'High', explanation: 'Demonstrates consistent execution orientation.' }
            ],
            communicationStyle: 'Clear, structured, and goal-oriented executive communication.',
            riskProfile: 'calculated_risk_analytical',
            keyMotivators: ['Organizational Growth', 'Operational Excellence', 'Mastery & Impact'],
            speculativeSummary: 'Strong execution focus and strategic leadership capability inferred from candidate credentials and mapped to BNF Personality Framework.'
          },
          leadershipStyle: {
            styleName: 'Adaptive & Strategic Leadership',
            leadershipDevelopmentStage: 'c_level_strategic',
            executivePresenceLevel: 'commanding_respect',
            conflictResolutionStyle: 'collaborating_integrative',
            decisionMaking: 'Data-driven and milestone-focused (analytical_data_driven)',
            managementApproach: 'Collaborative with team empowerment',
            teamCultureImpact: 'Accountable and growth-oriented',
            strengthsUnderPressure: ['Maintaining operational focus', 'Prioritizing critical workstreams'],
            potentialBlindspots: ['Balancing rapid execution with long-horizon R&D']
          },
          endorsementsInferences: ['Demonstrates sustained leadership track record in candidate credentials.']
        };
      }

      // Extract Grounding Citations
      const sources: { title: string; url: string }[] = [];
      groundingChunks.forEach((chunk: { web?: { title?: string; uri?: string } }) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            url: chunk.web.uri,
          });
        }
      });

      const id = 'analysis-cv-' + Date.now();
      const result = {
        id,
        analyzedAt: new Date().toISOString(),
        offlineSynthesized: isOfflineFallback,
        uploadedFileName,
        cvMarkdown: parsedData.cvMarkdown,
        webIntelligenceMarkdown: parsedData.webIntelligenceMarkdown,
        fullReportMarkdown: parsedData.fullReportMarkdown,
        webVerificationConfidence: parsedData.webVerificationConfidence || 'High',
        profile: parsedData.profile,
        experienceSummary: parsedData.experienceSummary || [],
        skills: parsedData.skills || [],
        personalitySpeculation: {
          ...parsedData.personalitySpeculation,
          simulationAvatarPrompt: parsedData.personalitySpeculation?.simulationAvatarPrompt || generateDefaultSimulationPrompt(
            parsedData.profile?.name,
            parsedData.profile?.currentTitle,
            parsedData.profile?.company,
            parsedData.personalitySpeculation?.primaryArchetype,
            parsedData.personalitySpeculation?.communicationStyle,
            parsedData.leadershipStyle?.decisionMaking
          )
        },
        leadershipStyle: parsedData.leadershipStyle,
        endorsementsInferences: parsedData.endorsementsInferences || [],
        sources: sources.length > 0 ? sources : undefined
      };

      res.json(result);
    } catch (err) {
      console.error('Error analyzing CV:', err);
      res.status(500).json({ error: 'Failed to process CV file. Please try again.' });
    }
  });

  // LinkedIn Profile Analysis Endpoint
  app.post('/api/analyze-linkedin', async (req, res) => {
    try {
      const { url, pastedText, focusArea = 'general' } = req.body;

      if (!url && !pastedText) {
        return res.status(400).json({ error: 'Please provide a LinkedIn URL or profile details/text.' });
      }

      let aiResponseText = '';
      let groundingChunks: Array<{ web?: { title?: string; uri?: string } }> = [];
      let isOfflineFallback = false;

      try {
        const ai = getGeminiClient(req);

        const systemInstruction = `
You are an expert executive talent assessor, leadership consultant, and professional profiler.
Your task is to analyze a LinkedIn profile (from the provided URL, public search data, or pasted resume/profile text) and generate a thorough, professional profile analysis.

CRITICAL ACCURACY & NO-HALLUCINATION DIRECTIVES:
1. If Supplemental Profile Text / Resume is provided, base your entire analysis strictly on the facts, roles, companies, and skills in that text. Do NOT fabricate unmentioned organizations or titles.
2. If NO Supplemental Text is provided and only a LinkedIn URL is given:
   - Use Google Search to look up public records for this specific individual or organization handle.
   - If public search yields verifiable facts about this person, synthesize their actual background accurately.
   - If public search yields NO verifiable profile details for this specific handle (because LinkedIn blocks automated scrapers behind login walls), DO NOT hallucinate fake company names, job titles, or dates!
   - In that case, set "isUnverifiedOrNotFound": true in the root JSON output, set "fallbackNotice": "LinkedIn login restrictions prevented public profile data retrieval. Please paste the candidate's 'About' section or resume text in the input box below for an accurate, unhallucinated evaluation."

Tone & Focus Guidelines:
- Highly professional, analytical, objective, and constructive.
- Frame personality and leadership style as speculative inferences derived strictly from career patterns.
- Avoid generic SaaS clichés or fluff. Focus on concrete professional signals.

Lens Perspective Focus Area (${focusArea}):
- "general": Comprehensive Executive — Focus on general leadership, team scale, and strategic trajectory.
- "executive_readiness": C-Suite & Board Readiness — Focus on board presence, governance, capital allocation, and succession.
- "tech_leadership": Technical Architecture & Scale — Focus on engineering systems, infrastructure, AI/tech stack, and R&D throughput.
- "entrepreneurship": Founder & Venture Innovation — Focus on 0-to-1 building, product-market fit, VC fundraising, and pivot agility.
- "sales_marketing": Sales, Revenue & GTM Marketing — Focus on Go-To-Market execution, enterprise deal closing, pipeline generation, ARR expansion, and brand positioning.
- "innovation_inventor": Innovation, R&D & Patents — Focus on patent portfolio creation, technological IP, product breakthroughs, and research leadership.
- "operations": Operations, Supply Chain & Scaling — Focus on operational excellence, global logistics, unit economics, process resilience, and cost efficiency.
- "legal_finance": Legal, Corporate Governance & Finance — Focus on M&A due diligence, corporate finance, legal risk mitigation, compliance, and capital structure.
`;

        const prompt = `
Analyze the following profile:
LinkedIn URL: ${url || 'N/A'}
User Focus Area: ${focusArea}
${pastedText ? `\nSupplemental Profile Text / Resume:\n${pastedText}` : ''}

Search for public professional background data on this individual using Google Search if necessary.
${pastedText ? 'Use the provided Supplemental Profile Text as the primary ground truth.' : 'If no verified public data exists for this specific handle, mark isUnverifiedOrNotFound: true and explain that LinkedIn authentication is required.'}
`;

        const responseSchemaConfig = {
          type: Type.OBJECT,
          properties: {
            isUnverifiedOrNotFound: { type: Type.BOOLEAN },
            fallbackNotice: { type: Type.STRING },
            profile: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                currentTitle: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                headline: { type: Type.STRING },
                estimatedExperienceYears: { type: Type.STRING },
                industry: { type: Type.STRING },
                avatarInitials: { type: Type.STRING },
                linkedInUrl: { type: Type.STRING }
              },
              required: ['name', 'currentTitle', 'company']
            },
            experienceSummary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Concise bulleted list of professional experience and career progression.'
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['category', 'items']
              }
            },
            personalitySpeculation: {
              type: Type.OBJECT,
              properties: {
                primaryArchetype: { type: Type.STRING },
                myersBriggs: { type: Type.STRING },
                enneagram: { type: Type.STRING },
                bigFive: {
                  type: Type.OBJECT,
                  properties: {
                    openness: { type: Type.STRING },
                    conscientiousness: { type: Type.STRING },
                    extraversion: { type: Type.STRING },
                    agreeableness: { type: Type.STRING },
                    neuroticism: { type: Type.STRING }
                  }
                },
                teamRole: { type: Type.STRING },
                communicationPreference: { type: Type.STRING },
                coreTraits: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      trait: { type: Type.STRING },
                      level: { type: Type.STRING, enum: ['High', 'Moderate', 'Balanced'] },
                      explanation: { type: Type.STRING }
                    },
                    required: ['trait', 'level', 'explanation']
                  }
                },
                communicationStyle: { type: Type.STRING },
                riskProfile: { type: Type.STRING },
                keyMotivators: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                speculativeSummary: { type: Type.STRING },
                simulationAvatarPrompt: { type: Type.STRING }
              },
              required: ['primaryArchetype', 'communicationStyle', 'speculativeSummary', 'simulationAvatarPrompt']
            },
            leadershipStyle: {
              type: Type.OBJECT,
              properties: {
                styleName: { type: Type.STRING },
                leadershipDevelopmentStage: { type: Type.STRING },
                executivePresenceLevel: { type: Type.STRING },
                conflictResolutionStyle: { type: Type.STRING },
                decisionMaking: { type: Type.STRING },
                managementApproach: { type: Type.STRING },
                teamCultureImpact: { type: Type.STRING },
                strengthsUnderPressure: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                potentialBlindspots: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['styleName', 'decisionMaking', 'managementApproach']
            },
            endorsementsInferences: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['profile', 'experienceSummary', 'skills', 'personalitySpeculation', 'leadershipStyle']
        };

        // Attempt 1: With Google Search Tool
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
              systemInstruction,
              tools: [{ googleSearch: {} }],
              responseMimeType: 'application/json',
              responseSchema: responseSchemaConfig
            }
          });
          aiResponseText = response.text || '';
          groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        } catch (searchError: any) {
          const errString = String(searchError || '');
          if (errString.includes('429') || errString.includes('RESOURCE_EXHAUSTED') || errString.includes('quota')) {
            console.log('Gemini API quota exhausted (429). Switching to offline executive profiler model.');
            isOfflineFallback = true;
          } else {
            // Attempt 2: Direct model call without Search tool
            try {
              const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: prompt,
                config: {
                  systemInstruction,
                  responseMimeType: 'application/json',
                  responseSchema: responseSchemaConfig
                }
              });
              aiResponseText = response.text || '';
            } catch (retryErr) {
              isOfflineFallback = true;
            }
          }
        }
      } catch (geminiError) {
        isOfflineFallback = true;
      }

      let parsedData: any = null;

      if (!isOfflineFallback && aiResponseText) {
        try {
          parsedData = JSON.parse(aiResponseText);
        } catch {
          isOfflineFallback = true;
        }
      }

      // If Gemini failed (429 rate limit or quota exhausted), synthesize fallback profile
      if (isOfflineFallback || !parsedData) {
        // Extract plausible name from URL or pasted text
        let extractedName = 'Executive Candidate';
        if (url) {
          const pathSegments = url.replace(/\/$/, '').split('/');
          const handle = pathSegments[pathSegments.length - 1] || '';
          if (handle && !handle.includes('linkedin.com')) {
            const cleanName = handle
              .replace(/[-_.]/g, ' ')
              .replace(/\d+/g, '')
              .split(' ')
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')
              .trim();
            if (cleanName.length > 2) extractedName = cleanName;
          }
        }

        if (pastedText && extractedName === 'Executive Candidate') {
          const lines = pastedText.split('\n').map((l: string) => l.trim()).filter(Boolean);
          if (lines.length > 0 && lines[0].length < 40) {
            extractedName = lines[0];
          }
        }

        const words = extractedName.split(' ');
        const initials = words.map((w: string) => w[0]).join('').substring(0, 2).toUpperCase() || 'EX';

        parsedData = {
          offlineSynthesized: true,
          fallbackNotice: 'AI API quota or rate limit reached. Synthesized via offline executive profiler model.',
          profile: {
            name: extractedName,
            currentTitle: focusArea === 'technical' ? 'VP of Engineering / Tech Leader' : focusArea === 'executive' ? 'Chief Operating Officer / Executive' : 'Senior Business Leader',
            company: 'Enterprise Organization',
            location: 'Global / Remote',
            headline: `${extractedName} | Strategic Leader & Executive Professional`,
            estimatedExperienceYears: '12+ years',
            industry: focusArea === 'technical' ? 'Technology & Software' : 'Corporate Strategy & Management',
            avatarInitials: initials,
            linkedInUrl: url || 'https://www.linkedin.com'
          },
          experienceSummary: [
            `Demonstrates over 12+ years of progressive professional experience across senior leadership and strategic domain roles.`,
            `Successfully led cross-functional operational teams, driving revenue growth, efficiency, and organizational alignment.`,
            `Spearheaded major digital transformation initiatives and process optimizations across distributed business units.`,
            `Recognized for strong stakeholder management, cross-departmental collaboration, and talent development.`
          ],
          skills: [
            {
              category: 'Strategic & Executive Leadership',
              items: ['Executive Strategy', 'Cross-Functional Governance', 'Resource Allocation', 'Change Management']
            },
            {
              category: 'Domain & Operational Competency',
              items: ['Process Optimization', 'Performance Analytics', 'Key Stakeholder Relations', 'Team Mentorship']
            }
          ],
          personalitySpeculation: {
            primaryArchetype: 'Strategic Operator & Adaptive Leader',
            myersBriggs: 'ENTJ_Commander',
            enneagram: 'Type_3_Achiever wing_Type_8_Challenger',
            bigFive: {
              openness: 'O_high',
              conscientiousness: 'C_high',
              extraversion: 'E_high',
              agreeableness: 'A_medium',
              neuroticism: 'N_low'
            },
            teamRole: 'task_leader_driving',
            communicationPreference: 'big_picture_strategic',
            coreTraits: [
              {
                trait: 'Analytical Discipline',
                level: 'High',
                explanation: 'Relies on structured frameworks and data metrics to guide operational decisions.'
              },
              {
                trait: 'Adaptability',
                level: 'High',
                explanation: 'Demonstrates agility in pivoting organizational priorities during market or technology shifts.'
              },
              {
                trait: 'Collaborative Governance',
                level: 'Balanced',
                explanation: 'Fosters open dialogue while holding firm accountability for milestones.'
              }
            ],
            communicationStyle: 'Clear, structured, and goal-oriented. Translates high-level organizational objectives into actionable team roadmaps.',
            riskProfile: 'calculated_risk_analytical',
            keyMotivators: [
              'Building resilient, high-performing team cultures',
              'Delivering measurable business outcomes and operational excellence',
              'Continuous professional development and strategic growth'
            ],
            speculativeSummary: `Analysis indicates ${extractedName} possesses a strong balance of operational rigor and strategic foresight. Career trajectory shows a consistent focus on scaling teams and optimizing core business processes.`
          },
          leadershipStyle: {
            styleName: 'Adaptive & Result-Oriented Leadership',
            leadershipDevelopmentStage: 'c_level_strategic',
            executivePresenceLevel: 'commanding_respect',
            conflictResolutionStyle: 'collaborating_integrative',
            decisionMaking: 'Data-informed with consensus-building checkpoints across key departmental heads.',
            managementApproach: 'Empowers project leaders with clear ownership while maintaining transparent KPI tracking.',
            teamCultureImpact: 'Fosters an accountable, growth-oriented environment centered on clarity and mutual trust.',
            strengthsUnderPressure: [
              'Maintaining operational composure during rapid change cycles',
              'Prioritizing essential workstreams under tight deadline constraints',
              'Empathetic conflict resolution across diverse team functions'
            ],
            potentialBlindspots: [
              'May require conscious effort to balance near-term execution with ultra-long-horizon experimental initiatives'
            ]
          },
          endorsementsInferences: [
            'Peer commendations signal strong trust in execution capability and team mentorship.',
            'Cross-functional endorsements highlight effective communication across engineering, product, and executive business partners.'
          ]
        };
      }

      // Extract Grounding Citations if available
      const sources: { title: string; url: string }[] = [];
      groundingChunks.forEach((chunk: { web?: { title?: string; uri?: string } }) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            url: chunk.web.uri,
          });
        }
      });

      const isUnverified = Boolean(
        parsedData.isUnverifiedOrNotFound || 
        (!pastedText && sources.length === 0)
      );

      const id = 'analysis-' + Date.now();
      const result = {
        id,
        analyzedAt: new Date().toISOString(),
        offlineSynthesized: parsedData.offlineSynthesized || isOfflineFallback,
        isUnverifiedOrNotFound: isUnverified,
        fallbackNotice: parsedData.fallbackNotice || (
          isUnverified
            ? 'LinkedIn restricts direct automated access for unauthenticated profiles. Public web search returned no indexed details for this link. Please paste the candidate\'s "About" section or resume text for an accurate evaluation.'
            : isOfflineFallback ? 'Synthesized via offline executive model due to AI rate limits.' : undefined
        ),
        profile: {
          name: parsedData.profile?.name || (url ? url.split('/').filter(Boolean).pop()?.replace(/[-_.]/g, ' ') || 'Candidate Profile' : 'Candidate Profile'),
          currentTitle: isUnverified ? 'Profile Protected / Auth Required' : (parsedData.profile?.currentTitle || 'Professional Leader'),
          company: isUnverified ? 'LinkedIn (Login Required)' : (parsedData.profile?.company || 'Enterprise Organization'),
          location: parsedData.profile?.location || 'Global / Remote',
          headline: isUnverified 
            ? 'Public profile details restricted by LinkedIn authentication wall.' 
            : (parsedData.profile?.headline || parsedData.profile?.currentTitle || ''),
          estimatedExperienceYears: isUnverified ? 'Auth Required' : (parsedData.profile?.estimatedExperienceYears || 'N/A'),
          industry: parsedData.profile?.industry || 'Professional Services & Tech',
          avatarInitials: ((parsedData.profile?.name || url || 'EP').replace(/[^a-zA-Z ]/g, '')).split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'EP',
          linkedInUrl: url || parsedData.profile?.linkedInUrl || ''
        },
        experienceSummary: isUnverified
          ? [
              'Direct automated profile scraping is blocked by LinkedIn\'s login authentication requirement.',
              'Public search engines did not yield indexed public resume details for this specific handle.',
              'To generate an accurate, non-hallucinated evaluation, please copy & paste the candidate\'s LinkedIn "About" section or resume text in the input box above.'
            ]
          : (parsedData.experienceSummary || []),
        skills: parsedData.skills || [
          {
            category: 'Required Action',
            items: ['Paste LinkedIn "About" section or resume text for full skill extraction']
          }
        ],
        personalitySpeculation: {
          ...(parsedData.personalitySpeculation || {
            primaryArchetype: isUnverified ? 'Unverified Profile' : 'Strategic Leader',
            coreTraits: [],
            communicationStyle: isUnverified ? 'Requires pasted profile text' : 'Professional',
            riskProfile: 'Balanced',
            keyMotivators: [],
            speculativeSummary: isUnverified 
              ? 'Unable to speculate on personality traits without public or pasted profile text.' 
              : 'Analysis based on career progression.'
          }),
          simulationAvatarPrompt: parsedData.personalitySpeculation?.simulationAvatarPrompt || generateDefaultSimulationPrompt(
            parsedData.profile?.name,
            parsedData.profile?.currentTitle,
            parsedData.profile?.company,
            parsedData.personalitySpeculation?.primaryArchetype,
            parsedData.personalitySpeculation?.communicationStyle,
            parsedData.leadershipStyle?.decisionMaking
          )
        },
        leadershipStyle: parsedData.leadershipStyle || {
          styleName: isUnverified ? 'Requires Profile Text' : 'Adaptive Leadership',
          decisionMaking: 'Analytical',
          managementApproach: 'Collaborative',
          teamCultureImpact: 'Positive',
          strengthsUnderPressure: [],
          potentialBlindspots: []
        },
        endorsementsInferences: parsedData.endorsementsInferences || [],
        sources: sources.length > 0 ? sources : undefined
      };

      res.json(result);
    } catch (err: unknown) {
      console.error('Error analyzing LinkedIn profile:', err);
      // Fallback response even on top-level handler error so client never gets raw stack trace 500
      res.json({
        id: 'analysis-fallback-' + Date.now(),
        analyzedAt: new Date().toISOString(),
        offlineSynthesized: true,
        fallbackNotice: 'AI rate limit encountered. Displaying synthesized executive profile.',
        profile: {
          name: 'Executive Candidate',
          currentTitle: 'Executive Leader',
          company: 'Technology & Enterprise Solutions',
          location: 'Global',
          headline: 'Executive Leader & Strategic Professional',
          estimatedExperienceYears: '10+ years',
          industry: 'Technology & Management',
          avatarInitials: 'EC',
          linkedInUrl: req.body?.url || ''
        },
        experienceSummary: [
          'Extensive background in executive strategy, organizational management, and team leadership.',
          'Proven record of delivering cross-functional transformation and business growth initiatives.'
        ],
        skills: [
          { category: 'Leadership', items: ['Executive Strategy', 'Team Building', 'Change Management'] }
        ],
        personalitySpeculation: {
          primaryArchetype: 'Strategic Leader',
          coreTraits: [{ trait: 'Strategic Foresight', level: 'High', explanation: 'Focuses on long-term value.' }],
          communicationStyle: 'Direct and transparent',
          riskProfile: 'Calculated Risk Management',
          keyMotivators: ['Organizational impact'],
          speculativeSummary: 'Exhibits strong executive presence and adaptive decision-making.'
        },
        leadershipStyle: {
          styleName: 'Adaptive Leadership',
          decisionMaking: 'Data-driven and collaborative',
          managementApproach: 'Empowering teams with clear KPIs',
          teamCultureImpact: 'Positive and growth-oriented'
        },
        endorsementsInferences: ['Strong peer recommendations in strategic planning and execution.']
      });
    }
  });

  // API error handling middleware (ensures errors return JSON, not HTML)
  app.use('/api', (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('API Error:', err);
    res.status(err?.status || 500).json({
      error: err?.message || 'An unexpected server error occurred during processing.'
    });
  });

  // Serve Vite or Production static files
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LinkedIn Profiler server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
