"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  Loader2, X, UploadCloud, Eye, EyeOff, 
  Save, Send, Trash2, Image as ImageIcon, ArrowLeft
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
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  blogId,
  initialDescription,
  initialContent,
  initialTitle,
  initialImageUrl,
  mode = 'draft',
}) => {
  const [content, setContent] = useState(initialContent || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [title, setTitle] = useState(initialTitle || "");
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
  const [isPublishing, setPublishing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [isSavingDraft, setSavingDraft] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(false);
  const router = useRouter();

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
      router.push("/home");
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
        router.push(`/blog/viewer/${blogId}`);
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

  // Autosave only for drafts
  useAutosave({
    data: isDraft ? { title, description, content, imageUrl } : null,
    onSave: async (data: any) => {
      if (!isDraft || !data) return;
      setIsAutosaving(true);
      try {
        await fetch(`/api/blog/${blogId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, content, imageUrl }),
        });
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
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

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
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`);
      xhr.send(formData);
    }
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
        {isPublishing && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-foreground text-center">{isDraft ? 'Publishing your blog...' : 'Saving changes...'}</p>
            </div>
          </div>
        )}

        {isSavingDraft && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-foreground text-center">Saving your draft...</p>
            </div>
          </div>
        )}

        {isDeleting && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <Loader2 className="h-12 w-12 animate-spin text-destructive mx-auto mb-4" />
              <p className="text-foreground text-center">Deleting your blog...</p>
            </div>
          </div>
        )}

        {/* Confirm Publish/Save Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
            <div className="w-full max-md p-6 glass-card rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
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
          </div>
        )}

        {/* Confirm Delete Dialog */}
        {showConfirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmDelete(false)}>
            <div className="w-full max-w-md p-6 glass-card rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
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
          </div>
        )}

        {/* Image Upload Dialog */}
        {showUploadDrawer && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadDrawer(false)}>
            <div className="w-full max-w-md p-6 glass-card rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-foreground">Upload Cover Image</h3>
                <button onClick={() => setShowUploadDrawer(false)} className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
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
              {imageUrl && (
                <div className="mt-4">
                  <p className="text-foreground mb-2 font-medium text-sm">Preview:</p>
                  <div className="relative pb-[56.25%]">
                    <Image unoptimized={true} src={imageUrl} alt="Cover image preview" fill className="absolute inset-0 w-full h-full object-cover rounded-xl border border-border" />
                  </div>
                </div>
              )}
            </div>
          </div>
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
                <TiptapEditor content={content} onChange={handleContentChange} placeholder="Start writing your masterpiece..." />
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