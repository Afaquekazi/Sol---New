// ========== BACKEND AUTHENTICATION API ==========

import { BACKEND_ENDPOINTS } from '../core/constants.js';
import { setPageCredits } from '../core/state.js';

// Get auth token from storage
export async function getAuthToken() {
    try {
        const result = await chrome.storage.local.get(['authToken']);
        return result.authToken || null;
    } catch (error) {
        return null;
    }
}

// Set auth token in storage
export async function setAuthToken(token) {
    try {
        await chrome.storage.local.set({
            authToken: token,
            authTimestamp: Date.now()
        });
        return true;
    } catch (error) {
        return false;
    }
}

// Exchange Firebase token for backend JWT
export async function exchangeFirebaseTokenForBackendJWT(firebaseToken) {
    try {
        const response = await fetch(BACKEND_ENDPOINTS.GOOGLE_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firebaseToken })
        });

        const data = await response.json();

        if (response.ok && data.success && data.token) {
            return { success: true, token: data.token, user: data.user };
        } else {
            return { success: false, error: data.error || 'Token exchange failed' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Check if user is logged in
export async function isLoggedIn() {
    try {
        const token = await getAuthToken();
        if (!token) return false;

        const response = await fetch(BACKEND_ENDPOINTS.USER_CREDITS, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.ok;
    } catch (error) {
        return false;
    }
}

// Login with email and password
export async function login(email, password) {
    try {
        const response = await fetch(BACKEND_ENDPOINTS.AUTH_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            await setAuthToken(data.token);
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error || 'Login failed' };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// Logout user
export async function logout() {
    try {
        await chrome.storage.local.remove(['authToken', 'authTimestamp']);
        setPageCredits(null);
        return true;
    } catch (error) {
        return false;
    }
}

// Get user credits
export async function getUserCredits() {
    try {
        const token = await getAuthToken();
        if (!token) return 0;

        const response = await fetch(BACKEND_ENDPOINTS.USER_CREDITS, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.credits || 0;
        }
        return 0;
    } catch (error) {
        return 0;
    }
}

// Deduct credits for a feature
export async function deductCredits(feature) {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, message: "Not logged in" };
        }

        const response = await fetch(BACKEND_ENDPOINTS.DEDUCT_CREDITS, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ feature })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Export as BackendAuth object for compatibility
export const BackendAuth = {
    getAuthToken,
    setAuthToken,
    exchangeFirebaseTokenForBackendJWT,
    isLoggedIn,
    login,
    logout,
    getUserCredits,
    deductCredits
};
