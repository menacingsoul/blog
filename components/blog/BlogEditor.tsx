"use client";

import React, { useState, FormEvent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  Loader2, X, UploadCloud, Eye, EyeOff, 
  Save, Send, Trash2, Image as ImageIcon, ArrowLeft, FolderOpen, Check
} from "lucide-react";
import { useAutosave } from "react-autosave";
import { deleteBlog } from "@/utils/api";
import Image from "next/image";
import BlogPreviewer from "./BlogPreviewer";
import { cn } from "@/lib/utils";
const TiptapEditor = dynamic(() => import("./TiptapEditor"), { ssr: false });

interface BlogEditorProps {
  blogId: string;
  initialDescription: string;
  initialContent: string;
  initialTitle: string;
  initialImageUrl: string;
  mode?: 'draft' | 'published';
  username: string;
}

interface MediaItem {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  blogId,
  initialDescription,
  initialContent,
  initialTitle,
  initialImageUrl,
  mode = 'draft',
  username,
}) => {
  const [content, setContent] = useState(initialContent || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [title, setTitle] = useState(initialTitle || "");
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
  const [isPublishing, setPublishing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [isSavingDraft, setSavingDraft] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(false);
  const [uploadTab, setUploadTab] = useState<'upload' | 'library'>('upload');
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const router = useRouter();

  const mediaFolder = `blog/${username}/media_uploads`;

  const isDraft = mode === 'draft';

  const handlePublishClick = () => setShowConfirm(true);
  const handleContentChange = (value: string) => setContent(value);
  const handleTitleChange = (event: FormEvent<HTMLInputElement>) => setTitle(event.currentTarget.value);
  const handleDescriptionChange = (event: FormEvent<HTMLInputElement>) => setDescription(event.currentTarget.value);
  const handleDeleteClick = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      setShowConfirmDelete(false);
      await deleteBlog(blogId);
      router.push(`/profile/${username}`);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmPublish = async () => {
    setPublishing(true);
    try {
      setShowConfirm(false);
      const res = await fetch(`/api/blog/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, content, published: true, imageUrl }),
      });
      if (res.ok) {
        router.push(`/profile/${username}`);
      } else {
        const errorData = await res.json();
        throw new Error(errorData?.message || "Failed to save blog");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Error saving blog.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDraftClick = async () => {
    setSavingDraft(true);
    try {
      await fetch(`/api/blog/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, content, imageUrl }),
      });
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      router.back();
      setSavingDraft(false);
    }
  };

  const lastSavedData = React.useRef({
    title: initialTitle || "",
    description: initialDescription || "",
    content: initialContent || "",
    imageUrl: initialImageUrl || ""
  });

  // Autosave only for drafts
  useAutosave({
    data: isDraft ? { title, description, content, imageUrl } : null,
    interval: 5000, // Debounce to 5 seconds
    onSave: async (data: any) => {
      if (!isDraft || !data) return;

      const currentDataStr = JSON.stringify(data);
      const lastSavedDataStr = JSON.stringify(lastSavedData.current);
      
      if (currentDataStr === lastSavedDataStr) {
        return; // Prevent saving if content hasn't changed
      }

      setIsAutosaving(true);
      try {
        await fetch(`/api/blog/${blogId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: currentDataStr,
        });
        lastSavedData.current = data;
      } catch (error) {
        console.error("Error autosaving blog:", error);
      } finally {
        setIsAutosaving(false);
      }
    },
  });

  const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploading(true);
      setUploadProgress(0);
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", mediaFolder);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) setUploadProgress((event.loaded / event.total) * 100);
      });
      xhr.upload.addEventListener("load", () => setUploadProgress(100));
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setImageUrl(response.secure_url);
          setShowUploadDrawer(false);
        } else {
          alert("Failed to upload image.");
        }
        setUploading(false);
      });
      xhr.addEventListener("error", () => { alert("Failed to upload image."); setUploading(false); });
      xhr.open("POST", "/api/upload");
      xhr.send(formData);
    }
  };

  const fetchMediaLibrary = async () => {
    if (mediaLibrary.length > 0) return; // already loaded
    setLoadingMedia(true);
    try {
      const res = await fetch(`/api/media-library?username=${username}`);
      if (res.ok) {
        const data = await res.json();
        setMediaLibrary(data.media || []);
      }
    } catch (err) {
      console.error("Failed to fetch media library", err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleSelectFromLibrary = (url: string) => {
    setImageUrl(url);
    setShowUploadDrawer(false);
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /><span className="text-sm">Back</span>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{isDraft ? 'Write Blog' : 'Edit Blog'}</h1>
          <div className="flex items-center gap-2 text-sm">
            {isDraft && (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-medium">Draft</span>
            )}
            {!isDraft && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium">Published</span>
            )}
            {isAutosaving && (
              <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <Loader2 className="h-3 w-3 animate-spin" />Saving...
              </span>
            )}
          </div>
        </div>

        {/* Loading Overlays */}
        {isPublishing && mounted && createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm">
            <div className="bg-background border border-border rounded-2xl p-8 shadow-xl">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-foreground text-center">{isDraft ? 'Publishing your blog...' : 'Saving changes...'}</p>
            </div>
          </div>,
          document.body
        )}

        {isSavingDraft && mounted && createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm">
            <div className="bg-background border border-border rounded-2xl p-8 shadow-xl">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-foreground text-center">Saving your draft...</p>
            </div>
          </div>,
          document.body
        )}

        {isDeleting && mounted && createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm">
            <div className="bg-background border border-border rounded-2xl p-8 shadow-xl">
              <Loader2 className="h-12 w-12 animate-spin text-destructive mx-auto mb-4" />
              <p className="text-foreground text-center">Deleting your blog...</p>
            </div>
          </div>,
          document.body
        )}

        {/* Confirm Publish/Save Dialog */}
        {showConfirm && mounted && createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
            <div className="w-full max-w-md p-6 bg-background border border-border rounded-2xl shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-foreground">{isDraft ? 'Confirm Publish' : 'Confirm Save'}</h3>
                <button onClick={() => setShowConfirm(false)} className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              <p className="text-foreground mb-6">
                {isDraft
                  ? 'Are you sure you want to publish this blog? Once published, it will be visible to readers.'
                  : 'Are you sure you want to save changes to this published blog?'}
              </p>
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors" onClick={() => setShowConfirm(false)}>Cancel</button>
                <button className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-colors flex items-center gap-2 shadow-md shadow-primary/20" onClick={handleConfirmPublish}>
                  {isDraft ? <><Send size={16} />Publish</> : <><Save size={16} />Save</>}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Confirm Delete Dialog */}
        {showConfirmDelete && mounted && createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmDelete(false)}>
            <div className="w-full max-w-md p-6 bg-background border border-border rounded-2xl shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-foreground">Confirm Delete</h3>
                <button onClick={() => setShowConfirmDelete(false)} className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              <p className="text-foreground mb-6">Are you sure you want to delete this blog? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors" onClick={() => setShowConfirmDelete(false)}>Cancel</button>
                <button className="px-4 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors flex items-center gap-2" onClick={handleConfirmDelete}>
                  <Trash2 size={16} />Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Image Upload Dialog */}
        {showUploadDrawer && mounted && createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadDrawer(false)}>
            <div className="w-full max-w-lg p-6 bg-background border border-border rounded-2xl shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-foreground">Cover Image</h3>
                <button onClick={() => setShowUploadDrawer(false)} className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-5">
                <button
                  onClick={() => setUploadTab('upload')}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                    uploadTab === 'upload'
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <UploadCloud size={14} />
                  Upload New
                </button>
                <button
                  onClick={() => { setUploadTab('library'); fetchMediaLibrary(); }}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                    uploadTab === 'library'
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <FolderOpen size={14} />
                  Media Library
                </button>
              </div>

              {uploadTab === 'upload' && (
                <>
                  <div
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl bg-muted/20 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                    onClick={() => document.getElementById("fileInput")?.click()}
                  >
                    <UploadCloud className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                    <p className="text-foreground">Click to upload or drag and drop</p>
                    <p className="text-foreground/60 text-sm">PNG, JPG, WebP (Max 10MB)</p>
                  </div>
                  <input id="fileInput" type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
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

              {uploadTab === 'library' && (
                <div>
                  {loadingMedia ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : mediaLibrary.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <FolderOpen size={32} className="mb-2 opacity-40" />
                      <p className="text-sm">No media uploaded yet</p>
                      <p className="text-xs mt-1">Upload images to your blog to see them here</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                      {mediaLibrary.map((item) => {
                        const isSelected = imageUrl === item.url;
                        return (
                          <button
                            key={item.publicId}
                            type="button"
                            onClick={() => handleSelectFromLibrary(item.url)}
                            className={cn(
                              "relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 group/media",
                              isSelected
                                ? "border-primary ring-1 ring-primary"
                                : "border-border hover:border-primary/50"
                            )}
                            title={`${item.format.toUpperCase()} · ${(item.bytes / 1024).toFixed(0)}KB · ${new Date(item.createdAt).toLocaleDateString()}`}
                          >
                            <Image
                              src={item.url}
                              fill
                              alt="Media"
                              className="object-cover group-hover/media:scale-105 transition-transform duration-200"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                  <Check size={14} className="text-primary-foreground" />
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {imageUrl && (
                <div className="mt-4">
                  <p className="text-foreground mb-2 font-medium text-sm">Preview:</p>
                  <div className="relative pb-[56.25%]">
                    <Image unoptimized={true} src={imageUrl} alt="Cover image preview" fill className="absolute inset-0 w-full h-full object-cover rounded-xl border border-border" />
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

        {/* Editor Card */}
        <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
          {/* Cover Image Area */}
          <div className="relative w-full h-64 bg-muted/30">
            {imageUrl ? (
              <>
                <Image src={imageUrl} fill className="object-cover" alt="Blog cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowUploadDrawer(true)}>
                  <ImageIcon size={48} className="mb-3 opacity-40" />
                  <p className="text-sm">Add a cover image</p>
                </div>
              </div>
            )}
            
            {!preview && (
              <button onClick={() => setShowUploadDrawer(true)}
                className="absolute bottom-4 right-4 p-2.5 glass rounded-xl text-white hover:bg-white/20 transition-colors flex items-center gap-2 text-sm">
                <UploadCloud size={16} /><span>{imageUrl ? "Change" : "Add"} Cover</span>
              </button>
            )}
            
            <button
              className={cn("absolute top-4 right-4 p-3 rounded-full transition-all", preview ? "bg-primary text-primary-foreground" : "glass text-white hover:bg-white/20")}
              onClick={() => setPreview(!preview)}
            >
              {preview ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Content Area */}
          <div className="p-6 lg:p-8">
            <div className="mb-6 pb-6 border-b border-border">
              {!preview ? (
                <>
                  <input type="text" value={title} onChange={handleTitleChange} placeholder="Blog Title"
                    className="w-full text-2xl lg:text-3xl font-bold bg-transparent border-none focus:outline-none text-foreground placeholder-muted-foreground/50 mb-4" />
                  <input type="text" value={description} onChange={handleDescriptionChange} placeholder="Add a brief description of your blog..."
                    className="w-full text-foreground/70 bg-transparent border-none focus:outline-none placeholder-muted-foreground/50" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">{title || "Untitled Blog"}</h1>
                  <p className="text-muted-foreground">{description || "No description provided"}</p>
                </>
              )}
            </div>

            {!preview ? (
              <div className="min-h-[500px]">
                <TiptapEditor content={content} onChange={handleContentChange} placeholder="Start writing your masterpiece..." username={username} />
              </div>
            ) : (
              <BlogPreviewer title={title} content={content} imageUrl={imageUrl} />
            )}

            {/* Actions Footer */}
            {!preview && (
              <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-3 justify-between items-center">
                <div className="flex gap-3">
                  <button onClick={handlePublishClick}
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all flex items-center gap-2 shadow-md shadow-primary/20 text-sm font-medium">
                    {isDraft ? <><Send size={16} />Publish</> : <><Save size={16} />Save Changes</>}
                  </button>
                  {isDraft && (
                    <button onClick={handleDraftClick}
                      className="px-5 py-2.5 rounded-xl bg-muted/50 hover:bg-muted text-foreground transition-all flex items-center gap-2 border border-border text-sm font-medium">
                      <Save size={16} />Save Draft
                    </button>
                  )}
                </div>
                <button onClick={handleDeleteClick}
                  className="px-5 py-2.5 rounded-xl bg-muted/50 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all flex items-center gap-2 border border-transparent hover:border-destructive/20 text-sm font-medium">
                  <Trash2 size={16} /><span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;