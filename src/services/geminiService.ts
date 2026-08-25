import { Student, Project, FactorBreakdown } from '../types';

export interface AIProjectAnalysis {
  summary: string;
  recommendedTeamSize: number;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  roles: { role: string; count: number; responsibilities: string }[];
  requiredSkills: { name: string; minLevel: number; priority: 'required' | 'preferred'; reason?: string }[];
  formationTip: string;
}

export interface AIMatchExplanation {
  headline: string;
  strengths: string[];
  skillAlignment: string;
  potentialGaps: string;
  collaborationSynergy: string;
}

/**
 * Calls backend API to analyze project idea with Gemini 2.5 Flash, with instant heuristic fallback
 */
export async function analyzeProjectWithAI(title: string, description: string, track: string): Promise<AIProjectAnalysis> {
  try {
    const res = await fetch('/api/ai/analyze-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, track }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.info('Using local client heuristic fallback for project analysis:', err);
  }

  // Client-Side Heuristic Fallback
  const lower = `${title} ${description} ${track}`.toLowerCase();
  const requiredSkills = [];
  const roles = [];

  if (lower.includes('ai') || lower.includes('ml') || lower.includes('model') || lower.includes('health') || lower.includes('vision') || lower.includes('llm') || lower.includes('data')) {
    requiredSkills.push({ name: 'Machine Learning', minLevel: 4, priority: 'required' as const, reason: 'Core model training, evaluation & inference' });
    requiredSkills.push({ name: 'Python', minLevel: 4, priority: 'required' as const, reason: 'Data pipeline and backend integration' });
    roles.push({ role: 'AI/ML Engineer', count: 1, responsibilities: 'Model architecture & prompt optimization' });
  }

  if (lower.includes('web') || lower.includes('react') || lower.includes('app') || lower.includes('portal') || lower.includes('client') || lower.includes('frontend')) {
    requiredSkills.push({ name: 'React', minLevel: 3, priority: 'required' as const, reason: 'Building fluid, responsive user dashboard' });
    requiredSkills.push({ name: 'Tailwind CSS', minLevel: 3, priority: 'preferred' as const, reason: 'Modern UI styling and responsive layouts' });
    roles.push({ role: 'Frontend Developer', count: 1, responsibilities: 'Client components and state management' });
  }

  if (lower.includes('api') || lower.includes('backend') || lower.includes('cloud') || lower.includes('server') || lower.includes('database') || lower.includes('node') || lower.includes('crypto') || lower.includes('web3')) {
    requiredSkills.push({ name: 'Node.js', minLevel: 3, priority: 'required' as const, reason: 'Secure REST/WebSocket backend infrastructure' });
    requiredSkills.push({ name: 'PostgreSQL', minLevel: 3, priority: 'preferred' as const, reason: 'Relational data persistence' });
    roles.push({ role: 'Backend Engineer', count: 1, responsibilities: 'Database schemas and API security' });
  }

  if (lower.includes('design') || lower.includes('ux') || lower.includes('ui') || lower.includes('figma') || lower.includes('clinical') || lower.includes('mobile')) {
    requiredSkills.push({ name: 'UI/UX Design', minLevel: 3, priority: 'preferred' as const, reason: 'User journey mapping & polished design system' });
    roles.push({ role: 'UI/UX Designer', count: 1, responsibilities: 'High-fidelity wireframes and design consistency' });
  }

  if (requiredSkills.length === 0) {
    requiredSkills.push({ name: 'React', minLevel: 3, priority: 'required' as const, reason: 'Interactive frontend' });
    requiredSkills.push({ name: 'Python', minLevel: 3, priority: 'required' as const, reason: 'Backend service logic' });
    roles.push({ role: 'Full Stack Developer', count: 1, responsibilities: 'Full feature delivery' });
  }

  if (roles.length === 0) {
    roles.push({ role: 'Full Stack Developer', count: 1, responsibilities: 'Full cycle development' });
  }

  return {
    summary: `Technical implementation blueprint for ${title || 'your hackathon project'}.`,
    recommendedTeamSize: Math.min(Math.max(roles.length + 1, 3), 4),
    complexity: requiredSkills.some(s => s.minLevel >= 4) ? 'Advanced' : 'Intermediate',
    roles,
    requiredSkills,
    formationTip: 'Lock down your core AI/data logic first, then integrate the frontend dashboard for maximum demo impact.',
  };
}

/**
 * Calls backend API to generate AI explanation with Gemini 2.5 Flash, with instant fallback
 */
export async function getAIMatchExplanation(
  candidate: Student,
  project: Project,
  matchScore: number,
  factorBreakdown: FactorBreakdown
): Promise<AIMatchExplanation> {
  try {
    const res = await fetch('/api/ai/explain-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate, project, matchScore, factorBreakdown }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.info('Using local client heuristic fallback for match explanation:', err);
  }

  // Client-Side Heuristic Fallback
  const matchedSkills = candidate.skills.filter(cs =>
    project.requiredSkills?.some(ps => ps.name.toLowerCase() === cs.name.toLowerCase())
  );
  const verifiedSkills = candidate.skills.filter(cs => cs.isAssessed);

  const strengths: string[] = [];
  if (matchedSkills.length > 0) {
    strengths.push(`Directly satisfies ${matchedSkills.length} required skill(s): ${matchedSkills.map(s => `${s.name} (Lvl ${s.level}${s.isAssessed ? ' ⭐ Verified' : ''})`).join(', ')}.`);
  }
  if (project.requiredRoles?.some(r => r.toLowerCase().includes(candidate.role.toLowerCase()) || candidate.role.toLowerCase().includes(r.toLowerCase()))) {
    strengths.push(`Fills the open project vacancy for ${candidate.role}.`);
  }
  if (verifiedSkills.length > 0) {
    strengths.push(`Has earned ${verifiedSkills.length} Matchify Verified Assessment badge(s) demonstrating tested technical accuracy.`);
  }

  return {
    headline: matchedSkills.length > 0
      ? `Strong synergy covering ${matchedSkills.map(s => s.name).join(' & ')} with verified proficiency.`
      : `Versatile team contributor offering dedicated ${candidate.role} capability.`,
    strengths: strengths.length > 0 ? strengths : ['Brings robust development experience and high availability.'],
    skillAlignment: `${candidate.name} meets technical expectations with Level ${matchedSkills[0]?.level || 3} in ${matchedSkills[0]?.name || 'core tech'}, satisfying requirements for ${project.title}.`,
    potentialGaps: matchedSkills.length < (project.requiredSkills?.length || 1)
      ? 'Can pair with another team member to cover secondary auxiliary skills.'
      : 'No major gaps detected; complete alignment with project needs.',
    collaborationSynergy: `Offers ${candidate.availabilityHours} hrs/week committed bandwidth in ${candidate.timezone} with aligned track interests.`,
  };
}
