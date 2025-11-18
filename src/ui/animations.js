// ========== UI ANIMATION UTILITIES ==========

import { shadowRoot, outputText } from '../core/state.js';

// Double-click animation for button
export function triggerDoubleClickAnimation() {
    const solthronButton = shadowRoot?.querySelector('.solthron-button');

    if (!solthronButton) return;

    solthronButton.classList.remove('double-click-activated');
    solthronButton.offsetHeight; // Force reflow
    solthronButton.classList.add('double-click-activated');

    setTimeout(() => {
        solthronButton.classList.remove('double-click-activated');
    }, 600);
}

// Loading shimmer effects
export function showShimmerLoading(message) {
    if (!outputText) return;

    outputText.classList.remove('placeholder', 'error');
    outputText.classList.add('shimmer-loading');
    outputText.textContent = message;
}

export function hideShimmerLoading() {
    if (!outputText) return;

    outputText.classList.remove('shimmer-loading');
}
