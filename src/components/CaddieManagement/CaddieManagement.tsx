
/*
import { useEffect, useState } from "react";
import axios from "axios";

interface Caddie {
  caddieId: number;
  fullName: string;
  contact: string;
  idNumber: string;
  experienceYears: number;
  rating: number;
  tierLevel: string;
  isAvailable: boolean;
  assignedTo?: string; // You can later populate this manually
}

export default function CaddieManagement() {
  const [caddies, setCaddies] = useState<Caddie[]>([]);
  const [newCaddie, setNewCaddie] = useState({ fullName: "", contact: "" });

  useEffect(() => {
    axios
      .get("http://197.232.170.121:8594/api/club/getAllCaddies")
      .then((res) => {
        if (res.data.status === "00") {
          setCaddies(res.data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch caddies:", err));
  }, []);

  const handleAdd = () => {
    const newEntry: Caddie = {
      caddieId: caddies.length + 1,
      fullName: newCaddie.fullName,
      contact: newCaddie.contact,
      idNumber: "TEMPID",
      experienceYears: 0,
      rating: 0,
      tierLevel: "Newbie",
      isAvailable: true,
    };
    setCaddies([...caddies, newEntry]);
    setNewCaddie({ fullName: "", contact: "" });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Caddie Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Caddie Name"
            value={newCaddie.fullName}
            onChange={(e) => setNewCaddie({ ...newCaddie, fullName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md mb-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Phone/Contact"
            value={newCaddie.contact}
            onChange={(e) => setNewCaddie({ ...newCaddie, contact: e.target.value })}
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
            <th className="border px-4 py-2 text-left dark:text-gray-300">Contact</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Tier</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Experience</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Availability</th>
            {/*<th className="border px-4 py-2 text-left dark:text-gray-300">Assigned To</th>*//*}
          </tr>
        </thead>
        <tbody>
          {caddies.map((caddie) => (
            <tr key={caddie.caddieId}>
              <td className="border px-4 py-2">{caddie.caddieId}</td>
              <td className="border px-4 py-2">{caddie.fullName}</td>
              <td className="border px-4 py-2">{caddie.contact}</td>
              <td className="border px-4 py-2">{caddie.tierLevel}</td>
              <td className="border px-4 py-2">{caddie.experienceYears} yrs</td>
              <td className="border px-4 py-2">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    caddie.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {caddie.isAvailable ? "Available" : "Unavailable"}
                </span>
              </td>
              {/*<td className="border px-4 py-2">{caddie.assignedTo ?? "-"}</td>*//*}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
*/



import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../ui/modal"; // Update path based on your file structure

interface Caddie {
  caddieId: number;
  fullName: string;
  contact: string;
  idNumber: string;
  experienceYears: number;
  rating: number;
  tierLevel: string;
  isAvailable: boolean;
}

export default function CaddieManagement() {
  const [caddies, setCaddies] = useState<Caddie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newCaddie, setNewCaddie] = useState<Omit<Caddie, "caddieId">>({
    fullName: "",
    contact: "",
    idNumber: "",
    experienceYears: 0,
    rating: 0,
    tierLevel: "",
    isAvailable: true,
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setNewCaddie({
      fullName: "",
      contact: "",
      idNumber: "",
      experienceYears: 0,
      rating: 0,
      tierLevel: "",
      isAvailable: true,
    });
  };

  const fetchCaddies = () => {
    axios
      .get("http://197.232.170.121:8594/api/club/getAllCaddies")
      .then((res) => {
        if (res.data.status === "00") {
          setCaddies(res.data.data);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchCaddies();
  }, []);

  const handleSubmit = () => {
    axios
      .post("http://197.232.170.121:8594/api/club/saveCaddies", newCaddie)
      .then((res) => {
        if (res.data.status === "00") {
          closeModal();
          fetchCaddies();
        } else {
          alert(res.data.statusDescription || "Failed to save caddie.");
        }
      })
      .catch(() => alert("Error saving caddie."));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Caddie Management</h2>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Caddie
        </button>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add New Caddie</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newCaddie.fullName}
              onChange={(e) => setNewCaddie({ ...newCaddie, fullName: e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Contact"
              value={newCaddie.contact}
              onChange={(e) => setNewCaddie({ ...newCaddie, contact: e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="ID Number"
              value={newCaddie.idNumber}
              onChange={(e) => setNewCaddie({ ...newCaddie, idNumber: e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              placeholder="Experience Years"
              value={newCaddie.experienceYears}
              onChange={(e) => setNewCaddie({ ...newCaddie, experienceYears: +e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              placeholder="Rating (e.g. 4.5)"
              step="0.1"
              value={newCaddie.rating}
              onChange={(e) => setNewCaddie({ ...newCaddie, rating: +e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Tier Level"
              value={newCaddie.tierLevel}
              onChange={(e) => setNewCaddie({ ...newCaddie, tierLevel: e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <select
              value={newCaddie.isAvailable ? "true" : "false"}
              onChange={(e) => setNewCaddie({ ...newCaddie, isAvailable: e.target.value === "true" })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Caddie
            </button>
          </div>
        </div>
      </Modal>

      {/* Table */}
      <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 mt-4">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border px-4 py-2 text-left dark:text-gray-300">#</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Name</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Contact</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Tier</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Experience</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Rating</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Availability</th>
          </tr>
        </thead>
        <tbody>
          {caddies.map((caddie) => (
            <tr key={caddie.caddieId}>
              <td className="border px-4 py-2">{caddie.caddieId}</td>
              <td className="border px-4 py-2">{caddie.fullName}</td>
              <td className="border px-4 py-2">{caddie.contact}</td>
              <td className="border px-4 py-2">{caddie.tierLevel}</td>
              <td className="border px-4 py-2">{caddie.experienceYears} yrs</td>
              <td className="border px-4 py-2">{caddie.rating}</td>
              <td className="border px-4 py-2">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    caddie.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {caddie.isAvailable ? "Available" : "Unavailable"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
