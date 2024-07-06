"use client";

import React, { useState, FormEvent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import { Loader2, X, UploadCloud, Eye, EyeOff } from "lucide-react";
import { useAutosave } from "react-autosave";
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

interface BlogData {
  title: string;
  description: string;
  content: string;
  published: boolean;
  imageUrl?: string;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
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
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [isSavingDraft, setSavingDraft] = useState(false);
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
          bool: true,
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

  const handleDraftClick = async () => {
    setSavingDraft(true);
    try {
      await fetch(`/api/blog/${blogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          content,
          published: false,
          imageUrl,
        }),
      });
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      router.push("/myblogs");
      setSavingDraft(false);
    }
  };

  // Autosave functionality
  useAutosave({
    data: { title, description, content, imageUrl },
    onSave: async ({ title, description, content, imageUrl }) => {
      setIsAutosaving(true);
      try {
        await fetch(`/api/blog/${blogId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            content,
            published: false,
            imageUrl,
          }),
        });
      } catch (error) {
        console.error("Error autosaving blog:", error);
      } finally {
        setIsAutosaving(false);
      }
    },
  });

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
    <>
      {isPublishing && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <Loader2 className="mr-2 h-20 w-20 animate-spin" />
          </div>
        </div>
      )}
      {isSavingDraft && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <Loader2 className="mr-2 h-20 w-20 animate-spin" />
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
          <div className="cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-[#E2DFD0]/20 to-[#E2DFD0]/30 backdrop-filter backdrop-blur-lg border border-[#E2DFD0]/30 shadow-lg transition-all duration-300 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Confirm Publish</h2>
            <p className="text-gray-200">Once published you cannot edit/delete the blog?</p>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 mr-2 rounded bg-zinc-900/70 hover:bg-gray-300/70 text-slate-50 hover:text-gray-800"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleConfirmPublish}
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <Loader2 className="mr-2 h-20 w-20 animate-spin" />
          </div>
        </div>
      )}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
          <div className="cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-[#E2DFD0]/20 to-[#E2DFD0]/30 backdrop-filter backdrop-blur-lg border border-[#E2DFD0]/30 shadow-lg transition-all duration-300 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Confirm Delete</h2>
            <p className="text-gray-200">Once deleted you cannot retrieve this blog?</p>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 mr-2 rounded bg-zinc-900/70 hover:bg-gray-300/70 text-slate-50 hover:text-gray-800"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Drawer */}
      {showUploadDrawer && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Upload Image</h2>
              <div
                className="cursor-pointer"
                onClick={() => setShowUploadDrawer(false)}
              >
                <X />
              </div>
            </div>

            <div
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <UploadCloud className="w-12 h-12 text-gray-400" />
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
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-300">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
                  ></div>
                </div>
                <div className="flex justify-center mt-1 text-xs text-gray-600">
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
              </div>
            )}
            {imageUrl && (
              <div className="relative pb-[56.25%] mb-4 mt-4">
                <Image
                  unoptimized={true}
                  height={100}
                  width={100}
                  src={imageUrl}
                  alt="Uploaded preview"
                  className="absolute inset-0 w-full h-full object-cover bg-gray-200 rounded"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-h-full flex flex-col items-center">
        <div
          className="shadow-lg bg-gradient-to-br from-white/20 to-white/30 backdrop-filter backdrop-blur-lg
          border border-white/30 hover:border-white/50
          hover:shadow-2xl transition-all duration-300 transform p-4 rounded-lg w-full"
        >
          <div className="flex items-center justify-between mb-2">
          {!preview ?(
            <div className="flex items-center">
              <div className="p-2 text-white text-lg font-semibold">Title:</div>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Blog Title"
                className="w-full focus:border-b-sky-600 p-2 text-lg bg-transparent rounded border-none placeholder-gray-300 focus:outline-none text-white"
              />
            </div>):(
              <div className="p-2 text-white text-lg font-semibold">Preview</div>
            )
            
            }
            
            <button
              className="text-white p-3 rounded-full bg-gray-600  hover:bg-gray-400 focus:outline-none"
              onClick={() => setPreview(!preview)}
            >
              {preview ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {!preview ? (
            <>

          <div className="flex items-center mb-4">
            <div className="p-2 text-white text-lg font-semibold">Description:</div>
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="What are you writing about?"
              className="w-full p-2 text-lg bg-transparent rounded border-none placeholder-gray-300 focus:outline-none text-white"
            />
          </div>

         
            <ReactQuill
              value={content}
              onChange={handleContentChange}
              className="text-zinc-200 bg-gradient-to-br from-white/5 to-white/10 backdrop-filter backdrop-blur-lg outline-none"
            />
            </>
          ) : (
            <>
            <BlogPreviewer title={title} content={content} imageUrl={imageUrl} />
            </>
            
          )}

          {/* Image URL display and upload button */}
          {!preview && (
            <div className="mt-4">
              {imageUrl && (
                <div className="relative pb-[56.25%] mb-2">
                  <Image
                    unoptimized={true}
                    height={100}
                    width={100}
                    src={imageUrl}
                    alt="Blog Image"
                    className="absolute inset-0 w-full h-full p-2 rounded object-cover bg-gray-200"
                  />
                </div>
              )}
              <div
                onClick={() => setShowUploadDrawer(true)}
                className="p-2 flex cursor-pointer gap-x-2 w-full rounded bg-white text-black items-center font-semibold justify-center"
              >
                Upload <UploadCloud />
              </div>
            </div>
          )}

          {!preview && (
            <div className="flex gap-3 items-center">
              <button
                onClick={handlePublishClick}
                className="mt-4 px-4 py-2 rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                Publish
              </button>
              <button
                onClick={handleDraftClick}
                className="mt-4 px-4 py-2 rounded-lg shadow-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-gray-500 disabled:bg-gray-400"
              >
                Draft
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex gap-1 items-center mt-4 px-4 py-2 rounded-lg shadow-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-red-500 disabled:bg-red-400"
              >
                Delete
              </button>
            </div>
          )}
          {!preview && isAutosaving && (
            <div className="flex items-center mb-2 mt-2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-300 mr-2" />
              <span className="text-gray-300">Autosaving...</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogEditor;
