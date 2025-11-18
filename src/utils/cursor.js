// ========== CURSOR POSITION UTILITIES ==========

import { detectAIPlatform } from '../platform/detector.js';

export function getCursorPosition(element) {
    try {
        if (element.tagName === 'TEXTAREA') {
            return getCursorPositionTextarea(element);
        } else {
            return getCursorPositionContentEditable(element);
        }
    } catch (error) {
        return null;
    }
}

export function getCursorPositionContentEditable(element) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    try {
        const range = selection.getRangeAt(0);

        // ✅ FIX: Check if range is actually within our target element
        if (!element.contains(range.commonAncestorContainer)) {
            return null;
        }

        const rect = range.getBoundingClientRect();

        // ✅ FIX: Better validation of rect
        if (rect.left === 0 && rect.top === 0 && rect.width === 0 && rect.height === 0) {
            // Completely empty rect, likely invalid selection
            return null;
        }

        // If range has no width/height, it's probably collapsed at cursor
        if (rect.width === 0 && rect.height === 0) {
            return {
                x: rect.left,
                y: rect.top,
                height: 20 // fallback height
            };
        }

        // For text selection, use the end of the range
        const endRange = range.cloneRange();
        endRange.collapse(false);
        const endRect = endRange.getBoundingClientRect();

        return {
            x: endRect.left || rect.left,
            y: endRect.top || rect.top,
            height: endRect.height || rect.height || 20
        };
    } catch (error) {
        return null;
    }
}

export function getCursorPositionTextarea(element) {
    const selectionStart = element.selectionStart;
    const text = element.value.substring(0, selectionStart);

    // Create a temporary element to measure text
    const measurer = createTextMeasurer(element);
    const position = measureTextPosition(measurer, text, element);

    // Clean up
    document.body.removeChild(measurer);

    return position;
}

export function createTextMeasurer(textarea) {
    const measurer = document.createElement('div');
    const style = window.getComputedStyle(textarea);
    const platform = detectAIPlatform();

    // Base styling that works for all platforms
    let measurerCSS = `
        position: absolute;
        visibility: hidden;
        height: auto;
        width: ${textarea.offsetWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)}px;
        font: ${style.font};
        font-family: ${style.fontFamily};
        font-size: ${style.fontSize};
        font-weight: ${style.fontWeight};
        line-height: ${style.lineHeight};
        letter-spacing: ${style.letterSpacing};
        white-space: pre-wrap;
        word-wrap: break-word;
        padding: ${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft};
        border: ${style.border};
        box-sizing: ${style.boxSizing};
        z-index: -1;
    `;

    // Platform-specific positioning
    if (platform === 'deepseek' || platform === 'grok') {
        // For DeepSeek and Grok, position the measurer element exactly over the textarea
        const rect = textarea.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        measurerCSS += `
            top: ${rect.top + scrollTop}px;
            left: ${rect.left + scrollLeft}px;
        `;
    } else {
        // For other platforms, use the original positioning (off-screen)
        measurerCSS += `
            top: -9999px;
            left: -9999px;
        `;
    }

    measurer.style.cssText = measurerCSS;
    document.body.appendChild(measurer);
    return measurer;
}

export function measureTextPosition(measurer, text, textarea) {
    // Add text up to cursor position
    measurer.textContent = text;

    // Add a marker span at the end to get cursor position
    const marker = document.createElement('span');
    marker.textContent = '|';
    measurer.appendChild(marker);

    const textareaRect = textarea.getBoundingClientRect();
    const markerRect = marker.getBoundingClientRect();
    const measurerRect = measurer.getBoundingClientRect();

    // Platform-specific coordinate calculation
    const platform = detectAIPlatform();

    if (platform === 'deepseek' || platform === 'grok') {
        // DeepSeek and Grok need special coordinate handling
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        // Calculate relative position within measurer, then translate to textarea coordinates
        const relativeX = markerRect.left - measurerRect.left;
        const relativeY = markerRect.top - measurerRect.top;

        return {
            x: textareaRect.left + relativeX,
            y: textareaRect.top + relativeY,
            height: markerRect.height || 20
        };
    } else {
        // Original logic for other platforms (ChatGPT, Claude, Gemini)
        return {
            x: markerRect.left,
            y: markerRect.top,
            height: markerRect.height || 20
        };
    }
}

// Get text offset helper
export function getTextOffset(element, node, offset) {
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        return element.selectionStart;
    }

    const range = document.createRange();
    range.selectNodeContents(element);
    range.setEnd(node, offset);
    return range.toString().length;
}
