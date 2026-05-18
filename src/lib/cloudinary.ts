// Cloudinary Configuration
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

// Cloudinary API helper for server-side uploads
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_preset'); // Create an unsigned preset in Cloudinary dashboard
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Get optimized Cloudinary URL
export const getCloudinaryUrl = (publicId: string, options?: Record<string, any>): string => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const params = new URLSearchParams();
  
  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      params.append(key, String(value));
    });
  }
  
  return `${baseUrl}/${params.toString()}/${publicId}`;
};

// Fetch media resources from Cloudinary
export const fetchCloudinaryResources = async (resourceType: 'image' | 'video' = 'image') => {
  try {
    // Using Cloudinary Search API (requires backend or proper CORS)
    // For now, we'll use a fallback approach with Cloudinary's delivery URLs
    // In production, use a backend endpoint with Admin API credentials
    
    // This is a client-side fallback that fetches from a predefined folder
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`),
        },
        body: JSON.stringify({
          resource_type: resourceType,
          type: 'upload',
          max_results: 500,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }

    const data = await response.json();
    return data.resources || [];
  } catch (error) {
    console.error('Error fetching Cloudinary resources:', error);
    // Return empty array as fallback
    return [];
  }
};

// Fetch images from Cloudinary
export const fetchCloudinaryImages = async () => {
  const resources = await fetchCloudinaryResources('image');
  return resources
    .filter((r: any) => r.format && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(r.format))
    .map((r: any) => ({
      id: r.public_id,
      url: r.secure_url || `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${r.public_id}.${r.format}`,
      type: 'image' as const,
      name: r.public_id,
      public_id: r.public_id,
      created_at: r.created_at || new Date().toISOString(),
    }));
};

// Fetch videos from Cloudinary
export const fetchCloudinaryVideos = async () => {
  const resources = await fetchCloudinaryResources('video');
  return resources
    .filter((r: any) => r.format && ['mp4', 'webm', 'mov', 'avi'].includes(r.format))
    .map((r: any) => ({
      id: r.public_id,
      url: r.secure_url || `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${r.public_id}.${r.format}`,
      type: 'video' as const,
      name: r.public_id,
      public_id: r.public_id,
      created_at: r.created_at || new Date().toISOString(),
    }));
};
