import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from '../../ui/modal';

interface BranchFormData {
  CompanyId: string;
  CompanyDescription: string;
  Description: string;
  AddressAddressLine1: string;
  AddressAddressLine2: string;
  AddressStreet: string;
  AddressPostalCode: string;
  AddressCity: string;
  AddressEmail: string;
  AddressLandLine: string;
  AddressMobileLine: string;
  IsLocked: boolean;
  CreatedDate: string;
  IsChecked: boolean;
}

interface BranchDisplay {
  Id: string;
  Description: string;
  AddressCity: string;
  AddressStreet: string;
  AddressEmail: string;
  AddressMobileLine: string;
  CreatedDate: string;
}

export default function BranchSetup() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [branches, setBranches] = useState<BranchDisplay[]>([]);

  const [formData, setFormData] = useState<BranchFormData>({
    CompanyId: 'B1258C18-4971-F011-8E03-28C63F58802D',
    CompanyDescription: 'Swizzsoft Corporation',
    Description: 'Headquarters Branch',
    AddressAddressLine1: 'Business Park Block A',
    AddressAddressLine2: 'Floor 3',
    AddressStreet: 'Enterprise Road',
    AddressPostalCode: '00200',
    AddressCity: 'Nairobi',
    AddressEmail: 'hq@swizzsoft.com',
    AddressLandLine: '0207654321',
    AddressMobileLine: '+254798765432',
    IsLocked: false,
    CreatedDate: new Date().toISOString(),
    IsChecked: false,
  });

  const handleChange = (key: keyof BranchFormData, value: string | boolean) => {
    setFormData({ ...formData, [key]: value });
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get(
        'https://43d797ae2495.ngrok-free.app/api/values/branches',
        {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        }
      );
      if (res.data?.Success) {
        setBranches(res.data.Data);
      }
    } catch (err) {
      console.error('Failed to load branches', err);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        'https://43d797ae2495.ngrok-free.app/api/values/add-branch',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      alert('Branch successfully added!');
      setIsOpen(false);
      fetchBranches(); // refresh branch list after add
    } catch (error) {
      alert('Failed to add branch.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl bg-white px-8 py-10 shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Branch Setup</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Add Branch
        </button>
      </div>

      {/* List of Existing Branches */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Existing Branches</h2>
        <div className="overflow-hidden rounded border border-gray-200">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Branch</th>
                <th className="px-4 py-2 text-left">City</th>
                <th className="px-4 py-2 text-left">Street</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Mobile</th>
              </tr>
            </thead>
            <tbody>
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                    No branches available.
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr key={branch.Id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{branch.Description}</td>
                    <td className="px-4 py-2">{branch.AddressCity}</td>
                    <td className="px-4 py-2">{branch.AddressStreet}</td>
                    <td className="px-4 py-2">{branch.AddressEmail}</td>
                    <td className="px-4 py-2">{branch.AddressMobileLine}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[720px] p-6">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">Add New Branch</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Branch Description"
            value={formData.Description}
            onChange={(e) => handleChange('Description', e.target.value)}
            className="w-full rounded border px-4 py-2"
            required
          />

          <input
            type="text"
            placeholder="Company Description"
            value={formData.CompanyDescription}
            onChange={(e) => handleChange('CompanyDescription', e.target.value)}
            className="w-full rounded border px-4 py-2"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Address Line 1"
              value={formData.AddressAddressLine1}
              onChange={(e) => handleChange('AddressAddressLine1', e.target.value)}
              className="rounded border px-4 py-2"
            />
            <input
              type="text"
              placeholder="Address Line 2"
              value={formData.AddressAddressLine2}
              onChange={(e) => handleChange('AddressAddressLine2', e.target.value)}
              className="rounded border px-4 py-2"
            />
            <input
              type="text"
              placeholder="Street"
              value={formData.AddressStreet}
              onChange={(e) => handleChange('AddressStreet', e.target.value)}
              className="rounded border px-4 py-2"
            />
            <input
              type="text"
              placeholder="City"
              value={formData.AddressCity}
              onChange={(e) => handleChange('AddressCity', e.target.value)}
              className="rounded border px-4 py-2"
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={formData.AddressPostalCode}
              onChange={(e) => handleChange('AddressPostalCode', e.target.value)}
              className="rounded border px-4 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.AddressEmail}
              onChange={(e) => handleChange('AddressEmail', e.target.value)}
              className="rounded border px-4 py-2"
            />
            <input
              type="text"
              placeholder="Land Line"
              value={formData.AddressLandLine}
              onChange={(e) => handleChange('AddressLandLine', e.target.value)}
              className="rounded border px-4 py-2"
            />
            <input
              type="text"
              placeholder="Mobile Line"
              value={formData.AddressMobileLine}
              onChange={(e) => handleChange('AddressMobileLine', e.target.value)}
              className="rounded border px-4 py-2"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.IsLocked}
                onChange={(e) => handleChange('IsLocked', e.target.checked)}
              />
              <span>Is Locked</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.IsChecked}
                onChange={(e) => handleChange('IsChecked', e.target.checked)}
              />
              <span>Is Checked</span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
            >
              {submitting ? 'Saving...' : 'Save Branch'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
