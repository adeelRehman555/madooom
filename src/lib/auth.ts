import CryptoJS from 'crypto-js';

// Encryption key - in production, use environment variable
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'nibi-secure-key-2003';

// Valid credentials
const VALID_CREDENTIALS = {
  nickname: 'nibi',
  dob: '2003-05-19', // YYYY-MM-DD format
};

// Encrypt data
export const encryptCredentials = (nickname: string, dob: string): string => {
  const data = JSON.stringify({ nickname, dob });
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

// Decrypt data
export const decryptCredentials = (encrypted: string): { nickname: string; dob: string } => {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    const data = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(data);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Invalid credentials format');
  }
};

// Format date to YYYY-MM-DD
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Validate credentials
export const validateCredentials = (nickname: string, dob: string): boolean => {
  const normalizedNickname = nickname.toLowerCase().trim();
  const dobFormatted = formatDateToString(new Date(dob));

  return (
    normalizedNickname === VALID_CREDENTIALS.nickname &&
    dobFormatted === VALID_CREDENTIALS.dob
  );
};

// Store encrypted token in session/local storage
export const storeAuthToken = (nickname: string, dob: string): string => {
  const token = encryptCredentials(nickname, dob);
  sessionStorage.setItem('auth_token', token);
  return token;
};

// Verify token
export const verifyAuthToken = (): boolean => {
  const token = sessionStorage.getItem('auth_token');
  if (!token) return false;

  try {
    const credentials = decryptCredentials(token);
    return validateCredentials(credentials.nickname, credentials.dob);
  } catch {
    return false;
  }
};

// Clear auth token
export const clearAuthToken = (): void => {
  sessionStorage.removeItem('auth_token');
};

// Get stored credentials (if verified)
export const getStoredCredentials = () => {
  const token = sessionStorage.getItem('auth_token');
  if (!token) return null;

  try {
    return decryptCredentials(token);
  } catch {
    return null;
  }
};
