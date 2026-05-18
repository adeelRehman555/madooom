import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { syncMediaToDatabase, getMediaFromDatabase, uploadMediaFile, deleteMediaById } from '../lib/database';

interface Picture {
  id?: number | string;
  url: string;
  type: 'image';
  name: string;
  public_id: string;
  created_at: string;
}

interface PicturesProps {
  onLogoutClick?: () => void;
  onNavigate?: (page: string) => void;
}

const Pictures: React.FC<PicturesProps> = ({ onLogoutClick, onNavigate }) => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id?: string; name?: string }>({ show: false });
  const [deleteMessage, setDeleteMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPictures();
  }, []);

  const loadPictures = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Sync media from Cloudinary to database
      await syncMediaToDatabase();
      
      // Fetch pictures from database
      const dbPictures = await getMediaFromDatabase('image');
      
      setPictures(dbPictures as Picture[]);
      if (dbPictures.length === 0) {
        setError('No pictures found');
      }
    } catch (err) {
      console.error('Error loading pictures:', err);
      setError('Failed to load pictures');
    } finally {
      setLoading(false);
    }
  };

  const nextPicture = () => {
    setCurrentIndex((prev) => (prev + 1) % pictures.length);
  };

  const prevPicture = () => {
    setCurrentIndex((prev) => (prev - 1 + pictures.length) % pictures.length);
  };

  const goToPicture = (index: number) => {
    setCurrentIndex(index);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadMediaFile(file, 'image');
      // Reload pictures after successful upload
      await loadPictures();
    } catch (err) {
      console.error('Error uploading picture:', err);
      alert(`Failed to upload picture: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteClick = (id: string | number | undefined, name: string | undefined) => {
    if (!id || !name) return;
    setDeleteConfirm({ show: true, id: String(id), name });
    setDeleteMessage('');
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      setDeleteMessage('Deleting...');
      const idNum = parseInt(deleteConfirm.id);
      await deleteMediaById(idNum);
      setDeleteMessage('✅ Picture deleted successfully! This image is gone forever.');
      setTimeout(() => {
        setDeleteConfirm({ show: false });
        loadPictures();
      }, 2000);
    } catch (err) {
      console.error('Error deleting picture:', err);
      setDeleteMessage(`❌ Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar currentPage="pictures" onLogoutClick={onLogoutClick} onNavigate={onNavigate} />
        <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin mb-4">
              <span className="text-6xl">✨</span>
            </div>
            <p className="text-xl font-semibold text-gray-700">Loading your pictures...</p>
          </div>
        </div>
      </>
    );
  }

  if (error && pictures.length === 0) {
    return (
      <>
        <Navbar currentPage="pictures" onLogoutClick={onLogoutClick} onNavigate={onNavigate} />
        <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 flex items-center justify-center pt-20 px-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700 mb-4">📸 {error}</p>
            <p className="text-gray-600 mb-6">Upload some pictures to get started!</p>
            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {uploading ? '⏳ Uploading...' : '📤 Upload Picture'}
            </button>
          </div>
        </div>
      </>
    );
  }

  const currentPicture = pictures[currentIndex];

  return (
    <>
      <Navbar currentPage="pictures" onLogoutClick={onLogoutClick} onNavigate={onNavigate} />
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 pt-24 pb-12 px-4">
        {/* Animated background */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-blob-slow"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-blob-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              📸 Your Pictures
            </h1>
            <p className="text-gray-700">
              {pictures.length} photo{pictures.length !== 1 ? 's' : ''} in your collection
            </p>
          </div>

          {/* Main Carousel */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl overflow-hidden mb-8">
            <div className="relative h-96 md:h-[600px] bg-black/10 flex items-center justify-center group">
              {/* Current Image */}
              <img
                src={currentPicture.url}
                alt={currentPicture.name}
                className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setIsFullscreen(true)}
              />

              {/* Previous Button */}
              <button
                onClick={prevPicture}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-3 rounded-r-lg transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={nextPicture}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-3 rounded-l-lg transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Counter */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg font-semibold">
                {currentIndex + 1} / {pictures.length}
              </div>
            </div>

            {/* Picture Info */}
            <div className="p-4 md:p-6 bg-gradient-to-r from-pink-100 to-rose-100">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
                {currentPicture.name}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(currentPicture.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gallery</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {pictures.map((pic, idx) => (
                <div key={pic.id} className="relative group">
                  <button
                    onClick={() => goToPicture(idx)}
                    className={`relative w-full rounded-lg overflow-hidden h-24 transition-all duration-200 ${
                      idx === currentIndex
                        ? 'ring-4 ring-pink-500 scale-105'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img
                      src={pic.url}
                      alt={pic.name}
                      className="w-full h-full object-cover"
                    />
                    {idx === currentIndex && (
                      <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                        <span className="text-white text-2xl">✓</span>
                      </div>
                    )}
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() => pic.id && handleDeleteClick(pic.id, pic.name)}
                    className="absolute top-0 right-0 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Delete picture"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '⏳ Uploading...' : '📤 Upload Picture'}
            </button>
            <button
              onClick={loadPictures}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              🖼️ Fullscreen
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🗑️ Delete Picture?</h2>
            <p className="text-gray-600 mb-2">Are you sure you want to delete this picture?</p>
            <p className="text-sm text-red-600 font-semibold mb-4">⚠️ This action cannot be undone. The picture will be gone forever.</p>
            
            {deleteMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm font-semibold ${
                deleteMessage.includes('✅') 
                  ? 'bg-green-100 text-green-800' 
                  : deleteMessage.includes('❌')
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {deleteMessage}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false })}
                disabled={deleteMessage.includes('Deleting')}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMessage.includes('Deleting') || deleteMessage.includes('✅')}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMessage.includes('Deleting') ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={currentPicture.url}
              alt={currentPicture.name}
              className="max-w-[95vw] max-h-[95vh] object-contain"
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </button>
            <button
              onClick={prevPicture}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextPicture}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Pictures;
