import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import TeamImagesSlider from '@/components/TeamImagesSlider';
import NoticeBoard from '@/components/NoticeBoard';
import SportsHighlights from '@/components/SportsHighlights';
import SportsVideo from '@/components/SportsVideo';
import EventsImagesSlider from '@/components/EventsImagesSlider';
import { AboutInstitute } from '@/components/Institute';
import PatternDivider from '@/components/PatternDivider';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSlider />
      <PatternDivider pattern="waves" />
      <TeamImagesSlider />
      <PatternDivider pattern="dots" />
      <NoticeBoard />
      <PatternDivider pattern="zigzag" />
      <SportsHighlights />
      <PatternDivider pattern="lines" />
      <SportsVideo />
      <PatternDivider pattern="circles" />
      <EventsImagesSlider />
      <PatternDivider pattern="diagonal" />
      <AboutInstitute/>
    </div>
  );
}
