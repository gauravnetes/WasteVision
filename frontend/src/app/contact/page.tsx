"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { HelpCircle, Cpu, Users, Workflow } from "lucide-react";
import { useState } from "react";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { FlipText } from "@/components/ui/FlipText";

export default function GetStarted() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = e.currentTarget;

    const data = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement)
        ?.value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement)
        ?.value,
      email: (form.elements.namedItem("email") as HTMLInputElement)?.value,
      institution: (form.elements.namedItem("institution") as HTMLInputElement)
        ?.value,
      role: (form.elements.namedItem("role") as HTMLSelectElement)?.value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        ?.value,
      consent: (form.elements.namedItem("consent") as HTMLInputElement)?.checked
        ? "Yes"
        : "No",
    };

    try {
      const res = await fetch("https://formspree.io/f/xvgbaoew", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus("✅ Thank you! Your request has been submitted.");
        setShowModal(true);
        form.reset();
      } else if (result?.errors) {
        setStatus(
          `❌ ${result.errors.map((err: any) => err.message).join(", ")}`
        );
        setShowModal(true);
      } else {
        setStatus("❌ Something went wrong. Please try again later.");
        setShowModal(true);
      }
    } catch (error) {
      setStatus("⚠ Network error. Please check your connection.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-14 md:pt-18">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-secondary/5 py-28">
          <div className="container mx-auto px-6 text-center">
            <FlipText
              className="text-3xl md:text-4xl lg:text-6xl font-extrabold tracking-tight 
             text-gray-900 dark:text-white drop-shadow-lg"
            >
              Get Started with Waste Vision
            </FlipText>
            <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground leading-relaxed">
              Have questions about Waste Vision? Get in touch and discover how
              we can help your institution manage waste smarter.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-24 bg-gradient-to-br from-background to-muted/40 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
              {/* Left Card: Contact Form */}
              <div className="group relative h-full flex">
                <div className="p-[1px] rounded-3xl bg-gradient-to-r from-green-400/60 via-green-300/40 to-green-500/60 flex flex-col w-full">
                  <div
                    className="h-full flex flex-col bg-white dark:bg-black backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 
            transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-green-400/30"
                  >
                    <div className="mb-6">
                      <h3
                        className="text-2xl md:text-3xl font-extrabold text-center 
                bg-clip-text text-transparent
                bg-gradient-to-r from-green-500 to-green-300
                dark:from-green-400 dark:to-green-200
                drop-shadow-md animate-textGlow"
                      >
                        Request a Consultation
                      </h3>
                      <p className="text-center text-sm md:text-base text-muted-foreground mt-2">
                        Fill out the form below and our team will respond within
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {" "}
                          24 hours
                        </span>
                        .
                      </p>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-6 flex-1 flex flex-col justify-between"
                    >
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium mb-2"
                            >
                              First Name
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              className="w-full p-3 rounded-xl border border-muted bg-white dark:bg-black text-black dark:text-white placeholder:text-gray-400 
                                 focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="John"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium mb-2"
                            >
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              className="w-full p-3 rounded-xl border border-muted bg-white dark:bg-black text-black dark:text-white placeholder:text-gray-400 
                                 focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Doe"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-2"
                          >
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full p-3 rounded-xl border border-muted bg-white dark:bg-black text-black dark:text-white placeholder:text-gray-400 
                               focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="john.doe@university.edu"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="institution"
                            className="block text-sm font-medium mb-2"
                          >
                            Institution Name
                          </label>
                          <input
                            type="text"
                            id="institution"
                            name="institution"
                            className="w-full p-3 rounded-xl border border-muted bg-white dark:bg-black text-black dark:text-white placeholder:text-gray-400 
                               focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="University of Technology"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="role"
                            className="block text-sm font-medium mb-2"
                          >
                            Your Role
                          </label>
                          <select
                            id="role"
                            name="role"
                            className="w-full p-3 rounded-xl border border-muted bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select your role</option>
                            <option value="administrator">Administrator</option>
                            <option value="faculty">Faculty Member</option>
                            <option value="sustainability">
                              Sustainability Officer
                            </option>
                            <option value="facilities">
                              Facilities Management
                            </option>
                            <option value="student">
                              Student Representative
                            </option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium mb-2"
                          >
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={5}
                            className="w-full p-3 rounded-xl border border-muted bg-white dark:bg-black text-black dark:text-white placeholder:text-gray-400 
                               focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Tell us about your institution's waste management needs..."
                            required
                          ></textarea>
                        </div>

                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            id="consent"
                            name="consent"
                            className="mt-1"
                          />
                          <label
                            htmlFor="consent"
                            className="text-sm text-muted-foreground"
                          >
                            I agree to receive communications from Waste Vision
                            about my inquiry and related services.
                          </label>
                        </div>
                      </div>

                      <ShimmerButton type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Request"}
                      </ShimmerButton>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right Card: Why Choose Us */}
              <div className="group relative h-full flex">
                <div className="p-[1px] rounded-3xl bg-gradient-to-r from-green-400/60 via-green-300/40 to-green-500/60 flex flex-col w-full">
                  <div
                    className="h-full flex flex-col relative bg-white dark:bg-black backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 
            transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-green-400/30 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-white/10 animate-pulse rounded-3xl"></div>

                    <h3
                      className="text-2xl md:text-3xl font-extrabold mb-6 text-center
              bg-clip-text text-transparent
              bg-gradient-to-r from-green-500 to-green-300
              dark:from-green-400 dark:to-green-200
              drop-shadow-md"
                    >
                      Why Choose Waste Vision?
                    </h3>

                    <div className="space-y-6 relative z-10 flex-1">
                      {[
                        {
                          icon: <Cpu className="w-6 h-6" />,
                          title: "Cutting-edge Technology",
                          text: "YOLOv8 detection model and 3D reconstruction for smarter AI waste management.",
                        },
                        {
                          icon: <Users className="w-6 h-6" />,
                          title: "Educational Focus",
                          text: "Built for colleges & universities with campus-specific features.",
                        },
                        {
                          icon: <Workflow className="w-6 h-6" />,
                          title: "Proven Results",
                          text: "Institutions reduced waste costs by up to 30% with our system.",
                        },
                        {
                          icon: <HelpCircle className="w-6 h-6" />,
                          title: "Dedicated Support",
                          text: "Comprehensive onboarding & 24/7 support.",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-black/5 hover:scale-[1.02]"
                        >
                          <div className="bg-black/10 p-3 rounded-full text-black dark:text-white border-2 border-green-500 dark:border-green-400 shadow-md shadow-green-400/30">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">
                              {item.title}
                            </h4>
                            <p className="text-muted-foreground">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-10 relative z-10">
                      <div className="text-center">
                        <h4 className="text-3xl font-bold text-black dark:text-white">
                          30%
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          Waste Cost Savings
                        </p>
                      </div>
                      <div className="text-center">
                        <h4 className="text-3xl font-bold text-black dark:text-white">
                          24/7
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          Support Availability
                        </p>
                      </div>
                    </div>

                    <div className="mt-10 p-8 rounded-2xl bg-white/10 dark:bg-black/30 backdrop-blur-2xl border border-white/20 shadow-xl hover:scale-[1.02] transition-all relative z-10">
                      <h4 className="font-semibold text-xl mb-3">
                        🚀 Schedule a Demo
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        Want to see Waste Vision in action? Book a live demo and
                        explore how it transforms waste management.
                      </p>
                      <ShimmerButton>Request Demo</ShimmerButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30 -mt-8">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-extrabold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>

            <Accordion
              type="single"
              collapsible
              className="w-full max-w-3xl mx-auto space-y-4"
            >
              <AccordionItem
                value="item-1"
                className="rounded-xl border bg-background p-3 hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                <AccordionTrigger className="text-lg font-semibold flex items-center gap-2 no-underline hover:no-underline focus:no-underline">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  How long does implementation take?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-7 text-base">
                  Typical implementation takes 2-4 weeks, depending on the size
                  of your campus and specific requirements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="rounded-xl border bg-background p-3 hover:shadow-lg hover:shadow-secondary/20 transition-all"
              >
                <AccordionTrigger className="text-lg font-semibold flex items-center gap-2 no-underline hover:no-underline focus:no-underline">
                  <Cpu className="w-5 h-5 text-secondary" />
                  What hardware requirements are needed?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-7 text-base">
                  Our system works with standard cameras and computing
                  equipment. We'll provide detailed specifications during
                  consultation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="rounded-xl border bg-background p-3 hover:shadow-lg hover:shadow-green-400/20 transition-all"
              >
                <AccordionTrigger className="text-lg font-semibold flex items-center gap-2 no-underline hover:no-underline focus:no-underline">
                  <Users className="w-5 h-5 text-green-500" />
                  Is training provided for staff?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-7 text-base">
                  Yes, we provide comprehensive training for facilities staff
                  and administrators as part of our implementation package.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="rounded-xl border bg-background p-3 hover:shadow-lg hover:shadow-blue-400/20 transition-all"
              >
                <AccordionTrigger className="text-lg font-semibold flex items-center gap-2 no-underline hover:no-underline focus:no-underline">
                  <Workflow className="w-5 h-5 text-blue-500" />
                  Can the system integrate with our existing waste management
                  processes?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-7 text-base">
                  Absolutely. Our solution is designed to complement and enhance
                  your existing waste management infrastructure and processes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      {/* Modal for Success/Error */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl max-w-sm w-full text-center relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">
              {status?.startsWith("✅") ? "Success!" : "Notice"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{status}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
