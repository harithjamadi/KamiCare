"use client";

import React from "react";

export default function PatientPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Patient Portal</h1>

      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-700">
          Welcome to your personal health portal.  
          You can view your medical history, upcoming appointments, and prescriptions here.
        </p>
      </div>
    </div>
  );
}
