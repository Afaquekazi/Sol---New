// ========== AUTOCOMPLETE SEARCH ==========

import { loadPrompts } from '../prompts/storage.js';
import { loadWorkflows } from '../workflows/storage.js';

// Search saved items (prompts and workflows)
export async function searchSavedItems(query) {
    try {
        const prompts = await loadPrompts();
        const workflows = await loadWorkflows();

        const allItems = [
            ...prompts.map(p => ({...p, type: 'prompt', icon: '📝', category: 'Prompt'})),
            ...workflows.map(w => ({
                ...w,
                type: 'workflow',
                icon: '⚙️',
                category: 'Workflow',
                text: w.title // Use title for searching
            }))
        ];

        if (!query) {
            return allItems.slice(0, 8); // Show first 8 if no query
        }

        // Fuzzy search
        return allItems.filter(item => {
            // Search in title for all items
            if (item.title && item.title.toLowerCase().includes(query.toLowerCase())) {
                return true;
            }
            // Search in text for prompts
            if (item.text && item.text.toLowerCase().includes(query.toLowerCase())) {
                return true;
            }
            // Search in workflow steps
            if (item.steps) {
                return item.steps.some(step =>
                    step.prompt.toLowerCase().includes(query.toLowerCase())
                );
            }
            return false;
        }).slice(0, 8); // Max 8 results

    } catch (error) {
        return [];
    }
}
