import { calculateMatchScore, rankCandidatesForProject, findCandidatesForMissingSkill } from '../src/services/matchingEngine.ts';
import { calculateSkillLevelFromScore, getSkillLevelLabel, QUESTION_BANKS } from '../src/data/assessmentQuestions.ts';
import { CURRENT_USER, SEED_CANDIDATES, INITIAL_PROJECTS } from '../src/data/seedData.ts';

console.log('🧪 Starting Matchify Core Flow Verification Suite...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Test Skill Level Calibration from Assessment Scores
console.log('📋 Test Suite 1: Skill Assessment Score to Level Calibration');
assert(calculateSkillLevelFromScore(95) === 5, 'Score >= 85% maps to Level 5 (Expert)');
assert(calculateSkillLevelFromScore(85) === 5, 'Score 85% boundary maps to Level 5');
assert(calculateSkillLevelFromScore(75) === 4, 'Score 75% maps to Level 4 (Advanced)');
assert(calculateSkillLevelFromScore(55) === 3, 'Score 55% maps to Level 3 (Intermediate)');
assert(calculateSkillLevelFromScore(35) === 2, 'Score 35% maps to Level 2 (Beginner)');
assert(calculateSkillLevelFromScore(20) === 1, 'Score < 30% maps to Level 1 (Novice)');

// Check Question Banks completeness
const expectedDomains = ['React', 'Python', 'Machine Learning', 'UI/UX Design', 'Cloud / DevOps'];
expectedDomains.forEach(domain => {
  assert(Boolean(QUESTION_BANKS[domain] && QUESTION_BANKS[domain].length === 5), `Question bank for "${domain}" contains 5 calibrated questions`);
});

// 2. Test Deterministic Matching Engine
console.log('\n📋 Test Suite 2: Deterministic Multi-Factor Matching Engine');
const project = INITIAL_PROJECTS[0]; // MedTriage AI (Needs ML Lvl 4, Python Lvl 4, React Lvl 3)
const maya = SEED_CANDIDATES.find(c => c.name === 'Maya Patel')!;

const mayaScore = calculateMatchScore(maya, project);
console.log(`  📊 Maya Patel Match Score for MedTriage AI: ${mayaScore.matchPercentage}%`);
console.log(`     - Skill Match: ${mayaScore.breakdown.skillMatchScore}%`);
console.log(`     - Level Score: ${mayaScore.breakdown.skillLevelScore}%`);
console.log(`     - Verification: ${mayaScore.breakdown.assessmentVerification}%`);
console.log(`     - Role Fit: ${mayaScore.breakdown.roleFitScore}%`);

assert(mayaScore.matchPercentage >= 85, 'Maya Patel achieves >= 85% Match for MedTriage AI');
assert(mayaScore.roleMatches === true, 'Role match correctly identifies AI/ML Engineer vacancy');
assert(mayaScore.matchedSkills.length >= 2, 'Matched skills correctly identifies Python & Machine Learning');

// Rank all candidates for MedTriage AI
const ranked = rankCandidatesForProject(SEED_CANDIDATES, project, [project.ownerId]);
assert(ranked.length === SEED_CANDIDATES.length, 'All candidates ranked');
assert(ranked[0].matchPercentage >= ranked[1].matchPercentage, 'Candidates sorted deterministically by descending match score');
assert(ranked[0].candidate.name === 'Maya Patel' || ranked[0].candidate.name === 'Karthik Raja', 'Top match is an AI/ML specialist');

// 3. Test Missing Skill Detector and Recommendation Finder
console.log('\n📋 Test Suite 3: Missing Skill Detection & Filter Engine');
const missingSkillName = 'Cloud / DevOps';
const candidatesForMissing = findCandidatesForMissingSkill(SEED_CANDIDATES, missingSkillName, 3);
console.log(`  🔎 Candidates found for missing skill "${missingSkillName}": ${candidatesForMissing.length}`);

assert(candidatesForMissing.length > 0, 'Successfully identified candidates covering missing skill');
assert(candidatesForMissing[0].candidate.name === 'Devon Brooks', 'Devon Brooks ranked #1 for Cloud / DevOps with verified assessment');
assert(candidatesForMissing[0].isAssessed === true, 'Devon Brooks has verified assessment badge');

// 4. Test Distinguishing Assessed vs Self-Reported Skills
console.log('\n📋 Test Suite 4: Assessed vs Self-Reported Skill Distinction');
const assessedInSeed = SEED_CANDIDATES.flatMap(c => c.skills.filter(s => s.isAssessed));
const unassessedInSeed = SEED_CANDIDATES.flatMap(c => c.skills.filter(s => !s.isAssessed));

assert(assessedInSeed.length > 0, 'Dataset contains verified assessed skills with scores');
assert(unassessedInSeed.length > 0, 'Dataset contains unverified self-reported skills');
assert(assessedInSeed.every(s => typeof s.assessmentScore === 'number'), 'All assessed skills have numerical accuracy score');

console.log(`\n🎉 Verification Complete: ${passedTests}/${totalTests} tests passed successfully!`);
