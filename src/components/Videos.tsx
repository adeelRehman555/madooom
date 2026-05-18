import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { fetchCloudinaryVideos } from '../lib/cloudinary';
import { syncMediaToDatabase, getMediaFromDatabase, uploadMediaFile, deleteMediaById } from '../lib/database';

interface Video {
  id: string;
  url: string;
  type: 'video';
  name: string;
  public_id: string;
  created_at: string;
}

interface VideosProps {
  onLogoutClick?: () => void;
  onNavigate?: (page: string) => void;
}

const Videos: React.FC<VideosProps> = ({ onLogoutClick, onNavigate }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id?: string; name?: string }>({ show: false });
  const [deleteMessage, setDeleteMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Sync media from Cloudinary to database
      const synced = await syncMediaToDatabase();
      
      // Fetch videos from database
      const dbVideos = await getMediaFromDatabase('video');
      
      setVideos(dbVideos);
      if (dbVideos.length === 0) {
        setError('No videos found');
      }
    } catch (err) {
      console.error('Error loading videos:', err);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const goToVideo = (index: number) => {
    setCurrentIndex(index);
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadMediaFile(file, 'video');
      // Reload videos after successful upload
      await loadVideos();
    } catch (err) {
      console.error('Error uploading video:', err);
      alert(`Failed to upload video: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirm({ show: true, id, name });
    setDeleteMessage('');
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      setDeleteMessage('Deleting...');
      const idNum = parseInt(deleteConfirm.id);
      await deleteMediaById(idNum);
      setDeleteMessage('✅ Video deleted successfully! This video is gone forever.');
      setTimeout(() => {
        setDeleteConfirm({ show: false });
        loadVideos();
      }, 2000);
    } catch (err) {
      console.error('Error deleting video:', err);
      setDeleteMessage(`❌ Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar currentPage="videos" onLogoutClick={onLogoutClick} onNavigate={onNavigate} />
        <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin mb-4">
              <span className="text-6xl">🎬</span>
            </div>
            <p className="text-xl font-semibold text-gray-700">Loading your videos...</p>
          </div>
        </div>
      </>
    );
  }

  if (error && videos.length === 0) {
    return (
      <>
        <Navbar currentPage="videos" onLogoutClick={onLogoutClick} onNavigate={onNavigate} />
        <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 flex items-center justify-center pt-20 px-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700 mb-4">🎥 {error}</p>
            <p className="text-gray-600 mb-6">Upload some videos to get started!</p>
            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {uploading ? '⏳ Uploading...' : '📹 Upload Video'}
            </button>
          </div>
        </div>
      </>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <>
      <Navbar currentPage="videos" onLogoutClick={onLogoutClick} onNavigate={onNavigate} />
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
              🎬 Your Videos
            </h1>
            <p className="text-gray-700">
              {videos.length} video{videos.length !== 1 ? 's' : ''} in your collection
            </p>
          </div>

          {/* Main Video Player */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl overflow-hidden mb-8">
            <div className="relative h-96 md:h-[600px] bg-black/10 flex items-center justify-center group">
              {/* Video Element */}
              <video
                ref={videoRef}
                key={currentVideo.id}
                src={currentVideo.url}
                className="w-full h-full object-contain"
                controls
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.playbackRate = playbackRate;
                  }
                }}
              />

              {/* Counter */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg font-semibold">
                {currentIndex + 1} / {videos.length}
              </div>
            </div>

            {/* Video Controls */}
            <div className="p-4 md:p-6 bg-gradient-to-r from-pink-100 to-rose-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Video Info */}
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
                    {currentVideo.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(currentVideo.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Playback Speed Controls */}
                <div className="flex items-center justify-start md:justify-end gap-2">
                  <span className="text-sm font-semibold text-gray-700">Speed:</span>
                  <div className="flex gap-2">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all duration-200 text-sm ${
                          playbackRate === rate
                            ? 'bg-pink-500 text-white shadow-lg'
                            : 'bg-white/50 text-gray-700 hover:bg-white'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={prevVideo}
                  className="flex-1 px-4 py-2 bg-white/50 hover:bg-white text-gray-800 font-semibold rounded-lg transition-all duration-200"
                >
                  ⬅️ Previous
                </button>
                <button
                  onClick={nextVideo}
                  className="flex-1 px-4 py-2 bg-white/50 hover:bg-white text-gray-800 font-semibold rounded-lg transition-all duration-200"
                >
                  Next ➡️
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Video Library</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {videos.map((vid, idx) => (
                <div key={vid.id} className="relative group">
                  <button
                    onClick={() => goToVideo(idx)}
                    className={`relative w-full rounded-lg overflow-hidden h-28 transition-all duration-200 ${
                      idx === currentIndex
                        ? 'ring-4 ring-pink-500 scale-105'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <video
                      src={vid.url}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-2xl">▶️</span>
                    </div>
                    {idx === currentIndex && (
                      <div className="absolute inset-0 bg-pink-500/30 flex items-center justify-center">
                        <span className="text-white text-3xl">▶️</span>
                      </div>
                    )}
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteClick(vid.id, vid.name)}
                    className="absolute top-0 right-0 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Delete video"
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
              {uploading ? '⏳ Uploading...' : '📹 Upload Video'}
            </button>
            <button
              onClick={loadVideos}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              🔄 Refresh
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              🖥️ Fullscreen
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🗑️ Delete Video?</h2>
            <p className="text-gray-600 mb-2">Are you sure you want to delete this video?</p>
            <p className="text-sm text-red-600 font-semibold mb-4">⚠️ This action cannot be undone. The video will be gone forever.</p>
            
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
    </>
  );
};

export default Videos;
