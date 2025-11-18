// ========== CHATS MANAGEMENT ==========

import {
    isChatStarActive,
    activeChatId,
    setActiveChatId,
    setIsChatStarActive
} from '../../core/state.js';

// Save chat exchange
export async function saveChatExchange(exchangeData) {
    // Check if a chat is starred/active (append mode)
    if (isChatStarActive && activeChatId) {
        try {
            const data = await chrome.storage.local.get('savedChats');
            const savedChats = data.savedChats || [];
            const chatIndex = savedChats.findIndex(chat => chat.id === activeChatId);

            if (chatIndex !== -1) {
                // Append to existing chat in Q&A format
                const newExchange = `\n\n---\n\nQ: ${exchangeData.question}\nA: ${exchangeData.answer}`;

                // Check if the original format is Q&A style or old format
                const isOldFormat = !savedChats[chatIndex].question.startsWith('Q: ');

                if (isOldFormat) {
                    // Convert old format to new Q&A format
                    savedChats[chatIndex].question = `Q: ${savedChats[chatIndex].question}\nA: ${savedChats[chatIndex].answer}`;
                    savedChats[chatIndex].answer = ''; // Clear answer field
                }

                // Append new exchange
                savedChats[chatIndex].question += newExchange;

                // Update metadata
                savedChats[chatIndex].date = new Date().toISOString();

                // Update detection flags
                savedChats[chatIndex].hasCode = savedChats[chatIndex].hasCode || exchangeData.hasCode;
                if (exchangeData.language && !savedChats[chatIndex].language) {
                    savedChats[chatIndex].language = exchangeData.language;
                }

                await chrome.storage.local.set({ savedChats });
                return true;
            }
        } catch (error) {
            return false;
        }
    } else {
        // Create new chat in Q&A format
        try {
            const data = await chrome.storage.local.get('savedChats');
            const savedChats = data.savedChats || [];

            // Format new chats in Q&A style
            const formattedData = {
                ...exchangeData,
                question: `Q: ${exchangeData.question}\nA: ${exchangeData.answer}`,
                answer: '' // Empty since we're storing both in question field
            };

            savedChats.push(formattedData);
            await chrome.storage.local.set({ savedChats });
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Load saved chats
export async function loadSavedChats() {
    try {
        const data = await chrome.storage.local.get('savedChats');
        return data.savedChats || [];
    } catch (error) {
        return [];
    }
}

// Delete saved chat
export async function deleteSavedChat(chatId) {
    try {
        const data = await chrome.storage.local.get('savedChats');
        const savedChats = (data.savedChats || []).filter(c => c.id !== chatId);
        await chrome.storage.local.set({ savedChats });
        return true;
    } catch (error) {
        return false;
    }
}

// Rename saved chat
export async function renameSavedChat(chatId, newTitle) {
    try {
        const data = await chrome.storage.local.get('savedChats');
        const savedChats = data.savedChats || [];
        const chatIndex = savedChats.findIndex(chat => chat.id === chatId);

        if (chatIndex !== -1) {
            savedChats[chatIndex].title = newTitle;
            savedChats[chatIndex].date = new Date().toISOString();
            await chrome.storage.local.set({ savedChats });
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}
