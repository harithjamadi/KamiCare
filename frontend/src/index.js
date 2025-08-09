import React from 'react';
import ReactDOM from 'react-dom/client';

// Main entry point for the React application
const { createRoot } = ReactDOM;

// Wait for all scripts to load before initializing the app
document.addEventListener('DOMContentLoaded', () => {
  // Check if all required components are loaded
  const requiredComponents = [
    'App',
    'AppProvider',
    'PractitionerPage', 
    'PatientPage',
    'mockPatients'
  ];
  
  const missingComponents = requiredComponents.filter(component => !window[component]);
  
  if (missingComponents.length > 0) {
    console.error('Missing required components:', missingComponents);
    
    // Show error message to user
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed inset-0 bg-red-50 flex items-center justify-center z-50';
    errorDiv.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
        <div class="flex items-center mb-4">
          <svg class="h-8 w-8 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <h2 class="text-xl font-bold text-gray-800">Loading Error</h2>
        </div>
        <p class="text-gray-600 mb-4">
          Some components failed to load properly. Please refresh the page to try again.
        </p>
        <div class="text-sm text-gray-500 mb-4">
          Missing: ${missingComponents.join(', ')}
        </div>
        <button onclick="window.location.reload()" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Refresh Page
        </button>
      </div>
    `;
    document.body.appendChild(errorDiv);
    return;
  }

  // Get the root element
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  try {
    // Create React root and render the app
    const root = createRoot(rootElement);
    
    // Add loading indicator while the app initializes
    rootElement.innerHTML = `
      <div class="min-h-screen bg-gray-100 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">Healthcare Dashboard</h2>
          <p class="text-gray-600">Loading application...</p>
        </div>
      </div>
    `;

    // Render the main App component
    setTimeout(() => {
      root.render(React.createElement(window.App));
      console.log('Healthcare Dashboard application successfully initialized');
    }, 500); // Small delay to show loading state

  } catch (error) {
    console.error('Error initializing the application:', error);
    
    // Show error message
    rootElement.innerHTML = `
      <div class="min-h-screen bg-red-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div class="flex items-center mb-4">
            <svg class="h-8 w-8 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <h2 class="text-xl font-bold text-gray-800">Application Error</h2>
          </div>
          <p class="text-gray-600 mb-4">
            Failed to initialize the Healthcare Dashboard. Please check the console for more details.
          </p>
          <div class="text-sm text-gray-500 bg-gray-50 p-3 rounded mb-4 font-mono">
            ${error.message}
          </div>
          <button onclick="window.location.reload()" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Reload Application
          </button>
        </div>
      </div>
    `;
  }
});

// Add some basic error handling for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Optional: Add performance monitoring
if (window.performance && window.performance.mark) {
  window.performance.mark('app-start');
  
  window.addEventListener('load', () => {
    window.performance.mark('app-loaded');
    window.performance.measure('app-load-time', 'app-start', 'app-loaded');
    
    const measure = window.performance.getEntriesByName('app-load-time')[0];
    if (measure) {
      console.log(`Healthcare Dashboard loaded in ${Math.round(measure.duration)}ms`);
    }
  });
}