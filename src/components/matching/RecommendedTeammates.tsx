import React, { useState, useMemo } from 'react';
import { Sparkles, Search, Filter, Award, Users, AlertCircle, CheckCircle2, ArrowRight, FolderGit2 } from 'lucide-react';
import { Student, Project, MatchResult } from '../../types';
import { rankCandidatesForProject } from '../../services/matchingEngine';
import { CandidateCard } from '../profile/CandidateCard';

interface RecommendedTeammatesProps {
  project: Project;
  allCandidates: Student[];
  onViewProfile: (candidate: Student) => void;
  onExplainMatch: (candidate: Student, matchResult: MatchResult) => void;
  onOpenMessage: (candidate: Student) => void;
  onInvite: (candidate: Student) => void;
  invitedStudentIds: string[];
  teamMemberIds: string[];
  missingSkillFilter?: string | null;
  onClearMissingSkillFilter?: () => void;
  onNavigateToProjects: () => void;
}

export const RecommendedTeammates: React.FC<RecommendedTeammatesProps> = ({
  project,
  allCandidates,
  onViewProfile,
  onExplainMatch,
  onOpenMessage,
  onInvite,
  invitedStudentIds,
  teamMemberIds,
  missingSkillFilter,
  onClearMissingSkillFilter,
  onNavigateToProjects,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [assessedOnly, setAssessedOnly] = useState<boolean>(false);

  // Exclude current owner from candidate list
  const excludeIds = useMemo(() => [project.ownerId], [project.ownerId]);

  // Deterministically rank candidates for this project
  const rankedResults = useMemo(() => {
    return rankCandidatesForProject(allCandidates, project, excludeIds);
  }, [allCandidates, project, excludeIds]);

  // Filter candidates
  const filteredResults = useMemo(() => {
    return rankedResults.filter(({ candidate, matchPercentage }) => {
      // 1. Missing skill or role filter from Team Dashboard
      if (missingSkillFilter) {
        const filterStr = missingSkillFilter.toLowerCase().trim();
        const roleMatches = candidate.role.toLowerCase().includes(filterStr) || filterStr.includes(candidate.role.toLowerCase());
        const hasSkill = candidate.skills.some(s => {
          const sName = s.name.toLowerCase();
          if (sName.includes(filterStr) || filterStr.includes(sName)) return true;
          if (filterStr.includes('frontend') && (sName === 'react' || sName === 'javascript' || sName === 'typescript')) return true;
          if (filterStr.includes('backend') && (sName === 'node.js' || sName === 'python' || sName === 'postgresql')) return true;
          if (filterStr.includes('data') && (sName === 'sql' || sName === 'data engineering')) return true;
          if ((filterStr.includes('ui') || filterStr.includes('ux') || filterStr.includes('design')) && (sName === 'ui/ux design' || sName === 'figma')) return true;
          return false;
        });
        if (!roleMatches && !hasSkill) return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = candidate.name.toLowerCase().includes(q);
        const matchesRole = candidate.role.toLowerCase().includes(q);
        const matchesUniv = candidate.university.toLowerCase().includes(q);
        const matchesSkill = candidate.skills.some(s => s.name.toLowerCase().includes(q));
        if (!matchesName && !matchesRole && !matchesUniv && !matchesSkill) {
          return false;
        }
      }

      // 3. Role Filter
      if (selectedRole !== 'all') {
        if (!candidate.role.toLowerCase().includes(selectedRole.toLowerCase())) {
          return false;
        }
      }

      // 4. Min Match %
      if (matchPercentage < minScoreFilter) {
        return false;
      }

      // 5. Assessed Only
      if (assessedOnly) {
        const hasAssessed = candidate.skills.some(s => s.isAssessed);
        if (!hasAssessed) return false;
      }

      return true;
    });
  }, [rankedResults, missingSkillFilter, searchQuery, selectedRole, minScoreFilter, assessedOnly]);

  const uniqueRoles = useMemo(() => {
    const roles = new Set<string>();
    allCandidates.forEach(c => roles.add(c.role));
    return Array.from(roles);
  }, [allCandidates]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Hero Banner */}
      <div className="student-panel p-6 sm:p-7 bg-white relative overflow-hidden border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {project.track}
              </span>
              <span className="text-xs text-slate-500">
                Active Project • <strong className="text-slate-800">{project.teamMembers?.length || 1}/{project.maxTeamSize} Members</strong>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {project.title}
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
              {project.description}
            </p>
          </div>

          <button
            onClick={onNavigateToProjects}
            className="btn-secondary text-xs px-4 py-2 shrink-0"
          >
            Switch Project
          </button>
        </div>

        {/* Required Skills Matrix Pills */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Project Skill Benchmarks:
          </span>
          {project.requiredSkills.map(skill => (
            <span
              key={skill.name}
              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-1.5"
            >
              <span className="font-medium">{skill.name}</span>
              <span className="font-mono text-brand-600 font-bold text-[10px]">
                ≥ Lvl {skill.minLevel}
              </span>
              {skill.priority === 'required' && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Required skill" />
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Active Team Gap Banner (if redirected from Team Dashboard) */}
      {missingSkillFilter && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-amber-800">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="text-slate-900">Active Gap Filter:</strong> Prioritizing candidates who cover{' '}
              <span className="font-bold underline text-amber-900">"{missingSkillFilter}"</span> for your team.
            </div>
          </div>
          <button
            onClick={onClearMissingSkillFilter}
            className="px-3 py-1 rounded-lg bg-white text-slate-700 hover:text-slate-900 border border-amber-300 font-semibold shadow-2xs"
          >
            Clear Gap Filter ×
          </button>
        </div>
      )}

      {/* Discovery Toolbar: Search & Filters */}
      <div className="student-panel p-4 bg-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates by name, university, or skill (e.g., Python, Maya, React)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value="all">All Roles</option>
            {uniqueRoles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={minScoreFilter}
            onChange={e => setMinScoreFilter(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value={0}>All Match Scores</option>
            <option value={80}>≥ 80% Match (High Synergy)</option>
            <option value={70}>≥ 70% Match</option>
            <option value={50}>≥ 50% Match</option>
          </select>

          <button
            onClick={() => setAssessedOnly(!assessedOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              assessedOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Matchify-Assessed ⭐
          </button>
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <strong className="text-slate-900">{filteredResults.length}</strong> ranked candidates for your project
        </div>
        <div>
          Ranked by <strong className="text-brand-600">Deterministic Match Score</strong>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      {filteredResults.length === 0 ? (
        <div className="student-panel p-12 text-center space-y-2 bg-white">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No Matching Candidates Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or clearing filters to view more student profiles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResults.map(result => {
            const isInvited = invitedStudentIds.includes(result.candidate.id);
            const isMember = teamMemberIds.includes(result.candidate.id);

            return (
              <CandidateCard
                key={result.candidate.id}
                candidate={result.candidate}
                matchResult={result}
                project={project}
                onViewProfile={onViewProfile}
                onExplainMatch={onExplainMatch}
                onOpenMessage={onOpenMessage}
                onInvite={onInvite}
                isInvited={isInvited}
                isMember={isMember}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
