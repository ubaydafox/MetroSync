import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function About() {
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
              ABOUT US
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-(--text)">
              We&apos;re Building the <span className="text-primary">Future</span><br />of Academic Collaboration
            </h1>
            <p className="text-lg md:text-xl text-(--text)/70 max-w-3xl mx-auto">
              MetroSync is transforming how educational institutions manage academic activities,
              empowering students, teachers, and administrators with cutting-edge technology.
            </p>
          </div>
          
          {/* Metrics */}
          {/* <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-lg p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors"></div>
              <div className="relative">
                <h3 className="text-5xl font-bold text-(--text) mb-2 flex items-end">
                  <span className="text-primary">2023</span>
                </h3>
                <p className="text-(--text)/70 text-lg">Founded at NEUB</p>
                <div className="mt-4 h-1 w-16 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full"></div>
              </div>
            </div>
            
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-lg p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors"></div>
              <div className="relative">
                <h3 className="text-5xl font-bold text-(--text) mb-2 flex items-end">
                  <span className="text-primary">10+</span>
                </h3>
                <p className="text-(--text)/70 text-lg">Team Members</p>
                <div className="mt-4 h-1 w-16 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full"></div>
              </div>
            </div>
            
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-lg p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors"></div>
              <div className="relative">
                <h3 className="text-5xl font-bold text-(--text) mb-2 flex items-end">
                  <span className="text-primary">500+</span>
                </h3>
                <p className="text-(--text)/70 text-lg">Active Users</p>
                <div className="mt-4 h-1 w-16 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full"></div>
              </div>
            </div>
          </div> */}
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-24 relative bg-[var(--background-light)]/70">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                
                {/* Image frame */}
                <div className="relative z-10 p-2 bg-background rounded-xl shadow-xl border border-(--primary)/10">

                  <Image src="/images/mu.png" width={600} height={400} alt="MU Campus" className="rounded-lg" />

                  
                  {/* Floating elements */}
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-background rounded-lg shadow-lg border border-(--primary)/10 transform rotate-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-background rounded-full shadow-lg border border-(--primary)/10 transform -rotate-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs tracking-wider">
                OUR STORY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-(--text)">
                From University Project to<br />
                <span className="text-primary">Revolutionary Platform</span>
              </h2>
              <p className="text-(--text)/70 mb-6">
                MetroSync began as an academic project at Metropolitan University Bangladesh, 
                driven by a vision to solve the challenges faced by students and educators in 
                managing academic workflows. What started as a solution for a single department 
                has evolved into a comprehensive platform serving the entire university ecosystem.
              </p>
              <p className="text-(--text)/70 mb-8">
                Our team of passionate developers, designers, and educators has worked tirelessly
                to create a system that streamlines everything from class scheduling and assignment
                management to resource sharing and academic communication—all in one intuitive platform.
              </p>
              
              <div className="flex gap-4">
                <Link 
                  href="/credits#our-team" 
                  className="group relative px-6 py-3 bg-primary text-white font-medium rounded-md hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all duration-300 overflow-hidden inline-flex items-center gap-2"
                >
                  <span className="relative z-10">Meet Our Team</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="absolute inset-0 w-0 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Mission */}
            <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-lg p-8 relative overflow-hidden hover:shadow-xl transition-all duration-300 border border-(--primary)/10">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="inline-block p-3 rounded-full bg-primary/10 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-(--text)">Our Mission</h3>
                <p className="text-(--text)/70 mb-6">
                  To revolutionize academic management by providing cutting-edge technology solutions 
                  that enhance collaboration, streamline workflows, and improve the educational 
                  experience for students, teachers, and administrators alike.
                </p>
                <div className="h-1 w-16 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full"></div>
              </div>
            </div>
            
            {/* Vision */}
            <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-lg p-8 relative overflow-hidden hover:shadow-xl transition-all duration-300 border border-(--primary)/10">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="inline-block p-3 rounded-full bg-primary/10 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-(--text)">Our Vision</h3>
                <p className="text-(--text)/70 mb-6">
                  To become the leading platform for academic management globally, creating 
                  a future where educational institutions of all sizes can leverage technology 
                  to create more efficient, engaging, and effective learning environments.
                </p>
                <div className="h-1 w-16 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Values */}
      <section className="py-24 relative bg-[var(--background-light)]/70">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs tracking-wider">
              WHAT WE STAND FOR
            </div>
            <h2 className="text-4xl font-bold mb-6 text-(--text)">
              Our Core <span className="text-primary">Values</span>
            </h2>
            <p className="text-lg text-(--text)/70 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Innovation */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-8 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
              <div className="relative">
                <div className="mb-6 p-3 inline-block rounded-xl bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-(--text)">Innovation</h3>
                <p className="text-(--text)/70">
                  We constantly push boundaries to create cutting-edge solutions that address the evolving needs of educational institutions.
                </p>
              </div>
            </div>
            
            {/* Collaboration */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-8 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
              <div className="relative">
                <div className="mb-6 p-3 inline-block rounded-xl bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-(--text)">Collaboration</h3>
                <p className="text-(--text)/70">
                  We believe in the power of teamwork and foster an environment where diverse perspectives come together to solve complex problems.
                </p>
              </div>
            </div>
            
            {/* Excellence */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-8 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
              <div className="relative">
                <div className="mb-6 p-3 inline-block rounded-xl bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-(--text)">Excellence</h3>
                <p className="text-(--text)/70">
                  We are committed to delivering high-quality solutions that exceed expectations and make a real difference in educational outcomes.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* User-Centric */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-8 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
              <div className="relative">
                <div className="mb-6 p-3 inline-block rounded-xl bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-(--text)">User-Centric</h3>
                <p className="text-(--text)/70">
                  We design with our users in mind, ensuring intuitive experiences that address the real needs of students, teachers, and administrators.
                </p>
              </div>
            </div>
            
            {/* Integrity */}
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-8 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
              <div className="relative">
                <div className="mb-6 p-3 inline-block rounded-xl bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-(--text)">Integrity</h3>
                <p className="text-(--text)/70">
                  We operate with transparency, honesty, and a strong ethical foundation in all our interactions and business practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background-light)]/50 to-[var(--background)] z-0"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-(--text)">
            Ready to Experience the <span className="text-primary">Future of Metrocation</span>?
          </h2>
          <p className="text-lg text-(--text)/70 mb-8 max-w-2xl mx-auto">
            Join the MetroSync community and transform how you manage academic activities.
            Whether you&apos;re a student, teacher, or administrator, we&apos;re here to help you succeed.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/contact" 
              className="group relative px-8 py-4 bg-primary text-white font-medium rounded-md hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all duration-300 overflow-hidden inline-flex items-center gap-2"
            >
              <span className="relative z-10">Get Started</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="absolute inset-0 w-0 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link 
              href="/dashboard" 
              className="px-8 py-4 border border-[var(--primary)] text-(--text) rounded-md hover:bg-primary/5 transition-all duration-300 inline-flex items-center gap-2 group"
            >
              <span>Learn More</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
