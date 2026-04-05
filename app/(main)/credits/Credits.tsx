import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaCode,
  FaBrain,
  FaLaptopCode,
  FaDatabase,
  FaPalette,
  FaUserShield,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiReact,
  SiPostgresql,
} from "react-icons/si";

export default function Credits() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[var(--primary-light)]/5 blur-3xl"></div>

        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs tracking-wider">
              <span className="animate-pulse mr-2 w-2 h-2 rounded-full bg-primary"></span>
              OUR TEAM
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-(--text)">
              The <span className="text-primary">Minds</span> Behind
              MetroSync
            </h1>
            <p className="text-lg md:text-xl text-(--text)/70 max-w-3xl mx-auto">
              Meet the talented team of developers and designers who brought
              MetroSync to life. A project for Metropolitan University
              Bangladesh, Department of Computer Science and Engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Team Member 1 */}
            <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-lg p-8 relative overflow-hidden border border-(--primary)/10 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-300"></div>

              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-[var(--primary)]/20 to-[var(--primary-light)]/20 mb-6 flex items-center justify-center text-primary text-3xl font-bold">
                  N
                </div>

                <h3 className="text-xl font-bold text-(--text)">
                  Nahidul Islam Rony
                </h3>
                <p className="text-primary font-medium mb-3">
                  Backend Developer
                </p>
                <p className="text-(--text)/70 mb-4">
                  ID: 231-115-069
                </p>

                <div className="border-t border-(--primary)/10 pt-4 mt-4">
                  <div className="flex gap-3">
                    <a
                      href="https://github.com/niRony02"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <FaGithub className="text-lg" />
                    </a>
                    <a
                      href="https://bd.linkedin.com/in/nahidul-islam-rony-363792266"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <FaLinkedin className="text-lg" />
                    </a>
                    <a
                      href="mailto:nirony2002@gmail.com"
                      className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <FaEnvelope className="text-lg" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-lg p-8 relative overflow-hidden border border-(--primary)/10 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-300"></div>

              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-[var(--primary)]/20 to-[var(--primary-light)]/20 mb-6 flex items-center justify-center text-primary text-3xl font-bold">
                  A
                </div>

                <h3 className="text-xl font-bold text-(--text)">
                  Abu Ubayda
                </h3>
                <p className="text-primary font-medium mb-3">
                  Frontend Developer
                </p>
                <p className="text-(--text)/70 mb-4">
                  ID: 231-115-080
                </p>

                <div className="border-t border-(--primary)/10 pt-4 mt-4">
                  <div className="flex gap-3">
                    <a
                      href="https://github.com/ubaydafox"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <FaGithub className="text-lg" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/abu-ubayda-131bb3190"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <FaLinkedin className="text-lg" />
                    </a>
                    <a
                      href="ubaydaazad@gmail.com"
                      className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <FaEnvelope className="text-lg" />
                    </a>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 relative bg-[var(--background-light)]/70">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs tracking-wider">
              POWERED BY
            </div>
            <h2 className="text-4xl font-bold mb-6 text-(--text)">
              Our <span className="text-primary">Technology</span>{" "}
              Stack
            </h2>
            <p className="text-lg text-(--text)/70 max-w-3xl mx-auto">
              Built with modern, powerful technologies to ensure performance,
              scalability, and an exceptional user experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Tech 1 */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 text-center relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-300"></div>
              <div className="relative flex flex-col items-center">
                <SiNextdotjs className="text-4xl text-(--text) mb-3" />
                <h3 className="font-medium text-(--text)">Next.js</h3>
                <p className="text-xs text-(--text)/60 mt-1">App Router</p>
              </div>
            </div>

            {/* Tech 2 */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 text-center relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-300"></div>
              <div className="relative flex flex-col items-center">
                <SiTypescript className="text-4xl text-[#3178c6] mb-3" />
                <h3 className="font-medium text-(--text)">TypeScript</h3>
                <p className="text-xs text-(--text)/60 mt-1">
                  Type Safety
                </p>
              </div>
            </div>

            {/* Tech 3 */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 text-center relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-300"></div>
              <div className="relative flex flex-col items-center">
                <SiTailwindcss className="text-4xl text-[#06b6d4] mb-3" />
                <h3 className="font-medium text-(--text)">Tailwind</h3>
                <p className="text-xs text-(--text)/60 mt-1">
                  UI Framework
                </p>
              </div>
            </div>

            {/* Tech 4 */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 text-center relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-300"></div>
              <div className="relative flex flex-col items-center">
                <SiReact className="text-4xl text-[#61dafb] mb-3" />
                <h3 className="font-medium text-(--text)">React</h3>
                <p className="text-xs text-(--text)/60 mt-1">UI Library</p>
              </div>
            </div>

            {/* Tech 5 */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 text-center relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-300"></div>
              <div className="relative flex flex-col items-center">
                <SiPostgresql className="text-4xl text-[#336791] mb-3" />
                <h3 className="font-medium text-(--text)">Django</h3>
                <p className="text-xs text-(--text)/60 mt-1">
                  Backend Framework
                </p>
              </div>
            </div>

            {/* Tech 6 */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 text-center relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-300"></div>
              <div className="relative flex flex-col items-center">
                <FaDatabase className="text-4xl text-[#00758f] mb-3" />
                <h3 className="font-medium text-(--text)">MySQL</h3>
                <p className="text-xs text-(--text)/60 mt-1">Database</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs tracking-wider">
              KEY FEATURES
            </div>
            <h2 className="text-4xl font-bold mb-6 text-(--text)">
              Built with{" "}
              <span className="text-primary">Innovation</span> in Mind
            </h2>
            <p className="text-lg text-(--text)/70 max-w-3xl mx-auto">
              MetroSync combines cutting-edge technology with thoughtful design to
              create a seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
              <div className="relative">
                <div className="mb-6 p-3 inline-block rounded-xl bg-primary/10">
                  <FaLaptopCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-(--text)">
                  Role-Based Access
                </h3>
                <p className="text-(--text)/70">
                  Tailored dashboards and permissions for students, teachers,
                  and administrators to ensure the right tools for each role.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
              <div className="relative">
                <div className="mb-6 p-3 inline-block rounded-xl bg-primary/10">
                  <FaCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-(--text)">
                  Modern Framework
                </h3>
                <p className="text-(--text)/70">
                  Built with Next.js and TypeScript for optimized performance,
                  SEO benefits, and a responsive user interface.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
              <div className="relative">
                <div className="mb-6 p-3 inline-block rounded-xl bg-primary/10">
                  <FaUserShield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-(--text)">
                  Secure Authentication
                </h3>
                <p className="text-(--text)/70">
                  Robust authentication system with password reset, session
                  management, and protection against common vulnerabilities.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
              <div className="relative">
                <div className="mb-6 p-3 inline-block rounded-xl bg-primary/10">
                  <FaDatabase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-(--text)">
                  Data Export
                </h3>
                <p className="text-(--text)/70">
                  Export schedules, reports, and other important information in
                  CSV format for easy sharing and analysis.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
              <div className="relative">
                <div className="mb-6 p-3 inline-block rounded-xl bg-primary/10">
                  <FaPalette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-(--text)">
                  Modern UI Design
                </h3>
                <p className="text-(--text)/70">
                  Sleek, intuitive interface with a focus on user experience,
                  featuring responsive layouts and beautiful visualizations.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
              <div className="relative">
                <div className="mb-6 p-3 inline-block rounded-xl bg-primary/10">
                  <FaBrain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-(--text)">
                  Smart Scheduling
                </h3>
                <p className="text-(--text)/70">
                  Intelligent scheduling system that optimizes timetables for
                  students and teachers while avoiding conflicts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acknowledgments */}
      <section className="py-16 bg-[var(--background-light)]/50 relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs tracking-wider">
              ACKNOWLEDGMENTS
            </div>
            <h2 className="text-3xl font-bold mb-6 text-(--text)">
              Special Thanks
            </h2>
          </div>

          <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-md p-8 relative overflow-hidden border border-(--primary)/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

            <div className="relative">
              <p className="text-(--text)/80 mb-6">
                We would like to express our sincere gratitude to our teacher,{" "}
                <span className="font-semibold text-primary">Abdul Wadud Shakib</span>,{" "}
                for his continuous guidance, mentorship, and support throughout the development of this project.
              </p>

              <div className="py-4 px-6 bg-primary/5 rounded-xl inline-block">
                <h3 className="text-lg font-semibold text-(--text) mb-1">
                  PROJECT 300
                </h3>
                <p className="text-primary">Spring 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
