import React from 'react';

interface ChatMarkdownRendererProps {
  content: string;
}

export const ChatMarkdownRenderer: React.FC<ChatMarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split into lines
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];

  let currentListItems: React.ReactNode[] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${renderedElements.length}`} className="space-y-1.5 my-1.5 pl-1">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  const formatInline = (text: string): React.ReactNode => {
    // 1. Check for markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(parseBoldAndCode(text.substring(lastIndex, match.index)));
      }
      const linkLabel = match[1];
      const linkUrl = match[2];
      parts.push(
        <a
          key={`link-${match.index}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          {linkLabel}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(parseBoldAndCode(text.substring(lastIndex)));
    }

    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  const parseBoldAndCode = (text: string): React.ReactNode => {
    // Split by bold (**bold**) and inline code (`code`)
    const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    const segments = text.split(tokenRegex);

    return (
      <>
        {segments.map((seg, i) => {
          if (seg.startsWith('**') && seg.endsWith('**')) {
            return (
              <strong key={i} className="font-bold text-slate-900 dark:text-white">
                {seg.slice(2, -2)}
              </strong>
            );
          }
          if (seg.startsWith('`') && seg.endsWith('`')) {
            return (
              <code
                key={i}
                className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-200/70 dark:bg-slate-700 font-mono text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold"
              >
                {seg.slice(1, -1)}
              </code>
            );
          }
          return seg;
        })}
      </>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Header 3 or Header 2 (### Title or ## Title)
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
      flushList();
      const headerText = trimmed.replace(/^#{2,3}\s+/, '');
      renderedElements.push(
        <h4
          key={`h-${i}`}
          className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-3 mb-1.5 border-b border-slate-200/50 dark:border-slate-700/50 pb-1"
        >
          {formatInline(headerText)}
        </h4>
      );
      continue;
    }

    // Bullet point (* Item or - Item)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      const itemText = trimmed.replace(/^[*•-]\s+/, '');
      currentListItems.push(
        <li key={`li-${i}`} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-1.5 shrink-0" />
          <span className="flex-1 leading-relaxed">{formatInline(itemText)}</span>
        </li>
      );
      continue;
    }

    // Numbered list item (1. Item)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      flushList();
      renderedElements.push(
        <div key={`num-${i}`} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 my-1">
          <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">{numMatch[1]}.</span>
          <span className="flex-1 leading-relaxed">{formatInline(numMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Standard paragraph line
    flushList();
    renderedElements.push(
      <p key={`p-${i}`} className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 my-1">
        {formatInline(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1">{renderedElements}</div>;
};
