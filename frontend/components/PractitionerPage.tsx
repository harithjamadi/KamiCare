import React, { useState, createContext, useContext } from 'react';
import { Search, Calendar, User, Stethoscope, Phone, Mail, MapPin, Activity } from 'lucide-react';

// Mock data
const mockPatients = [
  {
    id: 1,
    name: "John Smith",
    age: 45,
    email: "john.smith@email.com",
    phone: "+1-555-0101",
    address: "123 Main St, City, State",
    bloodPressure: {
      systolic: 140,
      diastolic: 90,
      status: "Hypertensive",
      lastReading: "2024-08-09T10:30:00Z",
      history: [
        { date: "2024-08-09", systolic: 140, diastolic: 90 },
        { date: "2024-08-07", systolic: 135, diastolic: 88 },
        { date: "2024-08-05", systolic: 142, diastolic: 92 },
        { date: "2024-08-03", systolic: 138, diastolic: 89 }
      ]
    },
    appointments: [
      { id: 1, date: "2024-08-15", time: "10:00 AM", type: "Follow-up", status: "Scheduled" },
      { id: 2, date: "2024-07-20", time: "2:00 PM", type: "Check-up", status: "Completed" }
    ]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    age: 32,
    email: "sarah.johnson@email.com",
    phone: "+1-555-0102",
    address: "456 Oak Ave, City, State",
    bloodPressure: {
      systolic: 118,
      diastolic: 75,
      status: "Normal",
      lastReading: "2024-08-08T14:15:00Z",
      history: [
        { date: "2024-08-08", systolic: 118, diastolic: 75 },
        { date: "2024-08-06", systolic: 120, diastolic: 78 },
        { date: "2024-08-04", systolic: 115, diastolic: 72 },
        { date: "2024-08-02", systolic: 119, diastolic: 76 }
      ]
    },
    appointments: [
      { id: 3, date: "2024-08-12", time: "3:30 PM", type: "Consultation", status: "Scheduled" },
      { id: 4, date: "2024-07-15", time: "11:00 AM", type: "Annual Check-up", status: "Completed" }
    ]
  },
  {
    id: 3,
    name: "Michael Brown",
    age: 58,
    email: "michael.brown@email.com",
    phone: "+1-555-0103",
    address: "789 Pine St, City, State",
    bloodPressure: {
      systolic: 165,
      diastolic: 105,
      status: "Hypertensive",
      lastReading: "2024-08-09T09:45:00Z",
      history: [
        { date: "2024-08-09", systolic: 165, diastolic: 105 },
        { date: "2024-08-07", systolic: 160, diastolic: 102 },
        { date: "2024-08-05", systolic: 170, diastolic: 108 },
        { date: "2024-08-03", systolic: 158, diastolic: 100 }
      ]
    },
    appointments: [
      { id: 5, date: "2024-08-10", time: "9:00 AM", type: "Emergency", status: "Scheduled" },
      { id: 6, date: "2024-07-25", time: "4:00 PM", type: "Follow-up", status: "Completed" }
    ]
  },
  {
    id: 4,
    name: "Emily Davis",
    age: 29,
    email: "emily.davis@email.com",
    phone: "+1-555-0104",
    address: "321 Elm St, City, State",
    bloodPressure: {
      systolic: 110,
      diastolic: 70,
      status: "Normal",
      lastReading: "2024-08-08T16:20:00Z",
      history: [
        { date: "2024-08-08", systolic: 110, diastolic: 70 },
        { date: "2024-08-06", systolic: 115, diastolic: 72 },
        { date: "2024-08-04", systolic: 108, diastolic: 68 },
        { date: "2024-08-02", systolic: 112, diastolic: 71 }
      ]
    },
    appointments: [
      { id: 7, date: "2024-08-14", time: "2:00 PM", type: "Routine Check-up", status: "Scheduled" },
      { id: 8, date: "2024-07-10", time: "10:30 AM", type: "Physical Exam", status: "Completed" }
    ]
  }
];

