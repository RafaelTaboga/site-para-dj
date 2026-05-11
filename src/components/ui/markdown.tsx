"use client";

// Lightweight markdown renderer — replace with `react-markdown` in production
// npm install react-markdown
export default function ReactMarkdown({ children }: { children: string }) {
  const html = children
    .replace(/^## (.*$)/gim, '<h2 class="font-display font-bold text-base mt-4 mb-2 text-white">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="font-semibold text-sm mt-3 mb-1 text-white">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-gray-300 italic">$1</em>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-gray-400 text-sm mb-1">$1</li>')
    .replace(/^• (.*$)/gim, '<li class="ml-4 list-disc text-gray-400 text-sm mb-1">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, '<br />');

  return (
    <div
      className="text-gray-300 text-sm leading-relaxed [&_h2]:mt-4 [&_h2]:mb-2 [&_li]:mb-1"
      dangerouslySetInnerHTML={{ __html: `<p class="mb-3">${html}</p>` }}
    />
  );
}
