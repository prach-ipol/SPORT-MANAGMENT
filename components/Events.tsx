"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface SliderImage {
  id: string
  imageUrl: string
  description: string
}

interface DataCenterDescription {
  id: string
  title: string
  description: string
}

export function ImageSliderSection() {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([])
  const [dataCenterDesc, setDataCenterDesc] = useState<DataCenterDescription | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (sliderImages.length > 0 && !isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sliderImages.length)
      }, 5000) // Auto-slide every 5 seconds
      return () => clearInterval(interval)
    }
  }, [sliderImages.length, isHovered])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [sliderRes, descRes] = await Promise.all([
        fetch('/api/slider'),
        fetch('/api/datacenter-description')
      ])
      
      if (sliderRes.ok) {
        const sliderData = await sliderRes.json()
        setSliderImages(sliderData || [])
      }
      
      if (descRes.ok) {
        const descData = await descRes.json()
        setDataCenterDesc(descData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-300 opacity-20"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Always show the component, even without API data

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Enhanced Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse opacity-10" style={{ backgroundColor: '#00BFFF' }}></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse opacity-10" style={{ backgroundColor: '#00BFFF', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl animate-pulse opacity-5" style={{ backgroundColor: '#00BFFF', animationDelay: '2s' }}></div>
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0, 191, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 191, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: '#00BFFF' }}>
              Sports Events
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            <span className="text-black">
              Upcoming <span style={{ color: '#00BFFF' }}>Events</span>
            </span>
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Join us for exciting sports events and competitions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side - Enhanced Description */}
          <div className="flex flex-col justify-center space-y-8 relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full opacity-20" style={{ background: 'linear-gradient(to bottom, #00BFFF, #00BFFF)' }}></div>
            
            {dataCenterDesc ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-black leading-tight">
                    {dataCenterDesc.title}
                  </h3>
                  <div className="w-20 h-1 rounded-full" style={{ backgroundColor: '#00BFFF' }}></div>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-black leading-relaxed text-base md:text-lg whitespace-pre-line">
                    {dataCenterDesc.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-black leading-tight">
                    Sports Events & Competitions
                  </h3>
                  <div className="w-20 h-1 rounded-full" style={{ backgroundColor: '#00BFFF' }}></div>
                </div>
                <p className="text-black leading-relaxed text-base md:text-lg">
                  Join us for exciting sports events and competitions throughout the year. From inter-college tournaments 
                  to national championships, we provide a platform for athletes to showcase their talent and compete at 
                  the highest level.
                </p>
              </div>
            )}

            {/* Enhanced Feature Cards */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="group flex flex-col items-center p-5 bg-white backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2">
                <div className="p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#00BFFF' }}>
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-black text-center">Secure</span>
              </div>
              <div className="group flex flex-col items-center p-5 bg-white backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2">
                <div className="p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#00BFFF' }}>
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-black text-center">Fast</span>
              </div>
              <div className="group flex flex-col items-center p-5 bg-white backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2">
                <div className="p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#00BFFF' }}>
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-black text-center">Reliable</span>
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Image Slider */}
          {sliderImages.length > 0 ? (
            <div 
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Enhanced Frame Container with Glow */}
              <div className="relative p-5 bg-white rounded-3xl shadow-2xl border-2 border-gray-200 backdrop-blur-xl">
                {/* Animated Border Glow */}
                <div className="absolute -inset-1 rounded-3xl opacity-20 blur-xl animate-pulse" style={{ backgroundColor: '#00BFFF' }}></div>
                
                {/* Inner Frame Shadow */}
                <div className="absolute inset-2 rounded-2xl border border-gray-200 shadow-inner pointer-events-none"></div>
                
                {/* Enhanced Corner Decorations */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 rounded-tl-lg" style={{ borderColor: '#00BFFF' }}></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 rounded-tr-lg" style={{ borderColor: '#00BFFF' }}></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 rounded-bl-lg" style={{ borderColor: '#00BFFF' }}></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 rounded-br-lg" style={{ borderColor: '#00BFFF' }}></div>
                
                <div className="overflow-hidden border-0 shadow-2xl bg-white relative z-10 rounded-2xl">
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 group">
                  {sliderImages.map((image, index) => (
                    <div
                      key={image.id}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentIndex 
                          ? 'opacity-100 scale-100 z-10' 
                          : 'opacity-0 scale-105 z-0'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={image.imageUrl}
                          alt={image.description || `Slide ${index + 1}`}
                          fill
                          className="object-cover"
                          priority={index === currentIndex}
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg'
                          }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Enhanced Navigation Buttons */}
                  {sliderImages.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md hover:bg-white border border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-125 transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 p-3 rounded-full"
                        style={{ borderColor: '#00BFFF' }}
                        onClick={goToPrevious}
                        aria-label="Previous slide"
                      >
                        <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md hover:bg-white border border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-125 transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 p-3 rounded-full"
                        style={{ borderColor: '#00BFFF' }}
                        onClick={goToNext}
                        aria-label="Next slide"
                      >
                        <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Enhanced Dots Indicator */}
                  {sliderImages.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                      {sliderImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`relative transition-all duration-300 rounded-full ${
                            index === currentIndex
                              ? 'w-8 h-2 shadow-lg'
                              : 'w-2 h-2 bg-white/60 hover:bg-white/90 hover:scale-150'
                          }`}
                          style={index === currentIndex ? { backgroundColor: '#00BFFF' } : {}}
                          aria-label={`Go to slide ${index + 1}`}
                        >
                          {index === currentIndex && (
                            <span className="absolute inset-0 rounded-full animate-pulse" style={{ backgroundColor: '#00BFFF' }}></span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Enhanced Slide Counter */}
                  {sliderImages.length > 1 && (
                    <div className="absolute top-4 right-4 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full z-20 shadow-lg border border-white/20" style={{ backgroundColor: '#00BFFF' }}>
                      <span className="text-white">{currentIndex + 1}</span>
                      <span className="mx-1 text-white/60">/</span>
                      <span className="text-white">{sliderImages.length}</span>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Description Below Image */}
                {sliderImages[currentIndex]?.description && (
                  <div className="p-6 bg-white border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full animate-pulse shadow-lg" style={{ backgroundColor: '#00BFFF' }}></div>
                      <p className="text-sm md:text-base text-black font-semibold text-center w-full">
                        {sliderImages[currentIndex].description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced Frame Glow Effect */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none -z-0 animate-pulse opacity-20" style={{ backgroundColor: '#00BFFF' }}></div>
              </div>

              {/* Enhanced Decorative Corner Accents */}
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl -z-10 animate-pulse opacity-30" style={{ backgroundColor: '#00BFFF' }}></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full blur-3xl -z-10 animate-pulse opacity-30" style={{ backgroundColor: '#00BFFF', animationDelay: '1s' }}></div>
            </div>
          ) : (
            <div className="relative">
              <div className="relative p-5 bg-white rounded-3xl shadow-2xl border-2 border-gray-200 backdrop-blur-xl">
                <div className="absolute -inset-1 rounded-3xl opacity-10 blur-xl" style={{ backgroundColor: '#00BFFF' }}></div>
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="mb-4 inline-block p-4 rounded-2xl" style={{ backgroundColor: '#00BFFF', opacity: 0.1 }}>
                      <svg className="w-16 h-16 mx-auto" style={{ color: '#00BFFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-black text-lg font-semibold mb-2">No images available</p>
                    <p className="text-black text-sm">Images will appear here when available</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

