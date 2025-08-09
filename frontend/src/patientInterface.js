// Patient Interface Components
const { User } = lucide;

// Main Patient Page Component
const PatientPage = () => {
  const { currentPatientData } = window.useApp();

  if (!currentPatientData) {
    return React.createElement('div', { className: "min-h-screen bg-gray-100 flex items-center justify-center" },
      React.createElement('div', { className: "text-center" },
        React.createElement('p', { className: "text-gray-600 mb-4" }, "No patient data available"),
        React.createElement('button', { 
          onClick: () => window.location.reload(),
          className: "btn-primary"
        }, "Reload Page")
      )
    );
  }

  const handlePhotoCapture = (imageData) => {
    alert('Photo captured! In a real application, this would process the image and extract BP readings.');
  };

  return (
    React.createElement('div', { className: "min-h-screen bg-gray-100" },
      // Header
      React.createElement('header', { className: "bg-white shadow-sm border-b header-gradient" },
        React.createElement('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" },
          React.createElement('div', { className: "flex items-center justify-between" },
            React.createElement('div', { className: "flex items-center" },
              React.createElement(User, { className: "h-8 w-8 text-blue-600 mr-3" }),
              React.createElement('div', null,
                React.createElement('h1', { className: "text-2xl font-bold text-gray-800" }, "Patient Portal"),
                React.createElement('p', { className: "text-gray-600" }, `Welcome back, ${currentPatientData.name}`)
              )
            ),
            React.createElement('div', { className: "text-sm text-gray-600 flex items-center" },
              React.createElement('span', { className: "status-indicator status-normal" }),
              "Patient View"
            )
          )
        )
      ),

      // Main Content
      React.createElement('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" },
        React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" },
          // Left Column - Photo Capture and History
          React.createElement('div', null,
            // Welcome Message
            React.createElement('div', { className: "bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 mb-6 text-white" },
              React.createElement('h2', { className: "text-xl font-semibold mb-2" }, "Health Monitoring Made Easy"),
              React.createElement('p', { className: "text-blue-100" }, 
                "Take photos of your blood pressure monitor for automatic reading detection and tracking."
              ),
              React.createElement('div', { className: "mt-4 flex items-center space-x-4" },
                React.createElement('div', { className: "flex items-center" },
                  React.createElement('svg', { className: "h-5 w-5 mr-2", fill: "currentColor", viewBox: "0 0 20 20" },
                    React.createElement('path', { 
                      fillRule: "evenodd",
                      d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                      clipRule: "evenodd"
                    })
                  ),
                  React.createElement('span', { className: "text-sm" }, "AI-Powered Detection")
                ),
                React.createElement('div', { className: "flex items-center" },
                  React.createElement('svg', { className: "h-5 w-5 mr-2", fill: "currentColor", viewBox: "0 0 20 20" },
                    React.createElement('path', { 
                      fillRule: "evenodd",
                      d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                      clipRule: "evenodd"
                    })
                  ),
                  React.createElement('span', { className: "text-sm" }, "Automatic Tracking")
                )
              )
            ),

            React.createElement(window.BPPhotoCapture, { onCapture: handlePhotoCapture }),
            React.createElement(window.HistoryRecord, { history: currentPatientData.bloodPressure.history })
          ),

          // Right Column - Current Status and Appointments
          React.createElement('div', null,
            // Current Status Card
            React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6 mb-6 card-shadow" },
              React.createElement('h3', { className: "text-lg font-semibold text-gray-800 mb-4" }, "Current Health Status"),
              React.createElement('div', { className: "grid grid-cols-2 gap-4 mb-4" },
                React.createElement('div', { className: "text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200" },
                  React.createElement('div', { className: "text-2xl font-bold text-gray-800 mb-1" },
                    `${currentPatientData.bloodPressure.systolic}/${currentPatientData.bloodPressure.diastolic}`
                  ),
                  React.createElement('div', { className: "text-sm text-gray-600" }, "Latest BP Reading"),
                  React.createElement('div', { className: "text-xs text-gray-500 mt-1" }, "mmHg")
                ),
                React.createElement('div', { className: "text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200" },
                  React.createElement('div', { 
                    className: `text-lg font-semibold mb-1 ${
                      currentPatientData.bloodPressure.status === 'Normal' ? 'text-green-600' : 'text-red-600'
                    }` 
                  }, currentPatientData.bloodPressure.status),
                  React.createElement('div', { className: "text-sm text-gray-600" }, "Status"),
                  React.createElement('div', { className: "text-xs text-gray-500 mt-1" }, "Current")
                )
              ),

              // Trend Indicator
              React.createElement('div', { className: "bg-gray-50 rounded-lg p-4" },
                React.createElement('h4', { className: "text-sm font-medium text-gray-800 mb-2" }, "Recent Trend"),
                React.createElement('div', { className: "flex items-center justify-between" },
                  React.createElement('span', { className: "text-sm text-gray-600" }, "Last 4 readings"),
                  React.createElement('div', { className: "flex items-center space-x-1" },
                    currentPatientData.bloodPressure.history.slice(-4).map((reading, index) => {
                      const isHigh = reading.systolic > 140 || reading.diastolic > 90;
                      return React.createElement('div', {
                        key: index,
                        className: `w-3 h-3 rounded-full ${isHigh ? 'bg-red-400' : 'bg-green-400'}`,
                        title: `${reading.date}: ${reading.systolic}/${reading.diastolic}`
                      });
                    })
                  )
                )
              )
            ),

            // Health Tips Card
            React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6 mb-6 card-shadow" },
              React.createElement('h3', { className: "text-lg font-semibold text-gray-800 mb-3" }, "Health Tips"),
              React.createElement('div', { className: "space-y-3" },
                React.createElement('div', { className: "flex items-start space-x-3 p-3 bg-blue-50 rounded-lg" },
                  React.createElement('div', { className: "flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" }),
                  React.createElement('div', null,
                    React.createElement('p', { className: "text-sm font-medium text-gray-800" }, "Monitor Regularly"),
                    React.createElement('p', { className: "text-xs text-gray-600 mt-1" }, "Take readings at the same time daily for accurate tracking")
                  )
                ),
                React.createElement('div', { className: "flex items-start space-x-3 p-3 bg-green-50 rounded-lg" },
                  React.createElement('div', { className: "flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2" }),
                  React.createElement('div', null,
                    React.createElement('p', { className: "text-sm font-medium text-gray-800" }, "Stay Active"),
                    React.createElement('p', { className: "text-xs text-gray-600 mt-1" }, "Regular exercise helps maintain healthy blood pressure")
                  )
                ),
                React.createElement('div', { className: "flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg" },
                  React.createElement('div', { className: "flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2" }),
                  React.createElement('div', null,
                    React.createElement('p', { className: "text-sm font-medium text-gray-800" }, "Healthy Diet"),
                    React.createElement('p', { className: "text-xs text-gray-600 mt-1" }, "Reduce sodium intake and eat more fruits and vegetables")
                  )
                )
              )
            ),

            React.createElement(window.AppointmentList, { 
              appointments: currentPatientData.appointments, 
              isPatient: true 
            })
          )
        )
      ),

      // Chatbot Widget
      React.createElement(window.ChatbotWidget)
    )
  );
};

// Export for use in main app
if (typeof window !== 'undefined') {
  window.PatientPage = PatientPage;
}