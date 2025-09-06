"use client";
import CircularText from "@/components/CircularText";
import FadeContent from "@/components/FadeContent";
import GradualBlurMemo from "@/components/GradualBlur";
import MaksedDivCard from "@/components/MaskedDiv";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import TiltedCard from "@/components/TiltedCard";
import { TextScroll } from "@/components/ui/text-scroll";
import { CardCarousel } from "@/components/ui/card-carousel";
import FlowingMenu from "@/components/FlowingMenu";
import localFont from "next/font/local";
import { useRef } from "react";
// Import the custom font directly in this component
const customFont = localFont({
  src: [
    {
      path: "../fonts/Syncopate-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Syncopate-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-custom-local",
  display: "swap",
});

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // restart if already playing
      audioRef.current.play();
    }
  };
  const images = [
    { src: "/cards/1.png", alt: "Image 1" },
    { src: "/cards/2.webp", alt: "Image 2" },
    { src: "/cards/3.webp", alt: "Image 3" },
    { src: "/cards/1.webp", alt: "Image 1" },
    { src: "/cards/2.webp", alt: "Image 2" },
    { src: "/cards/3.webp", alt: "Image 3" },
  ];
  const demoItems = [
    {
      link: "#",
      text: "Mojave",
      image: "https://picsum.photos/600/400?random=1",
    },
    {
      link: "#",
      text: "Sonoma",
      image: "https://picsum.photos/600/400?random=2",
    },
    {
      link: "#",
      text: "Monterey",
      image: "https://picsum.photos/600/400?random=3",
    },
    {
      link: "#",
      text: "Sequoia",
      image: "https://picsum.photos/600/400?random=4",
    },
  ];
  return (
    <>
      <section className="relative flex flex-col min-h-screen w-full">
        {/* Navbar */}
        <Navbar />
        {/* Hero Section */}
        <FadeContent blur duration={1000} easing="ease-out" initialOpacity={0}>
          <div className="relative h-screen w-full ">
            {/* Background Mask */}
            <div className="absolute inset-0 bg-black/10 dark:bg-black/20 z-[5] transition-colors duration-300" />
            <MaksedDivCard />
            {/* Hero Content */}
            <div className="absolute font-custom inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                Detect. Measure. Manage Waste Smarter.
              </h1>
              <p className="text-lg font-custom font-bold md:text-xl mb-10 max-w-6xl text-gray-700 dark:text-gray-300 transition-colors duration-300">
                BHai behen ka dola mela tadham tadham bola
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/dashboard"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg transition-all"
                >
                  Our Dashboard
                </a>
                <a
                  href="/signup"
                  className="bg-secondary hover:bg-secondary/90 text-black font-semibold py-3 px-8 rounded-lg transition-all"
                >
                  Get Started
                </a>
              </div>
            </div>
            {/* //megaphone */}
            <div
              className="absolute left-12 bottom-0 z-20 animate-float cursor-pointer group"
              onClick={playSound}
            >
              {/* Mic image */}
              <Image
                className="rotate-x-12"
                src="/images/model.png"
                alt="Mic"
                width={400}
                height={400}
                priority
              />

              {/* Tooltip */}
              <span
                className="
          absolute -top-8 left-1/2 -translate-x-1/2
          opacity-0 group-hover:opacity-100
          bg-black/40 text-white text-sm px-2 py-1 rounded-md
          transition-opacity duration-300 whitespace-nowrap
        "
              >
                Touch me 😏
              </span>

              {/* Horn Sound */}
              <audio ref={audioRef} src="/sounds/horn.mp3" />
            </div>
            {/* Circular Text */}
            <div className="absolute left-[32vw] bottom-2 z-20">
              <CircularText
                text="YOUR*WASTE*VISION*"
                onHover="goBonkers"
                spinDuration={20}
                className="text-gray-900 font-custom dark:text-gray-100 transition-colors duration-300"
              />
            </div>
            <div className="mt-15 ">
              <TextScroll
                className="font-display font-custom text-center text-4xl font-semibold tracking-tighter  text-black dark:text-white md:text-7xl md:leading-[5rem]"
                text="WASTE VISION  "
                default_velocity={5}
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="relative font-custom mt-40 w-full min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto flex gap-16 items-center px-6 ">
              {/* Left Side */}

              <div className="space-y-6  ">
                <h2 className="text-3xl  md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                  Smarter Waste Detection, Cleaner Future
                </h2>

                <p className="text-lg  text-gray-700 dark:text-gray-300 leading-relaxed">
                  Our AI-powered waste detection system goes beyond simple
                  object recognition. By combining{" "}
                  <span className="font-semibold">2D detection</span> with{" "}
                  <span className="font-semibold">3D waste approximation</span>,
                  we deliver insights that help institutions and communities
                  make smarter, data-driven decisions for a cleaner tomorrow.
                </p>
                <ul className="space-y-3 text-gray-800 dark:text-gray-200">
                  <li>✔️ Real-time waste detection from drone footage</li>
                  <li>✔️ Automatic classification: Small, Medium, Large</li>
                  <li>✔️ 3D estimation of waste area & volume</li>
                  <li>
                    ✔️ Actionable analytics for campus & community cleaning
                  </li>
                </ul>
              </div>
              {/* Right Side */}
              <div className="flex justify-center">
                <TiltedCard
                  imageSrc="/images/card.jpg"
                  altText="amader valaobashar waste detection system"
                  captionText="Hey Gour Da Look At Me"
                  containerHeight="400px"
                  containerWidth="400px"
                  imageHeight="400px"
                  imageWidth="400px"
                  rotateAmplitude={12}
                  scaleOnHover={1}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="tilted-card-demo-text">
                      Hey Gour Da Look At Me
                    </p>
                  }
                />
              </div>
            </div>
          </div>
          <div className="relative font-custom mb-10">
            <CardCarousel
              images={images}
              autoplayDelay={2000}
              showPagination={true}
              showNavigation={true}
            />
          </div>
          <div className="relative font-custom py-13 h-[70vh] z-12">
            <FlowingMenu items={demoItems} />
          </div>
        </FadeContent>

        {/* Bottom Blur + Footer */}
        <GradualBlurMemo
          target="page"
          position="bottom"
          height="6rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential
          opacity={1}
        />
        <Footer />
      </section>
    </>
  );
}
