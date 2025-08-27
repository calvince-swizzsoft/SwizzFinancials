
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from '../../ui/modal';
import { FaPlus, FaUniversity } from 'react-icons/fa';

interface BankLinkage {
  Id?: string;
  BankName: string;
  BankBranchName: string;
  BankAccountNumber: string;
  Remarks: string;
  IsLocked: boolean;
  CreatedDate: string;
  BranchId: string;
  ChartOfAccountId: string;
  ChartOfAccountAccountType: number;
  ChartOfAccountCostCenterId: string;
}

const BankLinkageComponent: React.FC = () => {
  const [linkages, setLinkages] = useState<BankLinkage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<BankLinkage>({
    BankName: '',
    BankBranchName: '',
    BankAccountNumber: '',
    Remarks: '',
    IsLocked: false,
    CreatedDate: new Date().toISOString(),
    BranchId: '',
    ChartOfAccountId: '',
    ChartOfAccountAccountType: 1,
    ChartOfAccountCostCenterId: '',
  });


  const fetchBankLinkages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/GetBankLinkages?pagesize=0&pageindex=0`,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      setLinkages(response.data.Data.Records || []);
    } catch (error) {
      console.error('Failed to fetch bank linkages:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/AddBankLinkages`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      setIsModalOpen(false);
      fetchBankLinkages(); // refresh table
      resetForm();
    } catch (error) {
      console.error('Error adding bank linkage:', error);
    }
  };

  const resetForm = () => {
  setFormData({
    BankName: '',
    BankBranchName: '',
    BankAccountNumber: '',
    Remarks: '',
    IsLocked: false,
    CreatedDate: new Date().toISOString(),
    BranchId: '',
    ChartOfAccountId: '',
    ChartOfAccountAccountType: 1,
    ChartOfAccountCostCenterId: '',
  });
};


  useEffect(() => {
    fetchBankLinkages();
  }, []);

  return (
    <div className="p-6 bg-white rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FaUniversity /> Bank Linkages
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Bank Linkage
        </button>
      </div>

      <table className="w-full table-auto border">
  <thead>
    <tr className="bg-gray-200 text-left">
      <th className="border p-2">Bank Name</th>
      <th className="border p-2">Branch Name</th>
      <th className="border p-2">Account Number</th>
      <th className="border p-2">Remarks</th>
      <th className="border p-2">Chart of Account</th>
      <th className="border p-2">Cost Center</th>
      <th className="border p-2">Branch</th>
      <th className="border p-2">Created Date</th>
      <th className="border p-2">Locked?</th>
    </tr>
  </thead>
  <tbody>
    {linkages.map((item, index) => (
      <tr key={index} className="hover:bg-gray-50">
        <td className="border p-2">{item.BankName}</td>
        <td className="border p-2">{item.BankBranchName}</td>
        <td className="border p-2">{item.BankAccountNumber}</td>
        <td className="border p-2">{item.Remarks}</td>
        <td className="border p-2">{(item as any).ChartOfAccountName || '-'}</td>
        <td className="border p-2">{(item as any).ChartOfAccountCostCenterDescription || '-'}</td>
        <td className="border p-2">{(item as any).BranchDescription || '-'}</td>
        <td className="border p-2">
        {new Date(item.CreatedDate).toLocaleDateString('en-GB')}
        </td>
        <td className="border p-2">{item.IsLocked ? 'Yes' : 'No'}</td>
      </tr>
    ))}
  </tbody>
</table>


      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-4xl m-4 p-6">
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Add Bank Linkage</h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Bank Name"
                className="border p-2"
                value={formData.BankName}
                onChange={(e) =>
                  setFormData({ ...formData, BankName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Branch Name"
                className="border p-2"
                value={formData.BankBranchName}
                onChange={(e) =>
                  setFormData({ ...formData, BankBranchName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Account Number"
                className="border p-2"
                value={formData.BankAccountNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    BankAccountNumber: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Remarks"
                className="border p-2"
                value={formData.Remarks}
                onChange={(e) =>
                  setFormData({ ...formData, Remarks: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Branch ID"
                className="border p-2"
                value={formData.BranchId}
                onChange={(e) =>
                  setFormData({ ...formData, BranchId: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Chart Of Account ID"
                className="border p-2"
                value={formData.ChartOfAccountId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ChartOfAccountId: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Account Type"
                className="border p-2"
                value={formData.ChartOfAccountAccountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ChartOfAccountAccountType: Number(e.target.value),
                  })
                }
              />
              <input
                type="text"
                placeholder="Cost Center ID"
                className="border p-2"
                value={formData.ChartOfAccountCostCenterId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ChartOfAccountCostCenterId: e.target.value,
                  })
                }
              />
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.IsLocked}
                  onChange={(e) =>
                    setFormData({ ...formData, IsLocked: e.target.checked })
                  }
                />
                <label>Is Locked?</label>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BankLinkageComponent;
