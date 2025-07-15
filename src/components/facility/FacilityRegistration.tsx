import { useState } from "react";

interface Facility {
  name: string;
  location: string;
  capacity: number;
  description: string;
  image: string;
}

export default function FacilityRegistration() {
  const [facility, setFacility] = useState<Facility>({
    name: "",
    location: "",
    capacity: 0,
    description: "",
    image: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFacility({
      ...facility,
      [name]: name === "capacity" ? parseInt(value) : value,
    });
  };
/*
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFacility((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
*/



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1]; // Removes the "data:image/jpeg;base64," part
      setFacility((prev) => ({
        ...prev,
        image: base64Data,
      }));
    };
    reader.readAsDataURL(file);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(facility);
    try {
      const response = await fetch("http://197.232.170.121:8594/api/facilities/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(facility),
      });

      const result = await response.json();

      if (response.ok && result.status === "00") {
        setSubmitted(true);
        setFacility({
          name: "",
          location: "",
          capacity: 0,
          description: "",
          image: "",
        });
        setError("");
      } else {
        setError(result.statusDescription || "Failed to register facility.");
      }
    } catch (err) {
      setError("Network error or server unavailable.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow mt-10">
      {/* Status messages */}
        {submitted && !error && (
          <div className="mb-4 p-3 text-sm bg-green-100 text-green-700 rounded">
            Facility registered successfully!
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 text-sm bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Register New Facility
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
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

        

        {/* Location */}
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
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Capacity */}
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

        {/* Description */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={facility.description}
            onChange={handleChange}
            rows={3}
            required
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Register Facility
        </button>

        
      </form>
    </div>
  );
}
