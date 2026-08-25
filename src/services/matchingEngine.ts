import { Student, Project, MatchResult, FactorBreakdown, SkillLevel } from '../types';

/**
 * Deterministic, multi-factor Matchify Matching Algorithm
 * Calculates an exact, transparent match score between a candidate and a project requirements matrix.
 */
export function calculateMatchScore(candidate: Student, project: Project): MatchResult {
  const reqSkills = project.requiredSkills || [];
  const candidateSkills = candidate.skills || [];

  if (reqSkills.length === 0) {
    return {
      candidate,
      matchPercentage: 50,
      breakdown: {
        skillMatchScore: 50,
        skillLevelScore: 50,
        assessmentVerification: 50,
        roleFitScore: 50,
        availabilityScore: 50,
        interestScore: 50,
      },
      matchedSkills: [],
      missingRequiredSkills: [],
      roleMatches: false,
    };
  }

  // 1. Skill Match Overlap (Weight: 40%)
  const matchedSkills: MatchResult['matchedSkills'] = [];
  const missingRequiredSkills: string[] = [];
  let totalSkillMatchScore = 0;
  let totalLevelScore = 0;
  let totalVerificationScore = 0;

  for (const req of reqSkills) {
    const candidateSkill = candidateSkills.find(
      cs => cs.name.toLowerCase() === req.name.toLowerCase()
    );

    if (candidateSkill) {
      const satisfiesMin = candidateSkill.level >= req.minLevel;
      matchedSkills.push({
        skillName: req.name,
        candidateLevel: candidateSkill.level,
        requiredMinLevel: req.minLevel,
        isAssessed: Boolean(candidateSkill.isAssessed),
        satisfiesMin,
      });

      // Match score contribution
      totalSkillMatchScore += req.priority === 'required' ? 1.0 : 0.6;

      // Level score calculation
      if (candidateSkill.level >= req.minLevel) {
        totalLevelScore += 1.0;
      } else if (candidateSkill.level === req.minLevel - 1) {
        totalLevelScore += 0.6; // 1 level below min
      } else {
        totalLevelScore += 0.25; // 2+ levels below
      }

      // Verification score
      if (candidateSkill.isAssessed) {
        const scoreNorm = (candidateSkill.assessmentScore || 80) / 100;
        totalVerificationScore += scoreNorm;
      } else {
        totalVerificationScore += 0.4; // Unverified self-report base
      }
    } else {
      if (req.priority === 'required') {
        missingRequiredSkills.push(req.name);
      }
    }
  }

  const maxSkillScore = reqSkills.reduce((acc, r) => acc + (r.priority === 'required' ? 1.0 : 0.6), 0);
  const skillMatchScore = Math.min(100, Math.round((totalSkillMatchScore / (maxSkillScore || 1)) * 100));
  const skillLevelScore = matchedSkills.length > 0
    ? Math.min(100, Math.round((totalLevelScore / matchedSkills.length) * 100))
    : 0;
  const assessmentVerification = matchedSkills.length > 0
    ? Math.min(100, Math.round((totalVerificationScore / matchedSkills.length) * 100))
    : (candidate.verifiedBadgesCount && candidate.verifiedBadgesCount > 0 ? 60 : 30);

  // 2. Role Fit (Weight: 15%)
  let roleFitScore = 30;
  let roleMatches = false;
  if (project.requiredRoles && project.requiredRoles.length > 0) {
    const matchingRole = project.requiredRoles.some(r => 
      r.toLowerCase().includes(candidate.role.toLowerCase()) || 
      candidate.role.toLowerCase().includes(r.toLowerCase())
    );
    if (matchingRole) {
      roleFitScore = 100;
      roleMatches = true;
    } else if (candidate.role.toLowerCase().includes('full stack')) {
      roleFitScore = 75; // Full stack generalist flex
      roleMatches = true;
    } else {
      roleFitScore = 40;
    }
  }

  // 3. Availability Bandwidth (Weight: 5%)
  let availabilityScore = 50;
  if (candidate.availabilityHours >= 25) {
    availabilityScore = 100;
  } else if (candidate.availabilityHours >= 20) {
    availabilityScore = 85;
  } else if (candidate.availabilityHours >= 15) {
    availabilityScore = 70;
  } else {
    availabilityScore = 45;
  }

  // 4. Interest & Track Affinity (Weight: 5%)
  let interestScore = 50;
  const projectTrack = (project.track || '').toLowerCase();
  const projectText = `${project.title} ${project.description}`.toLowerCase();
  
  const hasDirectInterest = candidate.interests.some(interest => {
    const i = interest.toLowerCase();
    return projectTrack.includes(i) || i.includes(projectTrack) || projectText.includes(i);
  });

  if (hasDirectInterest) {
    interestScore = 100;
  } else if (candidate.interests.length > 0) {
    interestScore = 70;
  }

  // Multi-Factor Weighted Sum
  // Skill Overlap: 40%, Skill Level: 20%, Verification: 15%, Role: 15%, Availability: 5%, Interests: 5%
  const weightedTotal =
    (skillMatchScore * 0.40) +
    (skillLevelScore * 0.20) +
    (assessmentVerification * 0.15) +
    (roleFitScore * 0.15) +
    (availabilityScore * 0.05) +
    (interestScore * 0.05);

  const matchPercentage = Math.max(12, Math.min(99, Math.round(weightedTotal)));

  const breakdown: FactorBreakdown = {
    skillMatchScore,
    skillLevelScore,
    assessmentVerification,
    roleFitScore,
    availabilityScore,
    interestScore,
  };

  return {
    candidate,
    matchPercentage,
    breakdown,
    matchedSkills,
    missingRequiredSkills,
    roleMatches,
  };
}

