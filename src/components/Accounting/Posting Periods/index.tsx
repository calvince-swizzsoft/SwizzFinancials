import { useEffect, useState } from "react";
import axios from "axios";
import AddPostingPeriodModal from "./AddPostingPeriodModal";

interface PostingPeriod {
  Id: string;
  Description: string;
  DurationStartDate: string;
  DurationEndDate: string;
  IsLocked: boolean;
  IsActive: boolean;
  IsClosed: boolean;
  ClosedBy: string | null;
  ClosedDate: string | null;
  CreatedBy: string;
  CreatedDate: string;
}

export default function PostingPeriods() {
  const [postingPeriods, setPostingPeriods] = useState<PostingPeriod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    axios
      .get( `${import.meta.env.VITE_ACCOUNT_URL}/api/values/GetPostingperiods`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((res) => {
        setPostingPeriods(res.data.Data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch posting periods.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="mx-auto w-full mb-8">
        <h3 className="mb-2 font-semibold text-gray-800 text-2xl dark:text-white/90">
          Posting Periods
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          List of financial posting periods with start and end dates.
        </p>
      </div>
      <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        + Add Posting Period
      </button>

      <AddPostingPeriodModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 text-left">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border p-2">Description</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
                <th className="border p-2">Active</th>
                <th className="border p-2">Closed</th>
              </tr>
            </thead>
            <tbody>
              {postingPeriods.map((period) => (
                <tr key={period.Id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border p-2">{period.Description}</td>
                  <td className="border p-2">{new Date(period.DurationStartDate).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(period.DurationEndDate).toLocaleDateString()}</td>
                  <td className="border p-2">
                    {period.IsActive ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="border p-2">
                    {period.IsClosed ? (
                      <span className="text-red-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
