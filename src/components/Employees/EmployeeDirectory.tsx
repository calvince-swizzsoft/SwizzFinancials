import { useState } from "react";

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  joiningDate: string;
  document?: string;
}

export default function EmployeeDirectory() {
  const [employees] = useState<Employee[]>([
   {
    id: 1,
    name: "Alice Mwende",
    email: "alice@example.com",
    phone: "0712345678",
    role: "Manager",
    joiningDate: "2022-01-15",
    document: "contract_alice.pdf",
  },
  {
    id: 2,
    name: "Brian Otieno",
    email: "brian@example.com",
    phone: "0723456789",
    role: "Receptionist",
    joiningDate: "2023-03-22",
  },
  {
    id: 3,
    name: "Cynthia Kimani",
    email: "cynthia@example.com",
    phone: "0734567890",
    role: "Accountant",
    joiningDate: "2021-08-10",
    document: "cynthia_cv.pdf",
  },
  {
    id: 4,
    name: "David Wanyama",
    email: "david@example.com",
    phone: "0745678901",
    role: "Maintenance",
    joiningDate: "2020-07-01",
  },
  {
    id: 5,
    name: "Esther Njeri",
    email: "esther@example.com",
    phone: "0756789012",
    role: "Security",
    joiningDate: "2019-12-01",
  },
  {
    id: 6,
    name: "Frankline Kipkorir",
    email: "frank@example.com",
    phone: "0767890123",
    role: "Chef",
    joiningDate: "2022-09-20",
  },
  {
    id: 7,
    name: "Grace Muthoni",
    email: "grace@example.com",
    phone: "0778901234",
    role: "Housekeeping",
    joiningDate: "2020-02-14",
    document: "grace_cert.pdf",
  },
  {
    id: 8,
    name: "Henry Ochieng",
    email: "henry@example.com",
    phone: "0789012345",
    role: "Caddie",
    joiningDate: "2018-11-30",
  },
  {
    id: 9,
    name: "Irene Chebet",
    email: "irene@example.com",
    phone: "0790123456",
    role: "Barista",
    joiningDate: "2023-05-10",
    document: "irene_training.pdf",
  },
  {
    id: 10,
    name: "James Odhiambo",
    email: "james@example.com",
    phone: "0701234567",
    role: "Technician",
    joiningDate: "2021-04-18",
  },
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Employee Directory
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Maintain detailed staff records including documents.
      </p>

      <table className="w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border px-4 py-2 text-left dark:text-gray-300">#</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Name</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Email</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Phone</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Role</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Joining Date</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Document</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.05]">
              <td className="border px-4 py-2">{emp.id}</td>
              <td className="border px-4 py-2">{emp.name}</td>
              <td className="border px-4 py-2">{emp.email}</td>
              <td className="border px-4 py-2">{emp.phone}</td>
              <td className="border px-4 py-2">{emp.role}</td>
              <td className="border px-4 py-2">
                {new Date(emp.joiningDate).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                {emp.document ? (
                  <a
                    href={`#/${emp.document}`}
                    className="text-blue-600 hover:underline"
                  >
                    {emp.document}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">None</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
