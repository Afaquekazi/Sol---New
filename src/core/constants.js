// ========== SOLTHRON EXTENSION CONSTANTS ==========

export const ANALYTICS_ENDPOINT = 'https://afaque.pythonanywhere.com/extension/track';
export const EXTENSION_VERSION = '1.5';

// Backend API endpoints
export const BACKEND_ENDPOINTS = {
    GOOGLE_LOGIN: 'https://afaque.pythonanywhere.com/google-login',
    USER_CREDITS: 'https://afaque.pythonanywhere.com/user-credits',
    AUTH_LOGIN: 'https://afaque.pythonanywhere.com/auth/login',
    DEDUCT_CREDITS: 'https://afaque.pythonanywhere.com/deduct-credits'
};

// Feature credit costs
export const FEATURE_CREDITS = {
    // Explain modes (5 credits)
    explain_meaning: 5,
    explain_story: 5,
    explain_eli5: 5,

    // AI Assistant modes (5 credits)
    smart_followups: 5,

    // Image modes (5 credits)
    image_prompt: 5,

    // 2 credit features
    workflow_step: 2,
    save_prompt: 2,
    save_response: 2,
    prompt_autocomplete: 2,

    // Free modes
    save_note: 0,
    save_persona: 0,

    // Default
    default: 6
};

// Get feature credits helper
export function getFeatureCredits(mode) {
    return FEATURE_CREDITS[mode] !== undefined
        ? FEATURE_CREDITS[mode]
        : FEATURE_CREDITS.default;
}
