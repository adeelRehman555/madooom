// Database utility functions for Neon via Backend API
const API_BASE_URL = '/api';

export interface MediaItem {
  id?: number;
  url: string;
  type: 'image' | 'video';
  name: string;
  public_id: string;
  created_at: string;
}

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Backend server not available');
    }
    console.log('✅ Backend database connected');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    return false;
  }
};

// Sync media from Cloudinary and save to database
export const syncMediaToDatabase = async (): Promise<boolean> => {
  try {
    console.log('📡 Syncing media from Cloudinary to database...');
    const response = await fetch(`${API_BASE_URL}/sync-media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to sync media from Cloudinary');
    }

    const data = await response.json();
    console.log('✅ Media synced:', data.message);
    console.log('Summary:', data.summary);
    return true;
  } catch (error) {
    console.error('❌ Error syncing media to database:', error);
    return false;
  }
};

// Get media from database by type
export const getMediaFromDatabase = async (type: 'image' | 'video'): Promise<MediaItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/media/${type}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type}s from database`);
    }
    const data = await response.json();
    console.log(`✅ Fetched ${data.count} ${type}s from database`);
    return data.data || [];
  } catch (error) {
    console.error(`❌ Error fetching ${type}s from database:`, error);
    return [];
  }
};

// Get all media from database
export const getAllMedia = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/media`);
    if (!response.ok) {
      throw new Error('Failed to fetch media from database');
    }
    const data = await response.json();
    console.log(`✅ Fetched ${data.count} total media items from database`);
    return data.data || [];
  } catch (error) {
    console.error('❌ Error fetching media from database:', error);
    return [];
  }
};

// Save media to database (legacy - for backwards compatibility)
export const saveMediaToDatabase = async (media: MediaItem[]): Promise<boolean> => {
  try {
    console.log(`Saving ${media.length} media items to database...`);
    // This function is now handled by the sync-media endpoint
    // Kept for backwards compatibility
    return true;
  } catch (error) {
    console.error('Error saving media:', error);
    return false;
  }
};

// Upload media file to Cloudinary and save to database
export const uploadMediaFile = async (file: File, type: 'image' | 'video'): Promise<MediaItem | null> => {
  try {
    // Validate file type
    if (type === 'image') {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        throw new Error('Invalid image type. Allowed: JPEG, PNG, GIF, WebP');
      }
    } else if (type === 'video') {
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      if (!validVideoTypes.includes(file.type)) {
        throw new Error('Invalid video type. Allowed: MP4, WebM, MOV');
      }
    }

    // Validate file size (100MB limit)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error(`File too large. Maximum 100MB. Current: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Upload to backend using FormData for binary file transfer
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed (HTTP ${response.status})`);
    }

    const data = await response.json();
    console.log(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully:`, data.data);
    return data.data as MediaItem;
  } catch (error) {
    console.error(`❌ Error uploading ${type}:`, error);
    throw error;
  }
};

// Delete media from database and Cloudinary
export const deleteMediaById = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/media/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to delete media');
    }

    const data = await response.json();
    console.log('✅ Media deleted successfully:', data.message);
    return true;
  } catch (error) {
    console.error('❌ Error deleting media:', error);
    throw error;
  }
};

export interface WishlistItem {
  id: number;
  title: string;
  description: string;
  link?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  created_at: string;
}

// Get all wishlist items
export const getWishlistItems = async (): Promise<WishlistItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`);
    if (!response.ok) {
      throw new Error('Failed to fetch wishlist items');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('❌ Error fetching wishlist:', error);
    return [];
  }
};

// Add new wishlist item
export const addWishlistItem = async (item: Omit<WishlistItem, 'id' | 'created_at' | 'completed'>): Promise<WishlistItem | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to add wishlist item');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('❌ Error adding wishlist item:', error);
    return null;
  }
};

// Update wishlist item
export const updateWishlistItem = async (id: number, item: Partial<Omit<WishlistItem, 'id' | 'created_at'>>): Promise<WishlistItem | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to update wishlist item');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('❌ Error updating wishlist item:', error);
    return null;
  }
};

// Toggle wishlist item completion status
export const toggleWishlistItem = async (id: number, completed: boolean): Promise<WishlistItem | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle wishlist item');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('❌ Error toggling wishlist item:', error);
    return null;
  }
};

// Delete wishlist item
export const deleteWishlistItem = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete wishlist item');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('❌ Error deleting wishlist item:', error);
    return false;
  }
};