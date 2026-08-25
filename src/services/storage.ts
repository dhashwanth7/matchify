import { Student, Project, Skill, AssessmentResult, ChatMessage } from '../types';
import { CURRENT_USER, SEED_CANDIDATES, INITIAL_PROJECTS, INITIAL_MESSAGES } from '../data/seedData';
import { calculateSkillLevelFromScore } from '../data/assessmentQuestions';

const USER_KEY = 'matchify_current_user_v2';
const CANDIDATES_KEY = 'matchify_candidates_v2';
const PROJECTS_KEY = 'matchify_projects_v2';
const MESSAGES_KEY = 'matchify_messages_v2';

export function getStoredCurrentUser(): Student {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load user from localStorage', e);
  }
  return CURRENT_USER;
}

export function saveCurrentUser(user: Student): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user to localStorage', e);
  }
}

export function getStoredCandidates(): Student[] {
  try {
    const data = localStorage.getItem(CANDIDATES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load candidates from localStorage', e);
  }
  return SEED_CANDIDATES;
}

export function saveCandidates(candidates: Student[]): void {
  try {
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));
  } catch (e) {
    console.error('Failed to save candidates to localStorage', e);
  }
}

export function getStoredProjects(): Project[] {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load projects from localStorage', e);
  }
  return INITIAL_PROJECTS;
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects to localStorage', e);
  }
}

export function getStoredMessages(): ChatMessage[] {
  try {
    const data = localStorage.getItem(MESSAGES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load messages from localStorage', e);
  }
  return INITIAL_MESSAGES;
}

export function saveMessages(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save messages to localStorage', e);
  }
}

export function addMessageToStore(msg: ChatMessage): ChatMessage[] {
  const current = getStoredMessages();
  const updated = [...current, msg];
  saveMessages(updated);
  return updated;
}

/**
 * Updates current user's profile with completed assessment result
 */
export function applyAssessmentToUser(result: AssessmentResult): Student {
  const user = getStoredCurrentUser();
  const estimatedLevel = calculateSkillLevelFromScore(result.scorePercentage);
  const now = new Date().toISOString().split('T')[0];

  const existingIndex = user.skills.findIndex(
    s => s.name.toLowerCase() === result.skillName.toLowerCase()
  );

  const updatedSkill: Skill = {
    name: result.skillName,
    level: estimatedLevel,
    isAssessed: true,
    assessmentScore: result.scorePercentage,
    assessmentDate: now,
  };

  let newSkills: Skill[];
  if (existingIndex >= 0) {
    newSkills = [...user.skills];
    newSkills[existingIndex] = {
      ...newSkills[existingIndex],
      ...updatedSkill,
    };
  } else {
    newSkills = [...user.skills, updatedSkill];
  }

  const verifiedCount = newSkills.filter(s => s.isAssessed).length;

  const updatedUser: Student = {
    ...user,
    skills: newSkills,
    verifiedBadgesCount: verifiedCount,
  };

  saveCurrentUser(updatedUser);
  return updatedUser;
}

/**
 * Resets local demo state to default seed data
 */
export function resetDemoData(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(CANDIDATES_KEY);
  localStorage.removeItem(PROJECTS_KEY);
  localStorage.removeItem(MESSAGES_KEY);
}
