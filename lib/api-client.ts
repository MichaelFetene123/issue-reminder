// @/lib/api-client.ts
import { shouldRefreshAccessToken } from '@/lib/auth'; // Ensure this utility can run on the client side

let currentAccessToken: string | null = null;

// Sets the token immediately after login or registration
export function setClientAccessToken(token: string) {
  currentAccessToken = token;
}

export async function secureFetch(url: string, options: RequestInit = {}) {
  // If we have an active token, check if it's close to dying (within 2 mins)
  if (currentAccessToken) {
    const needsRefresh = await shouldRefreshAccessToken(currentAccessToken);
    
    if (needsRefresh) {
      try {
        const res = await fetch('/api/auth/refresh', { method: 'POST' });
        if (!res.ok) throw new Error('Refresh token invalid or expired');
        
        const data = await res.json();
        currentAccessToken = data.accessToken; // Store the new 15-minute key
      } catch (err) {
        currentAccessToken = null;
        window.location.href = '/login'; // Evict user to login screen
        throw err;
      }
    }
  }

  // Attach the safe access token to headers
  const headers = new Headers(options.headers);
  if (currentAccessToken) {
    headers.set('Authorization', `Bearer ${currentAccessToken}`);
  }

  return fetch(url, { ...options, headers });
}
