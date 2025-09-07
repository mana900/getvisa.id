"use client"

import { useState, useRef, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      id: 1,
      name: "Jeannie Grant",
      date: "June 01, 2023",
      rating: 5,
      review: "A thorough report was done on our financial situation of what insurance covers etc existing. Better deals were found. These were processed on our behalf, which took a lot of stress away. Updates were given as required and outstanding responses chased after."
    },
    {
      id: 2,
      name: "Derval Russell",
      date: "November 09, 2023",
      rating: 5,
      review: "I have been a client of GetVisa.ID for 8 years now and have always found the advice provided by our consultant excellent. They always take the time to explain things really clearly to me and ensures I understand and am well informed and therefore able to make appropriate decisions."
    },
    {
      id: 3,
      name: "Claire Watson",
      date: "October 12, 2023",
      rating: 5,
      review: "Claire consistently demonstrates thorough knowledge and understanding of visa requirements and provides excellent customer service. She takes time to explain complex visa processes clearly and makes the entire application stress-free."
    },
    {
      id: 4,
      name: "Michael Chen",
      date: "September 15, 2023",
      rating: 5,
      review: "Outstanding service from start to finish. GetVisa.ID made my visa application process seamless and stress-free. The team was professional, responsive, and kept me informed throughout the entire process."
    },
    {
      id: 5,
      name: "Sarah Johnson",
      date: "August 22, 2023",
      rating: 5,
      review: "I was impressed by the efficiency and professionalism of GetVisa.ID. They handled all the paperwork and made sure everything was submitted correctly and on time. Highly recommended for anyone needing visa services."
    },
    {
      id: 6,
      name: "Ahmad Rahman",
      date: "July 18, 2023",
      rating: 5,
      review: "Exceptional service! The team at GetVisa.ID went above and beyond to ensure my visa application was successful. Their attention to detail and customer service is unmatched."
    },
    {
      id: 7,
      name: "Lisa Thompson",
      date: "June 25, 2023",
      rating: 5,
      review: "GetVisa.ID saved me so much time and stress. Their expertise in visa requirements is evident, and they made the whole process straightforward. I couldn't be happier with the service."
    }
  ]

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? "text-green-500 fill-green-500" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0))
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const scrollToNext = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 384 // w-96 = 384px
      const gap = 32 // gap-8 = 32px
      scrollContainerRef.current.scrollBy({
        left: cardWidth + gap,
        behavior: 'smooth'
      })
    }
  }

  const scrollToPrev = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 384
      const gap = 32
      scrollContainerRef.current.scrollBy({
        left: -(cardWidth + gap),
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header - Left Aligned */}
        <div className="text-left mb-12 max-w-4xl">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-4">
            THOUSANDS TRUST GETVISA.ID
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Don't take our word for it,<br />
            see what our clients say
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            We're honored by the feedback, and it fuels our commitment to delivering exceptional 
            visa services. Read the reviews to hear firsthand how GetVisa.ID is making a positive 
            impact on people's lives. Your trust is our greatest achievement.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute right-0 -top-20 flex space-x-2 z-10">
            <button
              onClick={scrollToPrev}
              className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={scrollToNext}
              className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Testimonials Carousel */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-8 pb-4 scroll-smooth scrollbar-hide cursor-grab"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-96 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Rating */}
                <div className="mb-6">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Review */}
                <p className="text-gray-700 leading-relaxed mb-8 text-base">
                  {testimonial.review}
                </p>

                {/* Author Info */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {testimonial.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}