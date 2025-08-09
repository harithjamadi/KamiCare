// Main App Component
const { useState } = React;

const App = () => {
  const [currentView, setCurrentView] = useState('practitioner');

  return (
    React.createElement(window.AppProvider, null,
      React.createElement('div', { className: "App" },
        // View Toggle Button
        React.createElement('div', { className: "fixed top-4 right-4 z-40" },
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-2 flex space-x-2 card-shadow" },
            React.createElement('button', {
              onClick: () => setCurrentView('practitioner'),
              className: `px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentView === 'practitioner'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`
            }, 
              React.createElement('span', { className: "flex items-center" },
                React.createElement('svg', { className: "h-4 w-4 mr-1", fill: "currentColor", viewBox: "0 0 20 20" },
                  React.createElement('path', { 
                    fillRule: "evenodd",
                    d: "M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A.996.996 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zM6 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zM16 19a1 1 0 01-1 1H5a1 1 0 01-1-1v-6a1 1 0 011-1h10a1 1 0 011 1v6zM9 13a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM9 15a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z",
                    clipRule: "evenodd"
                  })
                ),
                "Practitioner"
              )
            ),
            React.createElement('button', {
              onClick: () => setCurrentView('patient'),
              className: `px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentView === 'patient'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`
            },
              React.createElement('span', { className: "flex items-center" },
                React.createElement('svg', { className: "h-4 w-4 mr-1", fill: "currentColor", viewBox: "0 0 20 20" },
                  React.createElement('path', { 
                    fillRule: "evenodd",
                    d: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z",
                    clipRule: "evenodd"
                  })
                ),
                "Patient"
              )
            )
          )
        ),

        // Navigation Breadcrumb (optional)
        React.createElement('div', { className: "fixed top-20 right-4 z-30" },
          React.createElement('div', { className: "bg-white/80 backdrop-blur-sm rounded-md px-3 py-1 text-xs text-gray-600 shadow-sm" },
            `Current View: ${currentView === 'practitioner' ? 'Healthcare Provider' : 'Patient Portal'}`
          )
        ),

        // Render current view based on selection
        currentView === 'practitioner' 
          ? React.createElement(window.PractitionerPage)
          : React.createElement(window.PatientPage)
      )
    )
  );
};

// Export for use in index.js
if (typeof window !== 'undefined') {
  window.App = App;
}