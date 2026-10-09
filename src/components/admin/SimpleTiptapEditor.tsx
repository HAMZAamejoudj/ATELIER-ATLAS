'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Eye,
  Heading1,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo,
  Underline as UnderlineIcon,
  Undo,
} from 'lucide-react';
import { CustomLink } from '@/lib/tiptap-extensions';
import { cn } from '@/lib/utils';

interface SimpleTiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

function MenuButton({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100',
        isActive && 'bg-amber-100 text-amber-900',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  );
}

export function SimpleTiptapEditor({
  content,
  onChange,
  placeholder = 'Write content...',
  minHeight = 180,
}: SimpleTiptapEditorProps) {
  const [mode, setMode] = React.useState<'visual' | 'code'>('visual');
  const [codeContent, setCodeContent] = React.useState(content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      CustomLink.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      setCodeContent(html);
      onChange(html);
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
        'data-placeholder': placeholder,
      },
    },
  });

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      setCodeContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-amber-700/20">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/80 p-1">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
          <Bold className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
          <Italic className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
          <UnderlineIcon className="h-4 w-4" />
        </MenuButton>
        <div className="mx-1 h-4 w-px bg-slate-200" />
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="H1">
          <Heading1 className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="H2">
          <Heading2 className="h-4 w-4" />
        </MenuButton>
        <div className="mx-1 h-4 w-px bg-slate-200" />
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet list">
          <List className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered list">
          <ListOrdered className="h-4 w-4" />
        </MenuButton>
        <div className="mx-1 h-4 w-px bg-slate-200" />
        <MenuButton
          onClick={() => {
            const url = window.prompt('URL');
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else if (url === '') editor.chain().focus().unsetLink().run();
          }}
          isActive={editor.isActive('link')}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </MenuButton>
        <div className="flex-1" />
        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo className="h-4 w-4" />
        </MenuButton>
        <div className="ml-2 flex rounded-md bg-slate-100 p-0.5">
          <button
            type="button"
            onClick={() => {
              editor.commands.setContent(codeContent);
              setMode('visual');
            }}
            className={cn(
              'flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider',
              mode === 'visual' ? 'bg-white text-amber-900 shadow-sm' : 'text-slate-500'
            )}
          >
            <Eye className="h-3 w-3" /> Visual
          </button>
          <button
            type="button"
            onClick={() => setMode('code')}
            className={cn(
              'flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider',
              mode === 'code' ? 'bg-white text-amber-900 shadow-sm' : 'text-slate-500'
            )}
          >
            <Code className="h-3 w-3" /> HTML
          </button>
        </div>
      </div>

      {mode === 'visual' ? (
        <div className="p-4" style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
      ) : (
        <textarea
          value={codeContent}
          onChange={(e) => {
            setCodeContent(e.target.value);
            onChange(e.target.value);
          }}
          spellCheck={false}
          className="min-h-[180px] w-full resize-y border-none bg-slate-900 p-4 font-mono text-sm text-slate-300 outline-none"
          style={{ minHeight }}
        />
      )}
    </div>
  );
}
