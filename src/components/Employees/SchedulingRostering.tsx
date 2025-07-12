import { useState } from "react";

interface ShiftSchedule {
  id: number;
  date: string;
  shift: string;
  role: string;
  assignedTo: string;
  replacement?: string;
  linkedEvent?: string;
}

const roles = ["Caddie", "Chef", "Receptionist", "Security"];
const shifts = ["Morning", "Evening", "Full Day"];

export default function SchedulingRostering() {
  const [schedule, setSchedule] = useState<ShiftSchedule[]>([
    {
      id: 1,
      date: "2025-07-13",
      shift: "Morning",
      role: "Caddie",
      assignedTo: "John Kibet",
      linkedEvent: "Tee-time: 8:00 AM",
    },
    {
      id: 2,
      date: "2025-07-13",
      shift: "Evening",
      role: "Chef",
      assignedTo: "Mary Achieng",
      replacement: "Sarah Kamau",
    },
  ]);

  const [newShift, setNewShift] = useState<ShiftSchedule>({
    id: 0,
    date: "",
    shift: "",
    role: "",
    assignedTo: "",
    replacement: "",
    linkedEvent: "",
  });

  const [filterDate, setFilterDate] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewShift({ ...newShift, [e.target.name]: e.target.value });
  };

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = { ...newShift, id: schedule.length + 1 };
    setSchedule([...schedule, newEntry]);
    setNewShift({ id: 0, date: "", shift: "", role: "", assignedTo: "", replacement: "", linkedEvent: "" });
  };

  const filteredSchedule = schedule.filter((entry) => {
    const dateMatch = filterDate ? entry.date === filterDate : true;
    const roleMatch = filterRole ? entry.role === filterRole : true;
    return dateMatch && roleMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Scheduling & Rostering
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Assign shifts, manage replacements, and link events or tee-times.
      </p>

      {/* Filter Section */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <input
            type="date"
            className="border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            {roles.map((role, idx) => (
              <option key={idx} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setFilterDate("");
            setFilterRole("");
          }}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Clear Filters
        </button>
      </div>

      {/* Add Shift Form */}
      <form onSubmit={handleAddShift} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="date"
          type="date"
          value={newShift.date}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
        />
        <select
          name="shift"
          value={newShift.shift}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select Shift</option>
          {shifts.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          name="role"
          value={newShift.role}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select Role</option>
          {roles.map((r, i) => (
            <option key={i} value={r}>
              {r}
            </option>
          ))}
        </select>
        <input
          name="assignedTo"
          placeholder="Assigned To"
          value={newShift.assignedTo}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
        />
        <input
          name="replacement"
          placeholder="Replacement (optional)"
          value={newShift.replacement}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
        />
        <input
          name="linkedEvent"
          placeholder="Linked Event (optional)"
          value={newShift.linkedEvent}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
        />
        <div className="md:col-span-3 text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Add Shift
          </button>
        </div>
      </form>

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border px-4 py-2 text-left dark:text-gray-300">Date</th>
              <th className="border px-4 py-2 text-left dark:text-gray-300">Shift</th>
              <th className="border px-4 py-2 text-left dark:text-gray-300">Role</th>
              <th className="border px-4 py-2 text-left dark:text-gray-300">Assigned To</th>
              <th className="border px-4 py-2 text-left dark:text-gray-300">Replacement</th>
              <th className="border px-4 py-2 text-left dark:text-gray-300">Linked Event</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedule.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No shifts found.
                </td>
              </tr>
            ) : (
              filteredSchedule.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                  <td className="border px-4 py-2">{entry.date}</td>
                  <td className="border px-4 py-2">{entry.shift}</td>
                  <td className="border px-4 py-2">{entry.role}</td>
                  <td className="border px-4 py-2 font-medium">{entry.assignedTo}</td>
                  <td className="border px-4 py-2">{entry.replacement || "—"}</td>
                  <td className="border px-4 py-2">{entry.linkedEvent || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
