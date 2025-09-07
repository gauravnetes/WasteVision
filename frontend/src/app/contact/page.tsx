"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  HelpCircle,
  Cpu,
  Users,
  Workflow,
  CpuIcon,
  BookOpen,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";


export default function ContactUs() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      institution: (form.elements.namedItem("institution") as HTMLInputElement)
        ?.value,
      role: (form.elements.namedItem("role") as HTMLInputElement)?.value,
      email: (form.elements.namedItem("email") as HTMLInputElement)?.value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        ?.value,
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
        setShowSuccess(true);
        form.reset();
      } else if (result?.errors) {
        setStatus(
          `❌ ${result.errors.map((err: any) => err.message).join(", ")}`
        );
      } else {
        setStatus("❌ Something went wrong. Please try again later.");
      }
    } catch (error) {
      setStatus("⚠ Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <Navbar />

      {/* Success Overlay */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-card p-10 rounded-2xl shadow-2xl text-center max-w-md mx-auto"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Your message has been successfully sent. Our team will reach out
              to you soon.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-6 py-2 rounded-lg bg-foreground text-background font-semibold hover:opacity-80 transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="text-center py-20 mt-10">
        <h1 className="text-5xl font-bold mb-4">Vision Connect</h1>
        <p className="text-lg text-muted-foreground">
          Have questions about Waste Vision? Get in touch and discover how we
          can help your institution manage waste smarter.
        </p>
      </section>

      {/* Request a Consultation */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 relative">
            {/* Left Side: Consultation Form */}
            <div className="relative bg-card border border-border rounded-2xl shadow-lg p-10 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-center mb-4">
                  Request a Consultation
                </h2>
                <p className="text-muted-foreground mb-10 text-center leading-relaxed">
                  Fill out the form below, and one of our specialists will reach
                  out to discuss how Waste Vision can help your institution.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    required
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    required
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>
                <input
                  type="text"
                  name="institution"
                  placeholder="Institution / Organization"
                  required
                  className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                />
                <select
                  name="role"
                  required
                  className="w-full p-3 rounded-lg border border-border bg-background text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                >
                  <option value="">Select Your Role</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Facilities Manager">Facilities Manager</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Student">Student</option>
                  <option value="Other">Other</option>
                </select>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Your Message"
                  required
                  className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                ></textarea>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-foreground text-background font-semibold hover:opacity-80 transition"
                >
                  {loading ? "Sending..." : "Submit Request"}
                </button>
              </form>

              {status && (
                <p className="mt-6 text-center text-sm font-medium text-red-500">
                  {status}
                </p>
              )}
            </div>

            {/* Floating Mascot */}
            <motion.img
              src="/images/nn-removebg-preview.png"
              alt="Mascot"
              className="absolute -top-48 -left-38 w-32 md:w-80 drop-shadow-lg pointer-events-none select-none"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Right Side: Contact Info + Map */}
            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: (
                      <Phone className="w-6 h-6 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
                    ),
                    title: "Phone Number",
                    value: "9432012681",
                  },
                  {
                    icon: (
                      <Mail className="w-6 h-6 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
                    ),
                    title: "Email Address",
                    value: "waste_vision@gmail.com",
                  },
                  {
                    icon: (
                      <MessageSquare className="w-6 h-6 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
                    ),
                    title: "Address",
                    value:
                      "157/F, Nilgunj Rd, Sahid Colony, Panihati, Khardaha, West Bengal 700114",
                  },
                  {
                    icon: (
                      <MapPin className="w-6 h-6 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
                    ),
                    title: "Campus",
                    value: "Urban",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-start gap-3 p-6 rounded-xl border border-border bg-card shadow-md hover:shadow-lg transition"
                  >
                    {item.icon}
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.086268781775!2d88.3790179745803!3d22.61029793279586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02764c40a1cbe7%3A0x6e3fc1531d1cb33!2sGuru%20Nanak%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1752687634134!5m2!1sen!2sin"
                  width="100%"
                  height="280"
                  loading="lazy"
                  className="border-0 w-full h-96"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Waste Vision */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-16 text-foreground">
            Why Choose Waste Vision?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <CpuIcon className="w-10 h-10 text-foreground mx-auto mb-4 drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
                ),
                title: "Cutting-edge Technology",
                desc: "Harness AI-powered solutions designed to revolutionize waste management.",
              },
              {
                icon: (
                  <BookOpen className="w-10 h-10 text-foreground mx-auto mb-4 drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
                ),
                title: "Educational Focus",
                desc: "Empowering schools and institutions with awareness and sustainable practices.",
              },
              {
                icon: (
                  <CheckCircle2 className="w-10 h-10 text-foreground mx-auto mb-4 drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
                ),
                title: "Proven Results",
                desc: "Trusted by institutions to reduce waste and promote efficiency.",
              },
              {
                icon: (
                  <Headphones className="w-10 h-10 text-foreground mx-auto mb-4 drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
                ),
                title: "Dedicated Support",
                desc: "Our team is always ready to assist you with guidance and support.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-card h-full p-6 rounded-xl shadow-lg border border-border hover:border-foreground/40 hover:shadow-md transition-all duration-300"
              >
                {item.icon}
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 bg-muted/30 -mt-8 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="relative mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Frequently Asked Questions
            </h2>
            <motion.img
              src="/images/q-removebg-preview.png"
              alt="FAQ Mascot"
              className="absolute -top-8 right-24 w-42 md:w-98 drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
              animate={{
                y: [0, -14, 0],
                rotate: [0, -5, 5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-3xl mx-auto space-y-4"
          >
            <AccordionItem
              value="item-1"
              className="rounded-xl border bg-background p-4 hover:shadow-md transition-all"
            >
              <AccordionTrigger className="text-lg font-semibold flex items-center gap-3 no-underline hover:no-underline decoration-transparent">
                <HelpCircle className="w-7 h-7 text-foreground drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
                How does Waste Vision work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-10 text-base">
                Waste Vision uses AI-powered image recognition and analytics to
                identify, measure, and track waste, providing insights that help
                institutions reduce waste and improve sustainability.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-2"
              className="rounded-xl border bg-background p-4 hover:shadow-md transition-all"
            >
              <AccordionTrigger className="text-lg font-semibold flex items-center gap-3 no-underline hover:no-underline decoration-transparent">
                <Cpu className="w-7 h-7 text-foreground drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
                Do we need special equipment to use it?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-14 text-base">
                No special hardware is required. Waste Vision is compatible with
                standard cameras and computing devices, making it easy to set up
                and integrate.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-3"
              className="rounded-xl border bg-background p-4 hover:shadow-md transition-all"
            >
              <AccordionTrigger className="text-lg font-semibold flex items-center gap-3 no-underline hover:no-underline decoration-transparent">
                <Users className="w-7 h-7 text-foreground drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
                Who can benefit from Waste Vision?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-12 text-base">
                Waste Vision is designed for schools, universities, and
                institutions that want to manage waste more effectively, reduce
                costs, and promote sustainability on campus.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-4"
              className="rounded-xl border bg-background p-4 hover:shadow-md transition-all"
            >
              <AccordionTrigger className="text-lg font-semibold flex items-center gap-3 no-underline hover:no-underline decoration-transparent">
                <Workflow className="w-7 h-7 text-foreground drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] transform hover:scale-110 transition" />
                Is support available after setup?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-16 text-base">
                Yes! Our team provides ongoing technical support, updates, and
                training to ensure your institution gets the most out of Waste
                Vision.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
}
