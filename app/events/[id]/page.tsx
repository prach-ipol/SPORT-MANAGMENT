'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { API_BASE_URL } from '@/config/api';

interface EventImage {
  id: number;
  title?: string;
  description?: string;
  imageUrl: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [eventImage, setEventImage] = useState<EventImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventImage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/event-images/${params.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setEventImage(data);
        } else if (response.status === 404) {
          setError('Event not found');
        } else {
          setError('Failed to load event details');
        }
      } catch (error) {
        console.error('Error fetching event image:', error);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEventImage();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00BFFF] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !eventImage) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-16">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-black hover:text-[#00BFFF] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Event Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Event Image */}
            <div className="relative w-full h-96 md:h-[500px] bg-gray-100">
              <Image
                src={eventImage.imageUrl}
                alt={eventImage.title || 'Event image'}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              
              {/* Title Overlay */}
              {eventImage.title && (
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {eventImage.title}
                  </h1>
                </div>
              )}
            </div>

            {/* Event Details */}
            <div className="p-8 md:p-12">
              {eventImage.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-black mb-4">About This Event</h2>
                  <div className="w-20 h-1 rounded-full mb-6" style={{ backgroundColor: '#00BFFF' }}></div>
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                    {eventImage.description}
                  </p>
                </div>
              )}

              {/* Event Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#00BFFF' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-black">Event Image</h3>
                  </div>
                  <p className="text-sm text-gray-600">High-quality event photo</p>
                </div>

                {eventImage.createdAt && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: '#00BFFF' }}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-black">Added Date</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(eventImage.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#00BFFF' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-black">Display Order</h3>
                  </div>
                  <p className="text-sm text-gray-600">Position: {eventImage.displayOrder}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
                <Link
                  href="/"
                  className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors"
                >
                  View All Events
                </Link>
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-black rounded-lg font-medium transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

