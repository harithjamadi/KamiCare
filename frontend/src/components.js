// Shared components used across the application
const { useState, createContext, useContext, useEffect } = React;
const { Search, Camera, MessageCircle, Calendar, Activity, User, Stethoscope, Phone, Mail, MapPin } = lucide;

// Context for app state management
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState('practitioner');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients] = useState(window.mockPatients || []);
  const [currentPatientData] = useState(window.mockPatients ? window.mockPatients[0] : null);

  return (
    React.createElement(AppContext.Provider, {
      value: {
        currentUser,
        setCurrentUser,
        selectedPatient,
        setSelectedPatient,
        patients,
        currentPatientData
      }
    }, children)
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Search Bar Component
const SearchBar = ({ onSearch, placeholder = "Search patients..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    React.createElement('div', { className: "relative mb-6" },
      React.createElement('div', { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" },
        React.createElement(Search, { className: "h-5 w-5 text-gray-400" })
      ),
      React.createElement('input', {
        type: "text",
        value: searchTerm,
        onChange: handleSearch,
        className: "block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm input-field",
        placeholder: placeholder
      })
    )
  );
};

// Patient Detail Card Component
const PatientDetailCard = ({ patient, onCreateAppointment }) => {
  if (!patient) {
    return (
      React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6 text-center text-gray-500 card-shadow" },
        "Select a patient to view details"
      )
    );
  }

  const getBPStatusColor = (status) => {
    return status === 'Normal' ? 'badge-normal' : 'badge-hypertensive';
  };

  return (
    React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6 card-shadow hover-lift transition-all" },
      React.createElement('div', { className: "flex items-center mb-4" },
        React.createElement('div', { className: "bg-blue-100 rounded-full p-3 mr-4" },
          React.createElement(User, { className: "h-8 w-8 text-blue-600" })
        ),
        React.createElement('div', null,
          React.createElement('h2', { className: "text-xl font-bold text-gray-800" }, patient.name),
          React.createElement('p', { className: "text-gray-600" }, `Age: ${patient.age}`)
        )
      ),
      React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" },
        React.createElement('div', { className: "space-y-2" },
          React.createElement('div', { className: "flex items-center text-gray-600" },
            React.createElement(Mail, { className: "h-4 w-4 mr-2" }),
            React.createElement('span', { className: "text-sm" }, patient.email)
          ),
          React.createElement('div', { className: "flex items-center text-gray-600" },
            React.createElement(Phone, { className: "h-4 w-4 mr-2" }),
            React.createElement('span', { className: "text-sm" }, patient.phone)
          ),
          React.createElement('div', { className: "flex items-center text-gray-600" },
            React.createElement(MapPin, { className: "h-4 w-4 mr-2" }),
            React.createElement('span', { className: "text-sm" }, patient.address)
          )
        ),
        React.createElement('div', { className: "bg-gray-50 p-4 rounded-lg" },
          React.createElement('h3', { className: "font-semibold text-gray-800 mb-2" }, "Blood Pressure Analysis"),
          React.createElement('div', { className: "space-y-2" },
            React.createElement('div', { className: "flex justify-between items-center" },
              React.createElement('span', { className: "text-sm text-gray-600" }, "Systolic/Diastolic:"),
              React.createElement('span', { className: "font-medium" }, `${patient.bloodPressure.systolic}/${patient.bloodPressure.diastolic} mmHg`)
            ),
            React.createElement('div', { className: "flex justify-between items-center" },
              React.createElement('span', { className: "text-sm text-gray-600" }, "Status:"),
              React.createElement('span', { className: `px-2 py-1 rounded-full text-xs font-medium ${getBPStatusColor(patient.bloodPressure.status)}` },
                patient.bloodPressure.status
              )
            ),
            React.createElement('div', { className: "flex justify-between items-center" },
              React.createElement('span', { className: "text-sm text-gray-600" }, "Last Reading:"),
              React.createElement('span', { className: "text-xs text-gray-500" },
                new Date(patient.bloodPressure.lastReading).toLocaleDateString()
              )
            )
          )
        )
      ),
      React.createElement('button', {
        onClick: () => onCreateAppointment(patient),
        className: "w-full btn-primary flex items-center justify-center"
      },
        React.createElement(Calendar, { className: "h-5 w-5 mr-2" }),
        "Create Appointment"
      )
    )
  );
};

