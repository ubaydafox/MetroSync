import React from 'react'

export default function Contact() {
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
              GET IN TOUCH
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-(--text)">
              We&apos;d Love to <span className="text-primary">Hear</span> From You
            </h1>
            <p className="text-lg md:text-xl text-(--text)/70 max-w-3xl mx-auto">
              Have questions about MetroSync? Need technical support? Want to partner with us?
              Our team is here to help you with anything you need.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Form & Info Section */}
      <section className="py-12 pb-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Information */}
            <div className="lg:w-1/3">
              <div className="sticky top-8">
                {/* Email */}
                <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 mb-6 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
                  <div className="relative">
                    <div className="flex items-start">
                      <div className="p-2 rounded-lg bg-primary/10 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-(--text) mb-1">Email Us</h3>
                        <p className="text-(--text)/70 mb-2">Our friendly team is here to help.</p>
                        <a href="mailto:nayef@quadiz.com" className="text-primary hover:underline font-medium">nayef@quadiz.com</a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 mb-6 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
                  <div className="relative">
                    <div className="flex items-start">
                      <div className="p-2 rounded-lg bg-primary/10 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-(--text) mb-1">Call Us</h3>
                        <p className="text-(--text)/70 mb-2">Mon-Fri from 8am to 5pm</p>
                        <a href="tel:+8801858290153" className="text-primary hover:underline font-medium">+880 1858 290 153</a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Office */}
                <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 mb-6 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors duration-300"></div>
                  <div className="relative">
                    <div className="flex items-start">
                      <div className="p-2 rounded-lg bg-primary/10 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-(--text) mb-1">Visit Us</h3>
                        <p className="text-(--text)/70 mb-2">Come say hello at our office</p>
                        <p className="text-(--text)">
                          North East University Bangladesh<br/>
                          Telihaor, Sheikhghat, Sylhet, Bangladesh
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Social Media */}
                {/* <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 relative overflow-hidden border border-(--primary)/10 hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <h3 className="text-lg font-semibold text-(--text) mb-4">Connect With Us</h3>
                    <div className="flex gap-3">
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"></path></svg>
                      </a>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:w-2/3">
              <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-lg p-8 relative overflow-hidden border border-(--primary)/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--primary-light)]/5 rounded-full blur-3xl"></div>
                
                <div className="relative">
                  <h2 className="text-2xl font-bold mb-6 text-(--text)">Send Us a Message</h2>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-(--text)/70 mb-2">First Name</label>
                        <input
                          type="text"
                          id="first_name"
                          className="w-full px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-background/50 backdrop-blur-sm transition-all duration-300"
                          placeholder="John"
                        />
                      </div>
                      
                      {/* Last Name */}
                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-(--text)/70 mb-2">Last Name</label>
                        <input
                          type="text"
                          id="last_name"
                          className="w-full px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-background/50 backdrop-blur-sm transition-all duration-300"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-(--text)/70 mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-background/50 backdrop-blur-sm transition-all duration-300"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    
                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-(--text)/70 mb-2">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-background/50 backdrop-blur-sm transition-all duration-300"
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-(--text)/70 mb-2">Message</label>
                      <textarea
                        id="message"
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-background/50 backdrop-blur-sm transition-all duration-300 resize-none"
                        placeholder="Tell us what you need help with..."
                      ></textarea>
                    </div>
                    
                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="group relative px-6 py-3 bg-primary text-white font-medium rounded-md hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all duration-300 overflow-hidden inline-flex items-center gap-2 w-full justify-center"
                    >
                      <span className="relative z-10">Send Message</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="absolute inset-0 w-0 bg-linear-to-r from-[var(--primary)] to-[var(--primary-light)] group-hover:w-full transition-all duration-300"></span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      {/* <section className="py-16 bg-[var(--background-light)]/50 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs tracking-wider">
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-(--text)">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-(--text)/70 max-w-2xl mx-auto">
              Find answers to common questions about MetroSync platform, features, and services.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-(--primary)/10">
              <h3 className="text-lg font-semibold text-(--text) mb-3 flex items-center">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm mr-3">Q</span>
                What is MetroSync?
              </h3>
              <div className="pl-9">
                <p className="text-(--text)/70">
                  MetroSync is a comprehensive academic management platform designed to streamline scheduling, 
                  resource management, and collaboration for educational institutions. It helps students, 
                  teachers, and administrators organize academic activities efficiently.
                </p>
              </div>
            </div>
            
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-(--primary)/10">
              <h3 className="text-lg font-semibold text-(--text) mb-3 flex items-center">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm mr-3">Q</span>
                How can I get started with MetroSync?
              </h3>
              <div className="pl-9">
                <p className="text-(--text)/70">
                  Getting started is easy! Contact our team through this form or email us at support@edusync.edu. 
                  We&apos;ll set up a demo account for your institution and guide you through the onboarding process.
                </p>
              </div>
            </div>
            
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-(--primary)/10">
              <h3 className="text-lg font-semibold text-(--text) mb-3 flex items-center">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm mr-3">Q</span>
                Is MetroSync suitable for my institution?
              </h3>
              <div className="pl-9">
                <p className="text-(--text)/70">
                  MetroSync is designed to be flexible and scalable, making it suitable for educational institutions 
                  of all sizes—from small departments to entire universities. We offer customization options to 
                  meet your specific needs.
                </p>
              </div>
            </div>
            
            <div className="bg-background/70 backdrop-blur-md rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-(--primary)/10">
              <h3 className="text-lg font-semibold text-(--text) mb-3 flex items-center">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm mr-3">Q</span>
                Do you offer technical support?
              </h3>
              <div className="pl-9">
                <p className="text-(--text)/70">
                  Yes, we provide comprehensive technical support to all our users. Our dedicated support team 
                  is available via email, phone, and live chat to help you with any questions or issues you 
                  may encounter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      
      {/* Map Section */}
      {/* <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-(--primary)/10">
            <div className="aspect-[16/9] bg-[var(--background-light)]/50 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-(--text) mb-2">Map Placeholder</h3>
                <p className="text-(--text)/70">Interactive map will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  )
}
