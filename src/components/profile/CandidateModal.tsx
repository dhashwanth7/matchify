import React from 'react';
import { X, Award, Clock, MapPin, GraduationCap, Globe, UserPlus, Check, MessageSquare, Sparkles } from 'lucide-react';
import { Student } from '../../types';
import { getSkillLevelLabel } from '../../data/assessmentQuestions';

interface CandidateModalProps {
  candidate: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenMessage?: (candidate: Student) => void;
  onInvite?: (candidate: Student) => void;
  isInvited?: boolean;
  isMember?: boolean;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onOpenMessage,
  onInvite,
  isInvited = false,
  isMember = false,
}) => {
  if (!isOpen || !candidate) return null;

  const assessedSkills = candidate.skills.filter(s => s.isAssessed);
  const selfReportedSkills = candidate.skills.filter(s => !s.isAssessed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden my-8 animate-fadeIn">
        {/* Modal Top Banner & Header */}
        <div className="relative px-6 pt-6 pb-5 border-b border-slate-100 bg-slate-50/70">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-200 shadow-sm"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {candidate.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                  {candidate.role}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                  {candidate.experience}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {candidate.headline || candidate.role}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.university} • {candidate.major} ({candidate.graduationYear})
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <strong className="text-slate-800">{candidate.availabilityHours} hrs/wk</strong> availability
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* About */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              About
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {candidate.bio}
            </p>
          </div>

          {/* Looking For */}
          {candidate.lookingFor && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Looking For
              </h4>
              <p className="text-xs text-slate-700 bg-brand-50/50 p-3.5 rounded-xl border border-brand-100">
                {candidate.lookingFor}
              </p>
            </div>
          )}

          {/* Matchify-Assessed Skills */}
          {assessedSkills.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Matchify-Assessed Skills ({assessedSkills.length})
                </h4>
                <span className="text-[11px] text-slate-500">
                  Calibrated via standardized technical assessment
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {assessedSkills.map(skill => {
                  const info = getSkillLevelLabel(skill.level);
                  return (
                    <div
                      key={skill.name}
                      className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          {skill.name}
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/60 px-1.5 py-0.5 rounded">
                            ⭐ {skill.assessmentScore}% Score
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {info.label} • {info.description}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-emerald-700 font-mono">
                          Lvl {skill.level}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Self-Reported Skills */}
          {selfReportedSkills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Self-Reported Skills ({selfReportedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selfReportedSkills.map(skill => (
                  <span
                    key={skill.name}
                    className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-1.5"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono font-bold">
                      Lvl {skill.level} (Self-Reported)
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests & Domains */}
          {candidate.interests.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Interests & Project Domains
              </h4>
              <div className="flex flex-wrap gap-2">
                {candidate.interests.map(interest => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions: Message & Invite */}
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
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Check className="w-4 h-4" />
                    Team Member
                  </span>
                ) : isInvited ? (
                  <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Invitation Sent
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
                    Invite to Project
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
