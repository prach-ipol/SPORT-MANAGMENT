'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';

interface Student {
  id: number;
  name: string;
  prn_uid: string;
  contact: string;
  email?: string;
  address?: string;
  birthDate: string;
  size: number;
  age: number;
  managerId: number;
  isSelected?: boolean;
  selectionId?: number;
}

interface Coach {
  id: number;
  name: string;
  contact: string;
  email?: string;
  specialization?: string;
  managerId: number;
}

interface Manager {
  id: number;
  name: string;
  email: string;
  sport: string;
  department: string;
}

export default function ManagerDashboard() {
  const router = useRouter();
  const [manager, setManager] = useState<Manager | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'link-generation' | 'coaches' | 'students'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Link Generation State
  const [generatedLinks, setGeneratedLinks] = useState<any[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null);
  const [linkStudents, setLinkStudents] = useState<Student[]>([]);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(false);
  
  // Coach Form State
  const [coachFormData, setCoachFormData] = useState({
    name: '',
    contact: '',
    email: '',
    specialization: '',
  });
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [submittingCoach, setSubmittingCoach] = useState(false);

  useEffect(() => {
    // Check if user is manager
    const isManager = localStorage.getItem('isManager');
    const managerData = localStorage.getItem('managerData');
    
    if (!isManager || !managerData) {
      router.push('/login');
      return;
    }

    const managerInfo = JSON.parse(managerData);
    setManager(managerInfo);
    
    fetchStudents();
    fetchCoaches();
    if (activeTab === 'link-generation') {
      fetchGeneratedLinks();
    }
  }, [router]);

  useEffect(() => {
    if (activeTab === 'link-generation') {
      fetchGeneratedLinks();
    }
    if (selectedLinkId) {
      fetchLinkStudents(selectedLinkId);
    }
  }, [activeTab, selectedLinkId]);

  const fetchStudents = async () => {
    try {
      const managerId = localStorage.getItem('managerId');
      if (!managerId) return;

      const response = await fetch(`${API_BASE_URL}/api/students-with-selections?managerId=${managerId}`);
      if (response.ok) {
        const data = await response.json();
        // DEBUG: log student data to verify `size` values
        // Remove these logs once issue is diagnosed
        // eslint-disable-next-line no-console
        console.log('Fetched students (manager):', data);
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCoaches = async () => {
    try {
      const managerId = localStorage.getItem('managerId');
      if (!managerId) return;

      const response = await fetch(`${API_BASE_URL}/api/coaches?managerId=${managerId}`);
      if (response.ok) {
        const data = await response.json();
        setCoaches(data);
      }
    } catch (error) {
      console.error('Error fetching coaches:', error);
    }
  };

  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const fetchGeneratedLinks = async () => {
    try {
      setLoadingLinks(true);
      const managerId = localStorage.getItem('managerId');
      if (!managerId) return;

      const response = await fetch(`${API_BASE_URL}/api/student-links?managerId=${managerId}`);
      if (response.ok) {
        const data = await response.json();
        setGeneratedLinks(data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoadingLinks(false);
    }
  };

  const fetchLinkStudents = async (linkId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student-links/${linkId}/students`);
      if (response.ok) {
        const data = await response.json();
        // DEBUG: log link students to verify `size` values
        // Remove these logs once issue is diagnosed
        // eslint-disable-next-line no-console
        console.log('Fetched link students (linkId=' + linkId + '):', data);
        setLinkStudents(data);
      }
    } catch (error) {
      console.error('Error fetching link students:', error);
    }
  };

  const generateLink = async () => {
    try {
      setGeneratingLink(true);
      const managerId = localStorage.getItem('managerId');
      if (!managerId) {
        alert('Manager session expired. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/student-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ managerId: parseInt(managerId) }),
      });

      if (response.ok) {
        await fetchGeneratedLinks();
        alert('Link generated successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(errorData.error || 'Failed to generate link. Please try again.');
      }
    } catch (error) {
      console.error('Error generating link:', error);
      alert('Failed to generate link. Please try again.');
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyLinkToClipboard = (token: string) => {
    const link = `${window.location.origin}/student-form/${token}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link. Please copy manually.');
    });
  };

  const toggleLinkStatus = async (linkId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student-links/${linkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await fetchGeneratedLinks();
      } else {
        alert('Failed to update link status.');
      }
    } catch (error) {
      console.error('Error updating link status:', error);
      alert('Failed to update link status.');
    }
  };

  const deleteLink = async (linkId: number) => {
    if (!confirm('Are you sure you want to delete this link? This will not delete submitted students.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/student-links/${linkId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchGeneratedLinks();
        if (selectedLinkId === linkId) {
          setSelectedLinkId(null);
          setLinkStudents([]);
        }
        alert('Link deleted successfully!');
      } else {
        alert('Failed to delete link.');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Failed to delete link.');
    }
  };

  const handleCoachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coachFormData.name.trim() || !coachFormData.contact.trim()) {
      alert('Name and Contact are required');
      return;
    }

    setSubmittingCoach(true);

    try {
      const managerId = localStorage.getItem('managerId');
      if (!managerId) {
        alert('Manager session expired. Please login again.');
        router.push('/login');
        return;
      }

      const url = editingCoach
        ? `${API_BASE_URL}/api/coaches/${editingCoach.id}`
        : `${API_BASE_URL}/api/coaches`;
      
      const method = editingCoach ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...coachFormData,
          managerId: parseInt(managerId),
        }),
      });

      if (response.ok) {
        await fetchCoaches();
        setCoachFormData({ name: '', contact: '', email: '', specialization: '' });
        setEditingCoach(null);
        alert(editingCoach ? 'Coach updated successfully!' : 'Coach added successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(errorData.error || 'Failed to save coach. Please try again.');
      }
    } catch (error) {
      console.error('Error saving coach:', error);
      alert('Failed to save coach. Please try again.');
    } finally {
      setSubmittingCoach(false);
    }
  };

  const handleDeleteCoach = async (id: number) => {
    if (confirm('Are you sure you want to delete this coach?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/coaches/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchCoaches();
        } else {
          alert('Failed to delete coach.');
        }
      } catch (error) {
        console.error('Error deleting coach:', error);
        alert('Failed to delete coach. Please try again.');
      }
    }
  };

  const handleToggleStudentSelection = async (studentId: number, isSelected: boolean) => {
    try {
      const managerId = localStorage.getItem('managerId');
      if (!managerId) return;

      const response = await fetch(`${API_BASE_URL}/api/student-selections/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          managerId: parseInt(managerId),
          isSelected: !isSelected,
        }),
      });

      if (response.ok) {
        await fetchStudents();
      } else {
        alert('Failed to update student selection.');
      }
    } catch (error) {
      console.error('Error toggling student selection:', error);
      alert('Failed to update student selection. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isManager');
    localStorage.removeItem('managerId');
    localStorage.removeItem('managerEmail');
    localStorage.removeItem('managerName');
    localStorage.removeItem('managerData');
    router.push('/login');
  };

  if (!manager) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00BFFF] border-t-transparent"></div>
      </div>
    );
  }

  const selectedStudentsCount = students.filter(s => s.isSelected).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'link-generation',
      label: 'Link Generation',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      id: 'coaches',
      label: 'Coach Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'students',
      label: 'Student Details',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 shadow-md" style={{ backgroundColor: '#00BFFF' }}>
        <div className="flex items-center justify-between px-4 py-3 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">
              Manager <span className="text-white/90">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-white">
              Welcome, <span className="font-semibold text-white">{manager.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Left Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 transition-all duration-300 z-30 shadow-lg ${
            isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}
          style={{ backgroundColor: '#00BFFF' }}
        >
          <nav className="p-4 space-y-2 h-full overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-white text-[#00BFFF] shadow-lg font-semibold'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="p-6 bg-white">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black">Dashboard Overview</h2>
                            {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{students.length}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Selected Students</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{selectedStudentsCount}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Coaches</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{coaches.length}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">Quick Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('link-generation')}
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-black">Add New Student</div>
                    <div className="text-sm text-gray-600 mt-1">Generate link for new student</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('coaches')}
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-black">Manage Coaches</div>
                    <div className="text-sm text-gray-600 mt-1">Add or edit coaches</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('students')}
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-black">View Students</div>
                    <div className="text-sm text-gray-600 mt-1">Manage student selections</div>
                  </button>
                </div>
              </div>

              {/* Manager Info */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-lg font-medium text-black">{manager.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-medium text-black">{manager.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="text-lg font-medium text-black">{manager.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sport</p>
                    <p className="text-lg font-medium text-black">{manager.sport}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'link-generation' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-black">Link Generation</h2>
                <button
                  onClick={generateLink}
                  disabled={generatingLink}
                  className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingLink ? 'Generating...' : 'Generate New Link'}
                </button>
              </div>

              {/* Generated Links List */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">Generated Links</h3>
                {loadingLinks ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-[#00BFFF] mx-auto"></div>
                  </div>
                ) : generatedLinks.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    <p>No links generated yet. Click "Generate New Link" to create one.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generatedLinks.map((link: any) => {
                      const fullLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/student-form/${link.token}`;
                      return (
                        <div
                          key={link.id}
                          className={`p-4 border-2 rounded-lg ${
                            selectedLinkId === link.id
                              ? 'border-[#00BFFF] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  link.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {link.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {link.studentCount || 0} student(s) submitted
                                </span>
                                <span className="text-sm text-gray-500">
                                  Created: {new Date(link.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg mb-2">
                                <p className="text-sm text-gray-600 mb-1">Share this link with students:</p>
                                <div className="flex items-center gap-2">
                                  <code className="flex-1 text-xs bg-white px-3 py-2 rounded border border-gray-300 text-gray-800 break-all">
                                    {fullLink}
                                  </code>
                                  <button
                                    onClick={() => copyLinkToClipboard(link.token)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
                                  >
                                    Copy
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                              <button
                                onClick={() => {
                                  if (selectedLinkId === link.id) {
                                    setSelectedLinkId(null);
                                    setLinkStudents([]);
                                  } else {
                                    setSelectedLinkId(link.id);
                                    fetchLinkStudents(link.id);
                                  }
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  selectedLinkId === link.id
                                    ? 'bg-[#00BFFF] text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                }`}
                              >
                                {selectedLinkId === link.id ? 'Hide Students' : 'View Students'}
                              </button>
                              <button
                                onClick={() => toggleLinkStatus(link.id, link.isActive)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  link.isActive
                                    ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                                    : 'bg-green-100 hover:bg-green-200 text-green-800'
                                }`}
                              >
                                {link.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => deleteLink(link.id)}
                                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-medium transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Students List for this link */}
                          {selectedLinkId === link.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <h4 className="font-semibold text-black mb-3">Submitted Students ({linkStudents.length})</h4>
                              {linkStudents.length === 0 ? (
                                <p className="text-gray-600 text-sm">No students have submitted via this link yet.</p>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">PRN/UID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Contact</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Address</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date of Birth</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Size</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Age</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Submitted</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {linkStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                          <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                                          <td className="px-4 py-3 text-sm text-gray-600">{student.prn_uid}</td>
                                          <td className="px-4 py-3 text-sm text-gray-600">{student.contact}</td>
                                          <td className="px-4 py-3 text-sm text-gray-600">{student.email || '-'}</td>
                                          <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{student.address || '-'}</td>
                                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(student.birthDate).toLocaleDateString()}</td>
                                          <td className="px-4 py-3 text-sm text-gray-600">{student.size ?? '-'}</td>
                                          <td className="px-4 py-3 text-sm text-gray-600">{student.age}</td>
                                          {/* <td className="px-4 py-3 text-sm text-gray-600">{new Date(student.createdAt || '').toLocaleDateString()}</td> */}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'coaches' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black">Coach Management</h2>
              
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-black mb-6">
                  {editingCoach ? 'Edit Coach' : 'Add New Coach'}
                </h3>
                <form onSubmit={handleCoachSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={coachFormData.name}
                        onChange={(e) => setCoachFormData({ ...coachFormData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        placeholder="Enter coach name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Contact <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={coachFormData.contact}
                        onChange={(e) => setCoachFormData({ ...coachFormData, contact: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        placeholder="Enter contact number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={coachFormData.email}
                        onChange={(e) => setCoachFormData({ ...coachFormData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={coachFormData.specialization}
                        onChange={(e) => setCoachFormData({ ...coachFormData, specialization: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        placeholder="Enter specialization"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button
                      type="submit"
                      disabled={submittingCoach}
                      className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingCoach ? 'Saving...' : editingCoach ? 'Update Coach' : 'Add Coach'}
                    </button>
                    {editingCoach && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCoach(null);
                          setCoachFormData({ name: '', contact: '', email: '', specialization: '' });
                        }}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Coaches List */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-black mb-6">All Coaches ({coaches.length})</h3>
                {coaches.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No coaches added yet. Add your first coach above.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Specialization
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {coaches.map((coach) => (
                          <tr key={coach.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                              {coach.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {coach.contact}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {coach.email || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {coach.specialization || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => {
                                  setEditingCoach(coach);
                                  setCoachFormData({
                                    name: coach.name,
                                    contact: coach.contact,
                                    email: coach.email || '',
                                    specialization: coach.specialization || '',
                                  });
                                }}
                                className="text-[#00BFFF] hover:text-[#0099CC] font-medium mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCoach(coach.id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black">Student Details</h2>
              
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-black">
                    All Students ({students.length}) - Selected: {selectedStudentsCount}
                  </h3>
                </div>
                
                {students.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No students added yet. Add students from the Link Generation section.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Select
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            PRN/UID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Age
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={student.isSelected || false}
                                onChange={() => handleToggleStudentSelection(student.id, student.isSelected || false)}
                                className="w-4 h-4 text-[#00BFFF] border-gray-300 rounded focus:ring-[#00BFFF]"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                              {student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {student.prn_uid}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {student.contact}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {student.email || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {student.size ?? '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {student.age}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  student.isSelected
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {student.isSelected ? 'Selected' : 'Not Selected'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
}

