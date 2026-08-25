import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DemoFlowBanner } from './components/common/DemoFlowBanner';
import { UserProfile } from './components/profile/UserProfile';
import { SkillAssessmentModal } from './components/profile/SkillAssessmentModal';
import { CandidateModal } from './components/profile/CandidateModal';
import { MatchExplanationModal } from './components/matching/MatchExplanationModal';
import { RecommendedTeammates } from './components/matching/RecommendedTeammates';
import { ExplorePage } from './components/explore/ExplorePage';
import { MessagesPage } from './components/messages/MessagesPage';
import { ProjectList } from './components/projects/ProjectList';
import { CreateProjectModal } from './components/projects/CreateProjectModal';
import { TeamDashboard } from './components/team/TeamDashboard';
import {
  getStoredCurrentUser,
  saveCurrentUser,
  getStoredCandidates,
  saveCandidates,
  getStoredProjects,
  saveProjects,
  getStoredMessages,
  addMessageToStore,
  applyAssessmentToUser,
  resetDemoData,
} from './services/storage';
import { Student, Project, MatchResult, AssessmentResult, ChatMessage } from './types';
import { CheckCircle2, Bot } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [currentUser, setCurrentUser] = useState<Student>(getStoredCurrentUser());
  const [candidates, setCandidates] = useState<Student[]>(getStoredCandidates());
  const [projects, setProjects] = useState<Project[]>(getStoredProjects());
  const [messages, setMessages] = useState<ChatMessage[]>(getStoredMessages());
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || 'proj-001');
  const [activeTab, setActiveTab] = useState<'matches' | 'explore' | 'projects' | 'messages' | 'team' | 'profile'>('matches');

  // Modals & Active Selections
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);
  const [assessmentInitialSkill, setAssessmentInitialSkill] = useState<string>('React');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState<boolean>(false);
  const [selectedCandidateForProfile, setSelectedCandidateForProfile] = useState<Student | null>(null);
  const [selectedMatchForExplanation, setSelectedMatchForExplanation] = useState<{ candidate: Student; matchResult: MatchResult } | null>(null);
  const [selectedChatParticipantId, setSelectedChatParticipantId] = useState<string | null>(null);
  const [missingSkillFilter, setMissingSkillFilter] = useState<string | null>(null);
  const [demoStep, setDemoStep] = useState<number>(4);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Project
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // Active Team members of active project
  const activeTeamMembers: Student[] = (activeProject?.teamMembers || [])
    .filter(m => m.status === 'owner' || m.status === 'accepted')
    .map(m => {
      if (m.studentId === currentUser.id) return currentUser;
      return candidates.find(c => c.id === m.studentId);
    })
    .filter((s): s is Student => s !== undefined);

  const invitedStudentIds = (activeProject?.teamMembers || [])
    .filter(m => m.status === 'invited')
    .map(m => m.studentId);

  const teamMemberIds = (activeProject?.teamMembers || [])
    .filter(m => m.status === 'owner' || m.status === 'accepted')
    .map(m => m.studentId);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Assessment complete handler
  const handleAssessmentComplete = (result: AssessmentResult) => {
    const updatedUser = applyAssessmentToUser(result);
    setCurrentUser(updatedUser);
    showToast(`⭐ Assessment score saved! Estimated Level ${result.estimatedLevel} in ${result.skillName} (${result.scorePercentage}% score).`);
    setDemoStep(2);
  };

  // 2. Open assessment modal
  const handleOpenAssessment = (skillName?: string) => {
    if (skillName) setAssessmentInitialSkill(skillName);
    setIsAssessmentOpen(true);
  };

  // 3. Create Project handler
  const handleCreateProject = (newProject: Project) => {
    const updated = [newProject, ...projects];
    setProjects(updated);
    saveProjects(updated);
    setActiveProjectId(newProject.id);
    setActiveTab('matches');
    setDemoStep(4);
    showToast(`🚀 Project "${newProject.title}" published! Matching candidates now.`);
  };

  // 4. Invite candidate to active project
  const handleInviteCandidate = (candidate: Student) => {
    if (!activeProject) return;

    const existingMember = activeProject.teamMembers?.find(m => m.studentId === candidate.id);
    if (existingMember) return;

    const updatedProjects = projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          teamMembers: [
            ...(p.teamMembers || []),
            {
              studentId: candidate.id,
              role: candidate.role,
              joinedAt: new Date().toISOString(),
              status: 'invited' as const,
            },
          ],
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    showToast(`📩 Invitation sent to ${candidate.name}! (Simulate acceptance in Team Dashboard)`);
  };

  // 5. Accept Invite (Simulate acceptance)
  const handleAcceptInvite = (studentId: string) => {
    if (!activeProject) return;

    const candidate = candidates.find(c => c.id === studentId);
    const updatedProjects = projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          teamMembers: (p.teamMembers || []).map(m =>
            m.studentId === studentId ? { ...m, status: 'accepted' as const } : m
          ),
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveProjects(updatedProjects);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#6366f1'],
      });
    } catch (e) {}

    showToast(`🎉 ${candidate?.name || 'Teammate'} joined ${activeProject.title}! Coverage updated.`);
    setDemoStep(6);
  };

  // 6. Cancel Invite
  const handleCancelInvite = (studentId: string) => {
    if (!activeProject) return;

    const updatedProjects = projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          teamMembers: (p.teamMembers || []).filter(m => m.studentId !== studentId),
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  // 7. Remove Member
  const handleRemoveMember = (studentId: string) => {
    if (!activeProject) return;

    const updatedProjects = projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          teamMembers: (p.teamMembers || []).filter(m => m.studentId !== studentId),
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    showToast('Member removed from team.');
  };

  // 8. Find Missing Skill or Role Teammate (Connects Team Dashboard gap to Match Hub filter)
  const handleFindMissingSkillTeammate = (skillOrRoleName: string) => {
    setMissingSkillFilter(skillOrRoleName);
    setActiveTab('matches');
    setDemoStep(7);
    showToast(`🔍 Filtered Match Hub for "${skillOrRoleName}" candidates!`);
  };

  // 9. Open Direct Message to Candidate
  const handleOpenMessage = (candidate: Student) => {
    setSelectedChatParticipantId(candidate.id);
    setActiveTab('messages');
  };

  // 10. Send Message
  const handleSendMessage = (recipientId: string, text: string) => {
    const recipient = candidates.find(c => c.id === recipientId);
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId,
      recipientName: recipient?.name || 'Teammate',
      text,
      timestamp: timeString,
      isCurrentUser: true,
    };

    const updated = addMessageToStore(newMsg);
    setMessages(updated);
    showToast(`Message sent to ${recipient?.name || 'teammate'}.`);
  };

  // 11. Reset Demo Data
  const handleResetDemo = () => {
    if (window.confirm('Reset all demo state back to default seeded dataset?')) {
      resetDemoData();
      setCurrentUser(getStoredCurrentUser());
      setCandidates(getStoredCandidates());
      const p = getStoredProjects();
      setProjects(p);
      setActiveProjectId(p[0]?.id || 'proj-001');
      setMessages(getStoredMessages());
      setMissingSkillFilter(null);
      setDemoStep(1);
      showToast('🔄 Demo state reset to default!');
    }
  };

  // Step navigation helper
  const handleNavigateStep = (stepNumber: number) => {
    setDemoStep(stepNumber);
    switch (stepNumber) {
      case 1:
        setIsAssessmentOpen(true);
        break;
      case 2:
        setActiveTab('profile');
        break;
      case 3:
        setActiveTab('projects');
        break;
      case 4:
        setActiveTab('matches');
        break;
      case 5:
        if (candidates.length > 0) {
          const topCandidate = candidates[0];
          setSelectedMatchForExplanation({
            candidate: topCandidate,
            matchResult: {
              candidate: topCandidate,
              matchPercentage: 94,
              breakdown: {
                skillMatchScore: 95,
                skillLevelScore: 90,
                assessmentVerification: 95,
                roleFitScore: 100,
                availabilityScore: 90,
                interestScore: 95,
              },
              matchedSkills: [
                { skillName: 'Python', candidateLevel: 5, requiredMinLevel: 4, isAssessed: true, satisfiesMin: true },
                { skillName: 'Machine Learning', candidateLevel: 5, requiredMinLevel: 4, isAssessed: true, satisfiesMin: true },
              ],
              missingRequiredSkills: [],
              roleMatches: true,
            },
          });
        }
        break;
      case 6:
        setActiveTab('team');
        break;
      case 7:
        handleFindMissingSkillTeammate('Frontend Developer');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-white border border-brand-200 shadow-lg text-xs text-slate-900 font-medium flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        unreadMessagesCount={messages.length > 0 ? 1 : 0}
        onResetDemo={handleResetDemo}
        onOpenAssessment={() => handleOpenAssessment('React')}
      />

      {/* Demo Flow Banner */}
      <DemoFlowBanner
        currentStep={demoStep}
        onNavigateStep={handleNavigateStep}
        onOpenAssessment={() => handleOpenAssessment('React')}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Match Hub */}
        {activeTab === 'matches' && activeProject && (
          <RecommendedTeammates
            project={activeProject}
            allCandidates={candidates}
            onViewProfile={cand => setSelectedCandidateForProfile(cand)}
            onExplainMatch={(cand, match) => setSelectedMatchForExplanation({ candidate: cand, matchResult: match })}
            onOpenMessage={handleOpenMessage}
            onInvite={handleInviteCandidate}
            invitedStudentIds={invitedStudentIds}
            teamMemberIds={teamMemberIds}
            missingSkillFilter={missingSkillFilter}
            onClearMissingSkillFilter={() => setMissingSkillFilter(null)}
            onNavigateToProjects={() => setActiveTab('projects')}
          />
        )}

        {/* 2. Explore Page */}
        {activeTab === 'explore' && (
          <ExplorePage
            candidates={candidates}
            currentProject={activeProject}
            onViewProfile={cand => setSelectedCandidateForProfile(cand)}
            onOpenMessage={handleOpenMessage}
            onInvite={handleInviteCandidate}
            invitedStudentIds={invitedStudentIds}
            teamMemberIds={teamMemberIds}
          />
        )}

        {/* 3. Projects Page */}
        {activeTab === 'projects' && (
          <ProjectList
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={id => setActiveProjectId(id)}
            onOpenCreateModal={() => setIsCreateProjectOpen(true)}
            onNavigateToMatches={() => setActiveTab('matches')}
            onNavigateToTeam={id => {
              setActiveProjectId(id);
              setActiveTab('team');
            }}
          />
        )}

        {/* 4. Messages Page */}
        {activeTab === 'messages' && (
          <MessagesPage
            currentUser={currentUser}
            candidates={candidates}
            messages={messages}
            onSendMessage={handleSendMessage}
            selectedParticipantId={selectedChatParticipantId}
            onSelectParticipant={id => setSelectedChatParticipantId(id)}
            onViewProfile={cand => setSelectedCandidateForProfile(cand)}
          />
        )}

        {/* 5. Team Dashboard */}
        {activeTab === 'team' && activeProject && (
          <TeamDashboard
            project={activeProject}
            teamMembers={activeTeamMembers}
            allCandidates={candidates}
            onRemoveMember={handleRemoveMember}
            onAcceptInvite={handleAcceptInvite}
            onCancelInvite={handleCancelInvite}
            onFindTeammates={() => setActiveTab('matches')}
            onFindMissingSkillTeammate={handleFindMissingSkillTeammate}
            onNavigateToProjects={() => setActiveTab('projects')}
          />
        )}

        {/* 6. Profile Page */}
        {activeTab === 'profile' && (
          <UserProfile
            user={currentUser}
            onUpdateUser={u => {
              setCurrentUser(u);
              saveCurrentUser(u);
            }}
            onOpenAssessment={handleOpenAssessment}
          />
        )}
      </main>

      {/* Modals */}
      <SkillAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onAssessmentComplete={handleAssessmentComplete}
        initialSkill={assessmentInitialSkill}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreateProject={handleCreateProject}
        ownerId={currentUser.id}
        ownerName={currentUser.name}
      />

      <CandidateModal
        candidate={selectedCandidateForProfile}
        isOpen={Boolean(selectedCandidateForProfile)}
        onClose={() => setSelectedCandidateForProfile(null)}
        onOpenMessage={handleOpenMessage}
        onInvite={handleInviteCandidate}
        isInvited={selectedCandidateForProfile ? invitedStudentIds.includes(selectedCandidateForProfile.id) : false}
        isMember={selectedCandidateForProfile ? teamMemberIds.includes(selectedCandidateForProfile.id) : false}
      />

      {selectedMatchForExplanation && activeProject && (
        <MatchExplanationModal
          candidate={selectedMatchForExplanation.candidate}
          project={activeProject}
          matchResult={selectedMatchForExplanation.matchResult}
          isOpen={Boolean(selectedMatchForExplanation)}
          onClose={() => setSelectedMatchForExplanation(null)}
          onOpenMessage={handleOpenMessage}
          onInvite={handleInviteCandidate}
          isInvited={invitedStudentIds.includes(selectedMatchForExplanation.candidate.id)}
          isMember={teamMemberIds.includes(selectedMatchForExplanation.candidate.id)}
        />
      )}

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Matchify</span>
            <span>—</span>
            <span>Find the right people. Build the right team.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>PromptWars Problem Statement 2: ProjectMatch</span>
            <span>•</span>
            <span className="text-brand-600 flex items-center gap-1 font-medium">
              <Bot className="w-3.5 h-3.5" /> Powered by Gemini 2.5 Flash
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
