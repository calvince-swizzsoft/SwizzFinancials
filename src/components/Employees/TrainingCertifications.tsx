import { useState } from "react";

interface TrainingRecord {
  id: number;
  name: string;
  role: string;
  training: string;
  certified: boolean;
  completionDate: string;
  expiryDate: string;
}

export default function TrainingCertifications() {
  const [records, setRecords] = useState<TrainingRecord[]>([
    {
    id: 1,
    name: "James Kariuki",
    role: "Lifeguard",
    training: "CPR & First Aid",
    certified: true,
    completionDate: "2024-01-10",
    expiryDate: "2026-01-10",
  },
  {
    id: 2,
    name: "Mary Atieno",
    role: "Coach",
    training: "Child Safety & Conduct",
    certified: true,
    completionDate: "2023-08-20",
    expiryDate: "2025-08-20",
  },
  {
    id: 3,
    name: "Peter Otieno",
    role: "Bar Staff",
    training: "Responsible Alcohol Service",
    certified: false,
    completionDate: "2024-03-15",
    expiryDate: "N/A",
  },
  {
    id: 4,
    name: "Susan Njeri",
    role: "Chef",
    training: "Food Safety & Hygiene",
    certified: true,
    completionDate: "2022-05-12",
    expiryDate: "2024-05-12",
  },
  {
    id: 5,
    name: "Daniel Mwangi",
    role: "Security",
    training: "Emergency Response",
    certified: true,
    completionDate: "2023-11-01",
    expiryDate: "2025-11-01",
  },
  {
    id: 6,
    name: "Alice Wambui",
    role: "Receptionist",
    training: "Customer Service Excellence",
    certified: true,
    completionDate: "2023-02-18",
    expiryDate: "2025-02-18",
  },
  {
    id: 7,
    name: "Michael Okoth",
    role: "Maintenance",
    training: "Workplace Safety",
    certified: true,
    completionDate: "2022-09-30",
    expiryDate: "2024-09-30",
  },
  {
    id: 8,
    name: "Grace Chebet",
    role: "Housekeeping",
    training: "Sanitation Standards",
    certified: true,
    completionDate: "2023-07-10",
    expiryDate: "2025-07-10",
  },
  {
    id: 9,
    name: "John Karanja",
    role: "Waiter",
    training: "Food Handling & Etiquette",
    certified: true,
    completionDate: "2024-04-01",
    expiryDate: "2026-04-01",
  },
  {
    id: 10,
    name: "Linda Achieng",
    role: "Coach",
    training: "Youth Coaching Techniques",
    certified: true,
    completionDate: "2023-06-15",
    expiryDate: "2025-06-15",
  },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Training & Certifications
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Store and review training records for lifeguards, coaches, bar staff, and more.
      </p>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow">
        <table className="min-w-full bg-white dark:bg-gray-900 text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 border">#</th>
              <th className="px-4 py-3 border">Staff Name</th>
              <th className="px-4 py-3 border">Role</th>
              <th className="px-4 py-3 border">Training</th>
              <th className="px-4 py-3 border">Certified</th>
              <th className="px-4 py-3 border">Completion Date</th>
              <th className="px-4 py-3 border">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr
                key={rec.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3 border">{rec.id}</td>
                <td className="px-4 py-3 border font-medium">{rec.name}</td>
                <td className="px-4 py-3 border">{rec.role}</td>
                <td className="px-4 py-3 border">{rec.training}</td>
                <td className="px-4 py-3 border">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      rec.certified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {rec.certified ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3 border">{rec.completionDate}</td>
                <td className="px-4 py-3 border">{rec.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
