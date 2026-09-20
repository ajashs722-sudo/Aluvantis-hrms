// Google OAuth & Identity Services (GSI) Helper for Aluvantis HR

export interface GoogleUserProfile {
  id?: string;
  sub?: string;
  name: string;
  email: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  role?: 'admin' | 'hr_manager' | 'accountant' | 'employee';
  companyName?: string;
  companyId?: number;
}

// Global declaration for Google GSI
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string; select_by?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
            }
          ) => void;
          disableAutoSelect: () => void;
        };
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

/**
 * Safely decodes a Google JWT Credential Token
 */
export function decodeGoogleJwt(token: string): GoogleUserProfile | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return {
      id: parsed.sub,
      sub: parsed.sub,
      name: parsed.name || `${parsed.given_name || ''} ${parsed.family_name || ''}`.trim() || 'Foydalanuvchi',
      email: parsed.email || '',
      picture: parsed.picture,
      given_name: parsed.given_name,
      family_name: parsed.family_name,
    };
  } catch (err) {
    console.error('Failed to decode Google JWT token:', err);
    return null;
  }
}

/**
 * Fetch User Info using Google OAuth Access Token
 */
export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserProfile | null> {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch userinfo from Google');
    const data = await res.json();
    return {
      id: data.sub,
      sub: data.sub,
      name: data.name || `${data.given_name || ''} ${data.family_name || ''}`.trim() || 'Foydalanuvchi',
      email: data.email || '',
      picture: data.picture,
      given_name: data.given_name,
      family_name: data.family_name,
    };
  } catch (err) {
    console.warn('Google userinfo fetch fallback:', err);
    return null;
  }
}

/**
 * Get configured Google Client ID from Vite environment
 */
export function getGoogleClientId(): string {
  const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (envId && typeof envId === 'string' && envId.trim().length > 5) {
    return envId.trim();
  }
  return '';
}

/**
 * Check if real Google Client ID is configured
 */
export function isGoogleAuthAvailable(): boolean {
  return getGoogleClientId().length > 0;
}
