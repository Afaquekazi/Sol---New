// ========== CODE DETECTION UTILITIES ==========

// Detect if text contains code
export function detectCode(text) {
    if (!text) return false;

    // Check for code indicators
    const codeIndicators = [
        '```',           // Code blocks
        'function',      // JavaScript
        'def ',          // Python
        'class ',        // OOP
        'import ',       // Imports
        'const ',        // JS const
        'let ',          // JS let
        '<div',          // HTML
        'SELECT ',       // SQL
        '{',             // JSON/Objects
    ];

    return codeIndicators.some(indicator => text.includes(indicator));
}

// Detect programming language in text
export function detectLanguage(text) {
    if (!text) return null;

    // Check for code block with language
    const codeBlockMatch = text.match(/```(\w+)/);
    if (codeBlockMatch) {
        return codeBlockMatch[1];
    }

    // Heuristic detection
    if (text.includes('def ') && text.includes(':')) return 'python';
    if (text.includes('function') || text.includes('const ')) return 'javascript';
    if (text.includes('public class')) return 'java';
    if (text.includes('<?php')) return 'php';
    if (text.includes('<html') || text.includes('<div')) return 'html';
    if (text.includes('SELECT') && text.includes('FROM')) return 'sql';

    return null;
}
