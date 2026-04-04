"use client";

import React, { useState, FormEvent, useRef, useCallback } from "react";
import Image from "next/image";
import { CountryDropdown } from "react-country-region-selector";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/utils/api";
import { Loader2, ArrowLeft, Check, Camera, X, UploadCloud, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";
import type { ProfileFormData } from "@/types";
import { cn } from "@/lib/utils";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

interface EditProfileFormProps {
  initialData: ProfileFormData;
  username: string;
}

// Helper: create a cropped image blob from the source image + crop area
async function getCroppedImageBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = new window.Image();
  image.crossOrigin = "anonymous";
  image.src = imageSrc;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/jpeg",
      0.92
    );
  });
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData, username }) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Crop state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const avatarUrl = formData.profilePhoto ||
    `https://eu.ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName || ""}&color=7F9CF5&background=EBF4FF`;

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // When user selects a file, open the crop modal instead of uploading directly
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
    // Reset so re-selecting the same file triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropCancel = () => {
    setCropImageSrc(null);
    setCroppedAreaPixels(null);
  };

  const handleCropConfirm = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImageBlob(cropImageSrc, croppedAreaPixels);
      setCropImageSrc(null);

      // Upload the cropped blob
      setIsUploading(true);
      setUploadProgress(0);

      const uploadFormData = new FormData();
      uploadFormData.append("file", croppedBlob, "profile.jpg");
      uploadFormData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
      uploadFormData.append("folder", `blog/${username}/profile_pics`);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) setUploadProgress((event.loaded / event.total) * 100);
      });
      xhr.upload.addEventListener("load", () => setUploadProgress(100));
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setFormData((prev) => ({ ...prev, profilePhoto: response.secure_url }));
          if (saved) setSaved(false);
        } else {
          setError("Failed to upload profile photo. Please try again.");
        }
        setIsUploading(false);
      });
      xhr.addEventListener("error", () => {
        setError("Failed to upload profile photo. Please try again.");
        setIsUploading(false);
      });
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`);
      xhr.send(uploadFormData);
    } catch {
      setError("Failed to crop image. Please try again.");
      setCropImageSrc(null);
    }
  };

  const handleRemoveProfilePhoto = () => {
    setFormData((prev) => ({ ...prev, profilePhoto: "" }));
    if (saved) setSaved(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await updateProfile(formData);
      setSaved(true);
      setTimeout(() => {
        router.push(`/profile/${username}`);
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (saved) setSaved(false);
  };

  const backHref = username ? `/profile/${username}` : "/profile";

  return (
    <div>
      {/* ===== Crop Modal ===== */}
      {cropImageSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
          {/* Crop header */}
          <div className="flex items-center justify-between px-5 py-4 bg-background/90 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">Crop profile photo</h3>
            <button
              onClick={handleCropCancel}
              className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>

          {/* Crop area */}
          <div className="flex-1 relative">
            <Cropper
              image={cropImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          {/* Zoom controls + actions */}
          <div className="px-5 py-4 bg-background/90 border-t border-border">
            <div className="flex items-center justify-center gap-3 mb-4 max-w-xs mx-auto">
              <ZoomOut size={16} className="text-muted-foreground flex-shrink-0" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
              />
              <ZoomIn size={16} className="text-muted-foreground flex-shrink-0" />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCropCancel}
                className="px-5 py-2.5 rounded-full text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropConfirm}
                className="px-5 py-2.5 rounded-full text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-colors flex items-center gap-2 shadow-md shadow-primary/20"
              >
                <Check size={16} />
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link
            href={backHref}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Edit profile</h1>
        </div>

        <button
          type="submit"
          form="edit-profile-form"
          disabled={isLoading || saved}
          className={cn(
            "py-2.5 px-6 rounded-full text-sm font-medium transition-all flex items-center gap-2",
            saved
              ? "bg-emerald-600 text-white"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
            (isLoading || saved) && "opacity-80"
          )}
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" />Saving...</>
          ) : saved ? (
            <><Check size={16} />Saved</>
          ) : (
            "Save"
          )}
        </button>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-6 mb-10 pb-10 border-b border-border/50">
        <div className="relative group">
          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-border">
            <Image
              src={avatarUrl}
              fill
              alt="Profile photo"
              className="object-cover"
            />
            {/* Upload overlay */}
            {isUploading ? (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                <Loader2 size={20} className="animate-spin text-white mb-1" />
                <span className="text-white text-[10px] font-medium">{Math.round(uploadProgress)}%</span>
              </div>
            ) : (
              <div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={20} className="text-white" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        <div>
          <p className="text-foreground font-medium text-lg">
            {formData.firstName} {formData.lastName}
          </p>
          <p className="text-muted-foreground text-sm">@{username}</p>
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <UploadCloud size={12} />
              {formData.profilePhoto ? "Change photo" : "Upload photo"}
            </button>
            {formData.profilePhoto && (
              <>
                <span className="text-muted-foreground text-xs">·</span>
                <button
                  type="button"
                  onClick={handleRemoveProfilePhoto}
                  className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1"
                >
                  <X size={12} />
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Name fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              First name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-border rounded-lg text-foreground text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Last name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-border rounded-lg text-foreground text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Tell the world about yourself..."
            rows={4}
            maxLength={300}
            className="w-full px-4 py-3 bg-transparent border border-border rounded-lg text-foreground text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none leading-relaxed"
          />
          <p className="text-xs text-muted-foreground mt-1.5 text-right">
            {formData.bio.length}/300
          </p>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://yourwebsite.com"
            className="w-full px-4 py-3 bg-transparent border border-border rounded-lg text-foreground text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Your city"
              className="w-full px-4 py-3 bg-transparent border border-border rounded-lg text-foreground text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Country
            </label>
            <CountryDropdown
              value={formData.country}
              onChange={(val) => handleChange("country", val)}
              classes="w-full px-4 py-3 bg-transparent border border-border rounded-lg text-foreground text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm">
            {error}
          </div>
        )}

        {/* Mobile save + cancel */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/50 sm:hidden">
          <button
            type="submit"
            disabled={isLoading || saved}
            className={cn(
              "flex-1 py-3 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2",
              saved
                ? "bg-emerald-600 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" />Saving...</>
            ) : saved ? (
              <><Check size={16} />Saved</>
            ) : (
              "Save changes"
            )}
          </button>
          <Link
            href={backHref}
            className="py-3 px-6 rounded-full text-sm font-medium border border-border text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
