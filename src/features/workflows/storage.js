// ========== WORKFLOWS STORAGE ==========

// Built-in workflows
const BUILT_IN_WORKFLOWS = [
    {
        id: 'workflow-blogwriter',
        name: 'BlogWriter',
        title: 'Blog Writer Workflow',
        steps: [
            { number: 1, prompt: 'Write a blog article about AI trends' },
            { number: 2, prompt: 'Add some real life stories' },
            { number: 3, prompt: 'Add SEO keywords' },
            { number: 4, prompt: 'Make it easy to read and use simple english' },
            { number: 5, prompt: 'Add a catchy title and meta description' }
        ],
        timestamp: new Date().toISOString(),
        source: 'built_in'
    },
    {
        id: 'workflow-emailresponder',
        name: 'EmailResponder',
        title: 'Email Response Workflow',
        steps: [
            { number: 1, prompt: 'Read the email and understand the main points' },
            { number: 2, prompt: 'Draft a professional response addressing all concerns' },
            { number: 3, prompt: 'Add a friendly greeting and closing' },
            { number: 4, prompt: 'Proofread for tone and clarity' }
        ],
        timestamp: new Date().toISOString(),
        source: 'built_in'
    },
    {
        id: 'workflow-poetrywriter',
        name: 'PoetryWriter',
        title: 'Poetry Writer Workflow',
        steps: [
            { number: 1, prompt: 'Write a {length} poem about {theme} in {style} style' },
            { number: 2, prompt: 'Add vivid imagery and metaphors related to {theme}' },
            { number: 3, prompt: 'Ensure the poem follows {style} structure and rhythm' },
            { number: 4, prompt: 'Add a powerful conclusion that resonates with the {theme}' }
        ],
        variables: [
            { name: 'theme', label: 'Theme', placeholder: 'e.g., nature, love, freedom' },
            { name: 'style', label: 'Style', placeholder: 'e.g., haiku, sonnet, free verse' },
            { name: 'length', label: 'Length', placeholder: 'e.g., short, medium, long' }
        ],
        timestamp: new Date().toISOString(),
        source: 'built_in'
    }
];

// Load workflows from storage
export async function loadWorkflows() {
    try {
        const storageData = await chrome.storage.local.get('workflows');
        const savedWorkflows = storageData.workflows || [];
        return [...BUILT_IN_WORKFLOWS, ...savedWorkflows];
    } catch (error) {
        return BUILT_IN_WORKFLOWS;
    }
}

// Save a new workflow
export async function saveWorkflow(workflowData) {
    try {
        const data = await chrome.storage.local.get('workflows');
        const workflows = data.workflows || [];

        const newWorkflow = {
            id: 'workflow_' + Date.now(),
            ...workflowData,
            timestamp: new Date().toISOString(),
            source: 'custom'
        };

        workflows.push(newWorkflow);
        await chrome.storage.local.set({ workflows });
        return newWorkflow;
    } catch (error) {
        return null;
    }
}

// Delete a workflow
export async function deleteWorkflow(workflowId) {
    try {
        const data = await chrome.storage.local.get('workflows');
        const workflows = (data.workflows || []).filter(w => w.id !== workflowId);
        await chrome.storage.local.set({ workflows });
        return true;
    } catch (error) {
        return false;
    }
}

// Rename a workflow
export async function renameWorkflow(workflowId, newTitle) {
    try {
        const data = await chrome.storage.local.get('workflows');
        const workflows = data.workflows || [];
        const workflowIndex = workflows.findIndex(w => w.id === workflowId);

        if (workflowIndex !== -1) {
            workflows[workflowIndex].title = newTitle;
            workflows[workflowIndex].timestamp = new Date().toISOString();

            await chrome.storage.local.set({ workflows });
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}
