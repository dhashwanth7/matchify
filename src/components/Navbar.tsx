import React from 'react';
import { Sparkles, Compass, FolderGit2, MessageSquare, User, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import { Student } from '../types';

interface NavbarProps {
  activeTab: 'matches' | 'explore' | 'projects' | 'messages' | 'team' | 'profile';
  setActiveTab: (tab: 'matches' | 'explore' | 'projects' | 'messages' | 'team' | 'profile') => void;
  currentUser: Student;
  unreadMessagesCount: number;
  onResetDemo: () => void;
  onOpenAssessment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadMessagesCount,
  onResetDemo,
  onOpenAssessment,
}) => {
  const assessedCount = currentUser.skills.filter(s => s.isAssessed).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('matches')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/30 transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 font-sans">
                  Match<span className="text-brand-600">ify</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
                Find the right people. Build the right team.
              </p>
            </div>
          </div>

          {/* Nav Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'matches'
                  ? 'bg-white text-brand-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Match Hub
            </button>

            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'explore'
                  ? 'bg-white text-brand-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Explore
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'projects' || activeTab === 'team'
                  ? 'bg-white text-brand-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              Projects
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'messages'
                  ? 'bg-white text-brand-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Messages
              {unreadMessagesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-brand-600" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-brand-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              My Profile
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onResetDemo}
              title="Reset seeded demo dataset"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Profile Avatar Pill */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-brand-300 hover:bg-white cursor-pointer transition-all shadow-2xs"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  {assessedCount} Assessed {assessedCount === 1 ? 'Skill' : 'Skills'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3 py-1 rounded-md text-xs font-medium ${
              activeTab === 'matches' ? 'bg-brand-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1 rounded-md text-xs font-medium ${
              activeTab === 'explore' ? 'bg-brand-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1 rounded-md text-xs font-medium ${
              activeTab === 'projects' || activeTab === 'team' ? 'bg-brand-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3 py-1 rounded-md text-xs font-medium relative ${
              activeTab === 'messages' ? 'bg-brand-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1 rounded-md text-xs font-medium ${
              activeTab === 'profile' ? 'bg-brand-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Profile
          </button>
        </div>
      </div>
    </header>
  );
};
