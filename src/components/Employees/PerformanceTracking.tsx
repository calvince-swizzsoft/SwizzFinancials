import { useState } from "react";

interface PerformanceData {
  id: number;
  name: string;
  role: string;
  rating: number; // out of 5
  kpiScore: number; // out of 100
  feedback: string;
  appraisalScore: number; // final score out of 100
}

export default function PerformanceTracking() {
  const [data, setData] = useState<PerformanceData[]>([
    {
    id: 1,
    name: "Alice Muthoni",
    role: "Chef",
    rating: 4.6,
    kpiScore: 85,
    feedback: "Great food quality and timely service.",
    appraisalScore: 88,
  },
  {
    id: 2,
    name: "John Mwangi",
    role: "Caddie",
    rating: 4.2,
    kpiScore: 78,
    feedback: "Very helpful and punctual.",
    appraisalScore: 81,
  },
  {
    id: 3,
    name: "Sarah Njeri",
    role: "Admin",
    rating: 4.9,
    kpiScore: 92,
    feedback: "Excellent organizational skills.",
    appraisalScore: 94,
  },
  {
    id: 4,
    name: "David Wanyama",
    role: "Security",
    rating: 4.3,
    kpiScore: 80,
    feedback: "Reliable during night shifts.",
    appraisalScore: 83,
  },
  {
    id: 5,
    name: "Jane Mwikali",
    role: "Receptionist",
    rating: 4.7,
    kpiScore: 87,
    feedback: "Welcomes guests warmly and efficiently.",
    appraisalScore: 89,
  },
  {
    id: 6,
    name: "Mark Kipkoech",
    role: "Technician",
    rating: 4.5,
    kpiScore: 82,
    feedback: "Quick to resolve maintenance issues.",
    appraisalScore: 85,
  },
  {
    id: 7,
    name: "Grace Muthoni",
    role: "Housekeeping",
    rating: 4.4,
    kpiScore: 84,
    feedback: "Maintains high cleanliness standards.",
    appraisalScore: 86,
  },
  {
    id: 8,
    name: "Kevin Otieno",
    role: "Waiter",
    rating: 4.1,
    kpiScore: 76,
    feedback: "Responsive and courteous to members.",
    appraisalScore: 79,
  },
  {
    id: 9,
    name: "Lilian Chebet",
    role: "Barista",
    rating: 4.8,
    kpiScore: 90,
    feedback: "Makes excellent coffee and remembers preferences.",
    appraisalScore: 91,
  },
  {
    id: 10,
    name: "Mohamed Noor",
    role: "Security",
    rating: 4.0,
    kpiScore: 75,
    feedback: "Effective at monitoring and reporting.",
    appraisalScore: 78,
  },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Performance Tracking
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Monitor employee ratings, member feedback, KPIs, and final appraisals.
      </p>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow">
        <table className="min-w-full bg-white dark:bg-gray-900 text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 border">#</th>
              <th className="px-4 py-3 border">Employee</th>
              <th className="px-4 py-3 border">Role</th>
              <th className="px-4 py-3 border">Rating (★)</th>
              <th className="px-4 py-3 border">KPI Score</th>
              <th className="px-4 py-3 border">Feedback</th>
              <th className="px-4 py-3 border font-semibold">Appraisal</th>
            </tr>
          </thead>
          <tbody>
            {data.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3 border">{emp.id}</td>
                <td className="px-4 py-3 border font-medium">{emp.name}</td>
                <td className="px-4 py-3 border">{emp.role}</td>
                <td className="px-4 py-3 border text-yellow-500 font-semibold">
                  {emp.rating.toFixed(1)} ★
                </td>
                <td className="px-4 py-3 border">{emp.kpiScore}/100</td>
                <td className="px-4 py-3 border max-w-xs text-gray-600 dark:text-gray-300">
                  {emp.feedback}
                </td>
                <td className="px-4 py-3 border font-bold text-green-600">
                  {emp.appraisalScore}/100
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
