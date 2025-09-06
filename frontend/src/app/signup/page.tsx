"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Prism from "@/components/Prism";
import Image from "next/image";
import debounce from "lodash/debounce";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export default function SignUp() {
  useAuthRedirect()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCampus, setSelectedCampus] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [filteredStates, setFilteredStates] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Utility: fetch campuses with combined filters
  const fetchCampuses = async (term?: string, city?: string, state?: string) => {
    const params = new URLSearchParams();
    if (term) params.append("q", term);
    if (city) params.append("city", city);
    if (state) params.append("state", state);

    try {
      const res = await fetch(`${API_BASE}/api/campuses?${params.toString()}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setCampuses(data);
    } catch (err) {
      console.error("Error fetching campuses:", err);
      setCampuses([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".state-dropdown-container")) setShowStateDropdown(false);
      if (!target.closest(".city-dropdown-container")) setShowCityDropdown(false);
      if (!target.closest(".campus-dropdown-container")) {
        if (campuses.length > 0 && !searchTerm) setCampuses([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [campuses, searchTerm]);

  // fetch states
  useEffect(() => {
    fetch(`${API_BASE}/api/locations/states`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setStates(data);
        setFilteredStates(data);
      })
      .catch((err) => console.error("Error fetching states:", err));
  }, []);

  // fetch cities when state changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setFilteredCities([]);
      return;
    }

    fetch(`${API_BASE}/api/locations/cities?state=${encodeURIComponent(selectedState)}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCities(data);
        setFilteredCities(data);
      })
      .catch((err) => console.error("Error fetching cities:", err));
  }, [selectedState]);

  // Filter states and cities
  useEffect(() => {
    setFilteredStates(
      stateSearchTerm
        ? states.filter((s) => s.toLowerCase().includes(stateSearchTerm.toLowerCase()))
        : states
    );
  }, [stateSearchTerm, states]);

  useEffect(() => {
    setFilteredCities(
      citySearchTerm
        ? cities.filter((c) => c.toLowerCase().includes(citySearchTerm.toLowerCase()))
        : cities
    );
  }, [citySearchTerm, cities]);

  // Debounced search for campuses
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setIsSearching(true);
      fetchCampuses(term, selectedCity, selectedState);
    }, 300),
    [selectedCity, selectedState]
  );

  // trigger search when term changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // refetch campuses if city or state changes
  useEffect(() => {
    if (selectedCity || selectedState) {
      setIsSearching(true);
      fetchCampuses(searchTerm, selectedCity, selectedState);
    }
  }, [selectedCity, selectedState]);

  // handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!selectedCampus) {
      setError("Please select a campus");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          campus_id: selectedCampus,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Signup failed");
      }

      setSuccess("Account created successfully! Please verify your email.");
      setTimeout(() => {
        window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Prism background */}
      <div className="h-screen z-9 w-full relative">
        <Prism
          animationType="hover"
          timeScale={0.7}
          height={2.7}
          baseWidth={4.8}
          scale={3}
          hueShift={3.06}
          colorFrequency={4}
          noise={0}
          glow={1.4}
        />
      </div>

      <main className="absolute z-11 w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* LEFT SIDE */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center text-white">
            <Link href="/">
              <Image
                src="/images/auth_logo.png"
                alt="Waste Vision Logo"
                width={300}
                height={300}
                priority
                className="mb-4 cursor-pointer animate-float hidden dark:block"
              />
            </Link>
            <h2 className="text-4xl font-extrabold font-custom">
              Welcome to Waste Vision 🌍
            </h2>
            <p className="mt-4 text-gray-200 font-custom font-semibold">
              Join the{" "}
              <span className="text-lime-400 font-bold">Clean Campus Initiative</span>{" "}
              and be part of thousands of students driving change.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-200 font-custom font-semibold">
              <li>✅ Create your account in seconds</li>
              <li>✅ Connect with your campus community</li>
              <li>✅ Track and contribute to lime zones</li>
            </ul>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="md:w-1/2 p-10">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <h3 className="text-2xl font-bold text-center text-white mb-4 font-custom">
                Create your account
              </h3>

              {error && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm font-custom">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-lime-500/10 text-lime-400 p-3 rounded-xl text-sm font-custom">
                  {success}
                </div>
              )}

              {/* NAME */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500"
              />
              {/* EMAIL */}
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500"
              />
              {/* PASSWORD */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500"
              />

              {/* STATE */}
              <div className="relative w-full state-dropdown-container">
                <input
                  type="text"
                  placeholder="Search for state"
                  value={stateSearchTerm}
                  onChange={(e) => {
                    setStateSearchTerm(e.target.value);
                    setShowStateDropdown(true);
                  }}
                  onFocus={() => setShowStateDropdown(true)}
                  className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500"
                />
                {showStateDropdown && filteredStates.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-black/90 border border-gray-700 rounded-xl max-h-60 overflow-y-auto">
                    {filteredStates.map((state) => (
                      <div
                        key={state}
                        className={`px-5 py-3 cursor-pointer hover:bg-lime-500/20 ${
                          selectedState === state ? "bg-lime-500/30" : ""
                        }`}
                        onClick={() => {
                          setSelectedState(state);
                          setStateSearchTerm(state);
                          setShowStateDropdown(false);
                          setSelectedCity("");
                          setCitySearchTerm("");
                        }}
                      >
                        {state}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CITY */}
              <div className="relative w-full city-dropdown-container">
                <input
                  type="text"
                  placeholder="Search for city"
                  value={citySearchTerm}
                  onChange={(e) => {
                    setCitySearchTerm(e.target.value);
                    setShowCityDropdown(true);
                  }}
                  onFocus={() => setShowCityDropdown(true)}
                  disabled={!selectedState}
                  className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {showCityDropdown && filteredCities.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-black/90 border border-gray-700 rounded-xl max-h-60 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <div
                        key={city}
                        className={`px-5 py-3 cursor-pointer hover:bg-lime-500/20 ${
                          selectedCity === city ? "bg-lime-500/30" : ""
                        }`}
                        onClick={() => {
                          setSelectedCity(city);
                          setCitySearchTerm(city);
                          setShowCityDropdown(false);
                        }}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CAMPUS */}
              <div className="relative w-full campus-dropdown-container">
                <input
                  type="text"
                  placeholder="Search for campus by name, city, or state"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500"
                />
                {isSearching && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin h-5 w-5 border-2 border-lime-500 rounded-full border-t-transparent"></div>
                  </div>
                )}
                {campuses.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-black/90 border border-gray-700 rounded-xl max-h-60 overflow-y-auto">
                    {campuses.map((c) => (
                      <div
                        key={c.public_id}
                        className={`px-5 py-3 cursor-pointer hover:bg-lime-500/20 ${
                          selectedCampus === c.id ? "bg-lime-500/30" : ""
                        }`}
                        onClick={() => {
                          setSelectedCampus(c.id);
                          setSearchTerm(`${c.name} - ${c.city}, ${c.state}`);
                        }}
                      >
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-sm text-gray-400">
                          {c.city}, {c.state}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-lime-400 text-white font-custom font-bold hover:bg-lime-500 transition-colors"
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-300 font-custom font-semibold">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-lime-400 hover:text-lime-300 font-bold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
