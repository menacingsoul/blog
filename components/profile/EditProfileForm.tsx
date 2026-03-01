"use client";

import React, { useState, FormEvent } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/utils/api";
import { Loader2, ArrowLeft, Save, Check } from "lucide-react";
import Link from "next/link";
import type { ProfileFormData } from "@/types";

interface EditProfileFormProps {
  initialData: ProfileFormData;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await updateProfile(formData);
      setSaved(true);
      setTimeout(() => { router.push("/profile"); router.refresh(); }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="bg-zinc-900/80 border border-zinc-700/50 rounded-2xl p-8 shadow-xl">
      <div className="mb-6">
        <Link href="/profile" className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Profile
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 text-sm mb-1">First Name *</label>
            <input type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-1">Last Name</label>
            <input type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-1">Bio *</label>
          <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="input-field h-24" required />
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-1">Website</label>
          <input type="url" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://yourwebsite.com" className="input-field" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 text-sm mb-1">City *</label>
            <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-1">Country *</label>
            <CountryDropdown value={formData.country} onChange={val => setFormData({ ...formData, country: val })} classes="input-field" />
          </div>
        </div>

        {error && <div className="text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3 text-sm">{error}</div>}

        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={isLoading || saved}
            className={`flex items-center gap-2 py-2.5 px-6 rounded-lg font-medium transition-all duration-300 ${saved ? "bg-green-600 text-white" : "bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white"} disabled:opacity-70`}>
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} /> : <Save size={18} />}
            {saved ? "Saved!" : isLoading ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/profile" className="py-2.5 px-6 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
