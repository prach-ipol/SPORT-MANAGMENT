'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Manager {
  id: string;
  name: string;
  department: string;
  sport: string;
  contact: string;
  studentCount: number;
  createdAt: string;
}

export default function ManagersAdmin() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);
  const [addMethod, setAddMethod] = useState<'manual' | 'excel'>('manual');
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    sport: '',
    contact: '',
    studentCount: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.push('/login');
    }
    fetchManagers();
  }, [router]);

  const fetchManagers = () => {
    try {
      const stored = localStorage.getItem('managers');
      if (stored) {
        setManagers(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const saveManagers = (managersList: Manager[]) => {
    localStorage.setItem('managers', JSON.stringify(managersList));
    setManagers(managersList);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Manager Name is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.sport.trim()) {
      newErrors.sport = 'Sport is required';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact is required';
    }

    if (!formData.studentCount.trim()) {
      newErrors.studentCount = 'Count of Student is required';
    } else {
      const count = Number(formData.studentCount);
      if (isNaN(count) || count <= 0 || !Number.isInteger(count)) {
        newErrors.studentCount = 'Count of Student must be a positive whole number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const newManager: Manager = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        department: formData.department.trim(),
        sport: formData.sport.trim(),
        contact: formData.contact.trim(),
        studentCount: Number(formData.studentCount),
        createdAt: new Date().toISOString(),
      };

      const updatedManagers = [...managers, newManager];
      saveManagers(updatedManagers);

      // Reset form
      setFormData({
        name: '',
        department: '',
        sport: '',
        contact: '',
        studentCount: '',
      });
      setErrors({});

      alert('Manager added successfully!');
    } catch (error) {
      console.error('Error adding manager:', error);
      alert('Failed to add manager. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExcelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select an Excel file');
      return;
    }

    // Validate file type
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setSubmitting(true);

    try {
      // TODO: Implement Excel file parsing
      // For now, show a placeholder message
      alert('Excel upload feature will be implemented soon. Please use manual entry for now.');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading Excel file:', error);
      alert('Failed to upload Excel file. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this manager?')) {
      const updatedManagers = managers.filter((m) => m.id !== id);
      saveManagers(updatedManagers);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                setErrors({});
                setFormData({
                  name: '',
                  department: '',
                  sport: '',
                  contact: '',
                  studentCount: '',
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
              <form onSubmit={handleManualSubmit} className="space-y-4">
                {/* Manager Name */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    1) Manager Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter manager name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    2) Department of Manager <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => {
                      setFormData({ ...formData, department: e.target.value });
                      if (errors.department) setErrors({ ...errors, department: '' });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white ${
                      errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter department name"
                  />
                  {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                </div>

                {/* Sport */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    3) Sport <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sport}
                    onChange={(e) => {
                      setFormData({ ...formData, sport: e.target.value });
                      if (errors.sport) setErrors({ ...errors, sport: '' });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white ${
                      errors.sport ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter sport name"
                  />
                  {errors.sport && <p className="text-red-500 text-sm mt-1">{errors.sport}</p>}
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    4) Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => {
                      setFormData({ ...formData, contact: e.target.value });
                      if (errors.contact) setErrors({ ...errors, contact: '' });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white ${
                      errors.contact ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter contact number or email"
                  />
                  {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                </div>

                {/* Count of Student */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    5) Count of Student <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.studentCount}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow positive integers
                      if (value === '' || /^\d+$/.test(value)) {
                        setFormData({ ...formData, studentCount: value });
                        if (errors.studentCount) setErrors({ ...errors, studentCount: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white ${
                      errors.studentCount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter number of students"
                    required
                  />
                  {errors.studentCount && <p className="text-red-500 text-sm mt-1">{errors.studentCount}</p>}
                  <p className="text-gray-500 text-sm mt-1">Must be a positive whole number</p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Adding...' : 'Add Manager'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Excel Upload Form */}
          {addMethod === 'excel' && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-black mb-6">Upload Excel File</h3>
              <form onSubmit={handleExcelSubmit} className="space-y-4">
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
                    disabled={submitting || !selectedFile}
                    className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Uploading...' : 'Upload Excel File'}
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
                        Contact
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
                          {manager.contact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {manager.studentCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDelete(manager.id)}
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
    </div>
  );
}