/**
 * Ranks all candidates for a given project by match percentage
 */
export function rankCandidatesForProject(candidates: Student[], project: Project, excludeStudentIds: string[] = []): MatchResult[] {
  const eligible = candidates.filter(c => !excludeStudentIds.includes(c.id));
  const scored = eligible.map(candidate => calculateMatchScore(candidate, project));
  return scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

/**
 * Filters and ranks candidates who specifically satisfy a designated missing skill or missing role requirement
 */
export function findCandidatesForMissingSkill(
  candidates: Student[],
  queryOrRoleOrSkill: string,
  minLevel: SkillLevel = 1
): { candidate: Student; skillLevel: SkillLevel; isAssessed: boolean; assessmentScore?: number; matchReason?: string }[] {
  const q = queryOrRoleOrSkill.trim().toLowerCase();

  const matching = candidates
    .map(candidate => {
      // 1. Check if candidate's role matches the query (e.g. "Frontend Developer", "Data Engineer", "UI/UX Designer")
      const roleMatches = candidate.role.toLowerCase().includes(q) || q.includes(candidate.role.toLowerCase());

      // 2. Check if candidate possesses the exact skill or closely related skills
      const matchingSkill = candidate.skills.find(s => {
        const sName = s.name.toLowerCase();
        if (sName === q || sName.includes(q) || q.includes(sName)) return true;
        // Role aliases
        if (q.includes('frontend') && (sName === 'react' || sName === 'javascript' || sName === 'typescript')) return true;
        if (q.includes('backend') && (sName === 'node.js' || sName === 'python' || sName === 'postgresql')) return true;
        if (q.includes('data') && (sName === 'sql' || sName === 'data engineering' || sName === 'python')) return true;
        if ((q.includes('ui') || q.includes('ux') || q.includes('design')) && (sName === 'ui/ux design' || sName === 'figma')) return true;
        if ((q.includes('ai') || q.includes('ml')) && (sName === 'machine learning' || sName === 'python' || sName === 'pytorch')) return true;
        return false;
      });

      if (roleMatches || matchingSkill) {
        const effectiveSkill = matchingSkill || candidate.skills[0];
        const satisfiesLevel = effectiveSkill ? effectiveSkill.level >= minLevel : true;

        if (satisfiesLevel || roleMatches) {
          return {
            candidate,
            skillLevel: effectiveSkill?.level || 3,
            isAssessed: Boolean(effectiveSkill?.isAssessed),
            assessmentScore: effectiveSkill?.assessmentScore,
            matchReason: roleMatches ? `Primary Role: ${candidate.role}` : `Has Skill: ${effectiveSkill?.name} (Lvl ${effectiveSkill?.level})`,
          };
        }
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return matching.sort((a, b) => {
    // Sort by verified first, then highest level, then highest assessment score
    if (a.isAssessed !== b.isAssessed) return a.isAssessed ? -1 : 1;
    if (a.skillLevel !== b.skillLevel) return b.skillLevel - a.skillLevel;
    return (b.assessmentScore || 0) - (a.assessmentScore || 0);
  });
}