// Context for app state
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients] = useState(mockPatients);

  return (
    <AppContext.Provider value={{
      selectedPatient,
      setSelectedPatient,
      patients
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Components
const SearchBar = ({ onSearch, placeholder = "Search patients..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        placeholder={placeholder}
      />
    </div>
  );
};

const PatientDetailCard = ({ patient, onCreateAppointment }) => {
  if (!patient) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-4">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No Patient Selected</h3>
          <p className="text-gray-400">Select a patient from the list to view their details</p>
        </div>
      </div>
    );
  }

  const getBPStatusColor = (status) => {
    return status === 'Normal' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Patient Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
            <p className="text-gray-600">Age: {patient.age}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">{patient.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">{patient.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{patient.address}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Current Vitals</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Blood Pressure:</span>
                <span className="font-medium">{patient.bloodPressure.systolic}/{patient.bloodPressure.diastolic} mmHg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBPStatusColor(patient.bloodPressure.status)}`}>
                  {patient.bloodPressure.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Reading:</span>
                <span className="text-xs text-gray-500">
                  {new Date(patient.bloodPressure.lastReading).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onCreateAppointment(patient)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        >
          <Calendar className="h-5 w-5 mr-2" />
          Schedule New Appointment
        </button>
      </div>

      {/* Blood Pressure History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Blood Pressure History
        </h3>
        
        <div className="space-y-3">
          {patient.bloodPressure.history.map((record, index) => {
            const isHigh = record.systolic > 140 || record.diastolic > 90;
            return (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-800">{record.systolic}/{record.diastolic} mmHg</span>
                  <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                    isHigh ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {isHigh ? 'High' : 'Normal'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{record.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Appointments
        </h3>
        
        <div className="space-y-4">
          {/* Upcoming Appointments */}
          {patient.appointments.filter(apt => apt.status === 'Scheduled').length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Upcoming</h4>
              <div className="space-y-2">
                {patient.appointments
                  .filter(apt => apt.status === 'Scheduled')
                  .map((appointment) => (
                    <div key={appointment.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div>
                        <span className="font-medium text-gray-800">{appointment.type}</span>
                        <div className="text-sm text-gray-600">
                          {appointment.date} at {appointment.time}
                        </div>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {appointment.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Past Appointments */}
          {patient.appointments.filter(apt => apt.status === 'Completed').length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Recent</h4>
              <div className="space-y-2">
                {patient.appointments
                  .filter(apt => apt.status === 'Completed')
                  .map((appointment) => (
                    <div key={appointment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-800">{appointment.type}</span>
                        <div className="text-sm text-gray-600">
                          {appointment.date} at {appointment.time}
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {appointment.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Practitioner Page Component
const PractitionerPage = () => {
  const { patients, selectedPatient, setSelectedPatient } = useApp();
  const [filteredPatients, setFilteredPatients] = useState(patients);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }
    
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  };

  const handleCreateAppointment = (patient) => {
    alert(`Scheduling appointment for ${patient.name}. This would open a booking interface in a real application.`);
  };

  const getPatientStatusSummary = () => {
    const total = patients.length;
    const hypertensive = patients.filter(p => p.bloodPressure.status === 'Hypertensive').length;
    const normal = patients.filter(p => p.bloodPressure.status === 'Normal').length;
    
    return { total, hypertensive, normal };
  };

  const stats = getPatientStatusSummary();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Healthcare Practitioner Dashboard</h1>
                <p className="text-gray-600">Manage patients and monitor health data</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="text-center">
                <div className="font-semibold text-gray-800">{stats.total}</div>
                <div>Total Patients</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600">{stats.hypertensive}</div>
                <div>Hypertensive</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">{stats.normal}</div>
                <div>Normal BP</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Patient Search & List (2/5) */}
          <div className="lg:col-span-2">
            <SearchBar onSearch={handleSearch} placeholder="Search by name, email, or phone..." />
            
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  Patient List ({filteredPatients.length})
                </h2>
              </div>
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredPatients.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p>No patients found matching your search</p>
                  </div>
                ) : (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`p-4 border-b cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                        selectedPatient?.id === patient.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h3 className="font-medium text-gray-800">{patient.name}</h3>
                            <span className="ml-2 text-sm text-gray-500">({patient.age})</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{patient.email}</p>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              patient.bloodPressure.status === 'Normal' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {patient.bloodPressure.systolic}/{patient.bloodPressure.diastolic}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(patient.bloodPressure.lastReading).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Patient Details (3/5) */}
          <div className="lg:col-span-3">
            <PatientDetailCard
              patient={selectedPatient}
              onCreateAppointment={handleCreateAppointment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  return (
    <AppProvider>
      <PractitionerPage />
    </AppProvider>
  );
}