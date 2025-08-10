import Link from "next/link";

export default function PatientPortal() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black">
      <h1 className="text-3xl font-semibold mb-12 text-center text-white">
        Patient Portal
      </h1>

      <div className="flex flex-col space-y-10 w-full max-w-md">
        <Link
          href="/patient/add-reading"
          className="flex flex-col items-center justify-center bg-blue-600 text-white rounded-xl shadow-lg p-12 hover:bg-blue-700 transition"
          aria-label="Add New Reading"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-xl font-medium">Add Reading</span>
        </Link>

        <Link
          href="/patient/readings"
          className="flex flex-col items-center justify-center bg-green-600 text-white rounded-xl shadow-lg p-12 hover:bg-green-700 transition"
          aria-label="View Recorded Readings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h18M3 14h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z"
            />
          </svg>
          <span className="text-xl font-medium">See Records</span>
        </Link>
      </div>
    </div>
  );
}
