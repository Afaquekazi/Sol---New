chrome.action.onClicked.addListener(async (tab) => {
 try {
   await chrome.tabs.sendMessage(tab.id, { action: "toggleExtension" });
 } catch (error) {
   // Error sending toggle message
 }
});

// Helper function to get auth token
async function getAuthToken() {
  try {
    const result = await chrome.storage.local.get(['authToken']);
    return result.authToken || null;
  } catch (error) {
    return null;
  }
}

// Helper function to create headers with optional auth
async function createHeaders() {
  const headers = { 'Content-Type': 'application/json' };

  const authToken = await getAuthToken();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
 // Main text enhancement handler - USED
 if (request.type === 'enhance_text') {
   const mode = request.data.mode || 'enhance';
   let endpoint = 'generate';
   let requestBody = { ...request.data, mode: mode };

   if (mode === 'persona_generator') {
     endpoint = 'generate-persona';
     requestBody = {
       text: request.data.topic,
       mode: mode
     };
   }

   const controller = new AbortController();
   const timeoutId = setTimeout(() => {
     controller.abort();
   }, mode === 'persona_generator' ? 30000 : 15000);

   createHeaders().then(headers => {
     fetch(`https://afaque.pythonanywhere.com/${endpoint}`, {
       method: 'POST',
       headers: headers,
       body: JSON.stringify(requestBody),
       signal: controller.signal
     })
     .then(response => {
       clearTimeout(timeoutId);
       if (!response.ok) {
         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
       }
       return response.json();
     })
     .then(data => {
       sendResponse({success: true, data});
     })
     .catch(error => {
       clearTimeout(timeoutId);

       let errorMessage = error.message;
       if (error.name === 'AbortError') {
         errorMessage = `Request timeout - ${mode === 'persona_generator' ? 'AI analysis' : 'processing'} took too long`;
       } else if (error.message.includes('Failed to fetch')) {
         errorMessage = 'Network error - please check your connection';
       }

       sendResponse({success: false, error: errorMessage});
     });
   });
   return true;
 }

 // Smart Followups Handler - USED in content.js contextmenu
 if (request.type === 'smart_followups') {
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 20000);

   createHeaders().then(headers => {
     fetch('https://afaque.pythonanywhere.com/smart-followups', {
       method: 'POST',
       headers: headers,
       body: JSON.stringify({
         conversation: request.data.conversation,
         platform: request.data.platform
       }),
       signal: controller.signal
     })
     .then(response => {
       clearTimeout(timeoutId);
       if (!response.ok) {
         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
       }
       return response.json();
     })
     .then(data => sendResponse({success: true, data}))
     .catch(error => {
       clearTimeout(timeoutId);
       sendResponse({success: false, error: error.message});
     });
   });
   return true;
 }

 // Magic Pill Enhancement Handler - USED by Magic Pill feature
 if (request.type === 'magic_pill_enhance') {
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 20000);

   createHeaders().then(headers => {
     fetch('https://afaque.pythonanywhere.com/magic-pill-enhance', {
       method: 'POST',
       headers: headers,
       body: JSON.stringify({
         text: request.data.text,
         platform: request.data.platform
       }),
       signal: controller.signal
     })
     .then(response => {
       clearTimeout(timeoutId);
       if (!response.ok) {
         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
       }
       return response.json();
     })
     .then(data => {
       sendResponse({success: true, data});
     })
     .catch(error => {
       clearTimeout(timeoutId);

       let errorMessage = error.message;
       if (error.name === 'AbortError') {
         errorMessage = 'Magic pill enhancement timeout - please try with shorter text';
       } else if (error.message.includes('Failed to fetch')) {
         errorMessage = 'Network error - please check your connection';
       }

       sendResponse({success: false, error: errorMessage});
     });
   });
   return true;
 }

 // Gmail Enhancement Handler - USED by Gmail Magic Pill feature
 if (request.type === 'gmail_enhance') {
   (async () => {
     const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), 20000);

     try {
       const headers = await createHeaders();

       const response = await fetch('https://afaque.pythonanywhere.com/gmail-enhance', {
         method: 'POST',
         headers: headers,
         body: JSON.stringify({
           text: request.data.text,
           platform: request.data.platform,
           context: request.data.context,
           mode: request.data.mode
         }),
         signal: controller.signal
       });

       clearTimeout(timeoutId);
       const data = await response.json();

       if (!response.ok) {
         sendResponse({
           success: false,
           error: data.error || `HTTP ${response.status}: ${response.statusText}`
         });
         return;
       }

       sendResponse({success: true, data});

     } catch (error) {
       clearTimeout(timeoutId);

       let errorMessage = error.message || 'Unknown error';
       if (error.name === 'AbortError') {
         errorMessage = 'Gmail enhancement timeout - please try with shorter text';
       } else if (errorMessage.includes('Failed to fetch')) {
         errorMessage = 'Network error - please check your connection';
       }

       sendResponse({success: false, error: errorMessage});
     }
   })();

   return true;
 }

 // Gmail Custom Prompt Enhancement Handler - USED by Gmail Custom Prompt feature
 if (request.type === 'gmail_enhance_custom') {
   (async () => {
     const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), 20000);

     try {
       const headers = await createHeaders();

       const response = await fetch('https://afaque.pythonanywhere.com/gmail-enhance-custom', {
         method: 'POST',
         headers: headers,
         body: JSON.stringify({
           text: request.data.text,
           platform: request.data.platform,
           context: request.data.context,
           customPrompt: request.data.customPrompt
         }),
         signal: controller.signal
       });

       clearTimeout(timeoutId);
       const data = await response.json();

       if (!response.ok) {
         sendResponse({
           success: false,
           error: data.error || `HTTP ${response.status}: ${response.statusText}`
         });
         return;
       }

       sendResponse({success: true, data});

     } catch (error) {
       clearTimeout(timeoutId);

       let errorMessage = error.message || 'Unknown error';
       if (error.name === 'AbortError') {
         errorMessage = 'Gmail custom enhancement timeout - please try with shorter text';
       } else if (errorMessage.includes('Failed to fetch')) {
         errorMessage = 'Network error - please check your connection';
       }

       sendResponse({success: false, error: errorMessage});
     }
   })();

   return true;
 }

 // Gmail Smart Reply - Analyze Email Questions Handler
 if (request.type === 'analyze_email_questions') {
   (async () => {
     const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), 20000);

     try {
       const headers = await createHeaders();

       const response = await fetch('https://afaque.pythonanywhere.com/analyze-email-questions', {
         method: 'POST',
         headers: headers,
         body: JSON.stringify({
           emailBody: request.data.emailBody,
           context: request.data.context
         }),
         signal: controller.signal
       });

       clearTimeout(timeoutId);
       const data = await response.json();

       if (!response.ok) {
         sendResponse({
           success: false,
           error: data.error || `HTTP ${response.status}: ${response.statusText}`
         });
         return;
       }

       sendResponse({success: true, data});

     } catch (error) {
       clearTimeout(timeoutId);

       let errorMessage = error.message || 'Unknown error';
       if (error.name === 'AbortError') {
         errorMessage = 'Email analysis timeout - please try again';
       } else if (errorMessage.includes('Failed to fetch')) {
         errorMessage = 'Network error - please check your connection';
       }

       sendResponse({success: false, error: errorMessage});
     }
   })();

   return true;
 }

 // Gmail Smart Reply - Generate Reply Handler
 if (request.type === 'gmail_smart_reply_generate') {
   (async () => {
     const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), 25000);

     try {
       const headers = await createHeaders();

       const response = await fetch('https://afaque.pythonanywhere.com/gmail-smart-reply', {
         method: 'POST',
         headers: headers,
         body: JSON.stringify({
           emailBody: request.data.emailBody,
           context: request.data.context,
           questions: request.data.questions,
           answers: request.data.answers
         }),
         signal: controller.signal
       });

       clearTimeout(timeoutId);
       const data = await response.json();

       if (!response.ok) {
         sendResponse({
           success: false,
           error: data.error || `HTTP ${response.status}: ${response.statusText}`
         });
         return;
       }

       sendResponse({success: true, data});

     } catch (error) {
       clearTimeout(timeoutId);

       let errorMessage = error.message || 'Unknown error';
       if (error.name === 'AbortError') {
         errorMessage = 'Reply generation timeout - please try with shorter content';
       } else if (errorMessage.includes('Failed to fetch')) {
         errorMessage = 'Network error - please check your connection';
       }

       sendResponse({success: false, error: errorMessage});
     }
   })();

   return true;
 }

 // Image Processing Handler - USED for image features
 if (request.type === 'process_image') {
   const imageUrl = request.data.imageUrl;
   const mode = request.data.mode;

   const endpoint = mode === 'image_caption' ? 'generate-caption' :
                   mode === 'image_keyword' ? 'generate-keywords' :
                   'generate-image';

   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 25000);

   fetch(imageUrl)
     .then(response => {
       if (!response.ok) {
         throw new Error(`Failed to fetch image: ${response.status}`);
       }
       return response.blob();
     })
     .then(blob => {
       const reader = new FileReader();
       reader.onloadend = () => {
         createHeaders().then(headers => {
           fetch(`https://afaque.pythonanywhere.com/${endpoint}`, {
             method: 'POST',
             headers: headers,
             body: JSON.stringify({
               image: reader.result,
               mode: mode
             }),
             signal: controller.signal
           })
           .then(response => {
             clearTimeout(timeoutId);
             if (!response.ok) {
               throw new Error(`HTTP ${response.status}: ${response.statusText}`);
             }
             return response.json();
           })
           .then(data => sendResponse({success: true, data}))
           .catch(error => {
             clearTimeout(timeoutId);
             sendResponse({success: false, error: error.message});
           });
         });
       };
       reader.onerror = () => {
         clearTimeout(timeoutId);
         sendResponse({success: false, error: 'Failed to read image file'});
       };
       reader.readAsDataURL(blob);
     })
     .catch(error => {
       clearTimeout(timeoutId);
       sendResponse({success: false, error: error.message});
     });
   return true;
 }

 // AI Platform Custom Prompt Handler - USED for AI platform customize mode
 if (request.type === 'ai_platform_custom') {
   (async () => {
     const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), 20000);

     try {
       const headers = await createHeaders();

       const response = await fetch('https://afaque.pythonanywhere.com/ai-platform-custom', {
         method: 'POST',
         headers: headers,
         body: JSON.stringify({
           text: request.data.text,
           customPrompt: request.data.customPrompt
         }),
         signal: controller.signal
       });

       clearTimeout(timeoutId);
       const data = await response.json();

       if (!response.ok) {
         sendResponse({
           success: false,
           error: data.error || `HTTP ${response.status}: ${response.statusText}`
         });
         return;
       }

       sendResponse({success: true, data});

     } catch (error) {
       clearTimeout(timeoutId);

       let errorMessage = error.message || 'Unknown error';
       if (error.name === 'AbortError') {
         errorMessage = 'AI Platform custom prompt timeout - please try with shorter text';
       } else if (errorMessage.includes('Failed to fetch')) {
         errorMessage = 'Network error - please check your connection';
       }

       sendResponse({success: false, error: errorMessage});
     }
   })();

   return true;
 }

 // Return false for unhandled message types
 return false;
});
