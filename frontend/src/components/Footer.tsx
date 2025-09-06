import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-background font-custom border-t py-12 px-8 mb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Image
              src="/images/logo_dark.png"
              alt="Waste Vision Logo"
              width={180}
              height={180}
              priority
              className="mb-4 cursor-pointer hidden dark:block"
            />

            <Image
              className="mb-4 cursor-pointer block dark:hidden"
              src="/images/logo_light.png"
              alt="Waste Vision Logo"
              width={180}
              height={180}
              priority
            />
            <p className="text-muted-foreground mt-2">
              AI-powered waste detection and management solutions for colleges
              and institutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/business-model"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Our Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/playground"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Try Playground
                </Link>
              </li>
              <li>
                <Link
                  href="/get-started"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                <span className="font-medium">Email:</span> info@wastevision.com
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium">Phone:</span> +1 (555) 123-4567
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium">Address:</span> 123 Innovation
                Drive, Tech City
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-lg border border-r-0 focus:outline-none focus:ring-1 focus:ring-primary w-full"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Waste Vision. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
