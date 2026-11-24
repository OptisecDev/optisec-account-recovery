export const API_URL = import.meta.env.VITE_API_URL || 'https://optisec-account-recovery-production.up.railway.app';
// No admin password is stored in the frontend: anything here ships in the public bundle.
// Admin authentication must be enforced by the backend.
export const ADMIN_PASSWORD = '';
