"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  // Animation states for staggered reveal
  const [loaded, setLoaded] = useState(false);

  // Pre-compute stable particle positions (Math.random can't be called in render)
  const [particles, setParticles] = useState<Array<{width: number; height: number; top: number; left: number; animationDuration: number; animationDelay: number}>>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      setParticles(
        [...Array(20)].map(() => ({
          width: Math.random() * 6 + 2,
          height: Math.random() * 6 + 2,
          top: Math.random() * 100,
          left: Math.random() * 100,
          animationDuration: Math.random() * 8 + 2,
          animationDelay: Math.random() * 5,
        }))
      );
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative bg-[var(--background)] overflow-hidden">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full z-0 opacity-70">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[var(--primary)]/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[var(--primary)]/5 to-transparent"></div>
        <div className="absolute left-0 top-0 w-20 h-full bg-linear-to-r from-[var(--primary)]/5 to-transparent"></div>
        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-[var(--primary)]/5 to-transparent"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGI5ODEwNSIgZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0zaDF2NGgtMXYtNHptLTUgM2g0djFoLTR2LTF6bTAtM2gxdjRoLTF2LTR6bS01IDNoNHYxaC00di0xem0wLTNoMXY0aC0xdi00eiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Animated circles */}
        <div className="absolute w-[800px] h-[800px] rounded-full border border-(--primary)/10 animate-[spin_100s_linear_infinite]"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full border border-[var(--primary)]/20 animate-[spin_80s_linear_infinite_reverse]"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full border border-[var(--primary)]/30 animate-[spin_60s_linear_infinite]"></div>

        {/* Particle effect (simulated with fixed dots) */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute bg-primary rounded-full opacity-30 animate-pulse"
              style={{
                width: p.width + "px",
                height: p.height + "px",
                top: p.top + "%",
                left: p.left + "%",
                animationDuration: p.animationDuration + "s",
                animationDelay: p.animationDelay + "s",
              }}
            ></div>
          ))}
        </div>

        {/* Center hero content with staggered animation */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
          <div
            className={`w-full md:w-1/2 transition-all duration-1000 transform ${
              loaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
            }`}
          >
            <div className="mb-8 relative">
              {/* Futuristic badge */}
              <div className="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs tracking-wider">
                <span className="animate-pulse mr-2 w-2 h-2 rounded-full bg-primary"></span>
                NEXT-GEN ACADEMIC PLATFORM
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <div className="overflow-hidden">
                  <span className="bg-clip-text text-transparent bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] inline-block">
                    Metro<span className="text-(--text)">Sync</span>
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="inline-block text-3xl md:text-4xl text-(--text) mt-2">
                    Metrocation Reimagined
                  </span>
                </div>
              </h1>

              <p className="text-xl text-(--text)/80 max-w-lg relative pl-4 mb-8">
                <span className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[var(--primary)] to-[var(--primary-light)]"></span>
                Streamlining academic collaboration with cutting-edge technology
                for students, teachers, and administrators.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="group relative px-8 py-3 bg-primary text-white font-medium rounded-md hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <span className="absolute inset-0 w-0 bg-linear-to-r from-[var(--primary-light)] to-[var(--primary)] group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  href="/about"
                  className="relative px-8 py-3 border border-[var(--primary)] text-(--text) rounded-md hover:bg-primary/5 transition-all duration-300 flex items-center gap-2"
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* 3D-like UI mockup */}
          <div
            className={`w-full md:w-1/2 mt-16 md:mt-0 transition-all duration-1000 delay-300 transform ${
              loaded ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
            }`}
          >
            <div className="relative">
              {/* Main dashboard mockup */}
              <div className="w-full h-[400px] bg-background rounded-xl shadow-2xl overflow-hidden border border-(--primary)/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="h-10 bg-[var(--background-light)] border-b flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-primary/20 rounded-full"></div>
                    <div className="w-3 h-3 bg-primary/40 rounded-full"></div>
                    <div className="w-3 h-3 bg-primary/60 rounded-full"></div>
                  </div>
                  <div className="mx-auto text-xs text-(--text)/60">
                    MetroSync Dashboard
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex gap-4 mb-4">
                    <div className="w-1/3 h-24 bg-[var(--background-light)]/50 rounded-md animate-pulse"></div>
                    <div className="w-2/3 h-24 bg-[var(--background-light)]/30 rounded-md"></div>
                  </div>
                  <div className="h-40 bg-[var(--background-light)]/20 rounded-md mb-4"></div>
                  <div className="flex gap-2">
                    <div className="w-1/4 h-16 bg-primary/10 rounded-md"></div>
                    <div className="w-1/4 h-16 bg-primary/15 rounded-md"></div>
                    <div className="w-1/4 h-16 bg-primary/20 rounded-md"></div>
                    <div className="w-1/4 h-16 bg-primary/25 rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-[var(--primary-light)]/10 rounded-full blur-3xl"></div>

              {/* Floating notification */}
              <div className="absolute top-40 -right-10 bg-background p-3 rounded-lg shadow-lg border border-[var(--primary)]/20 w-64 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-(--text)">
                      New assignment posted
                    </h4>
                    <p className="text-xs text-(--text)/60">
                      Due in 3 days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-[var(--primary)]/30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 w-full relative">
        <div className="absolute inset-0 bg-[var(--background-light)]/80 z-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30 z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs tracking-wider">
              <span className="animate-pulse mr-2 w-2 h-2 rounded-full bg-primary"></span>
              MODULAR PLATFORM
            </div>

            <h2 className="text-4xl font-bold mb-6 text-(--text)">
              Features Built For{" "}
              <span className="text-primary">The Future</span>
            </h2>

            <div className="w-24 h-1 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] mx-auto mb-8 rounded-full"></div>

            <p className="max-w-2xl mx-auto text-(--text)/70 text-lg">
              Our platform adapts to every role in the academic ecosystem with
              specialized features tailored to each user&apos;s needs.
            </p>
          </div>

          {/* Hexagon grid layout */}
          <div className="flex flex-wrap justify-center gap-6">
            {/* Student Feature */}
            <div className="group w-full md:w-[340px] p-1 relative transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-br from-[var(--primary)] to-[var(--primary-light)] opacity-30 blur-xl group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-background/95 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-(--primary)/10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
                <div className="p-8 relative">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white shadow-lg group-hover:shadow-[var(--primary)]/30 transition-all duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div className="bg-primary/10 h-px grow ml-4"></div>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-(--text) group-hover:text-primary transition-colors">
                    For Students
                  </h3>

                  <ul className="space-y-3 mt-4 text-(--text)/80">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">◆</span>
                      Personalized schedule dashboard
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">◆</span>
                      Task tracker with deadline alerts
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">◆</span>
                      Instant course notifications
                    </li>
                  </ul>

                  <div className="mt-8 pt-4 border-t border-(--primary)/10">
                    <Link
                      href="/about"
                      className="text-sm font-medium text-primary flex items-center"
                    >
                      Learn more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>

                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-linear-to-br from-[var(--primary)]/10 to-transparent rounded-full blur-lg"></div>
                </div>
              </div>
            </div>

            {/* Teacher Feature */}
            <div className="group w-full md:w-[340px] p-1 relative transition-all duration-500 hover:scale-105 mt-10 md:mt-0">
              <div className="absolute inset-0 bg-linear-to-br from-[var(--primary)] to-[var(--primary-light)] opacity-30 blur-xl group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-background/95 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-(--primary)/10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
                <div className="p-8 relative">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white shadow-lg group-hover:shadow-[var(--primary)]/30 transition-all duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div className="bg-primary/10 h-px grow ml-4"></div>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-(--text) group-hover:text-primary transition-colors">
                    For Teachers
                  </h3>

                  <ul className="space-y-3 mt-4 text-(--text)/80">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">◆</span>
                      Course material organization
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">◆</span>
                      Class scheduling and notifications
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">◆</span>
                      Student progress analytics
                    </li>
                  </ul>

                  <div className="mt-8 pt-4 border-t border-(--primary)/10">
                    <Link
                      href="/about"
                      className="text-sm font-medium text-primary flex items-center"
                    >
                      Learn more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>

                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-linear-to-br from-[var(--primary)]/10 to-transparent rounded-full blur-lg"></div>
                </div>
              </div>
            </div>

            {/* HOD Feature */}
            <div className="group w-full md:w-[340px] p-1 relative transition-all duration-500 hover:scale-105 mt-10 md:mt-0">
              <div className="absolute inset-0 bg-linear-to-br from-[var(--primary)] to-[var(--primary-light)] opacity-30 blur-xl group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-background/95 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-(--primary)/10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
                <div className="p-8 relative">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white shadow-lg group-hover:shadow-[var(--primary)]/30 transition-all duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="bg-primary/10 h-px grow ml-4"></div>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-(--text) group-hover:text-primary transition-colors">
                    For Department Heads
                  </h3>

                  <ul className="space-y-3 mt-4 text-(--text)/80">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">◆</span>
                      Department-wide scheduling
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">◆</span>
                      Faculty management
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">◆</span>
                      Performance data & reporting
                    </li>
                  </ul>

                  <div className="mt-8 pt-4 border-t border-(--primary)/10">
                    <Link
                      href="/about"
                      className="text-sm font-medium text-primary flex items-center"
                    >
                      Learn more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>

                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-linear-to-br from-[var(--primary)]/10 to-transparent rounded-full blur-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-36 w-full relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[var(--background)] z-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10 z-0"></div>

        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[var(--primary)]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[var(--primary)]/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs tracking-wider">
              <span className="animate-pulse mr-2 w-2 h-2 rounded-full bg-primary"></span>
              PLATFORM ADVANTAGES
            </div>

            <h2 className="text-4xl font-bold mb-4 text-(--text)">
              Why Choose <span className="text-primary">MetroSync</span>?
            </h2>

            <div className="w-24 h-1 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] mx-auto mb-8 rounded-full"></div>

            <p className="max-w-2xl mx-auto text-(--text)/70 text-lg">
              Our innovative platform brings unparalleled advantages to academic
              institutions
            </p>
          </div>

          <div className="relative">
            {/* Central connector */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--primary)]/0 via-[var(--primary)]/30 to-[var(--primary)]/0 hidden lg:block"></div>

            {/* Timeline-style benefits layout */}
            <div className="space-y-24">
              {/* Benefit 1 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0 lg:text-right order-2 lg:order-1">
                  <div className="p-1 relative group transition-all">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-[var(--primary-light)] opacity-20 blur-xl group-hover:opacity-30 rounded-xl transition-opacity"></div>
                    <div className="bg-background/95 rounded-xl p-8 shadow-lg relative">
                      <h3 className="text-2xl font-bold text-(--text) mb-4 group-hover:text-primary transition-colors duration-300">
                        Centralized Communication
                      </h3>
                      <p className="text-(--text)/80">
                        Break down communication barriers with our unified
                        platform that connects students, teachers, and
                        administrators in real-time.
                      </p>
                      <div className="mt-6 flex items-center justify-end gap-3">
                        <span className="h-px w-12 bg-linear-to-r from-transparent to-[var(--primary)]/40"></span>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex flex-col items-center justify-center z-10 order-2">
                  <div className="w-12 h-12 rounded-full bg-background shadow-xl border-4 border-[var(--primary)]/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                  </div>
                </div>

                <div className="lg:w-1/2 lg:pl-12 order-1 lg:order-3">
                  <div className="aspect-video bg-background/90 rounded-xl shadow-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Mockup of communication interface */}
                      <div className="w-4/5 h-4/5 bg-background rounded-lg shadow-lg flex flex-col border border-(--primary)/10">
                        <div className="h-8 bg-primary/10 flex items-center px-4 border-b border-(--primary)/10">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                            <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                            <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                          </div>
                          <div className="mx-auto text-xs text-(--text)/60">
                            MetroSync Messages
                          </div>
                        </div>
                        <div className="flex-1 p-4 flex flex-col space-y-2">
                          <div className="w-3/4 h-6 bg-[var(--background-light)]/80 rounded"></div>
                          <div className="w-2/3 h-6 bg-[var(--background-light)]/60 rounded"></div>
                          <div className="w-full h-px bg-primary/5 my-1"></div>
                          <div className="w-3/4 h-6 ml-auto bg-primary/10 rounded"></div>
                          <div className="w-1/2 h-6 ml-auto bg-primary/20 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0 order-2 lg:order-1">
                  <div className="aspect-video bg-background/90 rounded-xl shadow-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Mockup of task management */}
                      <div className="w-4/5 h-4/5 bg-background rounded-lg shadow-lg flex flex-col border border-(--primary)/10">
                        <div className="h-8 bg-primary/10 flex items-center px-4 border-b border-(--primary)/10">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                            <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                            <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                          </div>
                          <div className="mx-auto text-xs text-(--text)/60">
                            Task Timeline
                          </div>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="w-full h-4 bg-[var(--background-light)]/50 rounded-full mb-3">
                            <div
                              className="h-4 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full"
                              style={{ width: "65%" }}
                            ></div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-primary/20 rounded-full mr-2"></div>
                              <div className="w-3/4 h-4 bg-[var(--background-light)]/40 rounded"></div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-primary/30 rounded-full mr-2"></div>
                              <div className="w-2/3 h-4 bg-[var(--background-light)]/40 rounded"></div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-primary/40 rounded-full mr-2"></div>
                              <div className="w-1/2 h-4 bg-[var(--background-light)]/40 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex flex-col items-center justify-center z-10 order-2">
                  <div className="w-12 h-12 rounded-full bg-background shadow-xl border-4 border-[var(--primary)]/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                  </div>
                </div>

                <div className="lg:w-1/2 lg:pl-12 lg:text-left order-1 lg:order-3">
                  <div className="p-1 relative group transition-all">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-[var(--primary-light)] opacity-20 blur-xl group-hover:opacity-30 rounded-xl transition-opacity"></div>
                    <div className="bg-background/95 rounded-xl p-8 shadow-lg relative">
                      <h3 className="text-2xl font-bold text-(--text) mb-4 group-hover:text-primary transition-colors duration-300">
                        Task Management
                      </h3>
                      <p className="text-(--text)/80">
                        Our intelligent task tracking system helps students,
                        teachers and administrators stay on top of deadlines
                        with smart reminders and visual progress tracking.
                      </p>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="h-px w-12 bg-linear-to-r from-[var(--primary)]/40 to-transparent"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background-light)]/50 to-[var(--background)] z-0"></div>

        {/* Futuristic elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div
            className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse"
            style={{ animationDuration: "15s" }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[var(--primary-light)]/10 blur-3xl animate-pulse"
            style={{ animationDuration: "20s" }}
          ></div>
        </div>

        <div className="absolute w-full h-full overflow-hidden">
          {/* Circuit board pattern - simulated with dots and lines */}
          <svg
            className="absolute top-0 left-0 w-full h-full opacity-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 800"
          >
            <g
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.2"
              fill="none"
              strokeLinecap="round"
            >
              <path
                d="M 100,100 L 700,100"
                className="text-primary"
              ></path>
              <path
                d="M 100,300 L 700,300"
                className="text-primary"
              ></path>
              <path
                d="M 100,500 L 700,500"
                className="text-primary"
              ></path>
              <path
                d="M 100,700 L 700,700"
                className="text-primary"
              ></path>
              <path
                d="M 100,100 L 100,700"
                className="text-primary"
              ></path>
              <path
                d="M 300,100 L 300,700"
                className="text-primary"
              ></path>
              <path
                d="M 500,100 L 500,700"
                className="text-primary"
              ></path>
              <path
                d="M 700,100 L 700,700"
                className="text-primary"
              ></path>
              <circle
                cx="100"
                cy="100"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="100"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="100"
                cy="500"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="100"
                cy="700"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="300"
                cy="100"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="300"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="300"
                cy="500"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="300"
                cy="700"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="500"
                cy="100"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="500"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="500"
                cy="500"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="500"
                cy="700"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="700"
                cy="100"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="700"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="700"
                cy="500"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
              <circle
                cx="700"
                cy="700"
                r="4"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
              ></circle>
            </g>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="bg-background/90 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--primary-light)]/5 rounded-full blur-2xl"></div>

            <div className="relative">
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
                <div className="lg:w-1/2">
                  <div className="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs tracking-wider">
                    <span className="animate-pulse mr-2 w-2 h-2 rounded-full bg-primary"></span>
                    GET STARTED TODAY
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-(--text)">
                    Ready to{" "}
                    <span className="text-primary">Transform</span>{" "}
                    Your Academic Experience?
                  </h2>

                  <p className="text-lg mb-8 text-(--text)/80 max-w-xl">
                    Join MetroSync today and experience a futuristic approach to
                    academic collaboration powered by cutting-edge technology.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/contact"
                      className="group relative px-8 py-4 bg-primary text-white font-medium rounded-md hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all duration-300 overflow-hidden inline-flex items-center gap-2"
                    >
                      <span className="relative z-10">Contact Us</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="absolute inset-0 w-0 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] group-hover:w-full transition-all duration-300"></span>
                    </Link>

                    <Link
                      href="/about"
                      className="px-8 py-4 border border-[var(--primary)] text-(--text) rounded-md hover:bg-primary/5 transition-all duration-300 inline-flex items-center gap-2 group"
                    >
                      <span>Learn More</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  {/* Floating device mockups */}
                  <div className="relative h-80 w-full">
                    {/* Desktop */}
                    <div className="absolute top-0 right-0 w-3/4 h-48 bg-background rounded-lg shadow-xl border border-(--primary)/10 transform rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
                      <div className="h-3 bg-[var(--background-light)]/50 rounded-t-lg flex items-center px-2">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 rounded-full bg-primary/20"></div>
                          <div className="w-1 h-1 rounded-full bg-primary/30"></div>
                          <div className="w-1 h-1 rounded-full bg-primary/40"></div>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="h-6 bg-[var(--background-light)]/30 rounded-sm mb-2"></div>
                        <div className="flex gap-1 mb-2">
                          <div className="w-1/3 h-12 bg-primary/10 rounded-sm"></div>
                          <div className="w-1/3 h-12 bg-primary/15 rounded-sm"></div>
                          <div className="w-1/3 h-12 bg-primary/20 rounded-sm"></div>
                        </div>
                        <div className="h-20 bg-[var(--background-light)]/20 rounded-sm"></div>
                      </div>
                    </div>

                    {/* Tablet */}
                    <div className="absolute bottom-0 left-0 w-1/2 h-64 bg-background rounded-lg shadow-xl border border-(--primary)/10 transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-10">
                      <div className="h-3 bg-[var(--background-light)]/50 rounded-t-lg flex items-center justify-center">
                        <div className="w-8 h-1 rounded-full bg-primary/20"></div>
                      </div>
                      <div className="p-3">
                        <div className="h-8 bg-primary/10 rounded-md mb-2"></div>
                        <div className="h-40 bg-[var(--background-light)]/30 rounded-md"></div>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="absolute bottom-10 right-16 w-24 h-40 bg-background rounded-lg shadow-xl border border-(--primary)/10 transform rotate-12 hover:rotate-0 transition-transform duration-500 z-30">
                      <div className="h-2 bg-[var(--background-light)]/50 rounded-t-lg"></div>
                      <div className="p-1">
                        <div className="h-3 w-12 mx-auto bg-primary/30 rounded-sm mb-1"></div>
                        <div className="h-32 bg-[var(--background-light)]/20 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
