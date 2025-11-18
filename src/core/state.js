// ========== GLOBAL STATE MANAGEMENT ==========

// UI State
export let shadowRoot = null;
export let button = null;
export let outputText = null;
export let selectedMode = null;
export let solthronContainer = null;
export let isButtonVisible = false;

// Prompt State
export let currentCategory = null;
export let activePromptId = null;
export let isPromptStarActive = false;

// Chat State
export let activeChatId = null;
export let isChatStarActive = false;

// Workflow State
export let activeWorkflow = null;
export let activeWorkflowName = null;
export let isWorkflowExecuting = false;
export let isWorkflowMinimized = false;
export let activeWorkflowExecutor = null;
export let workflowUIState = null;

// Right-click Feature State
export let rightClickFeaturesEnabled = false;
export let lastSelectedRightClickMode = null;
export let pageCredits = null;

// Autocomplete State
export let autocompleteDropdown = null;
export let autocompleteMatches = [];
export let selectedAutocompleteIndex = 0;
export let lastAtPosition = -1;
export let currentInputField = null;

// Quick Save State
export let justSavedPrompt = false;

// Analytics State
export let extensionSessionId = null;

// ========== STATE SETTERS ==========

export function setShadowRoot(value) { shadowRoot = value; }
export function setButton(value) { button = value; }
export function setOutputText(value) { outputText = value; }
export function setSelectedMode(value) { selectedMode = value; }
export function setSolthronContainer(value) { solthronContainer = value; }
export function setIsButtonVisible(value) { isButtonVisible = value; }

export function setCurrentCategory(value) { currentCategory = value; }
export function setActivePromptId(value) { activePromptId = value; }
export function setIsPromptStarActive(value) { isPromptStarActive = value; }

export function setActiveChatId(value) { activeChatId = value; }
export function setIsChatStarActive(value) { isChatStarActive = value; }

export function setActiveWorkflow(value) { activeWorkflow = value; }
export function setActiveWorkflowName(value) { activeWorkflowName = value; }
export function setIsWorkflowExecuting(value) { isWorkflowExecuting = value; }
export function setIsWorkflowMinimized(value) { isWorkflowMinimized = value; }
export function setActiveWorkflowExecutor(value) { activeWorkflowExecutor = value; }
export function setWorkflowUIState(value) { workflowUIState = value; }

export function setRightClickFeaturesEnabled(value) { rightClickFeaturesEnabled = value; }
export function setLastSelectedRightClickMode(value) { lastSelectedRightClickMode = value; }
export function setPageCredits(value) { pageCredits = value; }

export function setAutocompleteDropdown(value) { autocompleteDropdown = value; }
export function setAutocompleteMatches(value) { autocompleteMatches = value; }
export function setSelectedAutocompleteIndex(value) { selectedAutocompleteIndex = value; }
export function setLastAtPosition(value) { lastAtPosition = value; }
export function setCurrentInputField(value) { currentInputField = value; }

export function setJustSavedPrompt(value) { justSavedPrompt = value; }
export function setExtensionSessionId(value) { extensionSessionId = value; }
