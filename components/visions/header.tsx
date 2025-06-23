import { MotionDiv } from "./motion-div";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">LevantLogix</span>
            </Link>
          </MotionDiv>

          <nav className="hidden md:flex items-center gap-8">
            <MotionDiv
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Link href="/services" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Services
              </Link>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Link href="/visions" className="text-blue-600 font-medium">
                Our Vision
              </Link>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Contact
              </Link>
            </MotionDiv>
          </nav>

          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block"
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all font-medium">
              Get Started
            </button>
          </MotionDiv>
        </div>
      </div>
    </header>
  );
}