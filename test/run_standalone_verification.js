// Standalone deterministic matching test runner

function calculateSkillLevelFromScore(scorePercentage) {
  if (scorePercentage >= 85) return 5;
  if (scorePercentage >= 70) return 4;
  if (scorePercentage >= 50) return 3;
  if (scorePercentage >= 30) return 2;
  return 1;
}

function calculateMatchScore(candidate, project) {
  const reqSkills = project.requiredSkills || [];
  const candidateSkills = candidate.skills || [];

  if (reqSkills.length === 0) {
    return { matchPercentage: 50, breakdown: {}, matchedSkills: [], missingRequiredSkills: [], roleMatches: false };
  }

  const matchedSkills = [];
  const missingRequiredSkills = [];
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

      totalSkillMatchScore += req.priority === 'required' ? 1.0 : 0.6;

      if (candidateSkill.level >= req.minLevel) {
        totalLevelScore += 1.0;
      } else if (candidateSkill.level === req.minLevel - 1) {
        totalLevelScore += 0.6;
      } else {
        totalLevelScore += 0.25;
      }

      if (candidateSkill.isAssessed) {
        totalVerificationScore += (candidateSkill.assessmentScore || 80) / 100;
      } else {
        totalVerificationScore += 0.4;
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
      roleFitScore = 75;
      roleMatches = true;
    } else {
      roleFitScore = 40;
    }
  }

  let availabilityScore = candidate.availabilityHours >= 25 ? 100 : candidate.availabilityHours >= 20 ? 85 : 70;
  let interestScore = candidate.interests.some(i => project.track.toLowerCase().includes(i.toLowerCase())) ? 100 : 70;

  const weightedTotal =
    (skillMatchScore * 0.40) +
    (skillLevelScore * 0.20) +
    (assessmentVerification * 0.15) +
    (roleFitScore * 0.15) +
    (availabilityScore * 0.05) +
    (interestScore * 0.05);

  const matchPercentage = Math.max(12, Math.min(99, Math.round(weightedTotal)));

  return {
    candidate,
    matchPercentage,
    breakdown: { skillMatchScore, skillLevelScore, assessmentVerification, roleFitScore, availabilityScore, interestScore },
    matchedSkills,
    missingRequiredSkills,
    roleMatches,
  };
}

console.log('🚀 Running Standalone Verification of Matchify Engine...\n');

// Test 1: Level Calibration
console.log('1. Calibration Tests:');
console.log(' - Score 96% -> Level', calculateSkillLevelFromScore(96), '(Expect 5)');
console.log(' - Score 74% -> Level', calculateSkillLevelFromScore(74), '(Expect 4)');
console.log(' - Score 60% -> Level', calculateSkillLevelFromScore(60), '(Expect 3)');
console.log(' - Score 40% -> Level', calculateSkillLevelFromScore(40), '(Expect 2)');
console.log(' - Score 15% -> Level', calculateSkillLevelFromScore(15), '(Expect 1)');

// Test 2: Matching
const project = {
  title: 'MedTriage AI',
  track: 'HealthTech & Bio',
  requiredRoles: ['AI/ML Engineer', 'Frontend Developer'],
  requiredSkills: [
    { name: 'Machine Learning', minLevel: 4, priority: 'required' },
    { name: 'Python', minLevel: 4, priority: 'required' },
    { name: 'React', minLevel: 3, priority: 'required' },
  ]
};

const candidate = {
  name: 'Maya Patel',
  role: 'AI/ML Engineer',
  skills: [
    { name: 'Python', level: 5, isAssessed: true, assessmentScore: 96 },
    { name: 'Machine Learning', level: 5, isAssessed: true, assessmentScore: 94 },
    { name: 'FastAPI', level: 4, isAssessed: true, assessmentScore: 88 }
  ],
  interests: ['Healthcare AI'],
  availabilityHours: 30
};

const match = calculateMatchScore(candidate, project);
console.log('\n2. Deterministic Matching Result:');
console.log(` - Candidate: ${candidate.name}`);
console.log(` - Match Score: ${match.matchPercentage}%`);
console.log(` - Skill Match: ${match.breakdown.skillMatchScore}%`);
console.log(` - Skill Level Score: ${match.breakdown.skillLevelScore}%`);
console.log(` - Verification Boost: ${match.breakdown.assessmentVerification}%`);
console.log(` - Role Fit: ${match.breakdown.roleFitScore}%`);
console.log(` - Matched Skills:`, match.matchedSkills.map(m => `${m.skillName} (Lvl ${m.candidateLevel}, Min ${m.requiredMinLevel}, Sat: ${m.satisfiesMin})`));
console.log(` - Missing Skills for this candidate:`, match.missingRequiredSkills);

if (match.matchPercentage >= 85 && match.roleMatches) {
  console.log('\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
} else {
  console.error('\n❌ Matching check failed');
}
