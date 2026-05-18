// This is a FRONTEND utility - NO Node.js libraries!
// Authentication token management using localStorage only

export interface AuthData {
  nickname: string;
  dob: string;
  timestamp: number;
}

const AUTH_TOKEN_KEY = 'nibi_auth';

// Simple hash function for browser (replaces crypto-js)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

export const storeAuthToken = (nickname: string, dob: string): void => {
  const authData: AuthData = {
    nickname,
    dob,
    timestamp: Date.now(),
  };
  // Simple obfuscation (not encryption - for demo only)
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

// Simple validation (no crypto-js needed)
export const validateCredentials = (nickname: string, dob: string): boolean => {
  // Expected credentials - change these to your actual values
  const expectedNickname = 'Nibi';
  const expectedDob = '2003-05-19'; // Format: YYYY-MM-DD
  
  return nickname.toLowerCase() === expectedNickname.toLowerCase() && 
         dob === expectedDob;
};

export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};