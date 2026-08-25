import React, { useEffect, useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, Award, Clock, Users, Loader2, Bot, MessageSquare, UserPlus } from 'lucide-react';
import { Student, Project, MatchResult } from '../../types';
import { getAIMatchExplanation, AIMatchExplanation } from '../../services/geminiService';
import { getSkillLevelLabel } from '../../data/assessmentQuestions';

interface MatchExplanationModalProps {
  candidate: Student | null;
  project: Project | null;
  matchResult: MatchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenMessage?: (candidate: Student) => void;
  onInvite?: (candidate: Student) => void;
  isInvited?: boolean;
  isMember?: boolean;
}

export const MatchExplanationModal: React.FC<MatchExplanationModalProps> = ({
  candidate,
  project,
  matchResult,
  isOpen,
  onClose,
  onOpenMessage,
  onInvite,
  isInvited = false,
  isMember = false,
}) => {
  const [aiExplanation, setAiExplanation] = useState<AIMatchExplanation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && candidate && project && matchResult) {
      setIsLoadingAI(true);
      getAIMatchExplanation(candidate, project, matchResult.matchPercentage, matchResult.breakdown)
        .then(res => {
          setAiExplanation(res);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          setIsLoadingAI(false);
        });
    } else {
      setAiExplanation(null);
    }
  }, [isOpen, candidate, project, matchResult]);

  if (!isOpen || !candidate || !project || !matchResult) return null;

  const { breakdown, matchedSkills, missingRequiredSkills, matchPercentage } = matchResult;

  const factorList = [
    { label: 'Skill Match Overlap', score: breakdown.skillMatchScore, weight: '40%' },
    { label: 'Skill Level vs Min Required', score: breakdown.skillLevelScore, weight: '20%' },
    { label: 'Assessment-Backed Skills', score: breakdown.assessmentVerification, weight: '15%' },
    { label: 'Role & Vacancy Fit', score: breakdown.roleFitScore, weight: '15%' },
    { label: 'Availability Bandwidth', score: breakdown.availabilityScore, weight: '5%' },
    { label: 'Domain & Track Affinity', score: breakdown.interestScore, weight: '5%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden my-8 animate-fadeIn">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-8">
            <div className="flex items-center gap-3">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {candidate.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-bold border border-brand-200">
                    {candidate.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Match analysis for <strong className="text-slate-800">{project.title}</strong>
                </p>
              </div>
            </div>

            {/* Score Pill */}
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
              <div className="text-2xl font-extrabold font-mono leading-none">
                {matchPercentage}%
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5 text-emerald-700">
                Match Score
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* AI Justification Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50/70 via-indigo-50/30 to-white border border-brand-100 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-brand-600" />
                Why This Teammate Matches
              </div>
              {isLoadingAI && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Loader2 className="w-3 h-3 animate-spin text-brand-600" />
                  Generating summary...
                </div>
              )}
            </div>

            {aiExplanation ? (
              <div className="space-y-2.5 text-xs text-slate-700">
                <p className="font-semibold text-slate-900 leading-snug">
                  "{aiExplanation.headline}"
                </p>
                <ul className="space-y-1 pt-1">
                  {aiExplanation.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Evaluating candidate skill overlap, calibrated assessment scores, and project compatibility...
              </p>
            )}
          </div>

          {/* Factor Breakdown Bars */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Deterministic Scoring Factors:
            </h4>
            <div className="space-y-2.5">
              {factorList.map(factor => (
                <div key={factor.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{factor.label}</span>
                    <span className="text-slate-500 font-mono font-bold">
                      {factor.score}% <span className="text-slate-400 font-normal">({factor.weight})</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        factor.score >= 80 ? 'bg-emerald-500' : factor.score >= 60 ? 'bg-brand-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements Alignment Table */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Skill Requirements vs Candidate Calibration:
            </h4>
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Skill</th>
                    <th className="p-3 font-semibold">Required</th>
                    <th className="p-3 font-semibold">Candidate Level</th>
                    <th className="p-3 font-semibold text-right">Alignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matchedSkills.map(ms => (
                    <tr key={ms.skillName} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900">{ms.skillName}</td>
                      <td className="p-3 text-slate-600 font-mono">Lvl {ms.requiredMinLevel}+</td>
                      <td className="p-3">
                        <span className="font-bold font-mono text-slate-800">
                          Lvl {ms.candidateLevel}
                        </span>
                        {ms.isAssessed && (
                          <span className="ml-1.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                            ⭐ Assessed
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {ms.satisfiesMin ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Meets Min
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5" /> Below Min
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {missingRequiredSkills.map(missing => (
                    <tr key={missing} className="bg-rose-50/30">
                      <td className="p-3 font-bold text-rose-700">{missing}</td>
                      <td className="p-3 text-slate-500 font-mono">—</td>
                      <td className="p-3 text-slate-400 italic">Not listed</td>
                      <td className="p-3 text-right text-rose-600 text-[11px] font-semibold">
                        Skill Gap
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {onOpenMessage && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMessage(candidate);
                }}
                className="btn-secondary flex items-center gap-1.5 px-4 py-2 text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </button>
            )}

            {onInvite && (
              <div>
                {isMember ? (
                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    On Team
                  </span>
                ) : isInvited ? (
                  <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Invited
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      onInvite(candidate);
                      onClose();
                    }}
                    className="btn-primary flex items-center gap-1.5 px-5 py-2 text-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Invite Teammate
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
