// Practitioner Interface Components
const { useState } = React;
const { Stethoscope } = lucide;

// Main Practitioner Page Component
const PractitionerPage = () => {
  const { patients, selectedPatient, setSelectedPatient } = window.useApp();
  const [filteredPatients, setFilteredPatients] = useState(patients);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }
    
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleCreateAppointment = (patient) => {
    alert(`Creating appointment for ${patient.name}. This would open a scheduling modal in a real application.`);
  };

  return (
    React.createElement('div', { className: "min-h-screen bg-gray-100" },
      // Header
      React.createElement('header', { className: "bg-white shadow-sm border-b header-gradient" },
        React.createElement('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" },
          React.createElement('div', { className: "flex items-center justify-between" },
            React.createElement('div', { className: "flex items-center" },
              React.createElement(Stethoscope, { className: "h-8 w-8 text-blue-600 mr-3" }),
              React.createElement('h1', { className: "text-2xl font-bold text-gray-800" }, "Healthcare Dashboard")
            ),
            React.createElement('div', { className: "text-sm text-gray-600 flex items-center" },
              React.createElement('span', { className: "status-indicator status-normal" }),
              "Practitioner View"
            )
          )
        )
      ),

      // Main Content
      React.createElement('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" },
        React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" },
          // Left Column - Patient Search and List
          React.createElement('div', null,
            React.createElement(window.SearchBar, { 
              onSearch: handleSearch, 
              placeholder: "Search patients by name or email..." 
            }),
            
            React.createElement('div', { className: "bg-white rounded-lg shadow-md card-shadow" },
              React.createElement('div', { className: "p-4 border-b" },
                React.createElement('h2', { className: "text-lg font-semibold text-gray-800" }, "Patient List"),
                React.createElement('p', { className: "text-sm text-gray-600 mt-1" }, 
                  `${filteredPatients.length} patient${filteredPatients.length !== 1 ? 's' : ''} found`
                )
              ),
              React.createElement('div', { className: "max-h-96 overflow-y-auto custom-scrollbar" },
                filteredPatients.length === 0 
                  ? React.createElement('div', { className: "p-8 text-center text-gray-500" },
                      React.createElement('p', null, "No patients found matching your search criteria."),
                      React.createElement('button', { 
                        onClick: () => handleSearch(''),
                        className: "mt-2 text-blue-600 hover:text-blue-800 text-sm"
                      }, "Clear search")
                    )
                  : filteredPatients.map((patient) =>
                      React.createElement('div', {
                        key: patient.id,
                        onClick: () => setSelectedPatient(patient),
                        className: `p-4 border-b cursor-pointer transition-all duration-200 hover:bg-gray-50 hover-lift ${
                          selectedPatient?.id === patient.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`
                      },
                        React.createElement('div', { className: "flex items-center justify-between" },
                          React.createElement('div', { className: "flex-1" },
                            React.createElement('div', { className: "flex items-center mb-1" },
                              React.createElement('h3', { className: "font-medium text-gray-800 mr-2" }, patient.name),
                              React.createElement('span', { 
                                className: `status-indicator ${patient.bloodPressure.status === 'Normal' ? 'status-normal' : 'status-danger'}` 
                              })
                            ),
                            React.createElement('p', { className: "text-sm text-gray-600" }, 
                              `Age: ${patient.age} • ${patient.email}`
                            ),
                            React.createElement('div', { className: "mt-2 flex items-center space-x-2" },
                              React.createElement('span', { 
                                className: `inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  patient.bloodPressure.status === 'Normal' 
                                    ? 'badge-normal' 
                                    : 'badge-hypertensive'
                                }` 
                              }, `BP: ${patient.bloodPressure.systolic}/${patient.bloodPressure.diastolic}`),
                              React.createElement('span', { className: "text-xs text-gray-500" },
                                `Last: ${new Date(patient.bloodPressure.lastReading).toLocaleDateString()}`
                              )
                            )
                          ),
                          selectedPatient?.id === patient.id && React.createElement('div', { className: "text-blue-600" },
                            React.createElement('svg', { className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 20 20" },
                              React.createElement('path', { 
                                fillRule: "evenodd", 
                                d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                clipRule: "evenodd"
                              })
                            )
                          )
                        )
                      )
                    )
              )
            )
          ),

          // Right Column - Patient Details
          React.createElement('div', null,
            React.createElement(window.PatientDetailCard, {
              patient: selectedPatient,
              onCreateAppointment: handleCreateAppointment
            }),

            // Quick Stats Panel
            selectedPatient && React.createElement('div', { className: "mt-6 bg-white rounded-lg shadow-md p-6 card-shadow" },
              React.createElement('h3', { className: "text-lg font-semibold text-gray-800 mb-4" }, "Quick Statistics"),
              React.createElement('div', { className: "grid grid-cols-2 gap-4" },
                React.createElement('div', { className: "text-center p-3 bg-blue-50 rounded-lg" },
                  React.createElement('div', { className: "text-2xl font-bold text-blue-600" }, 
                    selectedPatient.appointments.filter(apt => apt.status === 'Scheduled').length
                  ),
                  React.createElement('div', { className: "text-sm text-gray-600" }, "Upcoming Appointments")
                ),
                React.createElement('div', { className: "text-center p-3 bg-green-50 rounded-lg" },
                  React.createElement('div', { className: "text-2xl font-bold text-green-600" }, 
                    selectedPatient.bloodPressure.history.length
                  ),
                  React.createElement('div', { className: "text-sm text-gray-600" }, "BP Readings")
                )
              )
            )
          )
        )
      )
    )
  );
};

// Export for use in main app
if (typeof window !== 'undefined') {
  window.PractitionerPage = PractitionerPage;
}