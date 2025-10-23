// Utility to sync auth token with extension
export const syncTokenWithExtension = (token: string) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  // Send message to extension if it exists
  if (window.chrome && window.chrome.runtime) {
    try {
      // Try to send message to extension
      window.chrome.runtime.sendMessage(
        'your-extension-id', // This should be the actual extension ID
        {
          action: 'setAuthToken',
          token: token
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.log('Extension not available:', chrome.runtime.lastError.message);
          } else {
            console.log('Token synced with extension');
          }
        }
      );
    } catch (error) {
      console.log('Could not sync token with extension:', error);
    }
  }
};

// Alternative method using localStorage and polling
export const setupTokenSync = () => {
  if (typeof window === 'undefined') return;
  
  // Listen for storage changes (when token is updated)
  window.addEventListener('storage', (event) => {
    if (event.key === 'access_token' && event.newValue) {
      // Notify extension about new token
      window.postMessage({
        type: 'AUTH_TOKEN_UPDATE',
        token: event.newValue
      }, '*');
    }
  });
  
  // Also listen for direct token updates
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (key === 'access_token') {
      window.postMessage({
        type: 'AUTH_TOKEN_UPDATE',
        token: value
      }, '*');
    }
  };
};
