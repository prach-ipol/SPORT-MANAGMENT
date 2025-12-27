'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_BASE_URL } from '@/config/api';

interface EventImage {
  id: number;
  title?: string;
  description?: string;
  imageUrl: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function EventImagesAdmin() {
  const router = useRouter();
  const [eventImages, setEventImages] = useState<EventImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingImage, setEditingImage] = useState<EventImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    displayOrder: '0',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.push('/login');
      return;
    }
    fetchEventImages();
  }, [router]);

  const fetchEventImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/event-images`);
      if (response.ok) {
        const data = await response.json();
        setEventImages(data || []);
      } else {
        console.error('Failed to fetch event images');
      }
    } catch (error) {
      console.error('Error fetching event images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !editingImage) {
      alert('Please select an image file');
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('displayOrder', formData.displayOrder);
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const url = editingImage
        ? `${API_BASE_URL}/api/event-images/${editingImage.id}`
        : `${API_BASE_URL}/api/event-images`;
      
      const method = editingImage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchEventImages();
        resetForm();
        alert(editingImage ? 'Event image updated successfully!' : 'Event image added successfully!');
        // Trigger event to update home page
        window.dispatchEvent(new Event('eventImagesUpdated'));
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(errorData.error || 'Failed to save event image. Please try again.');
      }
    } catch (error) {
      console.error('Error saving event image:', error);
      alert('Failed to save event image. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (image: EventImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title || '',
      description: image.description || '',
      displayOrder: image.displayOrder?.toString() || '0',
    });
    setImagePreview(image.imageUrl);
    setSelectedFile(null);
  };

  const handleDelete = async (id: number) => {
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

  const resetForm = () => {
    setFormData({ title: '', description: '', displayOrder: '0' });
    setSelectedFile(null);
    setImagePreview(null);
    setEditingImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00BFFF] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Event Images Management</h1>
          <p className="text-gray-600">Add and manage event photos for the home page</p>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
          <h3 className="text-xl font-bold text-black mb-6">
            {editingImage ? 'Edit Event Image' : 'Add New Event Image'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
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
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                placeholder="Enter image description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {editingImage ? 'New Image (Optional - leave empty to keep current)' : 'Image File'} <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none text-black bg-white"
                required={!editingImage}
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
              </p>
            </div>

            {(imagePreview || editingImage?.imageUrl) && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">Preview</label>
                <div className="relative w-full h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview || editingImage?.imageUrl || ''}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : editingImage ? 'Update Image' : 'Add Image'}
              </button>
              {editingImage && (
                <button
                  type="button"
                  onClick={resetForm}
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
                    <Image
                      src={image.imageUrl}
                      alt={image.title || 'Event image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                        onClick={() => handleEdit(image)}
                        className="flex-1 px-3 py-2 bg-[#00BFFF] hover:bg-[#0099CC] text-white rounded text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
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
      </div>
    </div>
  );
}

