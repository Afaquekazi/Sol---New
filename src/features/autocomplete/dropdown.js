// ========== AUTOCOMPLETE DROPDOWN UI ==========

import {
    autocompleteDropdown,
    setAutocompleteDropdown,
    selectedAutocompleteIndex
} from '../../core/state.js';

// Create autocomplete dropdown element
export function createAutocompleteDropdown() {
    if (autocompleteDropdown) {
        autocompleteDropdown.remove();
    }

    const dropdown = document.createElement('div');
    dropdown.id = 'solthron-autocomplete';
    dropdown.style.cssText = `
        position: absolute;
        background: #2a2a2a;
        border: 2px solid rgba(255, 215, 0, 0.4);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        max-height: 280px;
        overflow-y: auto;
        z-index: 9999999;
        min-width: 300px;
        display: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Add scrollbar styling
    const style = document.createElement('style');
    style.textContent = `
        #solthron-autocomplete::-webkit-scrollbar {
            width: 6px;
        }
        #solthron-autocomplete::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }
        #solthron-autocomplete::-webkit-scrollbar-thumb {
            background: rgba(255, 215, 0, 0.3);
            border-radius: 3px;
        }
        #solthron-autocomplete::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 215, 0, 0.5);
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(dropdown);
    setAutocompleteDropdown(dropdown);
    return dropdown;
}

// Render autocomplete items in dropdown
export function renderAutocompleteItems(matches) {
    if (!autocompleteDropdown) {
        createAutocompleteDropdown();
    }

    autocompleteDropdown.innerHTML = '';

    if (matches.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.style.cssText = `
            padding: 12px;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
            font-size: 12px;
        `;
        emptyState.textContent = 'No saved items found';
        autocompleteDropdown.appendChild(emptyState);
        return;
    }

    matches.forEach((item, index) => {
        const option = document.createElement('div');
        option.className = 'autocomplete-option';
        option.dataset.index = index;

        const isSelected = index === selectedAutocompleteIndex;

        option.style.cssText = `
            padding: 10px 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-left: 3px solid ${isSelected ? '#ffd700' : 'transparent'};
            background: ${isSelected ? 'rgba(255, 215, 0, 0.1)' : 'transparent'};
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        option.innerHTML = `
            <span style="font-size: 16px; flex-shrink: 0;">${item.icon}</span>
            <div style="flex: 1; overflow: hidden;">
                <div style="
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 13px;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                ">${item.title}</div>
                <div style="
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 11px;
                    margin-top: 2px;
                ">${item.category}</div>
            </div>
            <div style="
                color: rgba(255, 215, 0, 0.6);
                font-size: 11px;
                padding: 2px 6px;
                background: rgba(255, 215, 0, 0.1);
                border-radius: 3px;
            ">${item.type === 'prompt' ? 'P' : 'W'}</div>
        `;

        // Hover effects
        option.addEventListener('mouseenter', () => {
            option.style.background = 'rgba(255, 215, 0, 0.1)';
        });

        option.addEventListener('mouseleave', () => {
            if (index !== selectedAutocompleteIndex) {
                option.style.background = 'transparent';
            }
        });

        // Click to select
        option.addEventListener('click', () => {
            const event = new CustomEvent('autocomplete-select', { detail: { item, index } });
            autocompleteDropdown.dispatchEvent(event);
        });

        autocompleteDropdown.appendChild(option);
    });
}

// Hide autocomplete dropdown
export function hideAutocompleteDropdown() {
    if (autocompleteDropdown) {
        autocompleteDropdown.style.display = 'none';
    }
}
