import { useState } from "react";

interface Caddie {
  id: number;
  name: string;
  phone: string;
  availability: boolean;
  assignedTo?: string;
}

export default function CaddieManagement() {
  const [caddies, setCaddies] = useState<Caddie[]>([
    { id: 1, name: "James Otieno", phone: "0712345678", availability: true },
    { id: 2, name: "Peter Kariuki", phone: "0723456789", availability: false, assignedTo: "John Doe" },
    { id: 3, name: "Lucy Wanjiku", phone: "0734567890", availability: true },
    { id: 4, name: "Elvis Kiprono", phone: "0745678901", availability: true },
    { id: 5, name: "Susan Achieng", phone: "0756789012", availability: false, assignedTo: "Grace Wambui" },
    { id: 6, name: "Brian Ouma", phone: "0767890123", availability: true },
    { id: 7, name: "Mary Njeri", phone: "0778901234", availability: true },
    { id: 8, name: "Victor Kimani", phone: "0789012345", availability: false, assignedTo: "Felix Otieno" },
    { id: 9, name: "Agnes Mwende", phone: "0790123456", availability: true },
    { id: 10, name: "Daniel Mutiso", phone: "0701234567", availability: true },
  ]);

  const [newCaddie, setNewCaddie] = useState({ name: "", phone: "" });

  const handleAdd = () => {
    const id = caddies.length + 1;
    const newEntry: Caddie = {
      id,
      name: newCaddie.name,
      phone: newCaddie.phone,
      availability: true,
    };
    setCaddies([...caddies, newEntry]);
    setNewCaddie({ name: "", phone: "" });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Caddie Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Caddie Name"
            value={newCaddie.name}
            onChange={(e) => setNewCaddie({ ...newCaddie, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md mb-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newCaddie.phone}
            onChange={(e) => setNewCaddie({ ...newCaddie, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleAdd}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Add Caddie
          </button>
        </div>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border px-4 py-2 text-left dark:text-gray-300">#</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Name</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Phone</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Availability</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {caddies.map((caddie) => (
            <tr key={caddie.id}>
              <td className="border px-4 py-2">{caddie.id}</td>
              <td className="border px-4 py-2">{caddie.name}</td>
              <td className="border px-4 py-2">{caddie.phone}</td>
              <td className="border px-4 py-2">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    caddie.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {caddie.availability ? "Available" : "Unavailable"}
                </span>
              </td>
              <td className="border px-4 py-2">{caddie.assignedTo ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
