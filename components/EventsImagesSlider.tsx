'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';

interface EventImage {
  id: number;
  title?: string;
  description?: string;
  imageUrl: string;
  displayOrder: number;
}

export default function EventsImagesSlider() {
  const [eventImages, setEventImages] = useState<EventImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo images to show when no images are available from backend
  const demoImages: EventImage[] = [
    {
      id: 1001,
      title: 'Basketball',
      description: 'Basketball championship tournament',
      imageUrl: '/basketball/basketball.JPG',
      displayOrder: 1,
    },
    {
      id: 1002,
      title: 'Badminton',
      description: 'Badminton competition event',
      imageUrl: '/batmintan/batmintan.JPG',
      displayOrder: 2,
    },
    {
      id: 1003,
      title: 'Chess',
      description: 'Chess championship tournament',
      imageUrl: '/chess/chess.JPG',
      displayOrder: 3,
    },
    {
      id: 1004,
      title: 'Cricket',
      description: 'Cricket tournament competition',
      imageUrl: '/cricket/cricket.JPG',
      displayOrder: 4,
    },
    {
      id: 1005,
      title: 'Kabaddi',
      description: 'Kabaddi championship event',
      imageUrl: '/kabaddi/kabaddi.JPG',
      displayOrder: 5,
    },
    {
      id: 1006,
      title: 'Kho-Kho',
      description: 'Kho-Kho competition tournament',
      imageUrl: '/kho-kho/kho-kho.JPG',
      displayOrder: 6,
    },
    {
      id: 1007,
      title: 'Malkhamb',
      description: 'Malkhamb championship event',
      imageUrl: '/malkhamb/malkhamb.JPG',
      displayOrder: 7,
    },
    {
      id: 1008,
      title: 'Athletics',
      description: 'Athletics track and field competition',
      imageUrl: '/athletic/running.JPG',
      displayOrder: 8,
    },
    {
      id: 1009,
      title: 'Table Tennis',
      description: 'Table tennis championship tournament',
      imageUrl: '/table tennis/table tennis.JPG',
      displayOrder: 9,
    },
  ];

  const fetchEventImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/event-images`);
      if (response.ok) {
        const data = await response.json();
        setEventImages(data && data.length > 0 ? data : demoImages);
      } else {
        console.error('Failed to fetch event images');
        setEventImages(demoImages);
      }
    } catch (error) {
      console.error('Error fetching event images:', error);
      setEventImages(demoImages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventImages();

    const handleEventImagesUpdate = () => {
      fetchEventImages();
    };

    window.addEventListener('eventImagesUpdated', handleEventImagesUpdate);

    return () => {
      window.removeEventListener('eventImagesUpdated', handleEventImagesUpdate);
    };
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: '#f58002' }}></div>
          </div>
        </div>
      </section>
    );
  }

  // Always show the section, even if no images (will show demo images)
  const imagesToDisplay = eventImages.length > 0 ? eventImages : demoImages;

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-50/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
            Our <span style={{ color: '#f58002' }}>Events</span>
          </h2>
          <p className="text-black text-lg">
            Explore our exciting sports events and competitions
          </p>
        </div>

        {/* Horizontal Slider Container */}
        <div className="relative">
          {/* Gradient Overlays for Fade Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Slider Track */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll gap-6 md:gap-8" style={{
              animation: `scroll ${imagesToDisplay.length * 3}s linear infinite`,
            }}>
              {/* Duplicate images for seamless loop */}
              {[...imagesToDisplay, ...imagesToDisplay].map((image, index) => (
                <Link
                  key={`${image.id}-${index}`}
                  href={`/events/${image.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-48 md:w-64 h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-2 border-gray-200 cursor-pointer">
                    <Image
                      src={image.imageUrl}
                      alt={image.title || 'Event image'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 192px, 256px"
                    />
                    {/* Overlay with Event Info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        {image.title && (
                          <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                        )}
                        {image.description && (
                          <p className="text-sm text-white/90">{image.description}</p>
                        )}
                      </div>
                    </div>
                    {/* Badge */}
                    {image.title && (
                      <div className="absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg" style={{ backgroundColor: '#f58002' }}>
                        {image.title}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

