import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

let aiClient = null;
if (GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    console.log('✨ Gemini AI client initialized with API key.');
  } catch (err) {
    console.warn('⚠️ Gemini AI client initialization warning:', err.message);
  }
} else {
  console.log('ℹ️ Running in Smart Fallback mode (No GEMINI_API_KEY found). AI endpoints will use intelligent rule heuristics.');
}

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiEnabled: Boolean(GEMINI_API_KEY),
    mode: GEMINI_API_KEY ? 'gemini-2.5-flash' : 'intelligent-heuristic-fallback',
    timestamp: new Date().toISOString(),
  });
});

// 1. AI Project Requirement Breakdown
app.post('/api/ai/analyze-project', async (req, res) => {
  const { title, description, track } = req.body;

  if (!title && !description) {
    return res.status(400).json({ error: 'Title or description is required.' });
  }

  // If Gemini API is available, use Gemini 2.5 Flash
  if (aiClient) {
    try {
      const prompt = `You are Matchify's expert Hackathon Team Architect. Analyze this hackathon project idea and output ONLY valid JSON (no markdown fences, no code blocks) matching the exact schema below.

Project Title: "${title || 'Untitled'}"
Track/Domain: "${track || 'General'}"
Description: "${description || ''}"

Schema:
{
  "summary": "Brief 1-sentence technical synthesis of the project",
  "recommendedTeamSize": number (between 2 and 5),
  "complexity": "Beginner" | "Intermediate" | "Advanced",
  "roles": [
    {
      "role": "Role Name (e.g. Frontend Developer, ML Engineer, Backend Developer, UI/UX Designer, DevOps Engineer)",
      "count": 1,
      "responsibilities": "Key focus area for this role"
    }
  ],
  "requiredSkills": [
    {
      "name": "Skill Name (e.g. React, Python, PyTorch, Node.js, Figma, Tailwind CSS, PostgreSQL, Docker)",
      "minLevel": number between 1 and 5,
      "priority": "required" | "preferred",
      "reason": "Why this skill and level are necessary"
    }
  ],
  "formationTip": "One sharp advice tip for forming a winning hackathon team for this specific project"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);
      return res.json({ success: true, source: 'gemini-2.5-flash', data: parsed });
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart heuristic:', err.message);
    }
  }

  // Smart Heuristic Fallback
  const lowerDesc = `${title} ${description} ${track}`.toLowerCase();
  const requiredSkills = [];
  const roles = [];

  // Detect skills & roles based on keywords
  if (lowerDesc.includes('ai') || lowerDesc.includes('ml') || lowerDesc.includes('machine learning') || lowerDesc.includes('llm') || lowerDesc.includes('model') || lowerDesc.includes('vision') || lowerDesc.includes('nlp')) {
    requiredSkills.push({ name: 'Python', minLevel: 3, priority: 'required', reason: 'Core language for data processing and AI pipelines' });
    requiredSkills.push({ name: 'Machine Learning', minLevel: 4, priority: 'required', reason: 'Required for fine-tuning, RAG, or inference architectures' });
    roles.push({ role: 'AI/ML Engineer', count: 1, responsibilities: 'Model integration, prompt engineering, and inference optimization' });
  }

  if (lowerDesc.includes('web') || lowerDesc.includes('react') || lowerDesc.includes('frontend') || lowerDesc.includes('dashboard') || lowerDesc.includes('ui') || lowerDesc.includes('app') || lowerDesc.includes('interface')) {
    requiredSkills.push({ name: 'React', minLevel: 3, priority: 'required', reason: 'Building the interactive user interface and client state' });
    requiredSkills.push({ name: 'Tailwind CSS', minLevel: 2, priority: 'preferred', reason: 'Fast and responsive styling' });
    roles.push({ role: 'Frontend Developer', count: 1, responsibilities: 'Building accessible, fluid UI components and dashboard views' });
  }

  if (lowerDesc.includes('api') || lowerDesc.includes('backend') || lowerDesc.includes('database') || lowerDesc.includes('auth') || lowerDesc.includes('server') || lowerDesc.includes('sql') || lowerDesc.includes('node')) {
    requiredSkills.push({ name: 'Node.js', minLevel: 3, priority: 'required', reason: 'Building robust REST/WebSocket endpoints and orchestrating services' });
    requiredSkills.push({ name: 'PostgreSQL', minLevel: 2, priority: 'preferred', reason: 'Relational data persistence and schema consistency' });
    roles.push({ role: 'Backend Engineer', count: 1, responsibilities: 'API architecture, secure database transactions, and service orchestration' });
  }

  if (lowerDesc.includes('design') || lowerDesc.includes('figma') || lowerDesc.includes('user') || lowerDesc.includes('ux') || lowerDesc.includes('prototype')) {
    requiredSkills.push({ name: 'UI/UX Design', minLevel: 3, priority: 'preferred', reason: 'Wireframing, user journey maps, and high-fidelity prototypes' });
    roles.push({ role: 'UI/UX Designer', count: 1, responsibilities: 'Visual aesthetic, user flow diagrams, and design system tokens' });
  }

  // Ensure minimum baseline
  if (requiredSkills.length === 0) {
    requiredSkills.push({ name: 'React', minLevel: 3, priority: 'required', reason: 'Frontend user interface development' });
    requiredSkills.push({ name: 'Python', minLevel: 2, priority: 'required', reason: 'Backend service and data manipulation' });
    roles.push({ role: 'Full Stack Developer', count: 1, responsibilities: 'End-to-end feature delivery and API integration' });
  }

  if (roles.length === 0) {
    roles.push({ role: 'Full Stack Engineer', count: 1, responsibilities: 'Lead product engineering across frontend and backend' });
    roles.push({ role: 'Product / UI Designer', count: 1, responsibilities: 'Design prototypes and presentation pitch flow' });
  }

  const fallbackData = {
    summary: `Technical implementation blueprint for ${title || 'your hackathon project'}.`,
    recommendedTeamSize: Math.min(Math.max(roles.length + 1, 3), 4),
    complexity: requiredSkills.some(s => s.minLevel >= 4) ? 'Advanced' : 'Intermediate',
    roles,
    requiredSkills,
    formationTip: 'Look for teammates with verified assessment scores to minimize ramp-up friction during crunch time.',
  };

  return res.json({ success: true, source: 'smart-heuristic-fallback', data: fallbackData });
});

// 2. AI Teammate Match Synergy Justification
app.post('/api/ai/explain-match', async (req, res) => {
  const { candidate, project, matchScore, factorBreakdown } = req.body;

  if (!candidate || !project) {
    return res.status(400).json({ error: 'Candidate and project payload required.' });
  }

  if (aiClient) {
    try {
      const prompt = `You are Matchify's AI Matchmaker. Provide an honest, high-value, natural language explanation of why candidate "${candidate.name}" (${candidate.role}, Experience: ${candidate.experience}) is a ${matchScore}% match for the hackathon project "${project.title}".

Candidate Skills: ${JSON.stringify(candidate.skills)}
Project Requirements: ${JSON.stringify(project.requiredSkills)}
Match Breakdown: ${JSON.stringify(factorBreakdown || {})}
Candidate Bio/Interests: "${candidate.bio || ''}" | Interests: ${candidate.interests?.join(', ')}

Output ONLY valid JSON (no markdown formatting, no code blocks):
{
  "headline": "Punchy 1-line reason (e.g. 'Covers your core Python & ML needs with Level 4 Verified proficiency')",
  "strengths": [
    "Specific strength 1 with skill/level evidence",
    "Specific strength 2 with role or experience evidence"
  ],
  "skillAlignment": "2-3 sentences explaining exactly how candidate's skills map to project requirements",
  "potentialGaps": "Any slight gap or complementary skill advice, or 'None - complete fit'",
  "collaborationSynergy": "1 sentence on working style, availability (${candidate.availabilityHours} hrs/week), or track alignment"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);
      return res.json({ success: true, source: 'gemini-2.5-flash', data: parsed });
    } catch (err) {
      console.warn('Gemini explain-match failed, using heuristic fallback:', err.message);
    }
  }

  // Heuristic synthesis fallback
  const matchedSkills = candidate.skills.filter(cs => 
    project.requiredSkills.some(ps => ps.name.toLowerCase() === cs.name.toLowerCase())
  );

  const verifiedSkills = candidate.skills.filter(cs => cs.isAssessed);
  const strengths = [];

  if (matchedSkills.length > 0) {
    strengths.push(`Directly satisfies ${matchedSkills.length} project skill requirement${matchedSkills.length > 1 ? 's' : ''}: ${matchedSkills.map(s => s.name + ' (Lvl ' + s.level + (s.isAssessed ? ' ⭐ Verified' : '') + ')').join(', ')}.`);
  }
  if (candidate.role && project.requiredRoles?.includes(candidate.role)) {
    strengths.push(`Matches open team vacancy for role: ${candidate.role}.`);
  }
  if (verifiedSkills.length > 0) {
    strengths.push(`Has ${verifiedSkills.length} Matchify-verified assessment badge(s) demonstrating tested capability.`);
  }

  const fallbackData = {
    headline: matchedSkills.length > 0
      ? `Strong fit covering ${matchedSkills.map(s => s.name).join(' & ')} with ${candidate.experience} experience.`
      : `Complementary team member offering ${candidate.role} expertise.`,
    strengths: strengths.length > 0 ? strengths : ['Brings versatile full-stack and hackathon domain experience.'],
    skillAlignment: `${candidate.name} holds Level ${matchedSkills[0]?.level || 3} in ${matchedSkills[0]?.name || 'key tech'}, aligning with the technical benchmarks required for ${project.title}.`,
    potentialGaps: matchedSkills.length < project.requiredSkills.length ? 'May benefit from pairing on secondary project technologies.' : 'No major skill deficits detected.',
    collaborationSynergy: `Offers ${candidate.availabilityHours || 20} hrs/wk dedicated bandwidth with high synergy in the ${project.track || 'hackathon'} domain.`,
  };

  return res.json({ success: true, source: 'heuristic-synthesis', data: fallbackData });
});

app.listen(PORT, () => {
  console.log(`🚀 Matchify AI & API server listening on http://localhost:${PORT}`);
});