// Blood Pressure Photo Capture Component
const BPPhotoCapture = ({ onCapture }) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      onCapture('mock-image-data');
    }, 2000);
  };

  return (
    React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6 mb-6 card-shadow" },
      React.createElement('h3', { className: "text-lg font-semibold text-gray-800 mb-4 flex items-center" },
        React.createElement(Camera, { className: "h-5 w-5 mr-2" }),
        "Blood Pressure Monitor Scanner"
      ),
      React.createElement('div', { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center" },
        isCapturing 
          ? React.createElement('div', { className: "space-y-4" },
              React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }),
              React.createElement('p', { className: "text-gray-600" }, "Processing image...")
            )
          : React.createElement('div', { className: "space-y-4" },
              React.createElement(Camera, { className: "h-16 w-16 text-gray-400 mx-auto" }),
              React.createElement('div', null,
                React.createElement('h4', { className: "text-lg font-medium text-gray-800 mb-2" }, "Snap a Photo"),
                React.createElement('p', { className: "text-gray-600 mb-4" }, "Take a photo of your blood pressure monitor to automatically detect readings"),
                React.createElement('button', {
                  onClick: handleCapture,
                  className: "btn-primary"
                }, "Take Photo")
              )
            )
      )
    )
  );
};

// Chatbot Widget Component
const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm here to help you with any health-related questions.", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      const responses = window.mockChatResponses || ["Thank you for your message."];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const botResponse = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    React.createElement('div', { className: "fixed bottom-4 right-4 z-50" },
      isOpen && React.createElement('div', { className: "bg-white rounded-lg shadow-lg w-80 h-96 mb-4 flex flex-col card-shadow-lg" },
        React.createElement('div', { className: "bg-blue-600 text-white p-4 rounded-t-lg" },
          React.createElement('h3', { className: "font-semibold flex items-center" },
            React.createElement(MessageCircle, { className: "h-5 w-5 mr-2" }),
            "Health Assistant"
          )
        ),
        React.createElement('div', { className: "flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar" },
          messages.map((message) =>
            React.createElement('div', { 
              key: message.id, 
              className: `flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}` 
            },
              React.createElement('div', { 
                className: `max-w-xs rounded-lg p-3 ${message.sender === 'user' ? 'chat-bubble-user text-white' : 'chat-bubble-bot text-gray-800'}` 
              },
                React.createElement('p', { className: "text-sm" }, message.text)
              )
            )
          )
        ),
        React.createElement('div', { className: "p-4 border-t" },
          React.createElement('div', { className: "flex space-x-2" },
            React.createElement('input', {
              type: "text",
              value: inputMessage,
              onChange: (e) => setInputMessage(e.target.value),
              onKeyPress: (e) => e.key === 'Enter' && sendMessage(),
              placeholder: "Type your message...",
              className: "flex-1 input-field"
            }),
            React.createElement('button', {
              onClick: sendMessage,
              className: "btn-primary px-4 py-2"
            }, "Send")
          )
        )
      ),
      React.createElement('button', {
        onClick: () => setIsOpen(!isOpen),
        className: "bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
      },
        React.createElement(MessageCircle, { className: "h-6 w-6" })
      )
    )
  );
};

// History Record Component
const HistoryRecord = ({ history }) => {
  return (
    React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6 mb-6 card-shadow" },
      React.createElement('h3', { className: "text-lg font-semibold text-gray-800 mb-4 flex items-center" },
        React.createElement(Activity, { className: "h-5 w-5 mr-2" }),
        "Blood Pressure History"
      ),
      React.createElement('div', { className: "space-y-3" },
        history.map((record, index) => {
          const isHigh = record.systolic > 140 || record.diastolic > 90;
          return React.createElement('div', { 
            key: index, 
            className: "flex justify-between items-center p-3 bg-gray-50 rounded-lg hover-lift transition-all" 
          },
            React.createElement('div', null,
              React.createElement('span', { className: "font-medium text-gray-800" }, `${record.systolic}/${record.diastolic} mmHg`),
              React.createElement('span', { 
                className: `ml-3 px-2 py-1 rounded-full text-xs ${isHigh ? 'badge-hypertensive' : 'badge-normal'}` 
              }, isHigh ? 'High' : 'Normal')
            ),
            React.createElement('span', { className: "text-sm text-gray-500" }, record.date)
          );
        })
      )
    )
  );
};

// Appointment List Component
const AppointmentList = ({ appointments, isPatient = false }) => {
  const upcomingAppointments = appointments.filter(apt => apt.status === 'Scheduled');
  const pastAppointments = appointments.filter(apt => apt.status === 'Completed');

  return (
    React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6 card-shadow" },
      React.createElement('h3', { className: "text-lg font-semibold text-gray-800 mb-4 flex items-center" },
        React.createElement(Calendar, { className: "h-5 w-5 mr-2" }),
        "Appointments"
      ),
      upcomingAppointments.length > 0 && React.createElement('div', { className: "mb-6" },
        React.createElement('h4', { className: "text-md font-medium text-gray-700 mb-3" }, "Upcoming"),
        React.createElement('div', { className: "space-y-2" },
          upcomingAppointments.map((appointment) =>
            React.createElement('div', { 
              key: appointment.id, 
              className: "flex justify-between items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover-lift transition-all" 
            },
              React.createElement('div', null,
                React.createElement('span', { className: "font-medium text-gray-800" }, appointment.type),
                React.createElement('div', { className: "text-sm text-gray-600" }, `${appointment.date} at ${appointment.time}`)
              ),