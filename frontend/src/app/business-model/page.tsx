import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeToggleButton from '@/components/ui/theme-toggle-button';

export default function BusinessModel() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="py-5 px-10 flex items-center justify-between w-full gap-5 border-b">
        <div className="flex items-center gap-5">
          <div className="mt-5">
            <ThemeToggleButton />
          </div>
          <Image
            className="cursor-pointer"
            src="/images/logo_dark.png"
            alt="Site Logo"
            width={180}
            height={180}
          />
        </div>
        <div className="flex items-center gap-5">
          <Navbar />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-secondary/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Waste Management Solutions</h1>
            <p className="text-xl max-w-3xl mx-auto text-muted-foreground">
              Leveraging cutting-edge AI and 3D reconstruction technology to revolutionize waste management for educational institutions.
            </p>
          </div>
        </section>

        {/* YOLOv8 Waste Detection Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">YOLOv8 Waste Detection System</h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Our state-of-the-art waste detection system utilizes YOLOv8, the latest in real-time object detection technology, to identify and classify various types of waste with exceptional accuracy.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-4 bg-primary/10 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Real-time Detection</h3>
                      <p className="text-muted-foreground">Instantly identify and classify waste materials from images or video feeds.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 bg-primary/10 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Multi-class Classification</h3>
                      <p className="text-muted-foreground">Distinguish between recyclables, organic waste, e-waste, and more with high precision.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 bg-primary/10 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Waste Analytics</h3>
                      <p className="text-muted-foreground">Generate detailed reports on waste composition, trends, and hotspots across your campus.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-muted rounded-lg p-6 h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">YOLOv8 Detection Visualization</p>
                  <div className="w-full h-[300px] bg-background/50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">AI Detection Image Placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3D Reconstruction Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-background rounded-lg p-6 h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">3D Waste Volume Estimation</p>
                  <div className="w-full h-[300px] bg-muted/50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">3D Model Visualization Placeholder</p>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-6">3D Waste Volume Reconstruction</h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Our advanced 3D reconstruction technology transforms 2D waste images into accurate volumetric models, enabling precise measurement and management of waste accumulation.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-4 bg-primary/10 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Accurate Volume Estimation</h3>
                      <p className="text-muted-foreground">Calculate precise waste volumes to optimize collection schedules and resource allocation.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 bg-primary/10 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">3D Visualization</h3>
                      <p className="text-muted-foreground">Interactive 3D models allow for comprehensive analysis and planning of waste management strategies.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 bg-primary/10 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Trend Analysis</h3>
                      <p className="text-muted-foreground">Track waste volume changes over time to identify patterns and implement targeted reduction strategies.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Benefits for Educational Institutions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Cost Reduction</h3>
                <p className="text-muted-foreground">
                  Optimize waste collection schedules and resource allocation, reducing operational costs by up to 30%.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M18 8a6 6 0 0 0-9.33-5"/><path d="m10 2 1 5-5 1"/><path d="M6 16a6 6 0 0 0 9.33 5"/><path d="m14 22-1-5 5-1"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Sustainability Goals</h3>
                <p className="text-muted-foreground">
                  Meet and exceed sustainability targets with data-driven waste reduction strategies and improved recycling rates.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Educational Value</h3>
                <p className="text-muted-foreground">
                  Engage students in sustainability initiatives with real-world data and visualizations of campus waste management.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Campus Waste Management?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-muted-foreground">
              Join leading educational institutions that are already benefiting from our AI-powered waste detection and 3D reconstruction technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/playground" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all">
                Try Playground
              </a>
              <a href="/get-started" className="bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-8 rounded-lg transition-all">
                Get Started
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}