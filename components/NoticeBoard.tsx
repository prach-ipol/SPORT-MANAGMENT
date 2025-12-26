'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '@/config/api';

interface Notice {
  id: number;
  title: string;
  description: string;
  documentUrl?: string | null;
  scheduleImageUrl?: string | null;
  noticeDate: string;
  createdAt?: string;
  updatedAt?: string;
}

// Demo notices as fallback
const demoNotices: Notice[] = [
  {
    id: 1,
    title: 'Upcoming Football Tournament',
    description: 'Registration for the annual football tournament is now open. Register before March 15th.',
    noticeDate: '2024-03-01',
  },
  {
    id: 2,
    title: 'Basketball Practice Schedule Updated',
    description: 'Basketball practice sessions will be held every Tuesday and Thursday at 4 PM.',
    noticeDate: '2024-03-02',
  },
  {
    id: 3,
    title: 'Sports Equipment Collection',
    description: 'All sports equipment must be returned to the sports office by end of this week.',
    noticeDate: '2024-03-03',
  },
];

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleImageUrl, setScheduleImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
    
    // Listen for notices updates
    const handleNoticesUpdate = () => {
      fetchNotices();
    };
    
    window.addEventListener('noticesUpdated', handleNoticesUpdate);
    
    return () => {
      window.removeEventListener('noticesUpdated', handleNoticesUpdate);
    };
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/notices`);
      if (response.ok) {
        const data: Notice[] = await response.json();
        setNotices(data && data.length > 0 ? data : demoNotices);
        
        // Get the most recent notice's schedule image if available
        if (data && data.length > 0) {
          const noticeWithSchedule = data.find(n => n.scheduleImageUrl);
          setScheduleImageUrl(noticeWithSchedule?.scheduleImageUrl || null);
        } else {
          setScheduleImageUrl(null);
        }
      } else {
        // Fallback to demo notices
        setNotices(demoNotices);
        setScheduleImageUrl(null);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      // Fallback to demo notices
      setNotices(demoNotices);
      setScheduleImageUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Duplicate notices for seamless scrolling
  const allNotices = [...notices, ...notices];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">
            Notice <span style={{ color: '#f58002' }}>Board</span>
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Half - Vertical Scrolling News */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 flex items-center gap-3" style={{ backgroundColor: '#f58002' }}>
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-white font-semibold text-sm">Latest News & Notices</span>
            </div>

            {/* Vertical Scrolling Container */}
            <div className="relative h-96 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: '#f58002' }}></div>
                </div>
              ) : (
                <div className="absolute top-0 left-0 right-0 h-full">
                  <div className="animate-vertical-scroll">
                    {allNotices.map((notice, index) => (
                      <div key={`${notice.id}-${index}`} className="p-6 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f58002' }}></div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-black mb-2">
                              {notice.title}
                            </h3>
                            <p className="text-sm text-gray-700 mb-2 leading-relaxed line-clamp-2">
                              {notice.description}
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                              <p className="text-xs text-gray-500 flex items-center gap-2">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(notice.noticeDate)}
                              </p>
                              {notice.documentUrl && (
                                <a
                                  href={notice.documentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-[#f58002] hover:underline flex items-center gap-1"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                  View PDF
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Half - Schedule/Timetable Image */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 flex items-center gap-3" style={{ backgroundColor: '#f58002' }}>
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-white font-semibold text-sm">Schedule & Timetable</span>
            </div>
            <div className="relative h-96 w-full">
              {scheduleImageUrl ? (
                <Image
                  src={scheduleImageUrl}
                  alt="Schedule and Timetable"
                  fill
                  className="object-contain bg-gray-50"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No schedule available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes vertical-scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .animate-vertical-scroll {
          animation: vertical-scroll ${notices.length > 0 ? notices.length * 3 : 9}s linear infinite;
        }
      `}</style>
    </section>
  );
}

