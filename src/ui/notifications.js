// ========== UNIVERSAL NOTIFICATION SYSTEM ==========

export function showNotification(message, type = 'success') {
    const notification = document.createElement('div');

    const bgColor = type === 'success' ? 'rgba(0, 255, 0, 0.9)' :
                    type === 'error' ? 'rgba(255, 107, 107, 0.9)' :
                    'rgba(255, 215, 0, 0.9)';

    notification.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: ${bgColor};
        color: black;
        padding: 12px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        z-index: 999999;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(10px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2500);
}

// Specific notification helpers
export function showQuickSaveFeedback() {
    showNotification('✓ Saved to Prompts');
}

export function showSuccessNotification(message) {
    showNotification(message, 'success');
}

export function showErrorNotification(message) {
    showNotification(message, 'error');
}

export function showWarningNotification(message) {
    showNotification(message, 'warning');
}
