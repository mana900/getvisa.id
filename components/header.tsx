// This component is now DEPRECATED and should be replaced with Navigation + HeroBanner
// Keeping it temporarily for backward compatibility

import Navigation from "@/components/navigation"
import HeroBanner from "@/components/hero-banner"

interface HeaderProps {
  onSearchChange?: (filters: {
    destination: string
    passport: string
    lengthOfStay: string
  }) => void
}

export default function Header({ onSearchChange }: HeaderProps) {
  return (
    <>
      <Navigation />
      <HeroBanner onSearchChange={onSearchChange} />
    </>
  )
}
