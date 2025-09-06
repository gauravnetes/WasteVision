"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ShimmerButton } from "./ui/ShimmerButton";

export default function Navbar() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    picture: "/images/default-avatar.png",
    is_email_verified: false,
    state: "",
    campus: "",
    campus_id: null,
  });
  const [loading, setLoading] = useState(true);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // extra frontend-only fields
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("Available");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser({
          name: data.name || "",
          email: data.email || "",
          picture: data.picture || "/images/default-avatar.png",
          is_email_verified: data.is_email_verified || false,
          state: data.campus?.state || "",
          campus: data.campus?.name || "",
          campus_id: data.campus?.id || null,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setFileToUpload(file);

    const reader = new FileReader();
    reader.onload = () =>
      setUser({ ...user, picture: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSaving(true);

    try {
      let pictureUrl = user.picture;

      if (fileToUpload) {
        const formData = new FormData();
        formData.append("file", fileToUpload);

        const uploadRes = await fetch(
          "http://localhost:8000/api/users/upload-avatar",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          throw new Error(`Avatar upload failed: ${errorText}`);
        }

        const uploadData = await uploadRes.json();
        pictureUrl = uploadData.picture;
      }

      const res = await fetch("http://localhost:8000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          picture: pictureUrl,
          campus_id: user.campus_id,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updated = await res.json();
      setUser(updated);
      setPopoverOpen(false);
      setFileToUpload(null);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const glassInputClass =
    "px-3 py-2 rounded-lg bg-white/30 dark:bg-black/30 backdrop-blur-md " +
    "border border-white/30 dark:border-gray-600 text-black dark:text-white " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 " +
    "transition duration-200";

  if (loading) return null;

  return (
    <nav className="fixed font-custom h-36 top-0 left-0 w-full z-[999] px-6 md:px-10 py-5 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer mb-10">
        <div className="mt-5">
          <ThemeToggleButton />
        </div>

        {/* Transparent container with balanced blobs */}
        <div className="relative flex justify-center items-center w-72 h-20 mt-4">
          <Link href="/">
            <Image
              className="cursor-pointer pr-4"
              src="/images/logo_dark.png"
              alt="Site Logo"
              width={350}
              height={350}
              priority
            />
          </Link>
        </div>
      </div>

      <div
        className="flex items-center gap-6 px-7 py-5 rounded-full border  
                      bg-white/5 backdrop-blur-md shadow-lg font-bold "
      >
        {/* Nav Links */}
        <Link
          href="/"
          className="text-black dark:text-white font-handwriting transition"
        >
          HOME
        </Link>
        <Link
          href="/dashboard"
          className="text-black dark:text-white font-handwriting transition"
        >
          DASHBOARD
        </Link>
        <Link
          href="/about"
          className="text-black dark:text-white font-handwriting transition"
        >
          ABOUT
        </Link>

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button className="ml-4 w-10 h-10 rounded-full border overflow-hidden">
              <Image
                src={user.picture}
                alt="User"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </button>
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            align="end"
            className="flex w-[70vw] max-w-[1000px] h-[480px] rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl p-6 gap-6"
          >
            {/* Left: Avatar & Identity */}
            <div className="flex flex-col items-center justify-center w-1/3 border-r border-white/20 dark:border-gray-700 pr-6 py-8 gap-4">
              {/* Avatar */}
              <Image
                src={user.picture}
                alt="Avatar"
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-white shadow-md dark:border-gray-600"
              />

              {/* Change Photo Button */}
              <label
                htmlFor="profilePic"
                className="cursor-pointer px-5 py-2 bg-green-600 text-white rounded-full text-sm font-medium shadow hover:bg-green-700 transition duration-200"
              >
                Change Photo
              </label>
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Identity Details */}
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {user.email}
                </p>
              </div>

              {/* Verification Badge */}
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  user.is_email_verified
                    ? "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300"
                }`}
              >
                {user.is_email_verified ? "✅ Verified" : "❌ Not Verified"}
              </span>
            </div>

            {/* Right: Profile Details */}
            <div className="flex flex-col justify-between w-2/3 h-full">
              <div className="grid grid-cols-2 gap-4">
                {["name", "email", "state", "campus"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-gray-800 dark:text-gray-200 font-semibold mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={(user as any)[field] || ""}
                      onChange={handleChange}
                      className={glassInputClass}
                      disabled={
                        field === "email" ||
                        field === "state" ||
                        field === "campus"
                      }
                    />
                  </div>
                ))}

                {/* Bio */}
                <div className="col-span-2 flex flex-col">
                  <label className="text-gray-800 dark:text-gray-200 font-semibold mb-1">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write something about yourself..."
                    rows={3}
                    className={glassInputClass + " resize-none"}
                  />
                </div>

                {/* Status */}
                <div className="col-span-2 flex flex-col">
                  <label className="text-gray-800 dark:text-gray-200 font-semibold mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={glassInputClass}
                  >
                    <option>Available</option>
                    <option>Busy</option>
                    <option>Away</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-4">
                <ShimmerButton
                  onClick={handleSave}
                  className="px-6 py-2 rounded-md"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </ShimmerButton>
                <button
                  onClick={() => setPopoverOpen(false)}
                  className="px-6 py-2 bg-gray-200/50 dark:bg-gray-800/50 rounded-md text-black dark:text-white hover:bg-gray-300/50 dark:hover:bg-gray-700/50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}