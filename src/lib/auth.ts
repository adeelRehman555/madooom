// This is a FRONTEND utility - ONLY uses browser APIs
// Authentication token management using localStorage

export interface AuthData {
  nickname: string;
  dob: string;
  timestamp: number;
}

const AUTH_TOKEN_KEY = 'nibi_auth';

export const storeAuthToken = (nickname: string, dob: string): void => {
  const authData: AuthData = {
    nickname,
    dob,
    timestamp: Date.now(),
  };
  // Simple base64 encoding (not encryption - for demo only)
  const encoded = btoa(JSON.stringify(authData));
  localStorage.setItem(AUTH_TOKEN_KEY, encoded);
};

export const getStoredCredentials = (): AuthData | null => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;
  
  try {
    const decoded = JSON.parse(atob(token));
    // Check if token is not expired (24 hours)
    if (Date.now() - decoded.timestamp > 24 * 60 * 60 * 1000) {
      clearAuthToken();
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
};

export const verifyAuthToken = (): boolean => {
  const credentials = getStoredCredentials();
  return credentials !== null;
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Simple validation - matches the credentials from your Login page
export const validateCredentials = (nickname: string, dob: string): boolean => {
  // These are the credentials that will work
  const expectedNickname = 'Nibi';
  const expectedDob = '2003-05-19'; // Format: YYYY-MM-DD
  
  return nickname.toLowerCase() === expectedNickname.toLowerCase() && 
         dob === expectedDob;
};

// Format Date to YYYY-MM-DD string
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};