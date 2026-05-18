// src/config.ts
export const API_BASE_URL = import.meta.env.PROD 
  ? '' // Empty means relative URL, will use same domain in production
  : 'http://localhost:5000';

export const getApiUrl = (endpoint: string) => {
  const baseUrl = import.meta.env.PROD ? '' : API_BASE_URL;
  return `${baseUrl}/api${endpoint}`;
};