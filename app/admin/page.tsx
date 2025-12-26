'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from '@/config/api';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  href?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    href: '/admin',
  },
  {
    id: 'sports',
    label: 'Sports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    id: 'teams',
    label: 'Teams',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'notices',
    label: 'Notices',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    id: 'news',
    label: 'News',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    href: '/admin/news',
  },
  {
    id: 'events',
    label: 'Events',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    href: '/admin/events',
  },
    {
      id: 'event-images',
      label: 'Event Images',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  {
    id: 'managers',
    label: 'Managers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    href: '/admin/settings',
  },
];

interface Manager {
  id: string;
  name: string;
  department: string;
  sport: string;
  contact: string;
  email: string;
  studentCount: number;
  teamId?: number;
  teamName?: string;
  teamDepartment?: string;
  createdAt: string;
}

interface DashboardTeam {
  id: string;
  teamName: string;
  sport: string;
  teamLeaderName: string;
  studentSelectedCount: number;
}

interface Sport {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Team {
  id: number;
  name: string;
  department: string;
  logo?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EventImage {
  id: number;
  title?: string;
  description?: string;
  imageUrl: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

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

// Team interface for dashboard display (different structure)
interface DashboardTeam {
  id: string;
  teamName: string;
  sport: string;
  teamLeaderName: string;
  studentSelectedCount: number;
}

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');
  const router = useRouter();

  // Managers state
  const [managers, setManagers] = useState<Manager[]>([]);
  const [addMethod, setAddMethod] = useState<'manual' | 'excel'>('manual');
  const [managerFormData, setManagerFormData] = useState({
    name: '',
    department: '',
    sport: '',
    contact: '',
    email: '',
    studentCount: '',
    teamId: '',
  });
  const [managerErrors, setManagerErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submittingManager, setSubmittingManager] = useState(false);
  
  // Teams state (for dashboard display)
  const [teams, setTeams] = useState<DashboardTeam[]>([]);
  
  // Teams Management state
  const [teamsList, setTeamsList] = useState<Team[]>([]);
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    department: '',
    color: '#f58002',
  });
  const [teamLogoFile, setTeamLogoFile] = useState<File | null>(null);
  const [teamLogoPreview, setTeamLogoPreview] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [submittingTeam, setSubmittingTeam] = useState(false);
  
  // Sports state
  const [sports, setSports] = useState<Sport[]>([]);
  const [sportFormData, setSportFormData] = useState({
    name: '',
    description: '',
  });
  const [editingSport, setEditingSport] = useState<Sport | null>(null);
  const [submittingSport, setSubmittingSport] = useState(false);

