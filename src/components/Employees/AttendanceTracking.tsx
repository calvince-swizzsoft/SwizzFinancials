import { useState } from "react";

interface AttendanceEntry {
  id: number;
  name: string;
  role: string;
  date: string;
  clockIn: string;
  clockOut: string;
  shift: string;
  leaveStatus: string;
}

const dummyAttendance: AttendanceEntry[] = [
  { id: 1, name: "Alice Kamau", role: "Chef", date: "2025-07-12", clockIn: "08:00", clockOut: "17:00", shift: "Morning", leaveStatus: "None" },
  { id: 2, name: "Brian Otieno", role: "Caddie", date: "2025-07-12", clockIn: "09:00", clockOut: "16:30", shift: "Morning", leaveStatus: "None" },
  { id: 3, name: "Jane Mwikali", role: "Receptionist", date: "2025-07-12", clockIn: "-", clockOut: "-", shift: "Evening", leaveStatus: "Sick Leave" },
  { id: 4, name: "David Wanyama", role: "Security", date: "2025-07-12", clockIn: "18:00", clockOut: "06:00", shift: "Night", leaveStatus: "None" },
  { id: 5, name: "Sarah Njeri", role: "Admin", date: "2025-07-12", clockIn: "08:30", clockOut: "17:15", shift: "Morning", leaveStatus: "None" },
  { id: 6, name: "James Odhiambo", role: "Technician", date: "2025-07-12", clockIn: "07:45", clockOut: "16:00", shift: "Morning", leaveStatus: "None" },
  { id: 7, name: "Grace Muthoni", role: "Housekeeping", date: "2025-07-12", clockIn: "10:00", clockOut: "18:00", shift: "Afternoon", leaveStatus: "None" },
  { id: 8, name: "Kevin Kiprotich", role: "Waiter", date: "2025-07-12", clockIn: "12:00", clockOut: "20:00", shift: "Afternoon", leaveStatus: "None" },
  { id: 9, name: "Lilian Chebet", role: "Barista", date: "2025-07-12", clockIn: "14:00", clockOut: "22:00", shift: "Evening", leaveStatus: "None" },
  { id: 10, name: "Mohamed Noor", role: "Security", date: "2025-07-12", clockIn: "06:00", clockOut: "18:00", shift: "Day", leaveStatus: "Annual Leave" },
];

export default function AttendanceTracking() {
  const [attendance] = useState<AttendanceEntry[]>(dummyAttendance);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Attendance Tracking</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Monitor daily clock-ins, shifts, and leave records of your staff.
      </p>

      <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border px-4 py-2 text-left dark:text-gray-300">#</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Name</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Role</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Date</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Clock In</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Clock Out</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Shift</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Leave</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.05]">
              <td className="border px-4 py-2">{entry.id}</td>
              <td className="border px-4 py-2 font-medium">{entry.name}</td>
              <td className="border px-4 py-2">{entry.role}</td>
              <td className="border px-4 py-2">{entry.date}</td>
              <td className="border px-4 py-2">{entry.clockIn}</td>
              <td className="border px-4 py-2">{entry.clockOut}</td>
              <td className="border px-4 py-2">{entry.shift}</td>
              <td className="border px-4 py-2">
                {entry.leaveStatus === "None" ? (
                  <span className="text-green-600 dark:text-green-400">Present</span>
                ) : (
                  <span className="text-red-500 dark:text-red-400">{entry.leaveStatus}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
