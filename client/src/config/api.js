// API Configuration
// Prefers VITE_API_URL from environment variables, falling back to the Render backend link.
const ENV_URL = import.meta.env.VITE_API_URL;
const DEFAULT_URL = 'https://to-do-list-b16k.onrender.com';

const rawUrl = ENV_URL && ENV_URL.trim() ? ENV_URL : DEFAULT_URL;

// Ensure base URL has no trailing slash
export const API_BASE_URL = rawUrl.replace(/\/+$/, '');
