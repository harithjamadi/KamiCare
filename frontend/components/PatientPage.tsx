"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Camera, 
  Activity, 
  Calendar, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  FileText,
  Bell,
  Stethoscope
} from "lucide-react";

// Mock data based on your backend schemas
const mockPatientProfile = {
  id: 1,
  name: "John Smith",
  email: "john.smith@email.com",
  phone_number: "+1-555-0101",
  age: 45,
  weight: 75.5,
  height: 175,
  body_mass_index: 24.7,
  doctor_name: "Dr. Sarah Wilson",
  total_bp_readings: 15,
  last_bp_reading: "2024-08-09T10:30:00Z",
  idNumber: "123456789012",
  gender: "Male",
  emergency_contact_name: "Jane Smith",
  emergency_contact_phone: "+1-555-0102"
};

const mockBPRecords = [
  {
    id: 1,
    systolic: 140,
    diastolic: 90,
    pulse: 78,
    reading_time: "2024-08-09T10:30:00Z",
    status: "High",
    notes: "Post-exercise reading"
  },
  {
    id: 2,
    systolic: 135,
    diastolic: 88,
    pulse: 75,
    reading_time: "2024-08-07T14:15:00Z",
    status: "Elevated",
    notes: "Morning reading"
  },
  {
    id: 3,
    systolic: 118,
    diastolic: 76,
    pulse: 72,
    reading_time: "2024-08-05T09:45:00Z",
    status: "Normal",
    notes: "Fasting reading"
  },
  {
    id: 4,
    systolic: 142,
    diastolic: 92,
    pulse: 80,
    reading_time: "2024-08-03T16:20:00Z",
    status: "High",
    notes: "Evening reading"
  },
  {
    id: 5,
    systolic: 122,
    diastolic: 78,
    pulse: 70,
    reading_time: "2024-08-01T08:00:00Z",
    status: "Normal",
    notes: "Morning reading"
  }
];

const mockAppointments = [
  {
    id: 1,
    date: "2024-08-15",
    time: "10:00 AM",
    type: "Follow-up Consultation",
    doctor: "Dr. Sarah Wilson",
    status: "Scheduled",
    location: "Main Clinic Room 3"
  },
  {
    id: 2,
    date: "2024-08-22",
    time: "2:30 PM",
    type: "Blood Pressure Check",
    doctor: "Dr. Sarah Wilson",
    status: "Scheduled",
    location: "Main Clinic Room 1"
  },
  {
    id: 3,
    date: "2024-07-20",
    time: "3:00 PM",
    type: "Annual Check-up",
    doctor: "Dr. Sarah Wilson",
    status: "Completed",
    location: "Main Clinic Room 2"
  }
];

// Components
const ProfileCard = ({ profile }) => {
  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { status: "Underweight", color: "text-blue-600 bg-blue-100" };
    if (bmi < 25) return { status: "Normal", color: "text-green-600 bg-green-100" };
    if (bmi < 30) return { status: "Overweight", color: "text-yellow-600 bg-yellow-100" };
    return { status: "Obese", color: "text-red-600 bg-red-100" };
  };

  const bmiStatus = getBMIStatus(profile.body_mass_index);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white mb-6">
      <div className="flex items-center mb-4">
        <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
          <User className="h-10 w-10 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-blue-100">Patient ID: {profile.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">{profile.age}</div>
          <div className="text-sm text-blue-100">Years Old</div>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">{profile.body_mass_index}</div>
          <div className="text-sm text-blue-100">BMI</div>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">{profile.total_bp_readings}</div>
          <div className="text-sm text-blue-100">BP Readings</div>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">{profile.weight}kg</div>
          <div className="text-sm text-blue-100">Weight</div>
        </div>
      </div>
    </div>
  );
};

