import Medusa from '@medusajs/medusa-js';

const baseUrl = (typeof process !== 'undefined' ? process.env.VITE_MEDUSA_BACKEND_URL : undefined) || import.meta.env?.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const publishableKey = (typeof process !== 'undefined' ? process.env.VITE_MEDUSA_PUBLISHABLE_KEY : undefined) || import.meta.env?.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_c97cb3b73bcfb29b80cf1248a95f00d9b9f9c664b8eca271f6dcff1a6d5f77fd';

// Try to set global headers for all fetch calls if we can
// However, the Medusa JS SDK doesn't always expose the underlying client's headers easily.
export const medusa = new Medusa({ 
  baseUrl, 
  maxRetries: 3,
  publishableKey
});

// Medusa 2.0 compatibility hack: The 1.x SDK sends 'x-publishable-key', 
// but 2.0 backend expects 'x-publishable-api-key'.
// @ts-ignore
if (medusa.client && medusa.client.axiosClient) {
  // @ts-ignore
  medusa.client.axiosClient.defaults.headers.common['x-publishable-api-key'] = publishableKey;
}

/**
 * Medusa 2.0 often requires 'x-publishable-api-key' instead of 'x-publishable-key'.
 * This helper ensures we use the correct one for raw fetch calls.
 */
export const medusaFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-publishable-api-key': publishableKey,
  };

  // Add credentials if it's a store request that needs session
  options.credentials = 'include';

  const response = await fetch(url, { 
    ...options, 
    headers: {
      ...headers,
      ...options.headers,
    } 
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

// Test connection without health check CORS noise in tests if needed
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test' && import.meta.env?.MODE !== 'test') {
  fetch(`${baseUrl}/health`)
    .then(res => console.log('Medusa Backend Health:', res.status === 200 ? 'OK' : 'FAIL'))
    .catch(err => console.error('Medusa Backend unreachable:', err));
}
