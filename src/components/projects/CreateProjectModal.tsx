import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Bot, Layers, ArrowRight, Loader2 } from 'lucide-react';
import { Project, SkillRequirement, SkillLevel } from '../../types';
import { analyzeProjectWithAI } from '../../services/geminiService';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
  ownerId: string;
  ownerName: string;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  ownerId,
  ownerName,
}) => {
  const [title, setTitle] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [track, setTrack] = useState<Project['track']>('AI / Machine Learning');
  const [maxTeamSize, setMaxTeamSize] = useState<number>(4);
  const [requiredRoles, setRequiredRoles] = useState<string[]>(['AI/ML Engineer', 'Frontend Developer', 'Backend Engineer']);
  const [requiredSkills, setRequiredSkills] = useState<SkillRequirement[]>([
    { name: 'Python', minLevel: 4, priority: 'required', reason: 'Core data pipelines' },
    { name: 'Machine Learning', minLevel: 4, priority: 'required', reason: 'Inference and model optimization' },
    { name: 'React', minLevel: 3, priority: 'required', reason: 'Dashboard client UI' },
  ]);
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>(3);
  const [newSkillPriority, setNewSkillPriority] = useState<'required' | 'preferred'>('required');
  const [newRole, setNewRole] = useState<string>('');
  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);
  const [aiTip, setAiTip] = useState<string>('');

  if (!isOpen) return null;

  const handleAIAnalyze = async () => {
    if (!description.trim() && !title.trim()) {
      alert('Please provide a project title or description to analyze with AI.');
      return;
    }
    setIsAnalyzingAI(true);
    try {
      const result = await analyzeProjectWithAI(title, description, track);
      if (result) {
        if (result.roles && result.roles.length > 0) {
          setRequiredRoles(result.roles.map(r => r.role));
        }
        if (result.requiredSkills && result.requiredSkills.length > 0) {
          setRequiredSkills(
            result.requiredSkills.map(s => ({
              name: s.name,
              minLevel: (s.minLevel as SkillLevel) || 3,
              priority: s.priority || 'required',
              reason: s.reason,
            }))
          );
        }
        if (result.recommendedTeamSize) {
          setMaxTeamSize(result.recommendedTeamSize);
        }
        if (result.formationTip) {
          setAiTip(result.formationTip);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const exists = requiredSkills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
    if (exists) return;

    setRequiredSkills([
      ...requiredSkills,
      {
        name: newSkillName.trim(),
        minLevel: newSkillLevel,
        priority: newSkillPriority,
      },
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setRequiredSkills(requiredSkills.filter(s => s.name !== skillName));
  };

  const handleAddRole = () => {
    if (!newRole.trim()) return;
    if (requiredRoles.includes(newRole.trim())) return;
    setRequiredRoles([...requiredRoles, newRole.trim()]);
    setNewRole('');
  };

  const handleRemoveRole = (role: string) => {
    setRequiredRoles(requiredRoles.filter(r => r !== role));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a project title.');
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      tagline: tagline.trim() || 'A game-changing hackathon project.',
      description: description.trim(),
      track,
      ownerId,
      ownerName,
      maxTeamSize,
      requiredRoles,
      requiredSkills,
      teamMembers: [
        {
          studentId: ownerId,
          role: 'Team Lead & Founder',
          joinedAt: new Date().toISOString(),
          status: 'owner',
        },
      ],
      createdAt: new Date().toISOString(),
      aiAnalyzed: Boolean(aiTip),
      formationTip: aiTip,
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden my-8 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-700 border border-brand-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Create New Project
              </h3>
              <p className="text-xs text-slate-500">
                Define your project goals, required team roles, and minimum skill levels.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., MedTriage AI, EcoLedger"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hackathon Track
                </label>
                <select
                  value={track}
                  onChange={e => setTrack(e.target.value as Project['track'])}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="AI / Machine Learning">AI / Machine Learning</option>
                  <option value="HealthTech & Bio">HealthTech & Bio</option>
                  <option value="FinTech / Web3">FinTech / Web3</option>
                  <option value="Social Impact">Social Impact</option>
                  <option value="Developer Tools">Developer Tools</option>
                  <option value="Open Innovation">Open Innovation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Elevator Pitch / Tagline
              </label>
              <input
                type="text"
                placeholder="One sentence describing what you are building..."
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Project Description & Architecture *
                </label>

                <button
                  type="button"
                  disabled={isAnalyzingAI}
                  onClick={handleAIAnalyze}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 transition-all shadow-2xs"
                >
                  {isAnalyzingAI ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                      AI Auto-Fill Requirements
                    </>
                  )}
                </button>
              </div>

              <textarea
                required
                rows={3}
                placeholder="Describe what you plan to build and the tech stack you'll use. Click 'AI Auto-Fill Requirements' above to automatically extract required skills & roles!"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 leading-relaxed"
              />
            </div>

            {aiTip && (
              <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-100 text-xs text-brand-900">
                <strong>AI Team Formation Strategy:</strong> {aiTip}
              </div>
            )}
          </div>

          {/* Required Roles & Team Size */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Required Roles ({maxTeamSize} Max Members)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Max Team Size:</span>
                <input
                  type="number"
                  min={2}
                  max={6}
                  value={maxTeamSize}
                  onChange={e => setMaxTeamSize(Number(e.target.value))}
                  className="w-14 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 text-center font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {requiredRoles.map(role => (
                <span
                  key={role}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 flex items-center gap-1.5 font-medium"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Add role (e.g. Data Engineer)..."
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRole();
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="btn-secondary text-xs px-2 py-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Required Skills Matrix with Min Levels */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Required Technical Skills & Minimum Level Thresholds (1–5):
            </label>

            <div className="space-y-2">
              {requiredSkills.map(skill => (
                <div
                  key={skill.name}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{skill.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          skill.priority === 'required'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {skill.priority}
                      </span>
                    </div>
                    {skill.reason && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{skill.reason}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-brand-700 font-bold">
                      ≥ Lvl {skill.minLevel}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.name)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Skill Row */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Skill name (e.g. SQL, PyTorch)..."
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  className="flex-1 min-w-[120px] px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                />
                <select
                  value={newSkillLevel}
                  onChange={e => setNewSkillLevel(Number(e.target.value) as SkillLevel)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700"
                >
                  <option value={1}>Min Lvl 1</option>
                  <option value={2}>Min Lvl 2</option>
                  <option value={3}>Min Lvl 3</option>
                  <option value={4}>Min Lvl 4</option>
                  <option value={5}>Min Lvl 5</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-1.5 text-xs px-5 py-2"
            >
              <span>Publish & Start Matching</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
