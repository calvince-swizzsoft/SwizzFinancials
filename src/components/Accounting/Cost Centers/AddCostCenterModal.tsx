// components/AddCostCenterModal.tsx
import { useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal";
import { CostCenter } from ".";


interface AddCostCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCostCenter: CostCenter) => void;  // pass new center back
}




export default function AddCostCenterModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCostCenterModalProps) {
  const [description, setDescription] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  
  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/add-costcenter`,
        {
          description,
          isLocked,
          createdDate: new Date().toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (response.data.Success) {
        onSuccess(response.data.Data);  // send back newly created cost center
        onClose();
        setDescription("");
        setIsLocked(false);
      } else {
        setError(response.data.Message || "Failed to add cost center.");
      }
    } catch (err) {
      setError("Failed to add cost center.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-bold mb-4">Add New Cost Center</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g., Marketing Department"
          />
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="mr-2"
            />
            Locked
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            {submitting ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
