'use client'

import React, { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import FloatingMenuExtension from '@tiptap/extension-floating-menu'
import CodeBlock from '@tiptap/extension-code-block'
import Image from '@tiptap/extension-image'
import { 
  Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Heading4,
  Link as LinkIcon, Underline as UnderlineIcon, Highlighter,
  Code, SeparatorHorizontal, Strikethrough, Plus, Type, Image as ImageIcon,
  Loader2
} from 'lucide-react'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const TiptapEditor = ({ content, onChange, placeholder = 'Tell your story...' }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        codeBlock: false, // disable StarterKit default to use explicit extension
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl border border-border my-8 flex mx-auto max-w-full h-auto',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer decoration-primary/30 hover:decoration-primary transition-all',
        },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Typography,
      BubbleMenuExtension,
      FloatingMenuExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert focus:outline-none max-w-none min-h-[500px] pb-32 premium-content',
      },
    },
  })

  const [isUploading, setIsUploading] = React.useState(false)

  const addImage = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (event: any) => {
      const file = event.target.files[0]
      if (file) {
        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          )
          const data = await response.json()
          if (data.secure_url && editor) {
            editor.chain().focus().setImage({ src: data.secure_url }).run()
          }
        } catch (error) {
          console.error("Upload failed", error)
        } finally {
          setIsUploading(false)
        }
      }
    }
    input.click()
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter the URL', previousUrl)

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className="relative w-full editor-vibe">
      {/* Bubble Menu for Text Selections - Clean, Dark, Floating */}
      <BubbleMenu editor={editor}>
        <div className="flex items-center gap-0.5 bg-zinc-900 border border-zinc-800 p-1 rounded-full shadow-2xl overflow-hidden shadow-black/40">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('bold') ? 'text-indigo-400' : 'text-zinc-400'}`}
            title="Bold"
          >
            <Bold size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('italic') ? 'text-indigo-400' : 'text-zinc-400'}`}
            title="Italic"
          >
            <Italic size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('underline') ? 'text-indigo-400' : 'text-zinc-400'}`}
            title="Underline"
          >
            <UnderlineIcon size={15} strokeWidth={2.5} />
          </button>
          <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'text-indigo-400' : 'text-zinc-400'}`}
            title="H1"
          >
            <Heading1 size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-indigo-400' : 'text-zinc-400'}`}
            title="H2"
          >
            <Heading2 size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'text-indigo-400' : 'text-zinc-400'}`}
            title="H3"
          >
            <Heading3 size={15} strokeWidth={2.5} />
          </button>
          <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
          <button
            onClick={setLink}
            className={`p-2 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('link') ? 'text-indigo-400' : 'text-zinc-400'}`}
            title="Link"
          >
            <LinkIcon size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('highlight') ? 'text-indigo-400' : 'text-zinc-400'}`}
            title="Highlight"
          >
            <Highlighter size={15} strokeWidth={2.5} />
          </button>
          <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('bulletList') ? 'text-indigo-400' : 'text-zinc-400'}`}
            title="Bullet List"
          >
            <List size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('orderedList') ? 'text-indigo-400' : 'text-zinc-400'}`}
            title="Ordered List"
          >
            <ListOrdered size={15} strokeWidth={2.5} />
          </button>
          <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('codeBlock') ? 'text-indigo-400' : 'text-zinc-400'}`}
            title="Code Block"
          >
            <Code size={15} strokeWidth={2.5} />
          </button>
        </div>
      </BubbleMenu>

      {/* Floating Menu - Like Notion / Medium + Button */}
      <FloatingMenu editor={editor}>
        <div className="flex items-center group relative">
          <div className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all cursor-pointer bg-background shadow-sm">
            <Plus size={16} />
          </div>
          
          <div className="flex items-center gap-0.5 ml-2 bg-zinc-900 border border-zinc-800 p-1 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none group-hover:pointer-events-auto duration-200">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('bulletList') ? 'text-indigo-400' : 'text-zinc-400'}`}
              title="Bullet List"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('orderedList') ? 'text-indigo-400' : 'text-zinc-400'}`}
              title="Numbered List"
            >
              <ListOrdered size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('blockquote') ? 'text-indigo-400' : 'text-zinc-400'}`}
              title="Quote"
            >
              <Quote size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1.5 rounded-full hover:bg-zinc-800 transition-colors ${editor.isActive('codeBlock') ? 'text-indigo-400' : 'text-zinc-400'}`}
              title="Code Block"
            >
              <Code size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-1.5 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400"
              title="Divider"
            >
              <SeparatorHorizontal size={16} />
            </button>
            <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />
            <button
              onClick={addImage}
              disabled={isUploading}
              className="p-1.5 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 group/img flex items-center justify-center min-w-8 h-8"
              title="Add Image"
            >
              {isUploading ? <Loader2 size={16} className="animate-spin text-primary" /> : <ImageIcon size={16} className="group-hover/img:text-primary transition-colors" />}
            </button>
          </div>
        </div>
      </FloatingMenu>

      <EditorContent editor={editor} />

      <style jsx global>{`
        .editor-vibe .tiptap p.is-editor-empty:first-child::before {
          color: hsl(var(--muted-foreground) / 0.5);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

export default TiptapEditor
