'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on admin pages, manager pages, and login page
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/manager') || pathname === '/login') {
    return null;
  }
  
  return <Footer />;
}

