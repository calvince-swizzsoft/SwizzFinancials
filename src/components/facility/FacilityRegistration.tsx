import { useState } from "react";

interface Facility {
  name: string;
  type: string;
  location: string;
  capacity: number;
  description: string;
}

export default function FacilityRegistration() {
  const [facility, setFacility] = useState<Facility>({
    name: "",
    type: "",
    location: "",
    capacity: 0,
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFacility({
      ...facility,
      [name]: name === "capacity" ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Facility registered:", facility);
    setSubmitted(true);
    setFacility({
      name: "",
      type: "",
      location: "",
      capacity: 0,
      description: "",
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Register New Facility
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Facility Name
          </label>
          <input
            type="text"
            name="name"
            value={facility.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Type
          </label>
          <select
            name="type"
            value={facility.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">Select type</option>
            <option value="Tennis Court">Tennis Court</option>
            <option value="Conference Room">Conference Room</option>
            <option value="Swimming Pool">Swimming Pool</option>
            <option value="Gym">Gym</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={facility.location}
            onChange={handleChange}
            required
            placeholder="e.g., West Wing, Floor 2"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            value={facility.capacity}
            onChange={handleChange}
            required
            min={1}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={facility.description}
            onChange={handleChange}
            rows={3}
            placeholder="Brief description of the facility"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Register Facility
        </button>

        {submitted && (
          <div className="mt-4 p-3 text-sm bg-green-100 text-green-700 rounded">
            Facility registered successfully!
          </div>
        )}
      </form>
    </div>
  );
}
