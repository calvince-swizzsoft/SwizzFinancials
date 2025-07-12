import { useState } from "react";

interface Booking {
  facility: string;
  date: string;
  time: string;
  memberName: string;
}

const facilities = [
  "Tennis Court A",
  "Tennis Court B",
  "Conference Room 1",
  "Conference Room 2",
  "Swimming Pool",
];

export default function FacilityBooking() {
  const [booking, setBooking] = useState<Booking>({
    facility: "",
    date: "",
    time: "",
    memberName: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking Submitted:", booking);
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg dark:bg-gray-900 mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Facility Booking
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Facility
          </label>
          <select
            name="facility"
            value={booking.facility}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          >
            <option value="">Select a facility</option>
            {facilities.map((facility, idx) => (
              <option key={idx} value={facility}>
                {facility}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={booking.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Time
          </label>
          <input
            type="time"
            name="time"
            value={booking.time}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Member Name
          </label>
          <input
            type="text"
            name="memberName"
            value={booking.memberName}
            onChange={handleChange}
            required
            placeholder="e.g. John Doe"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Book Facility
        </button>
      </form>

      {submitted && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-md">
          Booking request submitted successfully!
        </div>
      )}
    </div>
  );
}
