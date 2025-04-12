"use client";

import React, { useState, FormEvent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import {
  Loader2,
  X,
  UploadCloud,
  Eye,
  EyeOff,
  Trash2,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { deleteBlog } from "@/utils/api";
import Image from "next/image";
import BlogPreviewer from "./BlogPreviewer";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface BlogEditorProps {
  blogId: string;
  initialDescription: string;
  initialContent: string;
  initialTitle: string;
  initialImageUrl: string;
}

const PublishedBlogEditor: React.FC<BlogEditorProps> = ({
  blogId,
  initialDescription,
  initialContent,
  initialTitle,
  initialImageUrl,
}) => {
  const [content, setContent] = useState(initialContent || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [title, setTitle] = useState(initialTitle || "");
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
  const [isPublishing, setPublishing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(false);
  const router = useRouter();

  const handlePublishClick = () => {
    setShowConfirm(true);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleTitleChange = (event: FormEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  };

  const handleDescriptionChange = (event: FormEvent<HTMLInputElement>) => {
    setDescription(event.currentTarget.value);
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);

    try {
      setShowConfirm(false);
      await deleteBlog(blogId);
      router.push("/myblogs");
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          content,
          published: true,
          imageUrl,
        }),
      });

      if (res.ok) {
        router.push("/myblogs");
      } else {
        const errorData = await res.json();
        throw new Error(errorData?.message || "Failed to publish blog");
      }
    } catch (error) {
      console.error("Error publishing blog:", error);
      alert("Error publishing blog.");
    } finally {
      setPublishing(false);
    }
  };

  // Handle image upload
  const handleUploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setUploading(true);
      setUploadProgress(0);
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.upload.addEventListener("load", () => {
        setUploadProgress(100);
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setImageUrl(response.secure_url);
          setShowUploadDrawer(false); // Close the drawer after upload
        } else {
          alert("Failed to upload image.");
        }
        setUploading(false);
      });

      xhr.addEventListener("error", () => {
        alert("Failed to upload image.");
        setUploading(false);
      });

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
      );
      xhr.send(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black py-6 px-4 sm:px-6 relative">
      {/* Background blobs */}
      <div className="absolute top-40 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-40 right-1/4 w-80 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto">
        {/* Loading Overlays */}
        {isPublishing && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-lg p-8 shadow-xl border border-gray-800">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
              <p className="text-white text-center">Saving your blog...</p>
            </div>
          </div>
        )}

        {isDeleting && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-lg p-8 shadow-xl border border-gray-800">
              <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-white text-center">Deleting your blog...</p>
            </div>
          </div>
        )}

        {/* Confirmation Dialogs */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 bg-gray-900/90 rounded-xl border border-gray-700 shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-white">Confirm Save</h3>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="p-1 rounded-full hover:bg-gray-700/70 transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to save changes to this blog?
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center gap-2"
                  onClick={handleConfirmPublish}
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 bg-gray-900/90 rounded-xl border border-gray-700 shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-white">Confirm Delete</h3>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="p-1 rounded-full hover:bg-gray-700/70 transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this blog? This action cannot be
                undone and all content will be permanently lost.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2"
                  onClick={handleConfirmDelete}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Upload Dialog */}
        {showUploadDrawer && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 bg-gray-900/90 rounded-xl border border-gray-700 shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-white">
                  Upload Cover Image
                </h3>
                <button
                  onClick={() => setShowUploadDrawer(false)}
                  className="p-1 rounded-full hover:bg-gray-700/70 transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/50 cursor-pointer hover:border-purple-500 transition-colors group"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <UploadCloud className="w-12 h-12 text-gray-400 group-hover:text-purple-400 transition-colors mb-2" />
                <p className="text-gray-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500 text-sm">
                  PNG, JPG, WebP (Max 10MB)
                </p>
              </div>

              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                className="hidden"
              />

              {isUploading && (
                <div className="relative pt-1 mt-4">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                    <div
                      style={{ width: `${uploadProgress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600 transition-all duration-500"
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                </div>
              )}

              {imageUrl && (
                <div className="mt-4">
                  <p className="text-gray-300 mb-2 font-medium">Preview:</p>
                  <div className="relative pb-[56.25%]">
                    <Image
                      unoptimized={true}
                      src={imageUrl}
                      alt="Cover image preview"
                      fill
                      className="absolute inset-0 w-full h-full object-cover rounded-lg border border-gray-700"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Editor Container */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full">
            <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-xl">
              {/* Cover Image Area */}
              <div className="relative w-full h-64 bg-gray-800">
                {imageUrl ? (
                  <>
                    <Image
                      src={imageUrl}
                      fill
                      className="object-cover"
                      alt="Blog cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => setShowUploadDrawer(true)}
                    >
                      <ImageIcon size={48} className="text-gray-600 mb-3" />
                      <p className="text-gray-500">Add a cover image</p>
                    </div>
                  </div>
                )}

                {/* Floating button for image upload */}
                {!preview && (
                  <button
                    onClick={() => setShowUploadDrawer(true)}
                    className="absolute bottom-4 right-4 p-2 bg-gray-800/90 hover:bg-gray-700 rounded-lg backdrop-blur-sm text-white transition-colors flex items-center gap-2"
                  >
                    <UploadCloud size={16} />
                    <span>{imageUrl ? "Change" : "Add"} Cover</span>
                  </button>
                )}

                {/* Preview Toggle */}
                <button
                  className="absolute top-4 right-4 text-white p-3 rounded-full bg-gray-800/90 hover:bg-gray-700 backdrop-blur-sm transition-colors"
                  onClick={() => setPreview(!preview)}
                >
                  {preview ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Content Area */}
              <div className="p-6 lg:p-8">
                {/* Editor Header */}
                <div className="mb-6 pb-6 border-b border-gray-800">
                  {!preview ? (
                    <>
                      <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Blog Title"
                        className="w-full text-2xl lg:text-3xl font-bold bg-transparent border-none focus:outline-none text-white placeholder-gray-500 mb-4"
                      />
                      <input
                        type="text"
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Add a brief description of your blog..."
                        className="w-full text-gray-300 bg-transparent border-none focus:outline-none placeholder-gray-500"
                      />
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                        {title || "Untitled Blog"}
                      </h1>
                      <p className="text-gray-300">
                        {description || "No description provided"}
                      </p>
                    </>
                  )}
                </div>

                {/* Editor/Preview Content */}
                {!preview ? (
                  <div className="min-h-[500px]">
                    <ReactQuill
                      value={content}
                      onChange={handleContentChange}
                      placeholder="Start writing your blog content here..."
                      className="text-white bg-transparent editor-container"
                      theme="snow"
                    />
                  </div>
                ) : (
                  <BlogPreviewer
                    title={title}
                    content={content}
                    imageUrl={imageUrl}
                  />
                )}

                {/* Actions Footer */}
                {!preview && (
                  <div className="mt-8 pt-6 border-t border-gray-800 flex flex-wrap gap-3 justify-between items-center">
                    <button
                      onClick={handlePublishClick}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center gap-2"
                    >
                      <Save size={16} />
                      Save
                    </button>

                    <button
                      onClick={handleDeleteClick}
                      className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-red-700 text-white transition-colors flex items-center gap-2 hover:bg-opacity-90"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for the editor */}
      <style jsx global>{`
        .editor-container .ql-editor {
          min-height: 500px;
          font-size: 1.125rem;
          color: #e5e7eb;
        }

        .editor-container .ql-toolbar {
          background-color: rgba(31, 41, 55, 0.5);
          border-color: #374151;
          border-radius: 0.5rem 0.5rem 0 0;
        }

        .editor-container .ql-container {
          border-color: #374151;
          background-color: rgba(17, 24, 39, 0.3);
          border-radius: 0 0 0.5rem 0.5rem;
        }

        .editor-container .ql-snow.ql-toolbar button,
        .editor-container .ql-snow .ql-toolbar button {
          color: #9ca3af;
        }

        .editor-container .ql-snow.ql-toolbar button:hover,
        .editor-container .ql-snow .ql-toolbar button:hover,
        .editor-container .ql-snow.ql-toolbar button.ql-active,
        .editor-container .ql-snow .ql-toolbar button.ql-active {
          color: #a78bfa;
        }

        .editor-container .ql-snow .ql-stroke {
          stroke: #9ca3af;
        }

        .editor-container .ql-snow .ql-fill {
          fill: #9ca3af;
        }

        .editor-container .ql-snow.ql-toolbar button:hover .ql-stroke,
        .editor-container .ql-snow .ql-toolbar button:hover .ql-stroke,
        .editor-container .ql-snow.ql-toolbar button.ql-active .ql-stroke,
        .editor-container .ql-snow .ql-toolbar button.ql-active .ql-stroke {
          stroke: #a78bfa;
        }

        .editor-container .ql-snow.ql-toolbar button:hover .ql-fill,
        .editor-container .ql-snow .ql-toolbar button:hover .ql-fill,
        .editor-container .ql-snow.ql-toolbar button.ql-active .ql-fill,
        .editor-container .ql-snow .ql-toolbar button.ql-active .ql-fill {
          fill: #a78bfa;
        }
      `}</style>
    </div>
  );
};

export default PublishedBlogEditor;
