'use client'

import React, { useCallback, useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useEditor, EditorContent, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import FloatingMenuExtension from '@tiptap/extension-floating-menu'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TiptapImage from '@tiptap/extension-image'
import NextImage from 'next/image'
import { all, createLowlight } from 'lowlight'
import { 
  Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Heading3,
  Link as LinkIcon, Underline as UnderlineIcon, Highlighter,
  Code, SeparatorHorizontal, Plus, Image as ImageIcon,
  Loader2, X, UploadCloud, FolderOpen, Check, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Create lowlight instance with all languages
const lowlight = createLowlight(all)

// Language options for the selector
const LANGUAGES = [
  { value: '', label: 'Auto' },
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'xml', label: 'XML' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'lua', label: 'Lua' },
  { value: 'r', label: 'R' },
  { value: 'dart', label: 'Dart' },
]

// Code block node view component with language selector
const CodeBlockComponent = ({ node, updateAttributes, extension }: any) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const currentLang = node.attrs.language || ''
  const currentLabel = LANGUAGES.find(l => l.value === currentLang)?.label || currentLang || 'Auto'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <NodeViewWrapper className="relative">
      <div className="absolute top-2 right-2 z-10" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-zinc-200 transition-all border border-white/5"
          contentEditable={false}
        >
          {currentLabel}
          <ChevronDown size={12} />
        </button>
        {showDropdown && (
          <div className="absolute top-full right-0 mt-1 w-40 max-h-64 overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-1 scrollbar-thin" contentEditable={false}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => {
                  updateAttributes({ language: lang.value })
                  setShowDropdown(false)
                }}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-xs font-mono transition-colors",
                  currentLang === lang.value
                    ? "bg-primary/20 text-primary"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <pre spellCheck={false}>
        {/* @ts-ignore - Tiptap types restrict 'as' prop to 'div' but 'code' works perfectly at runtime */}
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  )
}

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  username: string
}

interface MediaItem {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
  createdAt: string
}

const TiptapEditor = ({ content, onChange, placeholder = 'Tell your story...', username }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        codeBlock: false, // disable StarterKit default to use explicit extension
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent)
        },
      }).configure({
        lowlight,
      }),
      TiptapImage.configure({
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

  const [isUploading, setIsUploading] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [mediaTab, setMediaTab] = useState<'upload' | 'library'>('upload')
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const mediaFolder = `blog/${username}/media_uploads`

  const fetchMediaLibrary = async () => {
    if (mediaLibrary.length > 0) return
    setLoadingMedia(true)
    try {
      const res = await fetch(`/api/media-library?username=${username}`)
      if (res.ok) {
        const data = await res.json()
        setMediaLibrary(data.media || [])
      }
    } catch (err) {
      console.error("Failed to fetch media library", err)
    } finally {
      setLoadingMedia(false)
    }
  }

  const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editor) return

    setIsUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", mediaFolder)

    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) setUploadProgress((e.loaded / e.total) * 100)
    })
    xhr.upload.addEventListener("load", () => setUploadProgress(100))
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText)
        if (response.secure_url) {
          editor.chain().focus().setImage({ src: response.secure_url }).run()
          // Add to local media library cache
          setMediaLibrary(prev => [{
            url: response.secure_url,
            publicId: response.public_id,
            width: response.width,
            height: response.height,
            format: file.name.split('.').pop() || 'jpg',
            bytes: file.size,
            createdAt: new Date().toISOString(),
          }, ...prev])
          setShowMediaModal(false)
        }
      }
      setIsUploading(false)
    })
    xhr.addEventListener("error", () => {
      console.error("Upload failed")
      setIsUploading(false)
    })
    xhr.open("POST", "/api/upload")
    xhr.send(formData)

    // Reset input
    event.target.value = ''
  }

  const handleSelectFromLibrary = (url: string) => {
    if (!editor) return
    editor.chain().focus().setImage({ src: url }).run()
    setShowMediaModal(false)
  }

  // Quick upload (for floating menu click without modal)
  const addImage = useCallback(() => {
    setShowMediaModal(true)
    setMediaTab('upload')
  }, [])

  const openMediaLibrary = useCallback(() => {
    setShowMediaModal(true)
    setMediaTab('library')
    fetchMediaLibrary()
  }, [mediaLibrary.length])

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
      {/* Media Modal */}
      {mounted && showMediaModal && createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setShowMediaModal(false)}>
          <div className="w-full max-w-lg p-6 bg-background border border-border rounded-2xl shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-foreground">Add Image</h3>
              <button onClick={() => setShowMediaModal(false)} className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-5">
              <button
                onClick={() => setMediaTab('upload')}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                  mediaTab === 'upload'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <UploadCloud size={14} />
                Upload New
              </button>
              <button
                onClick={() => { setMediaTab('library'); fetchMediaLibrary(); }}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                  mediaTab === 'library'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FolderOpen size={14} />
                Media Library
              </button>
            </div>

            {mediaTab === 'upload' && (
              <>
                <div
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl bg-muted/20 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                  onClick={() => document.getElementById("tiptap-file-input")?.click()}
                >
                  <UploadCloud className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                  <p className="text-foreground">Click to upload an image</p>
                  <p className="text-foreground/60 text-sm">PNG, JPG, WebP, GIF (Max 10MB)</p>
                </div>
                <input id="tiptap-file-input" type="file" accept="image/*" onChange={handleUploadFile} className="hidden" />
                {isUploading && (
                  <div className="relative pt-1 mt-4">
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-muted">
                      <div style={{ width: `${uploadProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Uploading...</span><span>{Math.round(uploadProgress)}%</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {mediaTab === 'library' && (
              <div>
                {loadingMedia ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : mediaLibrary.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FolderOpen size={32} className="mb-2 opacity-40" />
                    <p className="text-sm">No media uploaded yet</p>
                    <p className="text-xs mt-1">Upload images to your blogs to build your library</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                    {mediaLibrary.map((item) => (
                      <button
                        key={item.publicId}
                        type="button"
                        onClick={() => handleSelectFromLibrary(item.url)}
                        className="relative aspect-video rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-200 group/media"
                        title={`${item.format.toUpperCase()} · ${(item.bytes / 1024).toFixed(0)}KB · ${new Date(item.createdAt).toLocaleDateString()}`}
                      >
                        <NextImage
                          src={item.url}
                          fill
                          alt="Media"
                          className="object-cover group-hover/media:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center shadow-lg opacity-0 group-hover/media:opacity-100 scale-75 group-hover/media:scale-100 transition-all">
                            <Check size={16} className="text-primary-foreground" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

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
              title="Upload Image"
            >
              {isUploading ? <Loader2 size={16} className="animate-spin text-primary" /> : <ImageIcon size={16} className="group-hover/img:text-primary transition-colors" />}
            </button>
            <button
              onClick={openMediaLibrary}
              className="p-1.5 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 group/lib flex items-center justify-center min-w-8 h-8"
              title="Media Library"
            >
              <FolderOpen size={16} className="group-hover/lib:text-primary transition-colors" />
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
