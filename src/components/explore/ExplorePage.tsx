import React, { useState, useMemo } from 'react';
import { Search, Filter, Award, Sparkles, MessageSquare, UserPlus, GraduationCap, Clock, Check } from 'lucide-react';
import { Student, Project, SkillLevel } from '../../types';
import { CandidateCard } from '../profile/CandidateCard';

interface ExplorePageProps {
  candidates: Student[];
  currentProject?: Project;
  onViewProfile: (candidate: Student) => void;
  onOpenMessage: (candidate: Student) => void;
  onInvite: (candidate: Student) => void;
  invitedStudentIds: string[];
  teamMemberIds: string[];
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  candidates,
  currentProject,
  onViewProfile,
  onOpenMessage,
  onInvite,
  invitedStudentIds,
  teamMemberIds,
}) => {
  const [query, setQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [minLevelFilter, setMinLevelFilter] = useState<number>(0);
  const [assessedOnly, setAssessedOnly] = useState<boolean>(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<number>(0);

  // Extract unique roles & skills for filter dropdowns
  const allRoles = useMemo(() => {
    const roles = new Set<string>();
    candidates.forEach(c => roles.add(c.role));
    return Array.from(roles);
  }, [candidates]);

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    candidates.forEach(c => c.skills.forEach(s => skills.add(s.name)));
    return Array.from(skills).sort();
  }, [candidates]);

  // Dynamic filter matching
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      // 1. Text Query
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesRole = c.role.toLowerCase().includes(q);
        const matchesUniv = c.university.toLowerCase().includes(q);
        const matchesMajor = c.major.toLowerCase().includes(q);
        const matchesBio = c.bio.toLowerCase().includes(q);
        const matchesSkills = c.skills.some(s => s.name.toLowerCase().includes(q));
        const matchesInterests = c.interests.some(i => i.toLowerCase().includes(q));

        if (!matchesName && !matchesRole && !matchesUniv && !matchesMajor && !matchesBio && !matchesSkills && !matchesInterests) {
          return false;
        }
      }

      // 2. Role Filter
      if (roleFilter !== 'all') {
        if (!c.role.toLowerCase().includes(roleFilter.toLowerCase())) {
          return false;
        }
      }

      // 3. Skill Filter
      if (skillFilter !== 'all') {
        const hasSkill = c.skills.some(s => s.name.toLowerCase() === skillFilter.toLowerCase());
        if (!hasSkill) return false;
      }

      // 4. Min Skill Level
      if (minLevelFilter > 0) {
        if (skillFilter !== 'all') {
          const s = c.skills.find(sk => sk.name.toLowerCase() === skillFilter.toLowerCase());
          if (!s || s.level < minLevelFilter) return false;
        } else {
          const hasAnyAtLevel = c.skills.some(sk => sk.level >= minLevelFilter);
          if (!hasAnyAtLevel) return false;
        }
      }

      // 5. Assessed Only
      if (assessedOnly) {
        const hasAssessed = c.skills.some(s => s.isAssessed);
        if (!hasAssessed) return false;
      }

      // 6. Availability Filter
      if (availabilityFilter > 0) {
        if (c.availabilityHours < availabilityFilter) return false;
      }

      return true;
    });
  }, [candidates, query, roleFilter, skillFilter, minLevelFilter, assessedOnly, availabilityFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Explore Student Builders
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Search students across universities by skills, calibrated assessment scores, roles, and technical domains.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="student-panel p-4 space-y-3 bg-white">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search people, skills, roles, universities (e.g., React, Python, UI/UX, Stanford, Data Engineer)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value="all">All Roles</option>
            {allRoles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Skill filter */}
          <select
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value="all">All Skills</option>
            {allSkills.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Min Level */}
          <select
            value={minLevelFilter}
            onChange={e => setMinLevelFilter(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value={0}>Any Skill Level</option>
            <option value={5}>Level 5 (Expert)</option>
            <option value={4}>≥ Level 4 (Advanced)</option>
            <option value={3}>≥ Level 3 (Intermediate)</option>
          </select>

          {/* Availability */}
          <select
            value={availabilityFilter}
            onChange={e => setAvailabilityFilter(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value={0}>Any Availability</option>
            <option value={20}>≥ 20 hrs/week</option>
            <option value={30}>≥ 30 hrs/week</option>
          </select>

          {/* Assessed Only Toggle */}
          <button
            onClick={() => setAssessedOnly(!assessedOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              assessedOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Matchify-Assessed Only ⭐
          </button>

          {/* Reset Filters button */}
          {(query || roleFilter !== 'all' || skillFilter !== 'all' || minLevelFilter > 0 || assessedOnly || availabilityFilter > 0) && (
            <button
              onClick={() => {
                setQuery('');
                setRoleFilter('all');
                setSkillFilter('all');
                setMinLevelFilter(0);
                setAssessedOnly(false);
                setAvailabilityFilter(0);
              }}
              className="text-xs text-slate-500 hover:text-slate-900 underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <strong className="text-slate-900">{filteredCandidates.length}</strong> student builders
        </div>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="student-panel p-12 text-center space-y-2 bg-white">
          <p className="text-sm font-bold text-slate-800">No candidates match your search filters</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, or clear some filters to discover more people.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidates.map(candidate => {
            const isInvited = invitedStudentIds.includes(candidate.id);
            const isMember = teamMemberIds.includes(candidate.id);

            return (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                project={currentProject}
                onViewProfile={onViewProfile}
                onExplainMatch={() => {}}
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
