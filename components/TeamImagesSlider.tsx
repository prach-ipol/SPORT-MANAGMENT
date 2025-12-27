'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '@/config/api';

interface TeamImage {
  id: number;
  imageUrl: string;
  teamName: string;
  sport: string;
  color?: string;
}

interface Team {
  id: number;
  name: string;
  department: string;
  logo: string | null;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeamImagesSlider() {
  const [teamImages, setTeamImages] = useState<TeamImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Demo team images to show when no images are available
  const demoTeamImages: TeamImage[] = [
    {
      id: -1,
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696095aa84cc?w=800&h=600&fit=crop',
      teamName: 'Basketball Team',
      sport: 'Basketball',
      color: '#f58002',
    },
    {
      id: -2,
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
      teamName: 'Football Team',
      sport: 'Football',
      color: '#f58002',
    },
    {
      id: -3,
      imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=600&fit=crop',
      teamName: 'Cricket Team',
      sport: 'Cricket',
      color: '#f58002',
    },
    {
      id: -5,
      imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop',
      teamName: 'Volleyball Team',
      sport: 'Volleyball',
      color: '#f58002',
    },
    {
      id: -6,
      imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=600&fit=crop',
      teamName: 'Swimming Team',
      sport: 'Swimming',
      color: '#f58002',
    },
    {
      id: -7,
      imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=600&fit=crop',
      teamName: 'Tennis Team',
      sport: 'Tennis',
      color: '#f58002',
    },
    {
      id: -8,
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
      teamName: 'Badminton Team',
      sport: 'Badminton',
      color: '#f58002',
    },
  ];

  useEffect(() => {
    fetchTeamImages();
    
    // Listen for custom event when teams are updated
    const handleTeamsUpdate = () => {
      fetchTeamImages();
    };
    
    window.addEventListener('teamsUpdated', handleTeamsUpdate);
    window.addEventListener('storage', handleTeamsUpdate);
    
    return () => {
      window.removeEventListener('teamsUpdated', handleTeamsUpdate);
      window.removeEventListener('storage', handleTeamsUpdate);
    };
  }, []);

  const fetchTeamImages = async () => {
    try {
      setLoading(true);
      // Fetch teams from API
      try {
        const response = await fetch(`${API_BASE_URL}/api/teams`);
        if (response.ok) {
          const teams: Team[] = await response.json();
          if (teams && teams.length > 0) {
            // Map teams to TeamImage format, filter out teams without logos
            const mappedTeams: TeamImage[] = teams
              .filter(team => team.logo) // Only show teams with logos
              .map(team => ({
                id: team.id,
                imageUrl: team.logo!,
                teamName: team.name,
                sport: team.department,
                color: team.color || '#f58002',
              }));
            
            // Use mapped teams if available, otherwise fallback to demo
            setTeamImages(mappedTeams.length > 0 ? mappedTeams : demoTeamImages);
            return;
          }
        }
      } catch (apiError) {
        console.log('API not available, using demo images:', apiError);
      }
      
      // Fallback to demo images
      setTeamImages(demoTeamImages);
    } catch (error) {
      console.error('Error fetching team images:', error);
      setTeamImages(demoTeamImages);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (imageUrl: string) => {
    setFailedImages(prev => new Set(prev).add(imageUrl));
  };

  const getFallbackImage = (team: TeamImage) => {
    // Return a placeholder or demo image based on team name
    const placeholderIndex = Math.abs(team.id) % demoTeamImages.length;
    return demoTeamImages[placeholderIndex]?.imageUrl || 'https://images.unsplash.com/photo-1518611012118-696095aa84cc?w=800&h=600&fit=crop';
  };

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

  // Always show the section with demo images as fallback
  const imagesToDisplay = teamImages.length > 0 ? teamImages : demoTeamImages;

  return (
    <section className="pt-4 pb-12 md:pb-16 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-50/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Horizontal Slider Container */}
        <div className="relative">
          {/* Gradient Overlays for Fade Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Slider Track */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll gap-5 md:gap-5" style={{
              animation: `scroll ${imagesToDisplay.length * 3}s linear infinite`,
            }}>
              {/* Duplicate images for seamless loop */}
              {[...imagesToDisplay, ...imagesToDisplay].map((team, index) => (
                <div
                  key={`${team.id}-${index}`}
                  className="flex-shrink-0 group"
                >
                  <div className="flex flex-col items-center">
                    <div 
                      className="relative w-40 md:w-56 h-40 md:h-56 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-2"
                      style={{ borderColor: team.color || '#f58002' }}
                    >
                      {failedImages.has(team.imageUrl) ? (
                        <Image
                          src={getFallbackImage(team)}
                          alt={team.teamName}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                          sizes="(max-width: 768px) 160px, 224px"
                        />
                      ) : (
                        <Image
                          src={team.imageUrl}
                          alt={team.teamName}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 160px, 224px"
                          onError={() => handleImageError(team.imageUrl)}
                          unoptimized={team.imageUrl.startsWith('http://') || team.imageUrl.startsWith('https://')}
                        />
                      )}
                      {/* Overlay with Team Info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-bold text-lg mb-1">{team.teamName}</h3>
                          <p className="text-sm text-white/90">{team.sport}</p>
                        </div>
                      </div>
                      {/* Badge */}
                      {/* <div className="absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg" style={{ backgroundColor: '#f58002' }}>
                        {team.sport}
                      </div> */}
                    </div>
                    {/* Team Name Below Image */}
                    <div className="mt-3 md:mt-4 text-center">
                      <h3 className="font-bold text-base md:text-lg text-black">{team.teamName}</h3>
                      {/* <p className="text-sm text-gray-600 mt-1">{team.sport}</p> */}
                    </div>
                  </div>
                </div>
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

