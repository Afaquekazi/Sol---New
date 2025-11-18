// ========== ANALYTICS TRACKING ==========

import { ANALYTICS_ENDPOINT, EXTENSION_VERSION } from '../core/constants.js';
import { extensionSessionId, setExtensionSessionId } from '../core/state.js';
import { getAuthToken } from '../api/backend-auth.js';

// Generate unique session ID
export function getExtensionSessionId() {
    if (!extensionSessionId) {
        const newSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        setExtensionSessionId(newSessionId);
    }
    return extensionSessionId;
}

// Track analytics event
export async function trackAnalyticsEvent(eventType, metadata = {}, error = null) {
    try {
        const sessionId = getExtensionSessionId();

        // Get user ID if logged in
        let userId = null;
        try {
            const authToken = await getAuthToken();
            if (authToken) {
                // Try to extract user ID from JWT
                try {
                    const tokenParts = authToken.split('.');
                    if (tokenParts.length === 3) {
                        const payload = JSON.parse(atob(tokenParts[1]));
                        userId = payload.uid || payload.user_id || null;
                    }
                } catch (e) {
                    // Token not JWT format
                }
            }
        } catch (e) {
            // No auth token
        }

        const data = {
            event: eventType,
            sessionId: sessionId,
            userId: userId,
            version: EXTENSION_VERSION,
            metadata: metadata,
            error: error
        };

        fetch(ANALYTICS_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(() => {
            // Silent fail - don't interrupt user experience
        });
    } catch (e) {
        // Silent fail
    }
}
