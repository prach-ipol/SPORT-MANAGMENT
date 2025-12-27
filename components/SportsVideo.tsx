'use client';

import { useState, useRef, useEffect } from 'react';

export default function SportsVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Auto-play on mount
    video.play().catch(console.error);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Information */}
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                Sports <span style={{ color: '#f58002' }}>Excellence</span>
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                Experience the thrill and excitement of our sports activities at Yashavantrao Chavan Institute of Science (YCIS), Satara. Our students showcase exceptional talent and dedication in various sports disciplines.
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                From competitive tournaments to friendly matches, our sports programs foster physical fitness, teamwork, and sportsmanship. Watch our athletes in action as they demonstrate their skills and passion for sports.
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                Join us in celebrating the spirit of sports and witness the remarkable achievements of our talented students.
              </p>
            </div>
          </div>

          {/* Right Side - Video */}
          <div className="order-1 lg:order-2">
            <div 
              className="relative w-full h-64 md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl group"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <video
                ref={videoRef}
                src="/Sports.mp4"
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Optional overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>

              {/* Video Controls Overlay */}
              <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlayPause}
                    className="bg-white/90 hover:bg-white rounded-full p-4 transition-all duration-200 hover:scale-110 shadow-lg"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg className="w-8 h-8 text-[#f58002]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-[#f58002]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Bottom Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Progress Bar */}
                  <div
                    className="w-full h-2 bg-white/30 rounded-full cursor-pointer mb-3 group/progress"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-150"
                      style={{ 
                        width: `${progressPercentage}%`,
                        backgroundColor: '#f58002'
                      }}
                    >
                      <div className="h-full w-full bg-[#f58002] rounded-full"></div>
                    </div>
                    {/* Progress Handle */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f58002] rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
                      style={{ left: `calc(${progressPercentage}% - 8px)` }}
                    ></div>
                  </div>

                  {/* Time and Controls */}
                  <div className="flex items-center justify-between text-white text-sm">
                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={togglePlayPause}
                        className="hover:text-[#f58002] transition-colors"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

