'use client';

import Image from 'next/image';

export default function SportsHighlights() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          {/* Left Side - Image (2/3 width) */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="relative w-full h-64 md:h-[350px] lg:h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/sportsh/260A0124.JPG"
                alt="Sports Highlights - Students and athletes on field"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              {/* Optional overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            </div>
          </div>

          {/* Right Side - Information (1/3 width) */}
          <div className="lg:col-span-1 order-1 lg:order-2 space-y-6 lg:space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                Sports <span style={{ color: '#f58002' }}>Highlights</span>
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              The Sports Festival of Yashavantrao Chavan Institute of Science (YCIS), Satara is organized every year to encourage sports and physical fitness among students.
Students actively participate in various indoor and outdoor games such as cricket, volleyball, kabaddi, athletics, and chess.
The festival promotes teamwork, discipline, and a healthy competitive spirit.
Teachers and staff members guide and support students throughout the event.
Winners are honored with prizes and certificates, making the festival memorable and inspiring.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

