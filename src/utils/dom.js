// ========== DOM MANIPULATION UTILITIES ==========

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

// Create element with styles
export function createElement(tag, styles = {}, attributes = {}) {
    const element = document.createElement(tag);

    // Apply styles
    Object.entries(styles).forEach(([key, value]) => {
        element.style[key] = value;
    });

    // Apply attributes
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    return element;
}

// Remove element safely
export function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
        return true;
    }
    return false;
}

// Check if element is visible in viewport
export function isElementInViewport(element) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Scroll element into view smoothly
export function scrollIntoView(element, options = { behavior: 'smooth', block: 'nearest' }) {
    if (element && element.scrollIntoView) {
        element.scrollIntoView(options);
    }
}

// Wait for element to appear in DOM
export function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}
