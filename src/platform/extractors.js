// ========== CONTENT EXTRACTION UTILITIES ==========

// ========== EXTRACT LAST Q&A EXCHANGE ==========
export function extractLastExchange(platform) {
    try {
        switch(platform) {
            case 'chatgpt':
                return extractChatGPTLastExchange();
            case 'claude':
                return extractClaudeLastExchange();
            case 'gemini':
                return extractGeminiLastExchange();
            case 'deepseek':
                return extractDeepSeekLastExchange();
            case 'grok':
                return extractGrokLastExchange();
            case 'perplexity':
                return extractPerplexityLastExchange();
            default:
                return null;
        }
    } catch (error) {
        return null;
    }
}

export function extractChatGPTLastExchange() {
    const messages = document.querySelectorAll('[data-message-author-role]');

    if (messages.length < 2) return null;

    // Get last two messages (user question + AI answer)
    const userMessage = messages[messages.length - 2];
    const aiMessage = messages[messages.length - 1];

    // Verify roles
    const userRole = userMessage.getAttribute('data-message-author-role');
    const aiRole = aiMessage.getAttribute('data-message-author-role');

    if (userRole !== 'user' || aiRole !== 'assistant') {
        return null;
    }

    return {
        question: userMessage.textContent.trim(),
        answer: aiMessage.textContent.trim()
    };
}

export function extractClaudeLastExchange() {
    // Get all message containers
    const allMessages = document.querySelectorAll('.font-user-message, .font-claude-message');

    if (allMessages.length < 2) return null;

    // Get last two
    const userMessage = allMessages[allMessages.length - 2];
    const aiMessage = allMessages[allMessages.length - 1];

    // Verify they're the right type
    if (!userMessage.classList.contains('font-user-message') ||
        !aiMessage.classList.contains('font-claude-message')) {
        return null;
    }

    return {
        question: userMessage.textContent.trim(),
        answer: aiMessage.textContent.trim()
    };
}

export function extractGeminiLastExchange() {
    // Try multiple selectors for Gemini
    const userMessages = document.querySelectorAll('[class*="user-message"], [data-message-author="user"]');
    const aiMessages = document.querySelectorAll('[class*="model-message"], [class*="response-container"]');

    if (userMessages.length === 0 || aiMessages.length === 0) return null;

    const lastUserMsg = userMessages[userMessages.length - 1];
    const lastAiMsg = aiMessages[aiMessages.length - 1];

    return {
        question: lastUserMsg?.textContent.trim() || '',
        answer: lastAiMsg?.textContent.trim() || ''
    };
}

export function extractDeepSeekLastExchange() {
    const messages = document.querySelectorAll('.message-container, [class*="message"]');

    if (messages.length < 2) return null;

    const userMessage = messages[messages.length - 2];
    const aiMessage = messages[messages.length - 1];

    return {
        question: userMessage?.textContent.trim() || '',
        answer: aiMessage?.textContent.trim() || ''
    };
}

export function extractGrokLastExchange() {
    // Similar to ChatGPT structure
    const messages = document.querySelectorAll('[data-testid*="message"], .message');

    if (messages.length < 2) return null;

    return {
        question: messages[messages.length - 2]?.textContent.trim() || '',
        answer: messages[messages.length - 1]?.textContent.trim() || ''
    };
}

export function extractPerplexityLastExchange() {
    const userMessages = document.querySelectorAll('[class*="user"]');
    const aiMessages = document.querySelectorAll('[class*="assistant"], [class*="answer"]');

    if (userMessages.length === 0 || aiMessages.length === 0) return null;

    return {
        question: userMessages[userMessages.length - 1]?.textContent.trim() || '',
        answer: aiMessages[aiMessages.length - 1]?.textContent.trim() || ''
    };
}

// ========== GMAIL CONTEXT EXTRACTION ==========
export function extractGmailContext() {
    const context = {
        isReply: false,
        recipients: [],
        subject: '',
        previousEmails: [],
        isCompose: true
    };

    try {
        // Check if it's a reply
        const replyIndicators = document.querySelectorAll('.gmail_quote, .gmail_attr, blockquote');
        context.isReply = replyIndicators.length > 0;

        // Get recipients (TO field)
        const toFields = document.querySelectorAll('input[name="to"], span[email], .vR span[email]');
        toFields.forEach(field => {
            const email = field.getAttribute('email') || field.value;
            if (email && !context.recipients.includes(email)) {
                context.recipients.push(email);
            }
        });

        // Get subject line
        const subjectField = document.querySelector('input[name="subjectbox"], input[name="subject"]');
        if (subjectField) {
            context.subject = subjectField.value;
        }

        // Detect if formal (based on domain)
        context.isFormal = context.recipients.some(email => {
            return email.includes('.gov') ||
                   email.includes('.edu') ||
                   email.includes('ceo') ||
                   email.includes('director') ||
                   email.includes('manager');
        });

        // Get thread context if reply
        if (context.isReply) {
            const quotedText = document.querySelector('.gmail_quote, .ii.gt');
            if (quotedText) {
                context.previousEmails = quotedText.innerText.substring(0, 500); // First 500 chars for context
            }
        }

    } catch (error) {
        // Silent fail
    }

    return context;
}
