import { useState } from "react";

interface EmployeePayroll {
  id: number;
  name: string;
  role: string;
  baseSalary: number;
  bonuses: number;
  commissions: number;
  tips: number;
  jobPayouts: number;
}

export default function PayrollCompensation() {
  const [employees] = useState<EmployeePayroll[]>([
    {
    id: 1,
    name: "Alice Muthoni",
    role: "Chef",
    baseSalary: 50000,
    bonuses: 5000,
    commissions: 2000,
    tips: 1500,
    jobPayouts: 0,
  },
  {
    id: 2,
    name: "John Mwangi",
    role: "Caddie",
    baseSalary: 30000,
    bonuses: 2000,
    commissions: 0,
    tips: 4000,
    jobPayouts: 3000,
  },
  {
    id: 3,
    name: "Sarah Njeri",
    role: "Admin",
    baseSalary: 60000,
    bonuses: 8000,
    commissions: 3000,
    tips: 0,
    jobPayouts: 0,
  },
  {
    id: 4,
    name: "David Wanyama",
    role: "Security",
    baseSalary: 35000,
    bonuses: 1000,
    commissions: 0,
    tips: 500,
    jobPayouts: 0,
  },
  {
    id: 5,
    name: "Jane Mwikali",
    role: "Receptionist",
    baseSalary: 40000,
    bonuses: 1500,
    commissions: 0,
    tips: 200,
    jobPayouts: 0,
  },
  {
    id: 6,
    name: "Mark Kipkoech",
    role: "Technician",
    baseSalary: 45000,
    bonuses: 2500,
    commissions: 1000,
    tips: 0,
    jobPayouts: 1000,
  },
  {
    id: 7,
    name: "Grace Muthoni",
    role: "Housekeeping",
    baseSalary: 30000,
    bonuses: 1000,
    commissions: 0,
    tips: 300,
    jobPayouts: 0,
  },
  {
    id: 8,
    name: "Kevin Otieno",
    role: "Waiter",
    baseSalary: 28000,
    bonuses: 800,
    commissions: 0,
    tips: 2000,
    jobPayouts: 500,
  },
  {
    id: 9,
    name: "Lilian Chebet",
    role: "Barista",
    baseSalary: 32000,
    bonuses: 1200,
    commissions: 500,
    tips: 1500,
    jobPayouts: 0,
  },
  {
    id: 10,
    name: "Mohamed Noor",
    role: "Security",
    baseSalary: 36000,
    bonuses: 0,
    commissions: 0,
    tips: 0,
    jobPayouts: 0,
  },
  ]);

  const calculateTotal = (employee: EmployeePayroll) => {
    return (
      employee.baseSalary +
      employee.bonuses +
      employee.commissions +
      employee.tips +
      employee.jobPayouts
    );
  };

  const totalPayroll = employees.reduce(
    (sum, emp) => sum + calculateTotal(emp),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Payroll & Compensation
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Calculate wages, track bonuses, commissions, tips, and job-based payouts.
      </p>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow">
        <table className="min-w-full bg-white dark:bg-gray-900 text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 border">#</th>
              <th className="px-4 py-3 border">Employee</th>
              <th className="px-4 py-3 border">Role</th>
              <th className="px-4 py-3 border">Base Salary (KES)</th>
              <th className="px-4 py-3 border">Bonuses</th>
              <th className="px-4 py-3 border">Commissions</th>
              <th className="px-4 py-3 border">Tips</th>
              <th className="px-4 py-3 border">Job Payouts</th>
              <th className="px-4 py-3 border font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                <td className="px-4 py-3 border">{emp.id}</td>
                <td className="px-4 py-3 border font-medium">{emp.name}</td>
                <td className="px-4 py-3 border">{emp.role}</td>
                <td className="px-4 py-3 border">{emp.baseSalary.toLocaleString()}</td>
                <td className="px-4 py-3 border">{emp.bonuses.toLocaleString()}</td>
                <td className="px-4 py-3 border">{emp.commissions.toLocaleString()}</td>
                <td className="px-4 py-3 border">{emp.tips.toLocaleString()}</td>
                <td className="px-4 py-3 border">{emp.jobPayouts.toLocaleString()}</td>
                <td className="px-4 py-3 border font-bold text-blue-600">
                  {calculateTotal(emp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">
              <td colSpan={8} className="px-4 py-3 text-right border">Total Payroll</td>
              <td className="px-4 py-3 border text-green-600">
                {totalPayroll.toLocaleString()} KES
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
