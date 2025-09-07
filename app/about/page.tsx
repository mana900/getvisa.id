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
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-6xl md:text-7xl text-gray-900 leading-tight mb-8">
                Visa Makers,
                Passion Behind Every Adventure
              </h1>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                We're more than a visa service—we're storytellers, explorers, and experience 
                creators, dedicated to making every trip unforgettable.
              </p>
              <div className="flex items-center text-green-700 font-semibold">
                <span className="mr-2">Discover Our Story</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl overflow-hidden h-96">
              <img 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop&crop=entropy&auto=format" 
                alt="Travelers exploring ancient ruins"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden h-96">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=entropy&auto=format" 
                alt="Couple enjoying sunset view"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden h-96">
              <img 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=600&fit=crop&crop=entropy&auto=format" 
                alt="Adventure through stone archway"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-2">
              <h3 className="text-lg text-gray-600 font-medium">Our Story</h3>
            </div>
            <div className="lg:col-span-10">
              <h2 className="text-4xl md:text-5xl text-gray-900 leading-tight mb-16">
                Established in 2018, our journey started with a passion for meaningful travel. Over the years, 
                we've grown into a trusted partner, we excel in personalized visa services that blend 
                adventure, comfort, and discovery.
              </h2>
              
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-12 mt-20">
                <div>
                  <div className="text-7xl md:text-8xl text-green-700 mb-2">98%</div>
                  <div className="text-lg text-gray-600">Satisfaction Rate</div>
                </div>
                <div>
                  <div className="text-7xl md:text-8xl text-green-700 mb-2">1500+</div>
                  <div className="text-lg text-gray-600">Satisfied Client Reviews</div>
                </div>
                <div>
                  <div className="text-7xl md:text-8xl text-green-700 mb-2">15+</div>
                  <div className="text-lg text-gray-600">Years of our Expertise</div>
                </div>
                <div>
                  <div className="text-7xl md:text-8xl text-green-700 mb-2">800+</div>
                  <div className="text-lg text-gray-600">Guided Tours Annually</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Required Amenities Section */}
      <section className="relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop&crop=entropy&auto=format)" }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div></div>
            
            <div className="bg-white rounded-3xl p-8 lg:p-12">
              <div className="mb-8">
                <p className="text-sm text-gray-600 font-medium mb-4">Required Amenities</p>
                <h2 className="text-4xl md:text-5xl text-gray-900 leading-tight mb-6">
                  Unmatched Comfort, Every Step of Journey
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We take care of every detail so you can focus on the adventure. Travel with confidence
                  —explore with ease.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl  text-gray-900 mb-2">High-Quality Equipment</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We provide all the gear you need—snorkeling, trekking, or camping—so you're 
                      always prepared.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl  text-gray-900 mb-2">Personal Documentation</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Capture every special moment with the help of our professional photographers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl  text-gray-900 mb-2">Comprehensive Insurance</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We provide full travel insurance coverage to ensure your peace of mind 
                      throughout your journey.
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