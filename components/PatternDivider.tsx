'use client';

interface PatternDividerProps {
  pattern?: 'waves' | 'dots' | 'lines' | 'zigzag' | 'circles' | 'diagonal';
}

export default function PatternDivider({ pattern = 'waves' }: PatternDividerProps) {
  const patterns = {
    waves: (
      <div className="relative w-full h-16 overflow-hidden">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="#f58002"
            opacity="0.1"
          />
          <path
            d="M0,80 Q300,40 600,80 T1200,80 L1200,120 L0,120 Z"
            fill="#f58002"
            opacity="0.05"
          />
        </svg>
      </div>
    ),
    dots: (
      <div className="relative w-full h-16 overflow-hidden bg-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-2">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: '#f58002',
                  opacity: 0.2 + (i % 3) * 0.1,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    lines: (
      <div className="relative w-full h-16 overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full flex gap-1">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="h-full flex-1"
                style={{
                  backgroundColor: i % 2 === 0 ? '#f58002' : 'transparent',
                  opacity: 0.1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    zigzag: (
      <div className="relative w-full h-16 overflow-hidden">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <polyline
            points="0,60 150,20 300,60 450,20 600,60 750,20 900,60 1050,20 1200,60 1200,120 0,120"
            fill="none"
            stroke="#f58002"
            strokeWidth="2"
            opacity="0.2"
          />
          <polyline
            points="0,80 150,40 300,80 450,40 600,80 750,40 900,80 1050,40 1200,80 1200,120 0,120"
            fill="#f58002"
            opacity="0.05"
          />
        </svg>
      </div>
    ),
    circles: (
      <div className="relative w-full h-16 overflow-hidden bg-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-4">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="rounded-full border-2"
                style={{
                  width: `${20 + (i % 3) * 10}px`,
                  height: `${20 + (i % 3) * 10}px`,
                  borderColor: '#f58002',
                  opacity: 0.15,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    diagonal: (
      <div className="relative w-full h-16 overflow-hidden bg-white">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(245, 128, 2, 0.05) 10px, rgba(245, 128, 2, 0.05) 20px)',
        }}></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(245, 128, 2, 0.05) 10px, rgba(245, 128, 2, 0.05) 20px)',
        }}></div>
      </div>
    ),
  };

  return <div className="w-full">{patterns[pattern]}</div>;
}

