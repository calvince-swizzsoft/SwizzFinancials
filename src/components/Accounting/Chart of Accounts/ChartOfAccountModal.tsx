import React, { useEffect, useState } from "react";
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
    accountType: 1000,
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

  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);

useEffect(() => {
  // Fetch existing chart of accounts for parent selection
  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_ACCOUNT_URL}/api/values/GetChartOfAccount`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const apiData = res.data.Data || [];
      setAccounts(
        apiData.map((item: any) => ({
          id: item.Id,
          name: item.AccountName,
        }))
      );
    } catch (error) {
      // Optionally handle error
    }
  };
  fetchAccounts();
}, []);
  
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
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
                    {/* <input
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
          /> */}

            <label className="flex flex-col">
          <span className="mb-1">Parent Chart of Account</span>
          <select
            name="parentId"
            value={formData.parentId || ""}
            onChange={handleChange}
            className="border p-2"
          >
            <option value="">-- None --</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </label>


            <label className="flex flex-col">
            <span className="mb-1">Account Name</span>
            <input
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="Account Name"
              className="border p-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1">Account Code</span>
            <input
              name="accountCode"
              value={formData.accountCode}
              onChange={handleChange}
              type="number"
              placeholder="Account Code"
              className="border p-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1">Account Type</span>
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className="border p-2"
            >
              <option value={1000}>Asset</option>
              <option value={2000}>Liability</option>
              <option value={3000}>Equity/Capital</option>
              <option value={4000}>Income/Revenue</option>
              <option value={5000}>Expense</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="mb-1">Account Category</span>
            <select
              name="accountCategory"
              value={formData.accountCategory}
              onChange={handleChange}
              className="border p-2"
            >
              <option value={4096}>Header Account (Non-Postable)</option>
              <option value={4097}>Detail Account (Postable)</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="mb-1">Depth</span>
            <input
              name="depth"
              value={formData.depth}
              onChange={handleChange}
              type="number"
              placeholder="Depth"
              className="border p-2"
            />
          </label>
    
          {/* <label className="flex items-center gap-2">
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
    
         */}

          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChartOfAccountModal;
