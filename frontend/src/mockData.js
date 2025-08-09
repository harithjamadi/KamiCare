// Mock data for the healthcare application
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
        lastReading: "2024-08-08T11:20:00Z",
        history: [
          { date: "2024-08-08", systolic: 110, diastolic: 70 },
          { date: "2024-08-06", systolic: 112, diastolic: 72 },
          { date: "2024-08-04", systolic: 108, diastolic: 68 },
          { date: "2024-08-02", systolic: 115, diastolic: 74 }
        ]
      },
      appointments: [
        { id: 7, date: "2024-08-18", time: "2:15 PM", type: "Routine Check-up", status: "Scheduled" },
        { id: 8, date: "2024-07-10", time: "9:30 AM", type: "Physical", status: "Completed" }
      ]
    },
    {
      id: 5,
      name: "Robert Wilson",
      age: 62,
      email: "robert.wilson@email.com",
      phone: "+1-555-0105",
      address: "654 Maple Ave, City, State",
      bloodPressure: {
        systolic: 155,
        diastolic: 95,
        status: "Hypertensive",
        lastReading: "2024-08-09T16:45:00Z",
        history: [
          { date: "2024-08-09", systolic: 155, diastolic: 95 },
          { date: "2024-08-07", systolic: 150, diastolic: 92 },
          { date: "2024-08-05", systolic: 158, diastolic: 98 },
          { date: "2024-08-03", systolic: 152, diastolic: 94 }
        ]
      },
      appointments: [
        { id: 9, date: "2024-08-14", time: "11:45 AM", type: "Medication Review", status: "Scheduled" },
        { id: 10, date: "2024-07-28", time: "3:00 PM", type: "Follow-up", status: "Completed" }
      ]
    }
  ];
  
  // Mock chatbot responses for more realistic interaction
  const mockChatResponses = [
    "Thank you for your message. Based on your blood pressure readings, I recommend scheduling a follow-up appointment.",
    "Your recent readings show improvement. Keep up with your medication schedule and lifestyle changes.",
    "I've noted your concern. A healthcare professional will review this and get back to you within 24 hours.",
    "For immediate medical emergencies, please call 911. For urgent but non-emergency concerns, contact your healthcare provider directly.",
    "Your blood pressure trend looks stable. Remember to take readings at the same time each day for consistency.",
    "I can help you understand your readings better. Normal blood pressure is typically below 120/80 mmHg."
  ];
  
  // Export data for use in other files
  if (typeof window !== 'undefined') {
    window.mockPatients = mockPatients;
    window.mockChatResponses = mockChatResponses;
  }