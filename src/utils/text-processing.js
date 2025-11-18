// ========== TEXT PROCESSING UTILITIES ==========

// Generate title from text
export function generateTitleFromText(text) {
    if (!text || !text.trim()) {
        return 'Untitled';
    }

    // Remove extra whitespace and newlines
    const cleanText = text.trim().replace(/\s+/g, ' ');

    // Try to get first line/sentence
    let title = cleanText.split('\n')[0]; // First line
    if (!title) {
        title = cleanText.split('.')[0]; // First sentence
    }
    if (!title) {
        title = cleanText; // Fallback to full text
    }

    // Limit to 50 characters and break at word boundary
    if (title.length > 50) {
        title = title.substring(0, 50);
        const lastSpace = title.lastIndexOf(' ');
        if (lastSpace > 20) {
            title = title.substring(0, lastSpace);
        }
        title = title.trim() + '...';
    }

    return title;
}

// Get input text from various element types
export function getInputText(element) {
    if (!element) return '';

    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        return element.value;
    }

    // For contenteditable elements
    return element.textContent || element.innerText || '';
}

// Set input text for various element types
export function setInputText(element, text) {
    if (!element) return false;

    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        element.value = text;
        // Trigger input event to notify any listeners
        element.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
    }

    // For contenteditable elements
    if (element.isContentEditable) {
        element.textContent = text;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
    }

    return false;
}
