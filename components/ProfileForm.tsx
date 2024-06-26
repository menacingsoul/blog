'use client'

import React, { useState } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    website: "",
    city: "",
    country: "",
  });
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const router = useRouter();

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await fetch(`/api/username-exists?username=${username}`);
      const data = await response.json();
      setIsUsernameAvailable(!data.exists);
    } catch (error) {
      console.error("Error checking username availability:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.country) {
      setCountryError(true);
      setIsLoading(false);
      toast.error("Country is required");
      return;
    }

    setCountryError(false);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Profile created successfully!');
        router.push('/home');
      } else {
        const errorData = await response.json();
        toast.error('Error creating profile');
        console.log("error", errorData.error);
      }
    } catch (err) {
      console.error("Error creating user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="relative mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="relative mt-8 space-y-6">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          placeholder="First Name"
          className="input-field"
          required
        />

        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          placeholder="Last Name"
          className="input-field"
        />

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={(e) => {
            setFormData({ ...formData, username: e.target.value });
            checkUsernameAvailability(e.target.value);
          }}
          placeholder="Username"
          className="input-field"
          required
          onBlur={() => checkUsernameAvailability(formData.username)}
        />
        {!isUsernameAvailable && (
          <p className="text-red-600 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-white/20 to-white/30 backdrop-filter backdrop-blur-lg border border-white/30 w-fit px-5 font-bold">
            Username already exists
          </p>
        )}

        <textarea
          name="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself..."
          className="input-field h-24"
          required
        />

        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="Your website (optional)"
          className="input-field"
        />

        <div className="flex space-x-2">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="City"
            className="input-field flex-1"
            required
          />
          <CountryDropdown
            value={formData.country}
            onChange={(val) => setFormData({ ...formData, country: val })}
            classes={`input-field flex-1 ${countryError ? 'border-red-600' : ''}`}
          />
        </div>
        <button
          type="submit"
          className="group relative z-10 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          disabled={isLoading || !isUsernameAvailable}
        >
          {isLoading ? "Creating..." : "Create Profile"}
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
