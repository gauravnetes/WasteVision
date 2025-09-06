"use client";
import Image from "next/image";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltedCard from "@/components/TiltedCard";
import { VideoText } from "@/components/ui/VideoText";
import { MagicCard } from "@/components/ui/MagicCard";

export default function About() {
  const cardVariants = {
  offscreen: { opacity: 0, y: 50 },
  onscreen: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 } 
  }
};
  // Team members data
  const teamMembers = [
    {
      name: "Gourav Chandra",
      role: "Backend Developer",
      bio: "Specializes in backend development and system architecture, building robust and efficient systems to support scalable applications.",
      image: "/images/Gourav.jpg",
    },
    {
      name: "Souvik Rahut",
      role: "Frontend Developer",
      bio: "Focuses on frontend development, creating intuitive, responsive, and user-friendly interfaces that enhance the overall user experience.",
      image: "/images/Souvik.jpg",
    },
    {
      name: "Shriparna Prasad",
      role: "Design Lead",
      bio: "Leads design and UX, crafting seamless user experiences with creative and effective visual solutions.",
      image: "/images/me.jpg",
    },
    {
      name: "Diptish Sarkar",
      role: "Testing Lead",
      bio: "Responsible for quality assurance and testing, ensuring that all products meet the highest standards of reliability and performance.",
      image: "/images/Diptish.jpg",
    },
  ];

  // Company milestones
const milestones = [
  {
    phase: "Conceptualization",
    title: "Vision & Ideation",
    description:
      "Started the journey to revolutionize waste management with AI-powered drones, overcoming the challenge of designing a solution without actual hardware using our dataset-driven YOLOv8 model.",
  },
  {
    phase: "Data & Model Training",
    title: "Building the Foundation",
    description:
      "Curated datasets and trained YOLOv8 models, tackling limited data, class imbalance, and ensuring high detection accuracy.",
  },
  {
    phase: "Simulation & Integration",
    title: "Bringing AI to Life",
    description:
      "Integrated AI into simulated drone environments, solving challenges in real-time detection, navigation, and system reliability.",
  },
  {
    phase: "Testing & Refinement",
    title: "Optimizing Performance",
    description:
      "Performed rigorous testing and refinements, addressing edge cases and enhancing system robustness and accuracy.",
  },
  {
    phase: "Presentation & Impact",
    title: "Showcasing Innovation",
    description:
      "Demonstrated AI capabilities and real-world impact, celebrating collaboration, technical expertise, and innovation milestones.",
  },
];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The Vision Behind Us
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We're on a mission to revolutionize waste management through
            cutting-edge AI technology and computer vision.
          </motion.p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="relative h-[100px] w-full overflow-hidden">
                <VideoText src="https://cdn.magicui.design/ocean-small.webm">
                  VISION
                </VideoText>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                At Waste Vision, we believe that technology can transform how we
                manage waste globally. Our mission is to develop AI-powered
                solutions that make waste sorting, recycling, and management
                more efficient and effective.
              </p>
              <p className="text-lg text-muted-foreground">
                By combining computer vision, machine learning, and 3D
                reconstruction, we're creating tools that help waste management
                facilities, municipalities, and businesses reduce landfill
                usage, increase recycling rates, and move toward a more
                sustainable future.
              </p>
            </motion.div>

            <motion.div
              className="rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <TiltedCard
                imageSrc="/images/about-pic.jpg"
                altText="Waste Vision Demo"
                captionText="AI-Powered Waste Management"
                containerHeight="400px"
                containerWidth="100%"
                imageHeight="400px"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <p className="text-white text-center text-lg font-bold">
                    AI-Powered Waste Management
                  </p>
                }
              />
            </motion.div>
          </div>
        </div>
      </section>

     {/* Our Team */}
<section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-foreground mb-4">
        Meet Our Team
      </h2>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        Our diverse team of experts combines knowledge in AI, environmental science,
        and waste management to create innovative solutions.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {teamMembers.map((member, index) => (
        <motion.div
          key={index}
          className="bg-background rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 relative group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ rotateY: 5, rotateX: 5, scale: 1.03 }}
        >
          {/* Image with shine effect */}
          <div className="relative h-60 w-full overflow-hidden">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </div>

          {/* Info */}
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-foreground mb-1">
              {member.name}
            </h3>
            <p className="text-primary font-medium mb-2">{member.role}</p>
            <p className="text-muted-foreground text-sm">{member.bio}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>



      {/* Our Journey / Milestones */}
<section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-foreground mb-4">
        Our Journey
      </h2>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        From our founding to today, we've been committed to innovation and
        environmental impact.
      </p>
    </div>

    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>

      <div className="space-y-12">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            className={`relative flex items-center ${
              index % 2 === 0 ? "justify-start" : "justify-end"
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Card */}
            <div
              className={`w-5/12 ${
                index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
              }`}
            >
              <div className="bg-card p-6 rounded-xl shadow-lg border border-primary/30 hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {milestone.title}
                </h3>
                <p className="text-primary font-medium mb-2">
                  {milestone.phase}
                </p>
                <p className="text-muted-foreground">{milestone.description}</p>
              </div>
            </div>

            {/* Timeline Dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-background flex items-center justify-center text-white font-bold">
              {index + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</section>

     {/* Our Values */}
<section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary/5 to-background">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-foreground mb-4">
        Our Values
      </h2>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        The principles that guide our work and innovation.
      </p>
    </div>

    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: { 
          transition: { staggerChildren: 0.15 } // stagger cards
        }
      }}
    >
      {[
        { icon: "🌱", title: "Sustainability", desc: "We're committed to creating solutions that have a positive environmental impact and promote sustainable waste management practices." },
        { icon: "🔬", title: "Innovation", desc: "We continuously push the boundaries of what's possible with AI and computer vision to solve complex waste management challenges." },
        { icon: "🤝", title: "Collaboration", desc: "We believe in working together with waste management facilities, municipalities, and other stakeholders to create effective solutions." },
        { icon: "📊", title: "Data-Driven", desc: "We use data and analytics to continuously improve our solutions and provide actionable insights to our partners." },
        { icon: "🌍", title: "Global Impact", desc: "We aim to make our technology accessible globally, with a focus on regions facing the greatest waste management challenges." },
        { icon: "⚖️", title: "Integrity", desc: "We operate with transparency and honesty in all our partnerships and communications." },
      ].map((item, idx) => (
        <motion.div
          key={idx}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
          }}
        >
          <MagicCard 
            className="cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform duration-300 will-change-transform"
          >
            <motion.div 
              className="p-8 text-center"
              whileHover={{ rotateX: 5, rotateY: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="text-primary text-6xl mb-4 inline-block drop-shadow-xl"
                whileHover={{ rotateY: 180, scale: 1.3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          </MagicCard>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>



      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-3xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Want to learn more about Waste Vision?
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Contact us to discuss how our AI-powered waste management solutions
            can help your organization.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <a
              href="/get-started"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-800 transition-colors"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
