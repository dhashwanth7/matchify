export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  name: string;
  level: SkillLevel;
  isAssessed: boolean;
  assessmentScore?: number; // 0 - 100%
  assessmentDate?: string;
  category?: 'frontend' | 'backend' | 'ai_ml' | 'design' | 'devops' | 'mobile' | 'data' | 'general';
}

export type ExperienceLevel = 'Beginner (0-1 yrs)' | 'Intermediate (1-3 yrs)' | 'Advanced (3+ yrs)' | 'Hackathon Veteran';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  university: string;
  major: string;
  graduationYear: number;
  role: string; // e.g., 'Full Stack Developer', 'AI/ML Engineer', 'UI/UX Designer', 'Backend Engineer', 'Data Engineer'
  experience: ExperienceLevel;
  bio: string;
  headline?: string;
  skills: Skill[];
  interests: string[];
  availabilityHours: number; // hours per week (e.g. 25)
  timezone: string;
  lookingFor?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  hackathonsWon?: number;
  verifiedBadgesCount?: number;
}

export interface SkillRequirement {
  name: string;
  minLevel: SkillLevel;
  priority: 'required' | 'preferred';
  reason?: string;
}

export interface ProjectRole {
  role: string;
  count: number;
  filledBy?: string[]; // student IDs
  responsibilities?: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  track: 'AI / Machine Learning' | 'FinTech / Web3' | 'HealthTech & Bio' | 'Social Impact' | 'Developer Tools' | 'Open Innovation';
  ownerId: string;
  ownerName: string;
  maxTeamSize: number;
  requiredRoles: string[];
  requiredSkills: SkillRequirement[];
  teamMembers: {
    studentId: string;
    role: string;
    joinedAt: string;
    status: 'owner' | 'accepted' | 'invited';
  }[];
  createdAt: string;
  aiAnalyzed?: boolean;
  formationTip?: string;
}

export interface FactorBreakdown {
  skillMatchScore: number;       // 0 - 100
  skillLevelScore: number;       // 0 - 100
  assessmentVerification: number;// 0 - 100
  roleFitScore: number;          // 0 - 100
  availabilityScore: number;     // 0 - 100
  interestScore: number;         // 0 - 100
}

export interface MatchResult {
  candidate: Student;
  matchPercentage: number; // 0 - 100
  breakdown: FactorBreakdown;
  matchedSkills: {
    skillName: string;
    candidateLevel: SkillLevel;
    requiredMinLevel: SkillLevel;
    isAssessed: boolean;
    satisfiesMin: boolean;
  }[];
  missingRequiredSkills: string[];
  roleMatches: boolean;
  aiExplanation?: {
    headline: string;
    strengths: string[];
    skillAlignment: string;
    potentialGaps: string;
    collaborationSynergy: string;
  };
}

export interface AssessmentQuestion {
  id: string;
  skillName: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AssessmentResult {
  skillName: string;
  scorePercentage: number;
  estimatedLevel: SkillLevel;
  totalQuestions: number;
  correctCount: number;
  completedAt: string;
}

export interface SkillCoverageItem {
  skillName: string;
  requiredMinLevel: SkillLevel;
  priority: 'required' | 'preferred';
  coveredBy: {
    student: Student;
    level: SkillLevel;
    isAssessed: boolean;
    satisfiesMin: boolean;
  }[];
  status: 'fully_covered' | 'partially_covered' | 'missing';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export interface Conversation {
  participantId: string;
  participant: Student;
  lastMessage: string;
  lastTimestamp: string;
  unread: boolean;
}
