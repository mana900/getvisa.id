export default function PartnerLogos() {
  return (
    <div className="w-full bg-white py-8">
      {/* Mobile: 2 rows layout */}
      <div className="block sm:hidden px-4">
        {/* First row: 4 logos */}
        <div className="flex justify-center items-center gap-6 mb-4">
          <span className="text-gray-500 font-medium text-base whitespace-nowrap">Booking.com</span>
          <span className="text-gray-500 font-medium text-base italic whitespace-nowrap">Instagram</span>
          <span className="text-gray-500 font-medium text-base whitespace-nowrap">airbnb</span>
          <span className="text-gray-500 font-medium text-base whitespace-nowrap">Medium</span>
        </div>
        {/* Second row: 2 logos */}
        <div className="flex justify-center items-center gap-6">
          <span className="text-gray-500 font-medium text-base whitespace-nowrap">tinder</span>
          <span className="text-gray-500 font-medium text-base whitespace-nowrap">Trustpilot</span>
        </div>
      </div>
      
      {/* Tablet and Desktop: Single row */}
      <div className="hidden sm:flex justify-center items-center gap-6 md:gap-8 lg:gap-12 px-4">
        <span className="text-gray-500 font-medium text-base lg:text-lg whitespace-nowrap">Booking.com</span>
        <span className="text-gray-500 font-medium text-base lg:text-lg italic whitespace-nowrap">Instagram</span>
        <span className="text-gray-500 font-medium text-base lg:text-lg whitespace-nowrap">airbnb</span>
        <span className="text-gray-500 font-medium text-base lg:text-lg whitespace-nowrap">Medium</span>
        <span className="text-gray-500 font-medium text-base lg:text-lg whitespace-nowrap">tinder</span>
        <span className="text-gray-500 font-medium text-base lg:text-lg whitespace-nowrap">Trustpilot</span>
      </div>
    </div>
  )
}
