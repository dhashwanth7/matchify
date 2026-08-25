import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  FolderGit2,
  MessageSquare,
  User,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { Student } from '../types';

interface NavbarProps {
  activeTab:
  | 'matches'
  | 'explore'
  | 'projects'
  | 'messages'
  | 'team'
  | 'profile';

  setActiveTab: (
    tab:
      | 'matches'
      | 'explore'
      | 'projects'
      | 'messages'
      | 'team'
      | 'profile'
  ) => void;

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
}) => {
  const assessedCount = currentUser.skills.filter(
    (skill) => skill.isAssessed
  ).length;

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (value.trim().length > 0) {
      setActiveTab('explore');
    }
  };

  const navItem = (
    tab:
      | 'matches'
      | 'explore'
      | 'projects'
      | 'messages'
      | 'profile',
    label: string,
    icon: React.ReactNode
  ) => {
    const active =
      activeTab === tab ||
      (tab === 'projects' && activeTab === 'team');

    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`
          group relative flex items-center gap-2
          px-4 py-2 rounded-xl
          text-sm font-medium
          transition-all duration-200
          ${active
            ? 'bg-white/[0.10] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]'
            : 'text-white/55 hover:text-white hover:bg-white/[0.06]'
          }
        `}
      >
        <span
          className={`
            transition-colors
            ${active ? 'text-white' : 'text-white/45 group-hover:text-white/80'}
          `}
        >
          {icon}
        </span>

        {label}

        {tab === 'messages' && unreadMessagesCount > 0 && (
          <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        )}
      </button>
    );
  };

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        border-b border-white/[0.08]
        bg-[#050505]/80
        backdrop-blur-2xl
        supports-[backdrop-filter]:bg-[#050505]/65
      "
    >
      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-[1500px] mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[76px] gap-6">

          {/* ================================================= */}
          {/* BRAND */}
          {/* ================================================= */}

          <button
            onClick={() => setActiveTab('matches')}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div
              className="
                relative w-11 h-11 rounded-2xl
                border border-white/15
                bg-white/[0.06]
                backdrop-blur-xl
                flex items-center justify-center
                text-white
                shadow-[0_8px_30px_rgba(0,0,0,0.35)]
                transition-all duration-300
                group-hover:bg-white/[0.10]
                group-hover:border-white/25
                group-hover:scale-[1.03]
              "
            >
              <Sparkles className="w-5 h-5" />

              <span className="absolute inset-0 rounded-2xl ring-1 ring-white/5" />
            </div>

            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Matchify
                </span>

                <span
                  className="
                    text-[9px] uppercase tracking-[0.18em]
                    font-semibold
                    px-2 py-0.5
                    rounded-full
                    border border-white/15
                    bg-white/[0.05]
                    text-white/60
                  "
                >
                  Campus
                </span>
              </div>

              <p className="text-[10px] text-white/40 mt-0.5">
                Find the right people. Build the right team.
              </p>
            </div>
          </button>

          {/* ================================================= */}
          {/* MAIN NAV */}
          {/* ================================================= */}

          <nav
            className="
              hidden lg:flex items-center gap-1
              rounded-2xl
              border border-white/[0.10]
              bg-white/[0.035]
              p-1.5
              backdrop-blur-xl
              shadow-[0_10px_40px_rgba(0,0,0,0.25)]
            "
          >
            {navItem(
              'matches',
              'Match Hub',
              <Sparkles className="w-4 h-4" />
            )}

            {navItem(
              'explore',
              'Explore',
              <Compass className="w-4 h-4" />
            )}

            {navItem(
              'projects',
              'Projects',
              <FolderGit2 className="w-4 h-4" />
            )}

            {navItem(
              'messages',
              'Messages',
              <MessageSquare className="w-4 h-4" />
            )}

            {navItem(
              'profile',
              'My Profile',
              <User className="w-4 h-4" />
            )}
          </nav>

          {/* ================================================= */}
          {/* RIGHT ACTIONS */}
          {/* ================================================= */}

          <div className="flex items-center gap-2 shrink-0">

            {/* SEARCH */}
            <div className="relative">
              {searchOpen ? (
                <div
                  className="
                    flex items-center gap-2
                    w-[220px]
                    h-10
                    px-3
                    rounded-xl
                    border border-white/15
                    bg-white/[0.07]
                    backdrop-blur-xl
                    shadow-[0_10px_35px_rgba(0,0,0,0.35)]
                  "
                >
                  <Search className="w-4 h-4 text-white/45 shrink-0" />

                  <input
                    autoFocus
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search people, skills..."
                    className="
                      flex-1
                      min-w-0
                      bg-transparent
                      outline-none
                      text-sm
                      text-white
                      placeholder:text-white/30
                    "
                  />

                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchValue('');
                    }}
                    className="text-white/40 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  title="Search"
                  className="
                    w-10 h-10
                    rounded-xl
                    border border-white/10
                    bg-white/[0.045]
                    text-white/55
                    hover:text-white
                    hover:bg-white/[0.09]
                    hover:border-white/20
                    flex items-center justify-center
                    transition-all
                    duration-200
                  "
                >
                  <Search className="w-[17px] h-[17px]" />
                </button>
              )}
            </div>

            {/* RESET */}
            <button
              onClick={onResetDemo}
              title="Reset demo"
              className="
                hidden xl:flex
                items-center gap-2
                h-10
                px-3
                rounded-xl
                border border-white/10
                bg-white/[0.035]
                text-white/45
                hover:text-white
                hover:bg-white/[0.07]
                transition-all
                text-xs
              "
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            {/* PROFILE */}
            <button
              onClick={() => setActiveTab('profile')}
              className="
                flex items-center gap-2.5
                h-11
                pl-1.5 pr-3
                rounded-full
                border border-white/10
                bg-white/[0.05]
                backdrop-blur-xl
                hover:bg-white/[0.09]
                hover:border-white/20
                transition-all
                duration-200
              "
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="
                    w-8 h-8
                    rounded-full
                    object-cover
                    ring-1 ring-white/15
                  "
                />

                <span
                  className="
                    absolute -bottom-0.5 -right-0.5
                    w-2.5 h-2.5
                    rounded-full
                    bg-white
                    ring-2 ring-[#050505]
                  "
                />
              </div>

              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser.name}
                </div>

                <div className="text-[10px] text-white/40 mt-0.5">
                  {assessedCount} Assessed{' '}
                  {assessedCount === 1 ? 'Skill' : 'Skills'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* MOBILE NAV */}
        {/* ================================================= */}

        <div className="lg:hidden flex items-center gap-1 pb-3 overflow-x-auto scrollbar-hide">
          {[
            ['matches', 'Match'],
            ['explore', 'Explore'],
            ['projects', 'Projects'],
            ['messages', 'Messages'],
            ['profile', 'Profile'],
          ].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(
                  tab as
                  | 'matches'
                  | 'explore'
                  | 'projects'
                  | 'messages'
                  | 'profile'
                )
              }
              className={`
                whitespace-nowrap
                px-3.5 py-2
                rounded-xl
                text-xs font-medium
                border
                transition-all
                ${activeTab === tab ||
                  (tab === 'projects' && activeTab === 'team')
                  ? 'bg-white text-black border-white'
                  : 'bg-white/[0.035] text-white/50 border-white/10 hover:text-white hover:bg-white/[0.07]'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};