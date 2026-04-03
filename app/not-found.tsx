import React from 'react';
import Link from 'next/link';
import { FaHome, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full z-0 opacity-70">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[var(--primary)]/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[var(--primary)]/5 to-transparent"></div>
        <div className="absolute left-0 top-0 w-20 h-full bg-linear-to-r from-[var(--primary)]/5 to-transparent"></div>
        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-[var(--primary)]/5 to-transparent"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGI5ODEwNSIgZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0zaDF2NGgtMXYtNHptLTUgM2g0djFoLTR2LTF6bTAtM2gxdjRoLTF2LTR6bS01IDNoNHYxaC00di0xem0wLTNoMXY0aC0xdi00eiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
      </div>

      {/* Animated circles */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full border border-(--primary)/10 animate-[spin_100s_linear_infinite]"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full border border-[var(--primary)]/20 animate-[spin_80s_linear_infinite_reverse]"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="bg-background/90 backdrop-blur-md rounded-2xl shadow-2xl p-12 md:p-16 text-center relative overflow-hidden border border-(--primary)/10">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[var(--primary-light)]/5 rounded-full blur-3xl"></div>

            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center mb-6 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs tracking-wider">
                <span className="animate-pulse mr-2 w-2 h-2 rounded-full bg-primary"></span>
                ERROR 404
              </div>

              {/* 404 Icon */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative bg-linear-to-r from-[var(--primary)]/10 to-[var(--primary-light)]/10 rounded-full p-8">
                    <FaExclamationTriangle className="text-primary text-6xl" />
                  </div>
                </div>
              </div>

              {/* 404 Text */}
              <div className="mb-8">
                <h1 className="text-8xl md:text-9xl font-black mb-6 leading-tight">
                  <span className="bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
                    404
                  </span>
                </h1>
                
                <h2 className="text-3xl md:text-4xl font-bold text-(--text) mb-4">
                  Page Not Found
                </h2>
                
                <div className="w-24 h-1 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] mx-auto mb-6 rounded-full"></div>
                
                <p className="text-lg text-(--text)/70 mb-2 max-w-md mx-auto">
                  Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <p className="text-(--text)/60">
                  Let&apos;s get you back on track.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Link 
                  href="/"
                  className="group relative px-8 py-4 bg-primary text-white font-medium rounded-md hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all duration-300 overflow-hidden inline-flex items-center justify-center gap-2"
                >
                  <FaHome className="text-lg relative z-10" />
                  <span className="relative z-10">Back to Home</span>
                  <span className="absolute inset-0 w-0 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] group-hover:w-full transition-all duration-300"></span>
                </Link>
                
                <Link 
                  href="/dashboard"
                  className="group relative px-8 py-4 border-2 border-[var(--primary)] text-(--text) rounded-md hover:bg-primary/5 transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  <span>Go to Dashboard</span>
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {/* Decorative bouncing dots */}
              <div className="mt-12 flex justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce opacity-75" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce opacity-50" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>

          {/* Additional Help Text */}
          <div className="mt-8 text-center">
            <p className="text-(--text)/60 text-sm">
              Need help? Contact your system administrator or{' '}
              <Link href="/contact" className="text-primary hover:text-[var(--primary-light)] font-medium underline transition-colors">
                get in touch
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
