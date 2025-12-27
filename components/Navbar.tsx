'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Blur and transparent background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20"></div>
      
      {/* Content */}
      <div className="relative max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3 md:px-6 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse z-10">
          <span className="self-center text-xl md:text-2xl font-bold whitespace-nowrap text-black">
            YCIS <span className="text-[#f58002]">Sports</span>
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-[#f58002]/50 transition-all z-10"
          aria-controls="navbar-dropdown"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-dropdown">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-black/10 rounded-xl bg-white/90 backdrop-blur-sm md:space-x-6 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            {/* Home */}
            <li>
              <Link
                href="/"
                className={`block py-2 px-3 rounded-lg md:px-4 md:py-2 transition-all duration-200 ${
                  pathname === '/'
                    ? 'text-[#f58002] bg-[#f58002]/10 md:bg-[#f58002]/10 font-semibold'
                    : 'text-black hover:text-[#f58002] hover:bg-black/5 md:hover:bg-[#f58002]/10'
                }`}
                aria-current={pathname === '/' ? 'page' : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>

            {/* About with Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                id="dropdownNavbarButton"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center justify-between w-full py-2 px-3 rounded-lg font-medium md:w-auto md:px-4 md:py-2 transition-all duration-200 ${
                  isDropdownOpen
                    ? 'text-[#f58002] bg-[#f58002]/10'
                    : 'text-black hover:text-[#f58002] hover:bg-black/5 md:hover:bg-[#f58002]/10'
                }`}
              >
                About
                <svg
                  className={`w-4 h-4 ms-1.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                </svg>
              </button>
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 md:left-auto z-10 mt-2 bg-white/95 backdrop-blur-md border border-black/10 rounded-xl shadow-xl w-44 overflow-hidden">
                  <ul className="p-2 text-sm font-medium">
                    <li>
                      <Link
                        href="/events"
                        className="inline-flex items-center w-full p-2.5 hover:bg-[#f58002]/10 hover:text-[#f58002] rounded-lg transition-colors duration-200 text-black"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        Events
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/news"
                        className="inline-flex items-center w-full p-2.5 hover:bg-[#f58002]/10 hover:text-[#f58002] rounded-lg transition-colors duration-200 text-black"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        News
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>

            {/* Login Button */}
            <li>
              <Link
                href="/login"
                className="block py-2 px-4 text-white bg-[#f58002] rounded-lg hover:bg-[#e67000] md:px-5 md:py-2.5 font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

