import { useEffect, useState } from "react";
import axios from "axios";
import AddCostCenterModal from "./AddCostCenterModal";

export interface CostCenter {
  Id: string;
  Description: string;
  IsLocked: boolean;
  CreatedDate: string;
  ErrorMessageResult: string | null;
}

interface ApiResponse {
  Success: boolean;
  Message: string;
  Data: CostCenter[] | CostCenter;
}

export default function CostCenter() {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const fetchCostCenters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/costcenters`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (response.data.Success && Array.isArray(response.data.Data)) {
        setCostCenters(response.data.Data);
      } else {
        setError("Failed to fetch cost centers.");
      }
    } catch (err) {
      setError("Error fetching cost centers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostCenters();
  }, []);

  // New function to add new cost center to the list
  const addNewCostCenter = (newCenter: CostCenter) => {
    setCostCenters((prev) => [newCenter, ...prev]);
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-3 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12" style={{boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"}}>
      <div className="mx-auto w-full">
        <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          Cost Centers
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base mb-6">
          Below is the list of all cost centers.
        </p>

        <button
          onClick={() => setModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          + Add Cost Center
        </button>

        {loading && <p className="text-blue-500">Loading cost centers...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Locked</th>
                  <th className="border px-4 py-2">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {costCenters.map((center) => (
                  <tr key={center.Id} className="text-gray-700 even:bg-blue-gray-50/50">
                    <td className="border px-4 py-2">{center.Description}</td>
                    <td className="border px-4 py-2">
                      {center.IsLocked ? "Yes" : "No"}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(center.CreatedDate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AddCostCenterModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={addNewCostCenter}
        />
      </div>
    </div>
  );
}
