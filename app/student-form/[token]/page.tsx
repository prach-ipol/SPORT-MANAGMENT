'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';

interface LinkInfo {
  id: number;
  managerId: number;
  token: string;
  managerName: string;
  sport: string;
  department: string;
}

export default function StudentFormPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    prn_uid: '',
    contact: '',
    email: '',
    address: '',
    birthDate: '',
    size: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchLinkInfo();
  }, [token]);

  const fetchLinkInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/student-links/token/${token}`);
      if (response.ok) {
        const data = await response.json();
        setLinkInfo(data);
      } else {
        setError('Invalid or expired link. Please contact your manager for a new link.');
      }
    } catch (error) {
      console.error('Error fetching link info:', error);
      setError('Failed to load form. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.prn_uid.trim()) {
      errors.prn_uid = 'PRN/UID is required';
    }
    if (!formData.contact.trim()) {
      errors.contact = 'Contact number is required';
    }
    if (!formData.birthDate) {
      errors.birthDate = 'Date of birth is required';
    }    if (!formData.size) {
      errors.size = "T-Shirt size is required";
    }    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/student-links/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          ...formData,
          size: Number(formData.size),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          prn_uid: '',
          contact: '',
          email: '',
          address: '',
          birthDate: '',
          size: '',
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-[#00BFFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error && !linkInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Invalid</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your details have been submitted successfully. Your manager will review your information.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors"
          >
            Submit Another Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration Form</h1>
          {linkInfo && (
            <div className="text-gray-600">
              <p className="mb-1">
                <span className="font-medium">Manager:</span> {linkInfo.managerName}
              </p>
              <p className="mb-1">
                <span className="font-medium">Department:</span> {linkInfo.department}
              </p>
              <p>
                <span className="font-medium">Sport:</span> {linkInfo.sport}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                  required
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PRN/UID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.prn_uid}
                  onChange={(e) => {
                    setFormData({ ...formData, prn_uid: e.target.value });
                    if (formErrors.prn_uid) setFormErrors({ ...formErrors, prn_uid: '' });
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none ${
                    formErrors.prn_uid ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your PRN/UID"
                  required
                />
                {formErrors.prn_uid && <p className="text-red-500 text-sm mt-1">{formErrors.prn_uid}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => {
                    setFormData({ ...formData, contact: e.target.value });
                    if (formErrors.contact) setFormErrors({ ...formErrors, contact: '' });
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none ${
                    formErrors.contact ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your contact number"
                  required
                />
                {formErrors.contact && <p className="text-red-500 text-sm mt-1">{formErrors.contact}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none"
                  placeholder="Enter your address"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => {
                    setFormData({ ...formData, birthDate: e.target.value });
                    if (formErrors.birthDate) setFormErrors({ ...formErrors, birthDate: '' });
                  }}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none ${
                    formErrors.birthDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.birthDate && <p className="text-red-500 text-sm mt-1">{formErrors.birthDate}</p>}
                {formData.birthDate && (
                  <p className="text-gray-600 text-sm mt-1">
                    Age: {calculateAge(formData.birthDate)} years
                  </p>
                )}
              </div>
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  T-Shirt Size <span className="text-gray-500 text-xs">(numeric)</span>
                </label>
                <input
                  type="number"
                  value={formData.size}
                  onChange={(e) => {
                    setFormData({ ...formData, size: e.target.value });
                    if (formErrors.size) setFormErrors({ ...formErrors, size: '' });
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none ${
                    formErrors.size ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your T-shirt size (e.g., 38)"
                  required
                />
                {formErrors.size && <p className="text-red-500 text-sm mt-1">{formErrors.size}</p>}
                
              </div>

            </div>
              
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Form'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