  // Event Images state
  const [eventImages, setEventImages] = useState<EventImage[]>([]);
  const [eventImageFormData, setEventImageFormData] = useState({
    title: '',
    description: '',
    displayOrder: '0',
  });
  const [editingEventImage, setEditingEventImage] = useState<EventImage | null>(null);
  const [selectedEventImageFile, setSelectedEventImageFile] = useState<File | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);
  const [submittingEventImage, setSubmittingEventImage] = useState(false);

  // Notices state
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticeFormData, setNoticeFormData] = useState({
    title: '',
    description: '',
    noticeDate: '',
  });
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [selectedNoticeFile, setSelectedNoticeFile] = useState<File | null>(null);
  const [selectedScheduleImageFile, setSelectedScheduleImageFile] = useState<File | null>(null);
  const [scheduleImagePreview, setScheduleImagePreview] = useState<string | null>(null);
  const [submittingNotice, setSubmittingNotice] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.push('/login');
    }
    fetchManagers();
    fetchTeams();
    fetchSports();
    fetchTeamsList();
    fetchEventImages();
    fetchNotices();

    // Listen for team images updates
    const handleTeamImagesUpdate = () => {
      fetchTeams();
    };
    window.addEventListener('teamImagesUpdated', handleTeamImagesUpdate);

    // Listen for event images updates
    const handleEventImagesUpdate = () => {
      fetchEventImages();
    };
    window.addEventListener('eventImagesUpdated', handleEventImagesUpdate);

    return () => {
      window.removeEventListener('teamImagesUpdated', handleTeamImagesUpdate);
      window.removeEventListener('eventImagesUpdated', handleEventImagesUpdate);
    };
  }, [router]);

  // Refresh sports when managers section is active
  useEffect(() => {
    if (activeItem === 'managers' || activeItem === 'sports') {
      fetchSports();
    }
    if (activeItem === 'teams' || activeItem === 'managers') {
      fetchTeamsList();
    }
    if (activeItem === 'event-images') {
      fetchEventImages();
    }
    if (activeItem === 'notices') {
      fetchNotices();
    }
  }, [activeItem]);

  const fetchManagers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/managers`);
      if (response.ok) {
        const data = await response.json();
        setManagers(data);
        // Also update localStorage as fallback
        localStorage.setItem('managers', JSON.stringify(data));
      } else {
        // Fallback to localStorage if server is not available
        const stored = localStorage.getItem('managers');
        if (stored) {
          setManagers(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
      // Fallback to localStorage if server is not available
      const stored = localStorage.getItem('managers');
      if (stored) {
        setManagers(JSON.parse(stored));
      }
    }
  };

  const saveManagers = async (managersList: Manager[]) => {
    // Update local state immediately
    setManagers(managersList);
    // Also update localStorage as fallback
    localStorage.setItem('managers', JSON.stringify(managersList));
    // Refresh teams data when managers change
    setTimeout(() => fetchTeams(), 100);
  };

  const validateManagerForm = () => {
    const newErrors: Record<string, string> = {};

    if (!managerFormData.name.trim()) {
      newErrors.name = 'Manager Name is required';
    }

    if (!managerFormData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!managerFormData.sport.trim()) {
      newErrors.sport = 'Sport is required';
    }

    if (!managerFormData.contact.trim()) {
      newErrors.contact = 'Contact is required';
    }

    if (!managerFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(managerFormData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!managerFormData.studentCount.trim()) {
      newErrors.studentCount = 'Count of Student is required';
    } else {
      const count = Number(managerFormData.studentCount);
      if (isNaN(count) || count <= 0 || !Number.isInteger(count)) {
        newErrors.studentCount = 'Count of Student must be a positive whole number';
      }
    }

    setManagerErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleManualManagerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateManagerForm()) {
      return;
    }

    setSubmittingManager(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/managers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: managerFormData.name.trim(),
          department: managerFormData.department.trim(),
          sport: managerFormData.sport.trim(),
          contact: managerFormData.contact.trim(),
          email: managerFormData.email.trim(),
          studentCount: Number(managerFormData.studentCount),
          teamId: managerFormData.teamId ? Number(managerFormData.teamId) : null,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Refresh managers list
        await fetchManagers();
        // Refresh teams
        fetchTeams();

        // Reset form
        setManagerFormData({
          name: '',
          department: '',
          sport: '',
          contact: '',
          email: '',
          studentCount: '',
          teamId: '',
        });
        setManagerErrors({});

        alert('Manager added successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(errorData.error || 'Failed to add manager. Please try again.');
      }
    } catch (error) {
      console.error('Error adding manager:', error);
      // Fallback to localStorage if server is not available
      const newManager: Manager = {
        id: Date.now().toString(),
        name: managerFormData.name.trim(),
        department: managerFormData.department.trim(),
        sport: managerFormData.sport.trim(),
        contact: managerFormData.contact.trim(),
        email: managerFormData.email.trim(),
        studentCount: Number(managerFormData.studentCount),
        createdAt: new Date().toISOString(),
      };
      const updatedManagers = [...managers, newManager];
      saveManagers(updatedManagers);
      alert('Manager added locally. Note: Server is not running.');
    } finally {
      setSubmittingManager(false);
    }
  };

  const handleExcelManagerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select an Excel file');
      return;
    }

    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setSubmittingManager(true);

    try {
      // Read the Excel file
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        try {
          const data = event.target?.result;
          if (!data) {
            throw new Error('Failed to read file');
          }

          // Parse Excel file
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

          if (jsonData.length < 2) {
            alert('Excel file must have at least a header row and one data row');
            setSubmittingManager(false);
            setSelectedFile(null);
            return;
          }

          // Get header row (first row)
          const headers = (jsonData[0] as string[]).map((h: string) => String(h).trim().toUpperCase());
          
          // Expected column indices (case-insensitive matching)
          const expectedColumns = ['MANAGER NAME', 'DEPARTMENT', 'SPORT', 'TEAM NAME', 'CONTACT', 'EMAIL', 'STUDENT COUNT'];
          const columnIndices: { [key: string]: number } = {};

          expectedColumns.forEach(col => {
            const index = headers.findIndex(h => h === col || h.includes(col));
            if (index === -1) {
              // Try alternative names
              if (col === 'MANAGER NAME' && headers.findIndex(h => h.includes('NAME') && !h.includes('TEAM')) !== -1) {
                columnIndices[col] = headers.findIndex(h => h.includes('NAME') && !h.includes('TEAM'));
              } else if (col === 'TEAM NAME' && headers.findIndex(h => h.includes('TEAM')) !== -1) {
                columnIndices[col] = headers.findIndex(h => h.includes('TEAM'));
              } else if (col === 'STUDENT COUNT' && headers.findIndex(h => h.includes('STUDENT') || h.includes('COUNT')) !== -1) {
                columnIndices[col] = headers.findIndex(h => h.includes('STUDENT') || h.includes('COUNT'));
              } else {
                throw new Error(`Column "${col}" not found in Excel file. Please check the column headers.`);
              }
            } else {
              columnIndices[col] = index;
            }
          });

          // Parse data rows
          const managers: any[] = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            
            // Skip empty rows
            if (row.every(cell => !cell || String(cell).trim() === '')) {
              continue;
            }

            const managerName = String(row[columnIndices['MANAGER NAME']] || '').trim();
            const department = String(row[columnIndices['DEPARTMENT']] || '').trim();
            const sport = String(row[columnIndices['SPORT']] || '').trim();
            const teamName = String(row[columnIndices['TEAM NAME']] || '').trim();
            const contact = String(row[columnIndices['CONTACT']] || '').trim();
            const email = String(row[columnIndices['EMAIL']] || '').trim();
            const studentCount = String(row[columnIndices['STUDENT COUNT']] || '').trim();

            // Find team ID if team name is provided
            let teamId = null;
            if (teamName) {
              const team = teamsList.find(t => t.name.toLowerCase() === teamName.toLowerCase());
              if (team) {
                teamId = team.id;
              }
            }

            managers.push({
              name: managerName,
              department: department,
              sport: sport,
              contact: contact,
              email: email,
              studentCount: studentCount,
              teamId: teamId
            });
          }

          if (managers.length === 0) {
            alert('No valid data rows found in Excel file');
            setSubmittingManager(false);
            setSelectedFile(null);
            return;
          }

          // Send to server
          const response = await fetch(`${API_BASE_URL}/api/managers/bulk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ managers }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to upload managers' }));
            throw new Error(errorData.error || 'Failed to upload managers');
          }

          const result = await response.json();

          // Show results
          const successCount = result.results?.success?.length || 0;
          const errorCount = result.results?.errors?.length || 0;

          if (errorCount > 0) {
            let errorMessage = `Upload completed with errors:\n\n`;
            errorMessage += `Successfully uploaded: ${successCount} manager(s)\n`;
            errorMessage += `Failed: ${errorCount} manager(s)\n\n`;
            errorMessage += `Errors:\n`;
            result.results.errors.slice(0, 10).forEach((err: any) => {
              errorMessage += `Row ${err.row}: ${err.error}\n`;
            });
            if (errorCount > 10) {
              errorMessage += `... and ${errorCount - 10} more errors\n`;
            }
            alert(errorMessage);
          } else {
            alert(`Successfully uploaded ${successCount} manager(s)!`);
          }

          // Refresh managers list
          await fetchManagers();
          // Refresh teams
          fetchTeams();

          // Reset form
          setSelectedFile(null);
        } catch (error: any) {
          console.error('Error processing Excel file:', error);
          alert(error.message || 'Failed to process Excel file. Please check the format and try again.');
        } finally {
          setSubmittingManager(false);
        }
      };

      fileReader.onerror = () => {
        alert('Error reading file. Please try again.');
        setSubmittingManager(false);
        setSelectedFile(null);
      };

      // Read file as ArrayBuffer for better compatibility
      fileReader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error('Error uploading Excel file:', error);
      alert('Failed to upload Excel file. Please try again.');
      setSubmittingManager(false);
      setSelectedFile(null);
    }
  };

  const DEFAULT_SPORTS: Sport[] = [
    { id: -1, name: 'Kabaddi' },
    { id: -2, name: 'Cricket' },
    { id: -3, name: 'Volleyball' },
    { id: -4, name: 'Basketball' },
    { id: -5, name: 'Running 100m' },
    { id: -6, name: 'Chess' },
    { id: -7, name: 'Kho-Kho' },
  ];

  const fetchSports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sports`);
      if (response.ok) {
        const data = await response.json();
        // If server returns an empty list, fall back to defaults so dropdowns still work
        if (Array.isArray(data) && data.length > 0) {
          setSports(data);
        } else {
          console.warn('No sports returned from API, using default list');
          setSports(DEFAULT_SPORTS);
        }
      } else {
        console.warn('Failed to fetch sports, populating defaults');
        setSports(DEFAULT_SPORTS);
      }
    } catch (error) {
      console.warn('Error fetching sports, using default sports:', error);
      setSports(DEFAULT_SPORTS);
    }
  };

  const fetchTeamsList = async () => {
    try {
      console.log('Fetching teams from:', `${API_BASE_URL}/api/teams`);
      
      // First test if the endpoint exists
      try {
        const testResponse = await fetch(`${API_BASE_URL}/api/teams/test`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('Teams API test successful:', testData);
        }
      } catch (testError) {
        console.warn('Teams API test failed:', testError);
      }

      const response = await fetch(`${API_BASE_URL}/api/teams`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Teams response status:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Teams data received:', data);
        setTeamsList(data || []);
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('Failed to fetch teams:', response.status, response.statusText, errorText);
        
        // If 404, the endpoint might not be registered - set empty array
        if (response.status === 404) {
          console.warn('Teams endpoint not found (404). Server may need to be restarted.');
          setTeamsList([]);
        }
      }
    } catch (error: any) {
      console.error('Error fetching teams:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      if (error.message?.includes('Failed to fetch')) {
        console.warn(`Cannot connect to server at ${API_BASE_URL}. Server may be offline.`);
      }
      
      // Set empty array on error to prevent UI issues
      setTeamsList([]);
    }
  };

  const fetchEventImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/event-images`);
      if (response.ok) {
        const data = await response.json();
        setEventImages(data || []);
      } else {
        console.error('Failed to fetch event images');
      }
    } catch (error) {
      console.error('Error fetching event images:', error);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notices`);
      if (response.ok) {
        const data = await response.json();
        setNotices(data || []);
      } else {
        console.error('Failed to fetch notices');
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const handleEventImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedEventImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEventImageFile && !editingEventImage) {
      alert('Please select an image file');
      return;
    }

    setSubmittingEventImage(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', eventImageFormData.title);
      formDataToSend.append('description', eventImageFormData.description);
      formDataToSend.append('displayOrder', eventImageFormData.displayOrder);
      
      if (selectedEventImageFile) {
        formDataToSend.append('image', selectedEventImageFile);
      }

      const url = editingEventImage
        ? `${API_BASE_URL}/api/event-images/${editingEventImage.id}`
        : `${API_BASE_URL}/api/event-images`;
      
      const method = editingEventImage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchEventImages();
        resetEventImageForm();
        alert(editingEventImage ? 'Event image updated successfully!' : 'Event image added successfully!');
        window.dispatchEvent(new Event('eventImagesUpdated'));
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(errorData.error || 'Failed to save event image. Please try again.');
      }
    } catch (error) {
      console.error('Error saving event image:', error);
      alert('Failed to save event image. Please try again.');
    } finally {
      setSubmittingEventImage(false);
    }
  };

  const handleEditEventImage = (image: EventImage) => {
    setEditingEventImage(image);
    setEventImageFormData({
      title: image.title || '',
      description: image.description || '',
      displayOrder: image.displayOrder?.toString() || '0',
    });
    setEventImagePreview(image.imageUrl);
    setSelectedEventImageFile(null);
  };

  const handleDeleteEventImage = async (id: number) => {
    if (confirm('Are you sure you want to delete this event image?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/event-images/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchEventImages();
          window.dispatchEvent(new Event('eventImagesUpdated'));
          alert('Event image deleted successfully!');
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          alert(errorData.error || 'Failed to delete event image.');
        }
      } catch (error) {
        console.error('Error deleting event image:', error);
        alert('Failed to delete event image. Please try again.');
      }
    }
  };

  const resetEventImageForm = () => {
    setEventImageFormData({ title: '', description: '', displayOrder: '0' });
    setSelectedEventImageFile(null);
    setEventImagePreview(null);
    setEditingEventImage(null);
  };

  const handleSportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sportFormData.name.trim()) {
      alert('Sport name is required');
      return;
    }

    setSubmittingSport(true);

    const url = editingSport
      ? `${API_BASE_URL}/api/sports/${editingSport.id}`
      : `${API_BASE_URL}/api/sports`;
    
    const method = editingSport ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sportFormData.name.trim(),
          description: sportFormData.description.trim() || null,
        }),
      });

      if (response.ok) {
        await fetchSports();
        setSportFormData({ name: '', description: '' });
        setEditingSport(null);
        alert(editingSport ? 'Sport updated successfully!' : 'Sport added successfully!');
      } else {
        let errorMessage = 'Failed to save sport. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
          } catch (textError) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        }
        console.error('Error response:', response.status, errorMessage);
        alert(errorMessage);
      }
    } catch (error: any) {
      console.error('Error saving sport:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        url: url
      });
      
      // Check if it's a network error
      if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
        alert(`Cannot connect to server at ${API_BASE_URL}. Please ensure:\n1. The server is running\n2. The server is accessible at ${API_BASE_URL}\n3. Check your network connection`);
      } else {
        alert(`Network error: ${error.message || 'Failed to save sport. Please check your connection.'}`);
      }
    } finally {
      setSubmittingSport(false);
    }
  };

  const handleEditSport = (sport: Sport) => {
    setEditingSport(sport);
    setSportFormData({
      name: sport.name,
      description: sport.description || '',
    });
  };

  const handleDeleteSport = async (id: number) => {
    if (confirm('Are you sure you want to delete this sport?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sports/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchSports();
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          alert(errorData.error || 'Failed to delete sport.');
        }
      } catch (error) {
        console.error('Error deleting sport:', error);
        alert('Failed to delete sport. Please try again.');
      }
    }
  };

  const handleTeamLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeamLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamFormData.name.trim()) {
      alert('Team name is required');
      return;
    }

    if (!teamFormData.department.trim()) {
      alert('Team department is required');
      return;
    }

    setSubmittingTeam(true);

    const url = editingTeam
      ? `${API_BASE_URL}/api/teams/${editingTeam.id}`
      : `${API_BASE_URL}/api/teams`;
    
    const method = editingTeam ? 'PUT' : 'POST';

    try {
      const formData = new FormData();
      formData.append('name', teamFormData.name.trim());
      formData.append('department', teamFormData.department.trim());
      formData.append('color', teamFormData.color || '#f58002');
      
      if (teamLogoFile) {
        formData.append('logo', teamLogoFile);
      }

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        await fetchTeamsList();
        setTeamFormData({ name: '', department: '', color: '#f58002' });
        setTeamLogoFile(null);
        setTeamLogoPreview(null);
        setEditingTeam(null);
        // Dispatch event to update team images slider
        window.dispatchEvent(new Event('teamsUpdated'));
        alert(editingTeam ? 'Team updated successfully!' : 'Team added successfully!');
      } else {
        let errorMessage = 'Failed to save team. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
          } catch (textError) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        }
        console.error('Error response:', response.status, errorMessage);
        alert(errorMessage);
      }
    } catch (error: any) {
      console.error('Error saving team:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        url: url
      });
      
      if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
        alert(`Cannot connect to server at ${API_BASE_URL}. Please ensure:\n1. The server is running\n2. The server is accessible at ${API_BASE_URL}\n3. Check your network connection`);
      } else {
        alert(`Network error: ${error.message || 'Failed to save team. Please check your connection.'}`);
      }
    } finally {
      setSubmittingTeam(false);
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setTeamFormData({
      name: team.name,
      department: team.department,
      color: team.color || '#f58002',
    });
    setTeamLogoPreview(team.logo || null);
    setTeamLogoFile(null);
  };

  const handleDeleteTeam = async (id: number) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/teams/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchTeamsList();
          // Dispatch event to update team images slider
          window.dispatchEvent(new Event('teamsUpdated'));
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          alert(errorData.error || 'Failed to delete team.');
        }
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Failed to delete team. Please try again.');
      }
    }
  };

  // Notice handlers
  const handleNoticeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedNoticeFile(file);
    }
  };

  const handleScheduleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedScheduleImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScheduleImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!noticeFormData.title.trim()) {
      alert('Notice title is required');
      return;
    }

    if (!noticeFormData.description.trim()) {
      alert('Notice description is required');
      return;
    }

    if (!noticeFormData.noticeDate) {
      alert('Notice date is required');
      return;
    }

    setSubmittingNotice(true);

    const url = editingNotice
      ? `${API_BASE_URL}/api/notices/${editingNotice.id}`
      : `${API_BASE_URL}/api/notices`;
    
    const method = editingNotice ? 'PUT' : 'POST';

    try {
      const formData = new FormData();
      formData.append('title', noticeFormData.title.trim());
      formData.append('description', noticeFormData.description.trim());
      formData.append('noticeDate', noticeFormData.noticeDate);
      
      if (selectedNoticeFile) {
        formData.append('document', selectedNoticeFile);
      }
      
      if (selectedScheduleImageFile) {
        formData.append('scheduleImage', selectedScheduleImageFile);
      }

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        await fetchNotices();
        resetNoticeForm();
        // Dispatch event to update notice board
        window.dispatchEvent(new Event('noticesUpdated'));
        alert(editingNotice ? 'Notice updated successfully!' : 'Notice added successfully!');
      } else {
        let errorMessage = 'Failed to save notice. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
          } catch (textError) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        }
        console.error('Error response:', response.status, errorMessage);
        alert(errorMessage);
      }
    } catch (error: any) {
      console.error('Error saving notice:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        url: url
      });
      
      if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
        alert(`Cannot connect to server at ${API_BASE_URL}. Please ensure:\n1. The server is running\n2. The server is accessible at ${API_BASE_URL}\n3. Check your network connection`);
      } else {
        alert(`Network error: ${error.message || 'Failed to save notice. Please check your connection.'}`);
      }
    } finally {
      setSubmittingNotice(false);
    }
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setNoticeFormData({
      title: notice.title,
      description: notice.description,
      noticeDate: notice.noticeDate,
    });
    setSelectedNoticeFile(null);
    setSelectedScheduleImageFile(null);
    setScheduleImagePreview(notice.scheduleImageUrl || null);
  };

  const handleDeleteNotice = async (id: number) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchNotices();
          // Dispatch event to update notice board
          window.dispatchEvent(new Event('noticesUpdated'));
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          alert(errorData.error || 'Failed to delete notice.');
        }
      } catch (error) {
        console.error('Error deleting notice:', error);
        alert('Failed to delete notice. Please try again.');
      }
    }
  };

  const resetNoticeForm = () => {
    setNoticeFormData({ title: '', description: '', noticeDate: '' });
    setSelectedNoticeFile(null);
    setSelectedScheduleImageFile(null);
    setScheduleImagePreview(null);
    setEditingNotice(null);
  };

  const handleDeleteManager = async (id: string) => {
    if (confirm('Are you sure you want to delete this manager?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/managers/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Refresh managers list
          await fetchManagers();
          // Refresh teams
          fetchTeams();
        } else {
          // Fallback to localStorage if server is not available
          const updatedManagers = managers.filter((m) => m.id !== id);
          saveManagers(updatedManagers);
          alert('Manager deleted locally. Note: Server is not running.');
        }
      } catch (error) {
        console.error('Error deleting manager:', error);
        // Fallback to localStorage if server is not available
        const updatedManagers = managers.filter((m) => m.id !== id);
        saveManagers(updatedManagers);
      }
    }
  };

  const fetchTeams = () => {
    try {
      // Get team images from localStorage
      const teamImagesData = localStorage.getItem('teamImages');
      const teamImages = teamImagesData ? JSON.parse(teamImagesData) : [];
      
      // Get managers from localStorage
      const managersData = localStorage.getItem('managers');
      const managersList = managersData ? JSON.parse(managersData) : [];
      
      // Combine data to create teams
      const teamsList: DashboardTeam[] = teamImages.map((teamImage: any, index: number) => {
        // Find manager for this sport or use default
        const manager = managersList.find((m: Manager) => m.sport === teamImage.sport) || managersList[0];
        
        return {
          id: teamImage.id || `team-${index}`,
          teamName: teamImage.teamName || 'Unnamed Team',
          sport: teamImage.sport || 'Unknown',
          teamLeaderName: manager?.name || 'Not Assigned',
          studentSelectedCount: manager?.studentCount || 0,
        };
      });
      
      // If no team images, create sample teams from managers
      if (teamsList.length === 0 && managersList.length > 0) {
        const sampleTeams = managersList.map((manager: Manager, index: number) => ({
          id: `team-${index}`,
          teamName: `${manager.sport} Team`,
          sport: manager.sport,
          teamLeaderName: manager.name,
          studentSelectedCount: manager.studentCount,
        }));
        setTeams(sampleTeams);
      } else {
        setTeams(teamsList);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      // Set default sample data
      setTeams([
        {
          id: '1',
          teamName: 'Football Team A',
          sport: 'Football',
          teamLeaderName: 'John Doe',
          studentSelectedCount: 25,
        },
        {
          id: '2',
          teamName: 'Basketball Team',
          sport: 'Basketball',
          teamLeaderName: 'Jane Smith',
          studentSelectedCount: 15,
        },
        {
          id: '3',
          teamName: 'Cricket Team',
          sport: 'Cricket',
          teamLeaderName: 'Mike Johnson',
          studentSelectedCount: 18,
        },
      ]);
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Teams Report', 14, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Prepare table data
    const tableData = teams.map(team => [
      team.teamName,
      team.sport,
      team.teamLeaderName,
      team.studentSelectedCount.toString(),
    ]);
    
    // Add table
    (doc as any).autoTable({
      head: [['Team name', 'Sport', 'Team leader name', 'Student Selected Count']],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [0, 191, 255], // #00BFFF color
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    
    // Save PDF
    doc.save(`teams-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    router.push('/login');
  };

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
              Admin <span className="text-white/90">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-white">
              Welcome, <span className="font-semibold text-white">Admin</span>
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
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveItem(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeItem === item.id
                      ? 'bg-white text-[#00BFFF] shadow-lg font-semibold'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeItem === item.id
                      ? 'bg-white text-[#00BFFF] shadow-lg font-semibold'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              )
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
            {activeItem === 'dashboard' && (
              <>
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Total Team Manager */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Team Manager</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{managers.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">From database</p>
              </div>

              {/* Total Students Enrolled in Sports */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students Enrolled in Sports</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {managers.reduce((sum, m) => sum + (m.studentCount || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">From all managers</p>
              </div>

              {/* Total Teams */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Teams</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{teams.length}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">Active teams</p>
              </div>
            </div>

            {/* Managers Details Table */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Managers Details</h2>
              {managers.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-4 text-gray-600">No managers found. Add managers from the Managers section.</p>
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
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Sport
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Email (UserID)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Contact (Password)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Student Count
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {managers.map((manager) => (
                        <tr key={manager.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                            {manager.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {manager.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {manager.sport}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {manager.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {manager.contact}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {manager.studentCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Teams Table */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
                {teams.length > 0 && (
                  <button
                    onClick={handleGeneratePDF}
                    className="px-4 py-2 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Make PDF
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Team name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Sport
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Team leader name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Student Selected Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teams.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                          <div className="flex flex-col items-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400 mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            <p>No teams available. Add team images and managers to see teams here.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      teams.map((team) => (
                        <tr key={team.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                            {team.teamName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {team.sport}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {team.teamLeaderName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {team.studentSelectedCount}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {teams.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleGeneratePDF}
                    className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Make PDF
                  </button>
                </div>
              )}
            </div>
              </>
            )}

            {activeItem === 'managers' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-black mb-2">Managers Management</h1>
                  <p className="text-gray-600">Add and manage team managers</p>
                </div>

                {/* Add Method Selection */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
                  <label className="block text-sm font-medium text-black mb-3">
                    Select Method to Add Manager
                  </label>
                  <select
                    value={addMethod}
                    onChange={(e) => {
                      setAddMethod(e.target.value as 'manual' | 'excel');
                      setManagerErrors({});
                      setManagerFormData({
                        name: '',
                        department: '',
                        sport: '',
                        contact: '',
                        email: '',
                        studentCount: '',
                        teamId: '',
                      });
                      setSelectedFile(null);
                    }}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                  >
                    <option value="manual">Manager Adding manually</option>
                    <option value="excel">Upload the excel File</option>
                  </select>
                </div>

                {/* Manual Form */}
                {addMethod === 'manual' && (
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
                    <h3 className="text-xl font-bold text-black mb-6">Add Manager Manually</h3>
                    <form onSubmit={handleManualManagerSubmit} className="space-y-4">
                      {/* Manager Name */}
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          1) Manager Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={managerFormData.name}
                          onChange={(e) => {
                            setManagerFormData({ ...managerFormData, name: e.target.value });
                            if (managerErrors.name) setManagerErrors({ ...managerErrors, name: '' });
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white ${
                            managerErrors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter manager name"
                        />
                        {managerErrors.name && <p className="text-red-500 text-sm mt-1">{managerErrors.name}</p>}
                      </div>

                      {/* Department */}
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          2) Department <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={managerFormData.department}
                          onChange={(e) => {
                            setManagerFormData({ ...managerFormData, department: e.target.value });
                            if (managerErrors.department) setManagerErrors({ ...managerErrors, department: '' });
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white ${
                            managerErrors.department ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter department name"
                        />
                        {managerErrors.department && <p className="text-red-500 text-sm mt-1">{managerErrors.department}</p>}
                      </div>

                      {/* Sport */}
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          3) Sport <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={managerFormData.sport}
                          onChange={(e) => {
                            setManagerFormData({ ...managerFormData, sport: e.target.value });
                            if (managerErrors.sport) setManagerErrors({ ...managerErrors, sport: '' });
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white ${
                            managerErrors.sport ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        >
                          <option value="">Select a sport</option>
                          {sports.map((sport) => (
                            <option key={sport.id} value={sport.name}>
                              {sport.name}
                            </option>
                          ))}
                        </select>
                        {managerErrors.sport && <p className="text-red-500 text-sm mt-1">{managerErrors.sport}</p>}
                        {sports.length === 0 && (
                          <p className="text-gray-500 text-sm mt-1">No sports available. Add sports from the Sports section.</p>
                        )}
                      </div>

                      {/* Team Name */}
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          4) Team Name
                        </label>
                        <select
                          value={managerFormData.teamId}
                          onChange={(e) => {
                            setManagerFormData({ ...managerFormData, teamId: e.target.value });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        >
                          <option value="">Select a team (Optional)</option>
                          {teamsList.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name} - {team.department}
                            </option>
                          ))}
                        </select>
                        {teamsList.length === 0 && (
                          <p className="text-gray-500 text-sm mt-1">No teams available. Add teams from the Teams section.</p>
                        )}
                      </div>

                      {/* Contact */}
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          4) Contact <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={managerFormData.contact}
                          onChange={(e) => {
                            setManagerFormData({ ...managerFormData, contact: e.target.value });
                            if (managerErrors.contact) setManagerErrors({ ...managerErrors, contact: '' });
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white ${
                            managerErrors.contact ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter contact number"
                        />
                        {managerErrors.contact && <p className="text-red-500 text-sm mt-1">{managerErrors.contact}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          5) Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={managerFormData.email}
                          onChange={(e) => {
                            setManagerFormData({ ...managerFormData, email: e.target.value });
                            if (managerErrors.email) setManagerErrors({ ...managerErrors, email: '' });
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white ${
                            managerErrors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter email address"
                        />
                        {managerErrors.email && <p className="text-red-500 text-sm mt-1">{managerErrors.email}</p>}
                      </div>

                      {/* Student Count */}
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          7) Student Count <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={managerFormData.studentCount}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^\d+$/.test(value)) {
                              setManagerFormData({ ...managerFormData, studentCount: value });
                              if (managerErrors.studentCount) setManagerErrors({ ...managerErrors, studentCount: '' });
                            }
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white ${
                            managerErrors.studentCount ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter number of students"
                          required
                        />
                        {managerErrors.studentCount && <p className="text-red-500 text-sm mt-1">{managerErrors.studentCount}</p>}
                        <p className="text-gray-500 text-sm mt-1">Must be a positive whole number</p>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={submittingManager}
                          className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submittingManager ? 'Adding...' : 'Add Manager'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Excel Upload Form */}
                {addMethod === 'excel' && (
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
                    <h3 className="text-xl font-bold text-black mb-6">Upload Excel File</h3>
                    <form onSubmit={handleExcelManagerSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Select Excel File <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedFile(file);
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        />
                        {selectedFile && (
                          <p className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</p>
                        )}
                        <p className="text-gray-500 text-sm mt-1">Accepted formats: .xlsx, .xls</p>
                      </div>

                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-black mb-2">Excel File Format:</p>
                        <p className="text-xs text-gray-600 mb-2">The Excel file should have the following columns (in order):</p>
                        <ol className="text-xs text-gray-600 list-decimal list-inside space-y-1">
                          <li>MANAGER NAME</li>
                          <li>DEPARTMENT</li>
                          <li>SPORT</li>
                          <li>TEAM NAME</li>
                          <li>CONTACT</li>
                          <li>EMAIL</li>
                          <li>STUDENT COUNT</li>
                        </ol>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={submittingManager || !selectedFile}
                          className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submittingManager ? 'Uploading...' : 'Upload Excel File'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Managers List */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-black mb-6">All Managers ({managers.length})</h3>
                  {managers.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-4 text-gray-600">No managers added yet. Add your first manager above.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Manager Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Sport
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Team Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Student Count
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {managers.map((manager) => (
                            <tr key={manager.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                                {manager.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {manager.department}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {manager.sport}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {manager.teamName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {manager.contact}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {manager.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {manager.studentCount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => handleDeleteManager(manager.id)}
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
              </>
            )}

            {activeItem === 'sports' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-black mb-2">Sports Management</h1>
                  <p className="text-gray-600">Add and manage sports</p>
                </div>

                {/* Add/Edit Sport Form */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
                  <h3 className="text-xl font-bold text-black mb-6">
                    {editingSport ? 'Edit Sport' : 'Add New Sport'}
                  </h3>
                  <form onSubmit={handleSportSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Sport Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={sportFormData.name}
                        onChange={(e) => setSportFormData({ ...sportFormData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        placeholder="Enter sport name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={sportFormData.description}
                        onChange={(e) => setSportFormData({ ...sportFormData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        placeholder="Enter sport description"
                        rows={3}
                      />
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        disabled={submittingSport}
                        className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingSport ? 'Saving...' : editingSport ? 'Update Sport' : 'Add Sport'}
                      </button>
                      {editingSport && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSport(null);
                            setSportFormData({ name: '', description: '' });
                          }}
                          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Sports List */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-black mb-6">All Sports ({sports.length})</h3>
                  {sports.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                      <p className="mt-4 text-gray-600">No sports added yet. Add your first sport above.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Sport Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sports.map((sport) => (
                            <tr key={sport.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                                {sport.name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {sport.description || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => handleEditSport(sport)}
                                  className="text-[#00BFFF] hover:text-[#0099CC] font-medium mr-4"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteSport(sport.id)}
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
              </>
            )}

            {activeItem === 'teams' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-black mb-2">Teams Management</h1>
                  <p className="text-gray-600">Add and manage teams</p>
                </div>

                {/* Add/Edit Team Form */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
                  <h3 className="text-xl font-bold text-black mb-6">
                    {editingTeam ? 'Edit Team' : 'Add New Team'}
                  </h3>
                  <form onSubmit={handleTeamSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Team Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={teamFormData.name}
                          onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                          placeholder="Enter team name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Team Department <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={teamFormData.department}
                          onChange={(e) => setTeamFormData({ ...teamFormData, department: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                          placeholder="Enter department"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Team Color <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={teamFormData.color}
                          onChange={(e) => setTeamFormData({ ...teamFormData, color: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                          required
                        >
                          <option value="#f58002">Orange (#f58002)</option>
                          <option value="#FF0000">Red (#FF0000)</option>
                          <option value="#0000FF">Blue (#0000FF)</option>
                          <option value="#00FF00">Green (#00FF00)</option>
                          <option value="#FFFF00">Yellow (#FFFF00)</option>
                          <option value="#FF00FF">Magenta (#FF00FF)</option>
                          <option value="#00FFFF">Cyan (#00FFFF)</option>
                          <option value="#800080">Purple (#800080)</option>
                          <option value="#FFA500">Orange Red (#FFA500)</option>
                          <option value="#008000">Dark Green (#008000)</option>
                          <option value="#000080">Navy Blue (#000080)</option>
                          <option value="#800000">Maroon (#800000)</option>
                          <option value="#FFC0CB">Pink (#FFC0CB)</option>
                          <option value="#A52A2A">Brown (#A52A2A)</option>
                          <option value="#808080">Gray (#808080)</option>
                          <option value="#FFFFFF">White (#FFFFFF)</option>
                        </select>
                        <div className="mt-2 flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: teamFormData.color }}
                          ></div>
                          <span className="text-xs text-gray-600">{teamFormData.color}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Team Logo
                      </label>
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleTeamLogoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        />
                        {(teamLogoPreview || editingTeam?.logo) && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                            <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                              <img
                                src={teamLogoPreview || editingTeam?.logo || ''}
                                alt="Team logo preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        disabled={submittingTeam}
                        className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingTeam ? 'Saving...' : editingTeam ? 'Update Team' : 'Add Team'}
                      </button>
                      {editingTeam && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTeam(null);
                            setTeamFormData({ name: '', department: '', color: '#f58002' });
                            setTeamLogoFile(null);
                            setTeamLogoPreview(null);
                          }}
                          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Teams List */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-black mb-6">All Teams ({teamsList.length})</h3>
                  {teamsList.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="mt-4 text-gray-600">No teams added yet. Add your first team above.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Logo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Team Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {teamsList.map((team) => (
                            <tr key={team.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                {team.logo ? (
                                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                    <img
                                      src={team.logo}
                                      alt={team.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                                {team.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {team.department}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => handleEditTeam(team)}
                                  className="text-[#00BFFF] hover:text-[#0099CC] font-medium mr-4"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteTeam(team.id)}
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
              </>
            )}

            {activeItem === 'event-images' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-black mb-2">Event Images Management</h1>
                  <p className="text-gray-600">Add and manage event photos for the home page</p>
                </div>

                {/* Add/Edit Form */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
                  <h3 className="text-xl font-bold text-black mb-6">
                    {editingEventImage ? 'Edit Event Image' : 'Add New Event Image'}
                  </h3>
                  <form onSubmit={handleEventImageSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Title (Optional)
                        </label>
                        <input
                          type="text"
                          value={eventImageFormData.title}
                          onChange={(e) => setEventImageFormData({ ...eventImageFormData, title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                          placeholder="Enter image title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Display Order
                        </label>
                        <input
                          type="number"
                          value={eventImageFormData.displayOrder}
                          onChange={(e) => setEventImageFormData({ ...eventImageFormData, displayOrder: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={eventImageFormData.description}
                        onChange={(e) => setEventImageFormData({ ...eventImageFormData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        placeholder="Enter image description"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        {editingEventImage ? 'New Image (Optional - leave empty to keep current)' : 'Image File'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEventImageFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        required={!editingEventImage}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
                      </p>
                    </div>

                    {(eventImagePreview || editingEventImage?.imageUrl) && (
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Preview</label>
                        <div className="relative w-full h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
                          <img
                            src={eventImagePreview || editingEventImage?.imageUrl || ''}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        disabled={submittingEventImage}
                        className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingEventImage ? 'Saving...' : editingEventImage ? 'Update Image' : 'Add Image'}
                      </button>
                      {editingEventImage && (
                        <button
                          type="button"
                          onClick={resetEventImageForm}
                          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Images List */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-black mb-6">All Event Images ({eventImages.length})</h3>
                  {eventImages.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-4 text-gray-600">No event images added yet. Add your first image above.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {eventImages.map((image) => (
                        <div key={image.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          <div className="relative w-full h-48">
                            <img
                              src={image.imageUrl}
                              alt={image.title || 'Event image'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            {image.title && (
                              <h4 className="font-semibold text-black mb-1">{image.title}</h4>
                            )}
                            {image.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{image.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mb-3">Order: {image.displayOrder}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditEventImage(image)}
                                className="flex-1 px-3 py-2 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded text-sm font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteEventImage(image.id)}
                                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeItem === 'notices' && (
              <>
                <h2 className="text-2xl font-bold text-black mb-6">Notices Management</h2>

                {/* Notice Form */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
                  <h3 className="text-xl font-bold text-black mb-4">
                    {editingNotice ? 'Edit Notice' : 'Add New Notice'}
                  </h3>
                  <form onSubmit={handleNoticeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Notice Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={noticeFormData.title}
                        onChange={(e) => setNoticeFormData({ ...noticeFormData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        placeholder="Enter notice title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Notice Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={noticeFormData.description}
                        onChange={(e) => setNoticeFormData({ ...noticeFormData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        placeholder="Enter notice description"
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Date of Notice <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={noticeFormData.noticeDate}
                        onChange={(e) => setNoticeFormData({ ...noticeFormData, noticeDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Document (PDF) {editingNotice ? '(Optional - leave empty to keep current)' : '(Optional)'}
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleNoticeFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Only PDF files are allowed (Max 10MB)
                      </p>
                      {editingNotice && editingNotice.documentUrl && !selectedNoticeFile && (
                        <p className="text-sm text-gray-600 mt-2">
                          Current document: <a href={editingNotice.documentUrl} target="_blank" rel="noopener noreferrer" className="text-[#00BFFF] hover:underline">View PDF</a>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Schedule & Timetable Image (JPG) {editingNotice ? '(Optional - leave empty to keep current)' : '(Optional)'}
                      </label>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleScheduleImageFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Only JPG/PNG image files are allowed (Max 10MB)
                      </p>
                      {(scheduleImagePreview || (editingNotice && editingNotice.scheduleImageUrl && !selectedScheduleImageFile)) && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-black mb-2">Preview</label>
                          <div className="relative w-full h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
                            <img
                              src={scheduleImagePreview || editingNotice?.scheduleImageUrl || ''}
                              alt="Schedule preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        disabled={submittingNotice}
                        className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingNotice ? 'Saving...' : editingNotice ? 'Update Notice' : 'Add Notice'}
                      </button>
                      {editingNotice && (
                        <button
                          type="button"
                          onClick={resetNoticeForm}
                          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Notices List */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-black mb-6">All Notices ({notices.length})</h3>
                  {notices.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <p className="mt-4 text-gray-600">No notices added yet. Add your first notice above.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-black">Title</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-black">Description</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-black">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-black">Document</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-black">Schedule Image</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-black">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notices.map((notice) => (
                            <tr key={notice.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-black font-medium">{notice.title}</td>
                              <td className="px-4 py-3 text-sm text-gray-700 max-w-md truncate">{notice.description}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {new Date(notice.noticeDate).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {notice.documentUrl ? (
                                  <a
                                    href={notice.documentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#00BFFF] hover:text-[#0099CC] font-medium"
                                  >
                                    View PDF
                                  </a>
                                ) : (
                                  <span className="text-gray-400">No document</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {notice.scheduleImageUrl ? (
                                  <a
                                    href={notice.scheduleImageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#00BFFF] hover:text-[#0099CC] font-medium"
                                  >
                                    View Image
                                  </a>
                                ) : (
                                  <span className="text-gray-400">No image</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <button
                                  onClick={() => handleEditNotice(notice)}
                                  className="text-[#00BFFF] hover:text-[#0099CC] font-medium mr-4"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteNotice(notice.id)}
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

