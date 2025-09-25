"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Globe, Users, Shield, Clock, Award, MapPin } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Journey Makers Style */}
      <section className="px-4 md:px-6 py-12 md:py-20" style={{ paddingTop: 'calc(3rem + 88px)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl text-gray-900 leading-tight mb-6 md:mb-8">
                Unlock the World
                Hassle-Free 
              </h1>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base md:text-xl text-gray-700 leading-relaxed mb-6 md:mb-8">
Getting a visa shouldn't feel like cracking a code. That's why we built GetVisa.ID by Travion—a modern visa concierge service designed to make travel simple, stress-free, and fast.<br/><br/>
We know the struggle: endless forms, confusing requirements, embassy queues, and that one missing document that throws everything off. We're here to cut through the noise and handle it all for you—so your only job is to plan where you'll go next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section - Hidden on mobile */}
      <section className="hidden md:block px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl overflow-hidden h-96">
              <img 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=600&fit=crop&crop=entropy&auto=format" 
                alt="Modern city skyline representing international destinations"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden h-96">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=entropy&auto=format" 
                alt="Scenic mountain landscape perfect for travel content"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden h-96">
              <img 
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop&crop=entropy&auto=format" 
                alt="Paradise beach destination for visa travel"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-4 md:px-6 py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            <div className="lg:col-span-2">
              <h3 className="text-base md:text-lg text-gray-600 font-medium">Our Story</h3>
            </div>
            <div className="lg:col-span-10">
              <h2 className="text-2xl md:text-4xl lg:text-5xl text-gray-900 leading-tight mb-8 md:mb-16">
Founded in 2017 under Travion | Travel & Beyond, we've always believed travel should be about discovery, not documents. After years of helping Indonesians plan their trips, we saw one thing holding people back: the visa process.

That's why we created GetVisa.id
              </h2>
              
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-6 md:gap-12 mt-8 md:mt-20">
                <div>
                  <div className="text-4xl md:text-7xl lg:text-8xl text-green-700 mb-1 md:mb-2">99%</div>
                  <div className="text-sm md:text-lg text-gray-600">Approval Success Rate</div>
                </div>
                <div>
                  <div className="text-4xl md:text-7xl lg:text-8xl text-green-700 mb-1 md:mb-2">1500+</div>
                  <div className="text-sm md:text-lg text-gray-600">Visas Processed</div>
                </div>
                <div>
                  <div className="text-4xl md:text-7xl lg:text-8xl text-green-700 mb-1 md:mb-2">7+</div>
                  <div className="text-sm md:text-lg text-gray-600">Years of our Expertise</div>
                </div>
                <div>
                  <div className="text-4xl md:text-7xl lg:text-8xl text-green-700 mb-1 md:mb-2">100+</div>
                  <div className="text-sm md:text-lg text-gray-600">Destinations Covered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Required Amenities Section */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-about-hero"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div></div>
            
            <div className="bg-white rounded-3xl p-4 md:p-6 lg:p-8">
              <div className="mb-4 md:mb-6 lg:mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-900 leading-tight mb-3 md:mb-4 lg:mb-6">
                  What Makes Us Different
                </h2>
                <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
                  We don't just process papers—we give you clarity, speed, and confidence. Every application is handled with care, so you never have to second-guess.
                </p>
              </div>

              <div className="space-y-4 md:space-y-6 lg:space-y-8">
                <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto md:mx-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-base md:text-lg lg:text-xl text-gray-900 mb-1 md:mb-2">Clear Guidance</h3>
                    <p className="text-gray-600 leading-relaxed text-xs md:text-sm lg:text-base">
                      No confusing forms. We simplify every step in plain language for Indonesians.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto md:mx-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-base md:text-lg lg:text-xl text-gray-900 mb-1 md:mb-2">End-to-End Support</h3>
                    <p className="text-gray-600 leading-relaxed text-xs md:text-sm lg:text-base">
                      From document checks to embassy appointments, we've got you covered.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto md:mx-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-base md:text-lg lg:text-xl text-gray-900 mb-1 md:mb-2">Trusted Expertise</h3>
                    <p className="text-gray-600 leading-relaxed text-xs md:text-sm lg:text-base">
                      With years of travel industry experience, we know what embassies look for.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}