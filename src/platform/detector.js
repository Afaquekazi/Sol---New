// ========== PLATFORM DETECTION ==========

export let isGmailPage = false;

export function setIsGmailPage(value) {
    isGmailPage = value;
}

export function detectAIPlatform() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // Check for Gmail first
    if (hostname.includes('mail.google.com')) {
        isGmailPage = true;
        return 'gmail';
    }

    if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) {
        return 'chatgpt';
    } else if (hostname.includes('claude.ai')) {
        return 'claude';
    } else if (hostname.includes('gemini.google.com') || hostname.includes('bard.google.com')) {
        return 'gemini';
    } else if (hostname.includes('chat.deepseek.com')) {
        return 'deepseek';
    } else if (hostname.includes('lovable.dev')) {
        return 'lovable';
    } else if (hostname.includes('grok.x.com') || (hostname.includes('x.com') && pathname.includes('grok'))) {
        return 'grok';
    } else if (hostname.includes('perplexity.ai')) {
        return 'perplexity';
    }
    return 'unknown';
}
