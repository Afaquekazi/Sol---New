// ========== PROMPTS STORAGE ==========

import { generateTitleFromText } from '../../utils/text-processing.js';

// Load prompts from storage
export async function loadPrompts() {
    try {
        const data = await chrome.storage.local.get('savedPrompts');
        let savedPrompts = data.savedPrompts || [];

        // Migration - Add titles to old prompts that don't have them
        let needsUpdate = false;
        savedPrompts = savedPrompts.map(prompt => {
            if (!prompt.title) {
                prompt.title = generateTitleFromText(prompt.text);
                needsUpdate = true;
            }
            return prompt;
        });

        // Save migrated prompts back to storage
        if (needsUpdate) {
            await chrome.storage.local.set({ savedPrompts });
        }

        return savedPrompts;
    } catch (error) {
        return [];
    }
}

// Save a new prompt
export async function savePrompt(promptText) {
    try {
        const data = await chrome.storage.local.get('savedPrompts');
        const savedPrompts = data.savedPrompts || [];

        const newPrompt = {
            id: 'prompt_' + Date.now(),
            text: promptText,
            title: generateTitleFromText(promptText),
            timestamp: new Date().toISOString()
        };

        savedPrompts.push(newPrompt);
        await chrome.storage.local.set({ savedPrompts });
        return newPrompt;
    } catch (error) {
        return null;
    }
}

// Delete a prompt
export async function deletePrompt(promptId) {
    try {
        const data = await chrome.storage.local.get('savedPrompts');
        const savedPrompts = (data.savedPrompts || []).filter(p => p.id !== promptId);
        await chrome.storage.local.set({ savedPrompts });
        return true;
    } catch (error) {
        return false;
    }
}

// Rename a prompt
export async function renamePrompt(promptId, newTitle) {
    try {
        const data = await chrome.storage.local.get('savedPrompts');
        const savedPrompts = data.savedPrompts || [];
        const promptIndex = savedPrompts.findIndex(prompt => prompt.id === promptId);

        if (promptIndex !== -1) {
            // CRITICAL: Only update title, NEVER touch text
            savedPrompts[promptIndex].title = newTitle;
            savedPrompts[promptIndex].timestamp = new Date().toISOString();

            await chrome.storage.local.set({ savedPrompts });
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}
