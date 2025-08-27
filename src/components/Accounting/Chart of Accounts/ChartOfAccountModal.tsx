import React, { useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal";

interface ChartOfAccount {
  parentId: string | null;
  parent: string | null;
  parentAccountName: string | null;
  costCenterId: string;
  costCenterDescription: string;
  accountType: number;
  accountCategory: number;
  accountCode: number;
  accountName: string;
  depth: number;
  isControlAccount: boolean;
  isReconciliationAccount: boolean;
  postAutomaticallyOnly: boolean;
  isLocked: boolean;
  createdDate: string;
  children: any[];
  errorMessageResult: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChartOfAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ChartOfAccount>({
    parentId: null,
    parent: null,
    parentAccountName: null,
    costCenterId: "",
    costCenterDescription: "",
    accountType: 1,
    accountCategory: 1,
    accountCode: 0,
    accountName: "",
    depth: 1,
    isControlAccount: false,
    isReconciliationAccount: false,
    postAutomaticallyOnly: false,
    isLocked: false,
    createdDate: new Date().toISOString(),
    children: [],
    errorMessageResult: ""
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_ACCOUNT_URL}/api/values/chartofaccount`, formData, {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
      alert(res.data?.Message || "Chart of Account created.");
      onClose();
    } catch (err) {
      alert("Failed to create chart of account.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Create Chart of Account</h2>
        <div className="grid gap-3">
          <input
            name="costCenterId"
            value={formData.costCenterId}
            onChange={handleChange}
            placeholder="Cost Center ID"
            className="border p-2"
          />
          <input
            name="costCenterDescription"
            value={formData.costCenterDescription}
            onChange={handleChange}
            placeholder="Cost Center Description"
            className="border p-2"
          />
          <input
            name="accountCode"
            value={formData.accountCode}
            onChange={handleChange}
            type="number"
            placeholder="Account Code"
            className="border p-2"
          />
          <input
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            placeholder="Account Name"
            className="border p-2"
          />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isControlAccount" checked={formData.isControlAccount} onChange={handleChange} />
            Control Account
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isReconciliationAccount" checked={formData.isReconciliationAccount} onChange={handleChange} />
            Reconciliation Account
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="postAutomaticallyOnly" checked={formData.postAutomaticallyOnly} onChange={handleChange} />
            Post Automatically Only
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isLocked" checked={formData.isLocked} onChange={handleChange} />
            Locked
          </label>

          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChartOfAccountModal;