const BPMonitorCard = ({ onCapture }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);
  const [manualReading, setManualReading] = useState({
    systolic: "",
    diastolic: "",
    pulse: "",
    notes: ""
  });

  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
      setIsCapturing(false);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCapturing(false);
      alert('Unable to access camera. Please check permissions or try manual entry.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);
      
      // Stop the camera
      stopCamera();
      
      // Simulate processing delay
      setIsCapturing(true);
      setTimeout(() => {
        setIsCapturing(false);
        onCapture("photo", imageDataUrl);
      }, 2000);
    }
  };

  const handlePhotoCapture = () => {
    startCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Cleanup camera on component unmount
  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleManualSubmit = () => {
    if (manualReading.systolic && manualReading.diastolic) {
      onCapture("manual", manualReading);
      setManualReading({ systolic: "", diastolic: "", pulse: "", notes: "" });
      setShowManualEntry(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Heart className="h-6 w-6 mr-2 text-red-500" />
        Blood Pressure Monitor
      </h3>

      <div className="space-y-4">
        {/* Camera View */}
        {showCamera && (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button
                onClick={capturePhoto}
                className="bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Camera className="h-6 w-6" />
              </button>
              <button
                onClick={stopCamera}
                className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Captured Image Preview */}
        {capturedImage && !isCapturing && (
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Captured Image</h4>
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured BP Monitor"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={retakePhoto}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Retake Photo
                </button>
                <button
                  onClick={() => setCapturedImage(null)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Use This Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Capture Button */}
        {!showCamera && !capturedImage && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {isCapturing ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600">Processing image...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Camera className="h-16 w-16 text-gray-400 mx-auto" />
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Snap a Photo</h4>
                  <p className="text-gray-600 mb-4">Take a photo of your BP monitor display</p>
                  <button
                    onClick={handlePhotoCapture}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Camera className="h-4 w-4 inline mr-2" />
                    Open Camera
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Entry Toggle */}
        {!showCamera && (
          <div className="text-center">
            <button
              onClick={() => setShowManualEntry(!showManualEntry)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center mx-auto"
            >
              <Plus className="h-4 w-4 mr-1" />
              Enter Reading Manually
            </button>
          </div>
        )}

        {/* Manual Entry Form */}
        {showManualEntry && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Systolic
                </label>
                <input
                  type="number"
                  value={manualReading.systolic}
                  onChange={(e) => setManualReading(prev => ({ ...prev, systolic: e.target.value }))}
                  placeholder="120"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diastolic
                </label>
                <input
                  type="number"
                  value={manualReading.diastolic}
                  onChange={(e) => setManualReading(prev => ({ ...prev, diastolic: e.target.value }))}
                  placeholder="80"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pulse
                </label>
                <input
                  type="number"
                  value={manualReading.pulse}
                  onChange={(e) => setManualReading(prev => ({ ...prev, pulse: e.target.value }))}
                  placeholder="72"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <input
                type="text"
                value={manualReading.notes}
                onChange={(e) => setManualReading(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="e.g., after exercise, morning reading"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleManualSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Save Reading
              </button>
              <button
                onClick={() => setShowManualEntry(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BPHistoryCard = ({ records }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Normal":
        return "text-green-600 bg-green-100";
      case "Elevated":
        return "text-yellow-600 bg-yellow-100";
      case "High":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Activity className="h-6 w-6 mr-2 text-blue-500" />
        Recent Readings
      </h3>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {records.map((record) => (
          <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-lg font-semibold text-gray-800">
                    {record.systolic}/{record.diastolic}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                  {record.pulse && (
                    <span className="text-sm text-gray-600">
                      ♡ {record.pulse} bpm
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(record.reading_time).toLocaleString()}
                </div>
                {record.notes && (
                  <p className="text-sm text-gray-600 italic">{record.notes}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center">
          <TrendingUp className="h-4 w-4 mr-1" />
          View Detailed History
        </button>
      </div>
    </div>
  );
};

const AppointmentsCard = ({ appointments }) => {
  const upcomingAppointments = appointments.filter(apt => apt.status === "Scheduled");
  const recentAppointments = appointments.filter(apt => apt.status === "Completed").slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Calendar className="h-6 w-6 mr-2 text-green-500" />
        Appointments
      </h3>

      {upcomingAppointments.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Upcoming
          </h4>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">{appointment.type}</h5>
                    <p className="text-sm text-gray-600 mt-1">with {appointment.doctor}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {appointment.date} at {appointment.time}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {appointment.location}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentAppointments.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Recent</h4>
          <div className="space-y-3">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">{appointment.type}</h5>
                    <p className="text-sm text-gray-600 mt-1">with {appointment.doctor}</p>
                    <p className="text-sm text-gray-500 mt-1">{appointment.date} at {appointment.time}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center">
          <Plus className="h-4 w-4 mr-2" />
          Request Appointment
        </button>
      </div>
    </div>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your health assistant. How can I help you today?", 
      sender: "bot", 
      timestamp: new Date() 
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "Thank you for your message. A healthcare professional will review your query.",
        "I understand your concern. Would you like me to schedule a consultation with your doctor?",
        "That's a great question about your blood pressure. Let me help you with that information.",
        "I can help you understand your readings better. Your recent BP trend shows improvement."
      ];
      
      const botResponse = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 mb-4 flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Health Assistant
            </h3>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs rounded-lg p-3 ${
                  message.sender === "user" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

// Main Patient Page Component
export default function PatientPage() {
  const [profile] = useState(mockPatientProfile);
  const [bpRecords] = useState(mockBPRecords);
  const [appointments] = useState(mockAppointments);

  const handleBPCapture = (type, data) => {
    if (type === "photo") {
      // Process the captured image data
      console.log("Photo captured:", data);
      alert("Photo captured successfully! In a real application, this would be sent to an AI service to extract BP readings from the image.");
    } else if (type === "manual") {
      alert(`Manual reading saved: ${data.systolic}/${data.diastolic} mmHg${data.pulse ? `, Pulse: ${data.pulse}` : ""}${data.notes ? `, Notes: ${data.notes}` : ""}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Patient Portal</h1>
                <p className="text-gray-600">Manage your health journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Stethoscope className="h-4 w-4 mr-1" />
                Dr. {profile.doctor_name.replace("Dr. ", "")}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <ProfileCard profile={profile} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* BP Monitor - Full width on mobile, spans 2 cols on XL */}
          <div className="lg:col-span-2 xl:col-span-2">
            <BPMonitorCard onCapture={handleBPCapture} />
          </div>

          {/* Appointments */}
          <div className="xl:col-span-1">
            <AppointmentsCard appointments={appointments} />
          </div>

          {/* BP History - Full width */}
          <div className="lg:col-span-2 xl:col-span-3">
            <BPHistoryCard records={bpRecords} />
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}