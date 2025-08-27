import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBuilding } from 'react-icons/fa';
import { Modal } from '../../ui/modal';

interface Branch {
  Id?: string;
  Code?: number;
  PaddedCode?: string;
  BankCode?: number;
  BankDescription?: string;
  Description: string;
  ContactPerson?: string;
  PhoneNumber?: string;
  AddressAddressLine1?: string;
  AddressAddressLine2?: string;
  AddressStreet?: string;
  AddressPostalCode?: string;
  AddressCity?: string;
  AddressEmail?: string;
  AddressLandLine?: string;
  AddressMobileLine?: string;
  CreatedDate?: string;
}

interface Bank {
  Id?: string;
  Code: number;
  PaddedCode?: string;
  Description: string;
  CreatedDate: string;
  BankBranchesDTO: Branch[];
}

export default function BankComponent() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [branchFilter, setBranchFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});



  const createdDate = new Date().toISOString();

  const [formData, setFormData] = useState({
    Code: 101,
    Description: 'KBC Bank',
    Branches: [
      {
        Code: 10101,
        PaddedCode: '10101',
        Description: 'Westlands Branch',
        AddressAddressLine1: 'P.O. Box 123',
        AddressAddressLine2: 'Equity Plaza, Floor 2',
        AddressStreet: 'Ring Road Westlands',
        AddressPostalCode: '00100',
        AddressCity: 'Nairobi',
        AddressEmail: 'westlands@equitybank.co.ke',
        AddressLandLine: '+254202000001',
        AddressMobileLine: '+254700000001',
        ContactPerson: 'Milca Awuor',
        PhoneNumber: '+254700000001',
      },
    ],
  });

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/getBanks?pagesize=1&&pageindex=0`,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      setBanks(res.data.Data);
      setSelectedBank(res.data.Data[0]);
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateBranchField = (index: number, field: keyof Branch, value: any) => {
    const updatedBranches = [...formData.Branches];
    updatedBranches[index] = {
      ...updatedBranches[index],
      [field]: value,
    };
    setFormData({ ...formData, Branches: updatedBranches });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      Code: formData.Code,
      Description: formData.Description,
      CreatedDate: createdDate,
      BankBranchesDTO: formData.Branches.map((b) => ({
        ...b,
        BankCode: formData.Code,
        BankDescription: formData.Description,
        CreatedDate: createdDate,
      })),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/AddBanks`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      console.log(response);
      alert('Bank successfully added!');
      setIsOpen(false);
      fetchBanks();
    } catch (err) {
      alert('Failed to add bank.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 p-4 rounded-2xl">
      {/* Left: Bank List */}
      <div className="w-1/3 bg-white border-r overflow-y-auto p-6 rounded-bl-2xl rounded-tl-2xl">
        <div className="flex justify-between items-center mb-4 bg-blue-100 p-3 rounded-2xl">
          <h2 className="text-xl font-semibold">Banks</h2>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 "
          >
            + Add Banks
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          banks.map((bank) => (
            <div
              key={bank.Id}
              className={`p-4 border rounded mb-3 cursor-pointer ${
                selectedBank?.Id === bank.Id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800'
              }`}
              onClick={() => setSelectedBank(bank)}
            >
              <div>
                <h3 className="font-medium">{bank.Description}</h3>
                <p className="text-xs">Code: {bank.PaddedCode}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right: Branches */}
      <div className="flex-1 bg-white p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Branches</h2>

        {selectedBank ? (
          selectedBank.BankBranchesDTO.length === 0 ? (
            <p className="text-gray-600">No branches available for this bank.</p>
          ) : (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  placeholder="Filter branches by name..."
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-2">#</th>
                    <th className="text-left p-2">Description</th>
                    <th className="text-left p-2">Code</th>
                    <th className="text-left p-2">Padded Code</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBank.BankBranchesDTO
                    .filter((branch) =>
                      branch.Description?.toLowerCase().includes(branchFilter.toLowerCase())
                    )
                    .map((branch, index) => (
                      <React.Fragment key={branch.Id ?? index}>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2 flex items-center gap-2">
                            <FaBuilding className="text-gray-500" />
                            {branch.Description}
                          </td>
                          <td className="p-2">{branch.Code ?? '—'}</td>
                          <td className="p-2">{branch.PaddedCode ?? '—'}</td>
                          <td className="p-2">
                            <button
                              onClick={() => toggleRow(branch.Id ?? `${index}`)}
                              className="text-blue-600 hover:underline"
                            >
                              {expandedRows[branch.Id ?? `${index}`]
                                ? 'Show Less'
                                : 'Show More'}
                            </button>
                          </td>
                        </tr>

                        {expandedRows[branch.Id ?? `${index}`] && (
                          <tr className="border-b bg-blue-100">
                            <td colSpan={5} className="p-4">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                <p><strong>Bank Code:</strong> {branch.BankCode ?? '—'}</p>
                                <p><strong>Contact Person:</strong> {branch.ContactPerson ?? '—'}</p>
                                <p><strong>Phone Number:</strong> {branch.PhoneNumber ?? '—'}</p>
                                <p><strong>Address 1:</strong> {branch.AddressAddressLine1 ?? '—'}</p>
                                <p><strong>Address 2:</strong> {branch.AddressAddressLine2 ?? '—'}</p>
                                <p><strong>Street:</strong> {branch.AddressStreet ?? '—'}</p>
                                <p><strong>Postal Code:</strong> {branch.AddressPostalCode ?? '—'}</p>
                                <p><strong>City:</strong> {branch.AddressCity ?? '—'}</p>
                                <p><strong>Email:</strong> {branch.AddressEmail ?? '—'}</p>
                                <p><strong>Landline:</strong> {branch.AddressLandLine ?? '—'}</p>
                                <p><strong>Mobile:</strong> {branch.AddressMobileLine ?? '—'}</p>
                                <p><strong>Created:</strong> {branch.CreatedDate ? new Date(branch.CreatedDate).toLocaleDateString() : '—'}</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </>
          )
        ) : (
          <p>Select a bank to view its branches.</p>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}  className="max-w-[720px] p-6">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">Add New Bank</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              type="text"
              value={formData.Description}
              onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
              className="w-full rounded border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          {formData.Branches.map((branch, idx) => (
            <div key={idx} className="border-t border-gray-200 pt-4">
              <h4 className="mb-2 text-sm font-semibold text-gray-700">Branch {idx + 1}</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  value={branch.Description}
                  onChange={(e) => updateBranchField(idx, 'Description', e.target.value)}
                  placeholder="Branch Name"
                  className="rounded border px-4 py-2"
                  required
                />
                <input
                  type="text"
                  value={branch.AddressCity}
                  onChange={(e) => updateBranchField(idx, 'AddressCity', e.target.value)}
                  placeholder="City"
                  className="rounded border px-4 py-2"
                />
                <input
                  type="text"
                  value={branch.ContactPerson}
                  onChange={(e) => updateBranchField(idx, 'ContactPerson', e.target.value)}
                  placeholder="Contact Person"
                  className="rounded border px-4 py-2"
                />
                <input
                  type="text"
                  value={branch.PhoneNumber}
                  onChange={(e) => updateBranchField(idx, 'PhoneNumber', e.target.value)}
                  placeholder="Phone Number"
                  className="rounded border px-4 py-2"
                />
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  Branches: [
                    ...formData.Branches,
                    {
                      Description: '',
                      Code: 0,
                      PaddedCode: '',
                      AddressAddressLine1: '',
                      AddressAddressLine2: '',
                      AddressStreet: '',
                      AddressPostalCode: '',
                      AddressCity: '',
                      AddressEmail: '',
                      AddressLandLine: '',
                      AddressMobileLine: '',
                      ContactPerson: '',
                      PhoneNumber: '',
                    },
                  ],
                })
              }
              className="text-sm text-indigo-600 hover:underline"
            >
              + Add Another Branch
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
            >
              {submitting ? 'Saving...' : 'Save Bank'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
