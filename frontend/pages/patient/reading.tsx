"use client";

import { useState, useEffect } from "react";

type Reading = {
  id: string;
  timestamp: string;
  systolic: number;
  diastolic: number;
};

export default function Readings() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReadings() {
      try {
        const res = await fetch("/api/readings");
        if (!res.ok) throw new Error("Failed to fetch readings");
        const data = await res.json();
        setReadings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReadings();
  }, []);

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-semibold mb-6">Recorded Readings</h1>

      {loading && <p>Loading readings...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && readings.length === 0 && <p>No readings found.</p>}

      <div className="space-y-4">
        {readings.map((reading) => (
          <div
            key={reading.id}
            className="bg-gray-900 rounded-lg p-4 shadow-md border border-gray-700"
          >
            <p className="mb-2">
              <strong>Date:</strong>{" "}
              {new Date(reading.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>Systolic:</strong> {reading.systolic} mmHg
            </p>
            <p>
              <strong>Diastolic:</strong> {reading.diastolic} mmHg
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
