// ========== QUICK SAVE KEYBOARD SHORTCUT ==========

import { getInputText } from '../../utils/text-processing.js';
import { savePrompt } from '../prompts/storage.js';
import { showQuickSaveFeedback, showNotification } from '../../ui/notifications.js';
import { setJustSavedPrompt, pageCredits, setPageCredits } from '../../core/state.js';
import { BackendAuth } from '../../api/backend-auth.js';

// Check credits before using a feature
async function checkCredits(featureMode) {
    // For now, simple check - can be expanded
    try {
        const token = await BackendAuth.getAuthToken();
        if (!token) {
            return { success: false, message: 'Please login to use this feature' };
        }
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Error checking credits' };
    }
}

// Handle Alt+S quick save shortcut
export async function handleQuickSave(e) {
    // Check for Alt+S
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        e.stopPropagation();

        // Try to get highlighted text first
        let text = window.getSelection().toString().trim();

        // If no highlighted text, get text from input field
        if (!text && e.target) {
            text = getInputText(e.target);
        }

        if (text.trim().length > 0) {
            // Check credits before saving
            const creditCheck = await checkCredits('save_prompt');
            if (!creditCheck.success) {
                showNotification(creditCheck.message || 'Please login to save prompts', 'error');
                return;
            }

            // Clear text selection immediately to prevent accidental processing
            window.getSelection().removeAllRanges();

            // Set flag to prevent processing for 2 seconds
            setJustSavedPrompt(true);
            setTimeout(() => {
                setJustSavedPrompt(false);
            }, 2000);

            // Save directly to prompts
            const success = await savePrompt(text);
            if (success) {
                // Deduct credits after successful save
                const deductResult = await BackendAuth.deductCredits('save_prompt');
                if (deductResult.success) {
                    setPageCredits(deductResult.remainingCredits);
                }
                // Show visual feedback
                showQuickSaveFeedback();
            }
        }
    }
}

// Initialize quick save keyboard shortcut
export function initializeQuickSave() {
    document.addEventListener('keydown', handleQuickSave, true);
}
