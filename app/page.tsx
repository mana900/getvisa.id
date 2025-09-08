"use client"

import { useState } from "react"
import Header from "@/components/header"
import PopularDestinations from "@/components/popular-destinations"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"

export default function Home() {
  const [searchFilters, setSearchFilters] = useState({
    destination: "",
    passport: "",
    lengthOfStay: "",
  })

  return (
    <main className="min-h-screen bg-gray-100">
      <Header onSearchChange={setSearchFilters} />
      <PopularDestinations searchFilters={searchFilters} />
      <Testimonials />
      <Footer />
    </main>
  )
}
