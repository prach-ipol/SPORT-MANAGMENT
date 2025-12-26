'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { API_BASE_URL } from '@/config/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Check admin credentials first
      if (email.toLowerCase() === 'admin' && password === 'Saurabh@2000') {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', email);
        router.push('/admin');
        return;
      }

      // Try manager login (email as userID, contact as password)
      const response = await fetch(`${API_BASE_URL}/api/managers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          contact: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store manager session
        localStorage.setItem('isManager', 'true');
        localStorage.setItem('managerId', data.manager.id.toString());
        localStorage.setItem('managerEmail', data.manager.email);
        localStorage.setItem('managerName', data.manager.name);
        localStorage.setItem('managerData', JSON.stringify(data.manager));
        // Redirect to manager dashboard
        router.push('/manager/dashboard');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Invalid credentials' }));
        setError(errorData.error || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Login Form (White Background) */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center px-8 md:px-16 py-12">
        {/* Medium Size Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#f58002' }}>
              Yashavantrao Chavan Institute of Science <br />
            </Link>
            <Link href="/" className="text-2xl font-bold" style={{ color: '#b52b26' }}>
              <center>YCIS Sports Festival 2025-26 </center>
            </Link>
          </div>

          {/* Main Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Log in to Account
            </h1>
            <div className="w-20 h-1" style={{ backgroundColor: '#f58002' }}></div>
          </div>

          {/* Separator */}
          <p className="text-sm text-gray-500 mb-6">or use your email account</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#f58002' } as React.CSSProperties}
                placeholder="Email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#f58002' } as React.CSSProperties}
                placeholder="Password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ backgroundColor: '#f58002', '--tw-ring-color': '#f58002' } as React.CSSProperties}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Log In
              </span>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Go Back to Home Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-[#f58002] transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go back to Home Page
          </Link>
        </div>
        </div>
      </div>

      {/* Right Column - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#f58002' }}>
        <div className="relative w-full h-full">
          <Image
            src="/sportsh/260A0124.JPG"
            alt="Sports Highlights - Students and athletes on field"
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
          {/* Optional overlay for better text contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f58002]/20"></div>
        </div>
      </div>
    </div>
  );
}

