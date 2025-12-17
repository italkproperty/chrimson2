import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Link as LinkIcon, Image as ImageIcon, Type } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);

  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      setCharCount(editorRef.current.innerText.length);
    }
  };

  // --- HYDRATION FIX ---
  // Only update innerHTML if the content prop changes AND the editor is not focused.
  // This allows initial data load (hydration) to work without resetting cursor while typing.
  useEffect(() => {
    if (editorRef.current) {
      const currentHTML = editorRef.current.innerHTML;
      if (content !== currentHTML) {
        // If the editor is empty (initial load) or we are not typing in it
        if (currentHTML.trim() === '' || document.activeElement !== editorRef.current) {
           editorRef.current.innerHTML = content || '';
           setCharCount(editorRef.current.innerText.length);
        }
      }
    }
  }, [content]); // Dependency on content is crucial for loading draft data

  const ToolbarButton = ({ icon: Icon, command, value, title }: any) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); exec(command, value); }}
      className="p-2 text-slate-600 hover:text-chrimson-700 hover:bg-slate-100 rounded-lg transition-colors"
      title={title}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="flex flex-col border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-chrimson-500/20 focus-within:border-chrimson-500 transition-all">
      {/* Toolbar - Explicit Light Theme */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1 items-center">
        <ToolbarButton icon={Heading1} command="formatBlock" value="H2" title="Heading" />
        <ToolbarButton icon={Heading2} command="formatBlock" value="H3" title="Subheading" />
        <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>
        <ToolbarButton icon={Bold} command="bold" title="Bold" />
        <ToolbarButton icon={Italic} command="italic" title="Italic" />
        <ToolbarButton icon={Quote} command="formatBlock" value="blockquote" title="Quote" />
        <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>
        <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
        <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
        <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>
        <button
           type="button"
           className="p-2 text-slate-600 hover:text-chrimson-700 hover:bg-slate-100 rounded-lg transition-colors"
           onMouseDown={(e) => {
               e.preventDefault();
               const url = prompt('Enter URL:');
               if (url) exec('createLink', url);
           }}
        >
            <LinkIcon size={18} />
        </button>
        
        {/* Debug / Status Indicator */}
        <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-md">
           <Type size={12} className="text-slate-400"/>
           <span className="text-[10px] font-mono font-medium text-slate-500">
             {charCount} chars {charCount > 0 && content.length === 0 ? '(Sync Error)' : ''}
           </span>
        </div>
      </div>

      {/* Editor Content Area - FORCED LIGHT MODE STYLES */}
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => {
          onChange(e.currentTarget.innerHTML);
          setCharCount(e.currentTarget.innerText.length);
        }}
        className="
          flex-1 p-6 min-h-[400px] outline-none overflow-y-auto
          prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-slate-900 
          prose-p:text-slate-800 prose-p:leading-relaxed
          prose-li:text-slate-800
          prose-strong:text-slate-900
          prose-blockquote:border-l-4 prose-blockquote:border-chrimson-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-700
          prose-a:text-chrimson-700 prose-a:underline
        "
        style={{ 
          color: '#111827', // Force Black text
          backgroundColor: '#ffffff', // Force White background
          textAlign: 'left'
        }}
        data-placeholder={placeholder}
      />
    </div>
  );
};