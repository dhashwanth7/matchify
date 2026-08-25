import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Project, Student } from '../../types';

interface MissingSkillDetectorProps {
  project: Project;
  teamMembers: Student[];
  onFindMissingSkillTeammate: (skillOrRoleName: string) => void;
}

export const MissingSkillDetector: React.FC<MissingSkillDetectorProps> = ({
  project,
  teamMembers,
  onFindMissingSkillTeammate,
}) => {
  const reqSkills = project.requiredSkills || [];

  // Identify skills that no team member has with >= minLevel
  const missingSkills = reqSkills.filter(req => {
    const hasFulfiller = teamMembers.some(member => {
      const s = member.skills.find(sk => sk.name.toLowerCase() === req.name.toLowerCase());
      return s && s.level >= req.minLevel;
    });
    return !hasFulfiller;
  });

  // Identify unfilled roles
  const filledRoles = teamMembers.map(m => m.role.toLowerCase());
  const unfilledRoles = (project.requiredRoles || []).filter(reqRole => {
    return !filledRoles.some(fr => fr.includes(reqRole.toLowerCase()) || reqRole.toLowerCase().includes(fr));
  });

  if (missingSkills.length === 0 && unfilledRoles.length === 0) {
    return (
      <div className="student-panel p-5 bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Complete Team Skill Coverage Achieved!
            </h4>
            <p className="text-xs text-emerald-800">
              Your team satisfies all required technical skill levels and open project roles.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-panel p-6 bg-amber-50/40 border border-amber-200 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Missing Skills & Role Deficits
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                {missingSkills.length + unfilledRoles.length} Gaps
              </span>
            </h4>
            <p className="text-xs text-slate-600">
              Click any missing role or skill below to find matching candidates in the Match Hub.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Missing Roles */}
        {unfilledRoles.map(role => (
          <div
            key={role}
            className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-2xs flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {role}
                </span>
                <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                  Open Role
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Your team currently has no member filling the {role} position.
              </p>
            </div>

            <button
              onClick={() => onFindMissingSkillTeammate(role)}
              className="btn-primary flex items-center justify-between w-full px-3 py-1.5 text-xs font-bold"
            >
              <span>Find {role} Candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Missing Skills */}
        {missingSkills.map(req => (
          <div
            key={req.name}
            className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-2xs flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {req.name}
                </span>
                <span className="text-[10px] font-mono text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded">
                  Needs ≥ Lvl {req.minLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {req.reason || `Target skill for ${project.title}`}
              </p>
            </div>

            <button
              onClick={() => onFindMissingSkillTeammate(req.name)}
              className="btn-primary flex items-center justify-between w-full px-3 py-1.5 text-xs font-bold"
            >
              <span>Find {req.name} Teammates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
