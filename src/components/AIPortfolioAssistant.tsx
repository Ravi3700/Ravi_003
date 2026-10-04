import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  FileText,
  Briefcase,
  Layers,
  Award,
  Mail,
} from 'lucide-react';
import { askPortfolioAssistant, ChatMessage } from '../services/aiAssistantService';
import { userProfile } from '../data/profile';
import { RESUME_SOURCE_URL } from '../data/knowledgeBase';
import { Project } from '../types';
import { projectsData } from '../data/projects';
import { ChatMarkdownRenderer } from './ChatMarkdownRenderer';

interface AIPortfolioAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onSelectProject?: (project: Project) => void;
}

export const AIPortfolioAssistant: React.FC<AIPortfolioAssistantProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectProject,
}) => {
  const initialWelcomeText = `**Hi! I'm DataMate AI.**\nAsk me about my skills, projects, experience, certifications, or resume.`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: initialWelcomeText,
      timestamp: 'Just now',
      quickActions: [
        { label: 'Profile', action: 'summarize_profile' },
        { label: 'Skills', action: 'show_skills' },
        { label: 'Projects', action: 'show_all_projects' },
        { label: 'Experience', action: 'show_experience' },
        { label: 'Resume', action: 'view_resume', url: RESUME_SOURCE_URL },
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const quickStarterPrompts = [
    { label: 'Profile', query: 'Summarize Data Analyst Profile', icon: User },
    { label: 'Skills', query: 'What are your core skills?', icon: Layers },
    { label: 'Projects', query: 'Tell me about your projects', icon: Briefcase },
    { label: 'Experience', query: 'What is your work experience?', icon: Award },
    { label: 'Resume', query: 'Show me your resume', icon: FileText },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askPortfolioAssistant(query, 'data-analyst', messages);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: 'Just now',
        quickActions: response.quickActions,
        relatedItems: response.relatedItems,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: "I couldn't find that specific information in the current portfolio or resume.\n\nYou can check the **Resume** for the latest details or reach out directly via the **Contact** section.",
        timestamp: 'Just now',
        quickActions: [
          { label: 'View Resume', action: 'view_resume', url: RESUME_SOURCE_URL },
          { label: 'Contact Me', action: 'go_contact' },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (qa: { label: string; action: string; url?: string }) => {
    const action = qa.action;

    if (action === 'view_resume' || action === 'download_resume') {
      const targetUrl = qa.url || RESUME_SOURCE_URL || userProfile.resumePath;
      if (targetUrl) {
        window.open(targetUrl, '_blank');
      } else {
        onNavigate('/resume');
        onClose();
      }
      return;
    }

    if (action === 'go_contact') {
      onNavigate('/contact');
      onClose();
      return;
    }

    if (action === 'show_skills') {
      onNavigate('/skills');
      onClose();
      return;
    }

    if (action === 'show_all_projects') {
      onNavigate('/projects');
      onClose();
      return;
    }

    if (action === 'show_certifications') {
      onNavigate('/certifications');
      onClose();
      return;
    }

    if (action.startsWith('view_project_')) {
      const projectId = action.replace('view_project_', '');
      const found = projectsData.find((p) => p.id === projectId);
      if (found && onSelectProject) {
        onSelectProject(found);
        onClose();
      } else {
        onNavigate('/projects');
        onClose();
      }
      return;
    }

    // Default: send query into chat
    if (action === 'summarize_profile' || action === 'summarize_da') {
      handleSend('Summarize Data Analyst Profile');
    } else if (action === 'show_experience') {
      handleSend('What is your work experience?');
    } else {
      handleSend(qa.label || action);
    }
  };

  const handleCopy = (id: string, text: string) => {
    // Strip markdown syntax for clean plain text copy
    const cleanText = text
      .replace(/^#{1,4}\s+/gm, '')
      .replace(/\*\*/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1: $2');

    navigator.clipboard.writeText(cleanText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleItemClick = (item: { type: string; title: string; id?: string; url?: string }) => {
    if (item.type === 'project') {
      const found = projectsData.find((p) => p.id === item.id || p.title.toLowerCase() === item.title.toLowerCase());
      if (found && onSelectProject) {
        onSelectProject(found);
        onClose();
      } else {
        onNavigate('/projects');
        onClose();
      }
    } else if (item.type === 'skill') {
      onNavigate('/skills');
      onClose();
    } else if (item.type === 'cert') {
      onNavigate('/certifications');
      onClose();
    } else if (item.type === 'resume') {
      const url = item.url || RESUME_SOURCE_URL || userProfile.resumePath;
      if (url) {
        window.open(url, '_blank');
      } else {
        onNavigate('/resume');
        onClose();
      }
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'assistant',
        text: initialWelcomeText,
        timestamp: 'Just now',
        quickActions: [
          { label: 'Profile', action: 'summarize_profile' },
          { label: 'Skills', action: 'show_skills' },
          { label: 'Projects', action: 'show_all_projects' },
          { label: 'Experience', action: 'show_experience' },
          { label: 'Resume', action: 'view_resume', url: RESUME_SOURCE_URL },
        ],
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      id="ai-assistant-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="ai-assistant-modal"
        className="relative w-full sm:max-w-lg h-[86vh] sm:h-[620px] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Assistant Header */}
        <header className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold tracking-tight">DataMate AI</h3>
                <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                  Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Portfolio & Resume Intelligence • {userProfile.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              aria-label="Reset conversation"
              title="Reset conversation"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close Assistant"
              title="Close Assistant"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Message History Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm bg-slate-50/70 dark:bg-slate-950/60">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs ${
                    isBot ? 'bg-indigo-600' : 'bg-slate-800 dark:bg-blue-600'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2 max-w-[88%]">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed ${
                      isBot
                        ? 'bg-white dark:bg-slate-800/95 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 shadow-xs'
                        : 'bg-indigo-600 text-white shadow-xs'
                    }`}
                  >
                    {isBot ? (
                      <ChatMarkdownRenderer content={msg.text} />
                    ) : (
                      <p className="whitespace-pre-line text-xs sm:text-sm">{msg.text}</p>
                    )}
                  </div>

                  {/* Related Items Pills (Projects / Skills / Certs / Resume) */}
                  {msg.relatedItems && msg.relatedItems.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {msg.relatedItems.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleItemClick(item)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          {item.type === 'resume' ? (
                            <FileText className="w-3 h-3 text-indigo-500" />
                          ) : (
                            <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                          )}
                          <span>{item.title}</span>
                          <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Action Chips */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {msg.quickActions.map((qa, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickAction(qa)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer shadow-2xs"
                        >
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Copy Button for Bot Messages */}
                  {isBot && (
                    <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-400">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="Copy answer text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
              <span>Analyzing portfolio & resume knowledge...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Starters on Top of Input */}
        <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex items-center gap-1.5 shrink-0 text-xs scrollbar-none">
          {quickStarterPrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(item.query)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-300 whitespace-nowrap transition-colors text-[11px] font-medium cursor-pointer border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <footer className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about Power BI, SQL, DAX, projects, resume..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold transition-colors cursor-pointer shrink-0 shadow-xs"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};
