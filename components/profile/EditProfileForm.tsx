"use client";

import React, { useState, FormEvent, useRef } from "react";
import Image from "next/image";
import { CountryDropdown } from "react-country-region-selector";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/utils/api";
import { Loader2, ArrowLeft, Check, Camera } from "lucide-react";
import Link from "next/link";
import type { ProfileFormData } from "@/types";
import { cn } from "@/lib/utils";

interface EditProfileFormProps {
  initialData: ProfileFormData;
  username: string;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData, username }) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const avatarUrl = formData.profilePhoto ||
    `https://eu.ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName || ""}&color=7F9CF5&background=EBF4FF`;

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
          </div>
        </div>
        <div>
          <p className="text-foreground font-medium text-lg">
            {formData.firstName} {formData.lastName}
          </p>
          <p className="text-muted-foreground text-sm">@{username}</p>
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
