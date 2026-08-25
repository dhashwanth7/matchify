import React from 'react';
import { Users, UserPlus, Clock, Trash2, CheckCircle2, UserCheck, Sparkles, FolderGit2, ArrowLeft } from 'lucide-react';
import { Project, Student } from '../../types';
import { SkillCoverageMatrix } from './SkillCoverageMatrix';
import { MissingSkillDetector } from './MissingSkillDetector';

interface TeamDashboardProps {
  project: Project;
  teamMembers: Student[];
  allCandidates: Student[];
  onRemoveMember: (studentId: string) => void;
  onAcceptInvite: (studentId: string) => void;
  onCancelInvite: (studentId: string) => void;
  onFindTeammates: () => void;
  onFindMissingSkillTeammate: (skillOrRoleName: string) => void;
  onNavigateToProjects?: () => void;
}

export const TeamDashboard: React.FC<TeamDashboardProps> = ({
  project,
  teamMembers,
  allCandidates,
  onRemoveMember,
  onAcceptInvite,
  onCancelInvite,
  onFindTeammates,
  onFindMissingSkillTeammate,
  onNavigateToProjects,
}) => {
  const memberCount = teamMembers.length;
  const isFull = memberCount >= project.maxTeamSize;

  const invitedMembers = project.teamMembers?.filter(m => m.status === 'invited') || [];
  const invitedCandidates = invitedMembers.map(inv => {
    const candidate = allCandidates.find(c => c.id === inv.studentId);
    return {
      invitation: inv,
      candidate,
    };
  }).filter((item): item is { invitation: typeof invitedMembers[0]; candidate: Student } => item.candidate !== undefined);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="student-panel p-6 sm:p-7 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            {onNavigateToProjects && (
              <button
                onClick={onNavigateToProjects}
                className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-semibold mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold">
                {project.track}
              </span>
              <span className="text-xs text-slate-500">
                Created by <strong className="text-slate-800">{project.ownerName}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {project.title} — Team Hub
            </h1>
            <p className="text-xs text-slate-600">
              Manage your active team roster, monitor technical skill coverage, and fill open role vacancies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Team Capacity Counter */}
            <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xl font-extrabold font-mono text-slate-900">
                {memberCount} / {project.maxTeamSize}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {isFull ? 'Team Full' : 'Members'}
              </div>
            </div>

            {!isFull && (
              <button
                onClick={onFindTeammates}
                className="btn-primary flex items-center gap-1.5 px-4 py-2 text-xs"
              >
                <UserPlus className="w-4 h-4" />
                Find Teammates
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Team Roster */}
      <div className="student-panel p-6 bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" />
            Active Team Members ({teamMembers.length})
          </h3>
          <span className="text-xs text-slate-500">
            {project.maxTeamSize - memberCount} open spot{project.maxTeamSize - memberCount !== 1 ? 's' : ''} remaining
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map(member => {
            const isOwner = member.id === project.ownerId;
            const assessedCount = member.skills.filter(s => s.isAssessed).length;

            return (
              <div
                key={member.id}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between gap-3 relative"
              >
                {isOwner && (
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-bl-lg border-l border-b border-brand-200">
                    Project Lead
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                    <p className="text-xs font-semibold text-brand-600">{member.role}</p>
                    <p className="text-[11px] text-slate-500">{member.university}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {member.skills.slice(0, 3).map(sk => (
                    <span
                      key={sk.name}
                      className={`text-[10px] px-2 py-0.5 rounded border ${
                        sk.isAssessed
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {sk.name} (L{sk.level}){sk.isAssessed && ' ⭐'}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {member.availabilityHours} hrs/wk
                  </span>

                  {!isOwner && (
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      className="text-slate-400 hover:text-rose-600 text-xs p-1"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Invitations */}
      {invitedCandidates.length > 0 && (
        <div className="student-panel p-5 bg-indigo-50/40 border border-indigo-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              Pending Invitations ({invitedCandidates.length})
            </h3>
            <span className="text-[11px] text-indigo-700">
              Click "Accept" to simulate candidate joining your team
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {invitedCandidates.map(({ candidate }) => (
              <div
                key={candidate.id}
                className="p-3.5 rounded-xl bg-white border border-indigo-200 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{candidate.name}</h4>
                    <p className="text-[11px] font-semibold text-brand-600">{candidate.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onAcceptInvite(candidate.id)}
                    className="btn-primary text-xs px-2.5 py-1"
                    title="Simulate candidate joining"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onCancelInvite(candidate.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                    title="Cancel invite"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Embedded Missing Skill & Role Detector */}
      <MissingSkillDetector
        project={project}
        teamMembers={teamMembers}
        onFindMissingSkillTeammate={onFindMissingSkillTeammate}
      />

      {/* Embedded Skill Coverage Matrix */}
      <SkillCoverageMatrix
        project={project}
        teamMembers={teamMembers}
      />
    </div>
  );
};
