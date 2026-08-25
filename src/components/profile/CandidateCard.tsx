import React from 'react';
import { Student, Project, MatchResult } from '../../types';
import { Sparkles, MessageSquare, UserPlus, Clock, Check, ArrowRight, Award } from 'lucide-react';
import { getSkillLevelLabel } from '../../data/assessmentQuestions';

interface CandidateCardProps {
  candidate: Student;
  matchResult?: MatchResult;
  project?: Project;
  onViewProfile: (candidate: Student) => void;
  onExplainMatch: (candidate: Student, matchResult: MatchResult) => void;
  onOpenMessage: (candidate: Student) => void;
  onInvite: (candidate: Student) => void;
  isInvited?: boolean;
  isMember?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  matchResult,
  project,
  onViewProfile,
  onExplainMatch,
  onOpenMessage,
  onInvite,
  isInvited = false,
  isMember = false,
}) => {
  const matchPct = matchResult?.matchPercentage || 0;

  // Match score color badge
  const getMatchBadgeStyle = (pct: number) => {
    if (pct >= 85) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (pct >= 70) return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    if (pct >= 50) return 'bg-blue-50 text-blue-800 border-blue-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="student-card p-5 flex flex-col justify-between bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div>
        {/* Top Header: Avatar, Name, Role, University & Match Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              onClick={() => onViewProfile(candidate)}
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
            />
            <div>
              <h3
                onClick={() => onViewProfile(candidate)}
                className="text-sm font-bold text-slate-900 hover:text-brand-600 cursor-pointer transition-colors leading-tight"
              >
                {candidate.name}
              </h3>
              <p className="text-xs font-semibold text-brand-600 mt-0.5">
                {candidate.role}
              </p>
              <p className="text-[11px] text-slate-500">
                {candidate.university}
              </p>
            </div>
          </div>

          {/* Match % Badge */}
          {matchResult && (
            <div className={`px-2.5 py-1 rounded-xl border text-center shrink-0 ${getMatchBadgeStyle(matchPct)}`}>
              <div className="text-sm font-extrabold font-mono leading-none">
                {matchPct}%
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
                Match
              </div>
            </div>
          )}
        </div>

        {/* Headline / 1-Line Summary */}
        <p className="text-xs text-slate-600 mt-3 line-clamp-1 leading-relaxed">
          {candidate.headline || candidate.bio}
        </p>

        {/* Top Skills & Calibrated Levels */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {candidate.skills.slice(0, 3).map(skill => {
            return (
              <span
                key={skill.name}
                className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${skill.isAssessed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
              >
                <span>{skill.name}</span>
                <span className="font-bold text-[10px] opacity-80">
                  L{skill.level}
                </span>
                {skill.isAssessed && (
                  <span className="text-[10px] text-emerald-600 font-bold" title={`Matchify-Assessed score: ${skill.assessmentScore}%`}>
                    ⭐
                  </span>
                )}
              </span>
            );
          })}
          {candidate.skills.length > 3 && (
            <span className="text-[11px] px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-500">
              +{candidate.skills.length - 3}
            </span>
          )}
        </div>

        {/* Availability & Commitment */}
        <div className="flex items-center gap-2 mt-3 text-[11px] text-white">
          <span className="flex items-center gap-1 bg-dark-700/90 border border-dark-500 px-2.5 py-1 rounded-md text-white font-semibold">
            <Clock className="w-3 h-3 text-gray-300" />
            {candidate.availabilityHours} hrs/week
          </span>

          <span className="bg-dark-700/90 border border-dark-500 px-2.5 py-1 rounded-md text-white font-semibold">
            {candidate.experience.split(' ')[0]}
          </span>
        </div>        {/* Action Footer: Why Match, Profile, Message, Invite */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {matchResult && (
              <button
                onClick={() => onExplainMatch(candidate, matchResult)}
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Why Match
              </button>
            )}

            <button
              onClick={() => onViewProfile(candidate)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Profile
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenMessage(candidate)}
              title={`Send message to ${candidate.name}`}
              aria-label={`Send message to ${candidate.name}`}
              className="p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {isMember ? (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                Joined
              </span>
            ) : isInvited ? (
              <span className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Invited
              </span>
            ) : (
              <button
                onClick={() => onInvite(candidate)}
                className="btn-primary flex items-center gap-1 px-3 py-1.5 text-xs shadow-none"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Invite
              </button>
            )}
          </div>
        </div>
      </div>
      );
};
