import React, { useState, useMemo } from 'react';
import { Send, MessageSquare, User, Clock, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Student, ChatMessage } from '../../types';

interface MessagesPageProps {
  currentUser: Student;
  candidates: Student[];
  messages: ChatMessage[];
  onSendMessage: (recipientId: string, text: string) => void;
  selectedParticipantId?: string | null;
  onSelectParticipant?: (id: string) => void;
  onViewProfile: (candidate: Student) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  currentUser,
  candidates,
  messages,
  onSendMessage,
  selectedParticipantId,
  onSelectParticipant,
  onViewProfile,
}) => {
  const [activeId, setActiveId] = useState<string>(
    selectedParticipantId || candidates[0]?.id || 'cand-001'
  );
  const [inputText, setInputText] = useState<string>('');

  // Update activeId if prop changes
  React.useEffect(() => {
    if (selectedParticipantId) {
      setActiveId(selectedParticipantId);
    }
  }, [selectedParticipantId]);

  const activeCandidate = candidates.find(c => c.id === activeId) || candidates[0];

  // Group messages into conversations
  const conversations = useMemo(() => {
    const map = new Map<string, { candidate: Student; lastMsg: ChatMessage; count: number }>();

    // Add all candidates with existing messages first
    messages.forEach(msg => {
      const otherId = msg.senderId === currentUser.id ? msg.recipientId : msg.senderId;
      const cand = candidates.find(c => c.id === otherId);
      if (cand) {
        map.set(otherId, { candidate: cand, lastMsg: msg, count: (map.get(otherId)?.count || 0) + 1 });
      }
    });

    // Ensure candidate with active selection is also visible
    if (activeCandidate && !map.has(activeCandidate.id)) {
      map.set(activeCandidate.id, {
        candidate: activeCandidate,
        lastMsg: {
          id: 'temp',
          senderId: activeCandidate.id,
          senderName: activeCandidate.name,
          recipientId: currentUser.id,
          recipientName: currentUser.name,
          text: 'Start a new conversation...',
          timestamp: 'Just now',
          isCurrentUser: false,
        },
        count: 0,
      });
    }

    return Array.from(map.values());
  }, [messages, candidates, currentUser, activeCandidate]);

  // Messages for active conversation
  const activeConversationMessages = useMemo(() => {
    return messages.filter(
      m =>
        (m.senderId === currentUser.id && m.recipientId === activeId) ||
        (m.senderId === activeId && m.recipientId === currentUser.id)
    );
  }, [messages, currentUser.id, activeId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(activeId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Teammate Messages
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect with potential project teammates, align on skill requirements, and coordinate project hackathons.
        </p>
      </div>

      <div className="student-panel overflow-hidden bg-white grid grid-cols-1 md:grid-cols-12 min-h-[550px] shadow-sm border border-slate-200">
        {/* Left: Conversation List */}
        <div className="md:col-span-4 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-3.5 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-500">
            Active Chats ({conversations.length})
          </div>

          <div className="divide-y divide-slate-100/80 overflow-y-auto flex-1 max-h-[500px]">
            {conversations.map(({ candidate, lastMsg }) => {
              const isSelected = candidate.id === activeId;
              return (
                <div
                  key={candidate.id}
                  onClick={() => {
                    setActiveId(candidate.id);
                    if (onSelectParticipant) onSelectParticipant(candidate.id);
                  }}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white border-l-4 border-brand-600 shadow-2xs' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {candidate.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {lastMsg.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-brand-600 truncate">
                      {candidate.role}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {lastMsg.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <div className="md:col-span-8 flex flex-col justify-between bg-white">
          {activeCandidate ? (
            <>
              {/* Chat Top Bar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                <div className="flex items-center gap-3">
                  <img
                    src={activeCandidate.avatar}
                    alt={activeCandidate.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {activeCandidate.name}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-bold border border-brand-200">
                        {activeCandidate.role}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {activeCandidate.university} • {activeCandidate.availabilityHours} hrs/wk
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onViewProfile(activeCandidate)}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  View Full Profile
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="p-5 space-y-3.5 overflow-y-auto flex-1 max-h-[380px] bg-slate-50/30">
                {activeConversationMessages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400 space-y-1">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="font-semibold text-slate-600">No messages with {activeCandidate.name} yet.</p>
                    <p>Introduce yourself and invite them to collaborate on your hackathon project!</p>
                  </div>
                ) : (
                  activeConversationMessages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-brand-600 text-white rounded-br-xs shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-3.5 border-t border-slate-100 flex items-center gap-2 bg-white">
                <input
                  type="text"
                  placeholder={`Send message to ${activeCandidate.name.split(' ')[0]}...`}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="btn-primary flex items-center gap-1.5 px-4 py-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select a conversation to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
