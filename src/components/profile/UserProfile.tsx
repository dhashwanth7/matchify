import React, { useState } from 'react';
import { Award, CheckCircle2, Clock, Plus, Trash2, Edit3, Save, Sparkles, MapPin, GraduationCap, Briefcase, ChevronRight } from 'lucide-react';
import { Student, Skill, SkillLevel } from '../../types';
import { getSkillLevelLabel } from '../../data/assessmentQuestions';

interface UserProfileProps {
  user: Student;
  onUpdateUser: (updated: Student) => void;
  onOpenAssessment: (skillName?: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onUpdateUser,
  onOpenAssessment,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Student>(user);
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>(3);
  const [newInterest, setNewInterest] = useState<string>('');

  const handleSaveProfile = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const exists = formData.skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
    if (exists) return;

    const newSkill: Skill = {
      name: newSkillName.trim(),
      level: newSkillLevel,
      isAssessed: false,
    };

    const updated = {
      ...formData,
      skills: [...formData.skills, newSkill],
    };
    setFormData(updated);
    onUpdateUser(updated);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    const updated = {
      ...formData,
      skills: formData.skills.filter(s => s.name !== skillName),
    };
    setFormData(updated);
    onUpdateUser(updated);
  };

  const handleSkillLevelChange = (skillName: string, level: SkillLevel) => {
    const updated = {
      ...formData,
      skills: formData.skills.map(s => (s.name === skillName ? { ...s, level } : s)),
    };
    setFormData(updated);
    onUpdateUser(updated);
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    if (formData.interests.includes(newInterest.trim())) return;
    const updated = {
      ...formData,
      interests: [...formData.interests, newInterest.trim()],
    };
    setFormData(updated);
    onUpdateUser(updated);
    setNewInterest('');
  };

  const handleRemoveInterest = (interest: string) => {
    const updated = {
      ...formData,
      interests: formData.interests.filter(i => i !== interest),
    };
    setFormData(updated);
    onUpdateUser(updated);
  };

  const assessedSkills = formData.skills.filter(s => s.isAssessed);
  const selfReportedSkills = formData.skills.filter(s => !s.isAssessed);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Profile Card */}
      <div className="student-panel p-6 sm:p-8 bg-white border border-slate-200 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
            />

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {formData.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                  {formData.role}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                  {formData.experience}
                </span>
              </div>

              <p className="text-xs font-medium text-slate-600">
                {formData.headline || `${formData.role} • ${formData.university}`}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {formData.university} ({formData.graduationYear})
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <strong className="text-slate-800">{formData.availabilityHours} hrs/wk</strong> availability
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {formData.timezone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => onOpenAssessment()}
              className="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs"
            >
              <Award className="w-4 h-4" />
              Take Skill Assessment
            </button>
            <button
              onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
              className="btn-secondary flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 text-brand-600" />
                  Save Profile
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bio & Looking For */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
          {isEditing ? (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bio / Background:</label>
                <textarea
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Looking For:</label>
                <input
                  type="text"
                  value={formData.lookingFor || ''}
                  onChange={e => setFormData({ ...formData, lookingFor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role:</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Availability (hrs/wk):</label>
                  <input
                    type="number"
                    value={formData.availabilityHours}
                    onChange={e => setFormData({ ...formData, availabilityHours: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Timezone:</label>
                  <input
                    type="text"
                    value={formData.timezone}
                    onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                "{formData.bio}"
              </p>
              {formData.lookingFor && (
                <div className="text-xs text-slate-600 bg-brand-50/40 p-3 rounded-xl border border-brand-100">
                  <strong className="text-brand-800">Looking For:</strong> {formData.lookingFor}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Skills Matrices: Matchify-Assessed vs Self-Reported */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matchify-Assessed Skills */}
        <div className="student-panel p-6 bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                Matchify-Assessed Skills ({assessedSkills.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Calibrated via standardized technical assessments
              </p>
            </div>
          </div>

          {assessedSkills.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
              <Award className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">
                Take an assessment to calibrate your skill level (1–5).
              </p>
              <button
                onClick={() => onOpenAssessment()}
                className="btn-primary text-xs px-3.5 py-1.5"
              >
                Take Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {assessedSkills.map(skill => {
                const info = getSkillLevelLabel(skill.level);
                return (
                  <div
                    key={skill.name}
                    className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{skill.name}</span>
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                          ⭐ {skill.assessmentScore}% Score
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {info.label} • {info.description}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <span
                          key={lvl}
                          className={`w-2 h-5 rounded-xs ${
                            lvl <= skill.level ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Self-Reported Skills */}
        <div className="student-panel p-6 bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Self-Reported Skills ({selfReportedSkills.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Self-estimated levels (1–5)
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {selfReportedSkills.map(skill => (
              <div
                key={skill.name}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800">{skill.name}</div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Level {skill.level}/5</span>
                    <button
                      onClick={() => onOpenAssessment(skill.name)}
                      className="text-brand-600 hover:text-brand-700 underline font-semibold"
                    >
                      Calibrate with Quiz →
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={skill.level}
                    onChange={e => handleSkillLevelChange(skill.name, Number(e.target.value) as SkillLevel)}
                    className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700"
                  >
                    <option value={1}>Lvl 1 (Novice)</option>
                    <option value={2}>Lvl 2 (Beginner)</option>
                    <option value={3}>Lvl 3 (Intermediate)</option>
                    <option value={4}>Lvl 4 (Advanced)</option>
                    <option value={5}>Lvl 5 (Expert)</option>
                  </select>

                  <button
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Skill */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Next.js, PyTorch)..."
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <select
                value={newSkillLevel}
                onChange={e => setNewSkillLevel(Number(e.target.value) as SkillLevel)}
                className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700"
              >
                <option value={1}>Lvl 1</option>
                <option value={2}>Lvl 2</option>
                <option value={3}>Lvl 3</option>
                <option value={4}>Lvl 4</option>
                <option value={5}>Lvl 5</option>
              </select>
              <button
                onClick={handleAddSkill}
                className="btn-secondary text-xs px-3 py-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="student-panel p-6 bg-white border border-slate-200 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          Hackathon Tracks & Project Domains
        </h3>
        <div className="flex flex-wrap gap-2">
          {formData.interests.map(interest => (
            <span
              key={interest}
              className="px-3 py-1 rounded-lg bg-slate-100 text-xs text-slate-700 flex items-center gap-2 font-medium"
            >
              {interest}
              <button
                onClick={() => handleRemoveInterest(interest)}
                className="text-slate-400 hover:text-rose-600"
              >
                ×
              </button>
            </span>
          ))}

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add domain/track..."
              value={newInterest}
              onChange={e => setNewInterest(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddInterest()}
              className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={handleAddInterest}
              className="p-1 rounded bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
