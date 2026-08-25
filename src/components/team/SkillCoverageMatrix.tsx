import React from 'react';
import { Award, CheckCircle2, AlertCircle, XCircle, Users } from 'lucide-react';
import { Project, Student, SkillCoverageItem } from '../../types';
import { getSkillLevelLabel } from '../../data/assessmentQuestions';

interface SkillCoverageMatrixProps {
  project: Project;
  teamMembers: Student[];
}

export const SkillCoverageMatrix: React.FC<SkillCoverageMatrixProps> = ({
  project,
  teamMembers,
}) => {
  const reqSkills = project.requiredSkills || [];

  const coverageItems: SkillCoverageItem[] = reqSkills.map(req => {
    const coveredBy: SkillCoverageItem['coveredBy'] = [];

    teamMembers.forEach(member => {
      const skill = member.skills.find(
        s => s.name.toLowerCase() === req.name.toLowerCase()
      );
      if (skill) {
        coveredBy.push({
          student: member,
          level: skill.level,
          isAssessed: Boolean(skill.isAssessed),
          satisfiesMin: skill.level >= req.minLevel,
        });
      }
    });

    let status: SkillCoverageItem['status'] = 'missing';
    if (coveredBy.length > 0) {
      const hasSatisfyingMember = coveredBy.some(c => c.satisfiesMin);
      status = hasSatisfyingMember ? 'fully_covered' : 'partially_covered';
    }

    return {
      skillName: req.name,
      requiredMinLevel: req.minLevel,
      priority: req.priority,
      coveredBy,
      status,
    };
  });

  const fullyCoveredCount = coverageItems.filter(c => c.status === 'fully_covered').length;
  const partiallyCoveredCount = coverageItems.filter(c => c.status === 'partially_covered').length;
  const missingCount = coverageItems.filter(c => c.status === 'missing').length;

  return (
    <div className="student-panel p-6 bg-white border border-slate-200 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" />
            Skill Coverage Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Audit how your current team satisfies technical requirements.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {fullyCoveredCount} Covered
          </span>
          {partiallyCoveredCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {partiallyCoveredCount} Below Min
            </span>
          )}
          {missingCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              {missingCount} Missing
            </span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-3.5 font-semibold">Required Skill</th>
              <th className="p-3.5 font-semibold">Benchmark</th>
              <th className="p-3.5 font-semibold">Team Coverage</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coverageItems.map(item => (
              <tr key={item.skillName} className="hover:bg-slate-50/50">
                <td className="p-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{item.skillName}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        item.priority === 'required'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </td>

                <td className="p-3.5 font-mono font-bold text-brand-700">
                  ≥ Level {item.requiredMinLevel}
                </td>

                <td className="p-3.5">
                  {item.coveredBy.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {item.coveredBy.map((cov, idx) => (
                        <div
                          key={idx}
                          className={`px-2 py-0.5 rounded-lg border flex items-center gap-1.5 text-[11px] ${
                            cov.satisfiesMin
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-amber-50 border-amber-200 text-amber-800'
                          }`}
                        >
                          <img
                            src={cov.student.avatar}
                            alt={cov.student.name}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="font-medium">{cov.student.name.split(' ')[0]}</span>
                          <span className="font-mono font-bold">L{cov.level}</span>
                          {cov.isAssessed && <span>⭐</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">
                      Not covered by any team member
                    </span>
                  )}
                </td>

                <td className="p-3.5 text-right">
                  {item.status === 'fully_covered' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Covered
                    </span>
                  ) : item.status === 'partially_covered' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" /> Below Min
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-semibold text-[11px]">
                      <XCircle className="w-3.5 h-3.5" /> Missing
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
