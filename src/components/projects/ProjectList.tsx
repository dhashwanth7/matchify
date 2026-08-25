import React from 'react';
import { Plus, Users, Sparkles, FolderGit2, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Project } from '../../types';

interface ProjectListProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onOpenCreateModal: () => void;
  onNavigateToMatches: () => void;
  onNavigateToTeam: (projectId: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onOpenCreateModal,
  onNavigateToMatches,
  onNavigateToTeam,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-brand-600" />
            Hackathon Projects
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create or explore projects, review required skill thresholds, and form your team.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="btn-primary flex items-center gap-1.5 px-4 py-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map(project => {
          const isActive = project.id === activeProjectId;
          const memberCount = project.teamMembers?.filter(m => m.status === 'owner' || m.status === 'accepted').length || 1;
          const openPositions = Math.max(0, project.maxTeamSize - memberCount);

          return (
            <div
              key={project.id}
              className={`student-card p-6 bg-white flex flex-col justify-between relative transition-all ${
                isActive
                  ? 'ring-2 ring-brand-500/80 border-brand-200 shadow-md'
                  : 'hover:border-slate-300'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-brand-600 text-white text-[10px] font-bold rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active Project
                </div>
              )}

              <div>
                {/* Domain Track & Team Capacity */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold">
                    {project.track}
                  </span>

                  <span className="text-xs font-medium text-slate-600 flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{memberCount}</strong> / {project.maxTeamSize} Members
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {project.title}
                </h2>
                <p className="text-xs font-semibold text-brand-600 mt-0.5">
                  {project.tagline}
                </p>

                <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Looking For Roles */}
                {project.requiredRoles && project.requiredRoles.length > 0 && (
                  <div className="mt-4 space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Looking For:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.requiredRoles.map(role => (
                        <span
                          key={role}
                          className="px-2.5 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Required Skills Benchmarks */}
                <div className="mt-3.5 space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Required Skills:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.requiredSkills.map(skill => (
                      <span
                        key={skill.name}
                        className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs flex items-center gap-1"
                      >
                        <span className="font-medium">{skill.name}</span>
                        <span className="font-mono text-brand-700 font-bold text-[11px]">
                          L{skill.minLevel}+
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Open Positions Note */}
                <div className="mt-3 text-xs text-slate-500">
                  <strong className="text-slate-700">{openPositions} open position{openPositions !== 1 ? 's' : ''}</strong> available on this team
                </div>
              </div>

              {/* Actions: View Team & Find Teammates */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => onNavigateToTeam(project.id)}
                  className="btn-secondary text-xs px-3.5 py-1.5"
                >
                  View Team Hub
                </button>

                <button
                  onClick={() => {
                    onSelectProject(project.id);
                    onNavigateToMatches();
                  }}
                  className="btn-primary flex items-center gap-1 px-4 py-1.5 text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Find Teammates
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
