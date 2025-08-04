/*
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal"; // adjust the path if needed

interface Advert {
  advertID?: number;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  advertType: string;
  displayLocation: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  clickCount: number;
  viewCount: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string | null;
}

const BankSetup: React.FC = () => {
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [isItemModalOpen2, setIsItemModalOpen2] = useState(false);

  const [formData, setFormData] = useState<Advert>({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    advertType: "Banner",
    displayLocation: "Homepage Top",
    startDate: "",
    endDate: "",
    isActive: true,
    priority: 1,
    clickCount: 0,
    viewCount: 0,
    createdBy: "admin",
  });

  useEffect(() => {
    fetchAdverts();
  }, []);

  const fetchAdverts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Advert[]>(
        "http://197.232.170.121:8599/api/club/getAllAdverts"
      );
      setAdverts(response.data);
    } catch (err) {
      setError("Failed to load advertisements.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://197.232.170.121:8599/api/club/createAdvert", formData);
      await fetchAdverts();
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        linkUrl: "",
        advertType: "Banner",
        displayLocation: "Homepage Top",
        startDate: "",
        endDate: "",
        isActive: true,
        priority: 1,
        clickCount: 0,
        viewCount: 0,
        createdBy: "admin",
      });
      setIsItemModalOpen2(false);
      alert("Advert created successfully.");
    } catch (err) {
      alert("Failed to create advert.");
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-10 bg-white rounded-2xl">
      {/* Top Bar *//*}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Club Advertisements</h2>
        <button
          onClick={() => setIsItemModalOpen2(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Advert
        </button>
      </div>

      {/* Modal Form *//*}
      <Modal
        isOpen={isItemModalOpen2}
        onClose={() => setIsItemModalOpen2(false)}
        className="max-w-[600px] m-4"
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <h2 className="text-lg font-semibold text-gray-700">New Advertisement</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            rows={3}
          />
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFormData({ ...formData, imageUrl: (reader.result as string).split(',')[1] });
                };
                reader.readAsDataURL(file);
              }
            }}
            className="border p-2 rounded w-full"
          />

          {/* Optional Preview *//*}
          {formData.imageUrl && (
            <img
              src={`data:image/jpeg;base64,${formData.imageUrl}`}
              alt="Preview"
              className="w-full h-40 object-contain border rounded mt-2"
            />
          )}

          <input
            type="text"
            name="linkUrl"
            placeholder="Link URL"
            value={formData.linkUrl}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          <div className="flex gap-2">
            <input
              type="date"
              name="startDate"
              value={formData.startDate.split("T")[0]}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value + "T00:00:00" })
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate.split("T")[0]}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value + "T23:59:59" })
              }
              className="border p-2 rounded w-full"
            />
          </div>
          <select
            name="advertType"
            value={formData.advertType}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="Banner">Banner</option>
            <option value="Popup">Popup</option>
          </select>
          <select
            name="displayLocation"
            value={formData.displayLocation}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="Homepage Top">Homepage Top</option>
            <option value="Sidebar">Sidebar</option>
          </select>
          <input
            type="number"
            name="priority"
            placeholder="Priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <span>Is Active</span>
          </label>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Submit
          </button>
        </form>
      </Modal>

      {/* Advertisement Cards *//*}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-center col-span-full">Loading...</p>}
        {error && <p className="text-center col-span-full text-red-500">{error}</p>}
        {adverts.map((ad) => (
          <div
            key={ad.advertID}
            className="rounded-xl overflow-hidden border border-gray-200 shadow hover:shadow-lg transition "
          >
              <img
                src={`data:image/jpeg;base64,${ad.imageUrl}`}
                alt={ad.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="font-bold text-lg text-gray-800">{ad.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{ad.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  From: {new Date(ad.startDate).toLocaleDateString()} <br />
                  To: {new Date(ad.endDate).toLocaleDateString()}
                </p>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BankSetup;
*/





// Enhanced BankSetup.tsx styled like 'SaaS Order page - Shodai.jpg'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from '../../ui/modal';

interface BankBranch {
  BankCode: number;
  BankDescription: string;
  Code: number;
  PaddedCode: string;
  Description: string;
  AddressAddressLine1: string;
  AddressAddressLine2: string;
  AddressStreet: string;
  AddressPostalCode: string;
  AddressCity: string;
  AddressEmail: string;
  AddressLandLine: string;
  AddressMobileLine: string;
  ContactPerson: string;
  PhoneNumber: string;
  CreatedDate: string;
}

interface Bank {
  Code: number;
  Description: string;
  CreatedDate: string;
  BankBranchesDTO: BankBranch[];
}

export default function BankSetup() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    Code: 101,
    Description: 'KBC Bank',
    Branches: [
      {
        Description: 'Westlands Branch',
        Code: 10101,
        PaddedCode: '10101',
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

  const createdDate = new Date().toISOString();

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get(
          'https://1acd57da41eb.ngrok-free.app/api/values/getBanks?pagesize=1&&pageindex=0',
          {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          }
        );
        setBanks(response.data.Data || []);
      } catch (error) {
        console.error('Error fetching banks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload: Bank = {
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
      await axios.post(
        'https://1acd57da41eb.ngrok-free.app/api/values/AddBanks',
        payload
      );
      alert('Bank successfully added!');
      setIsOpen(false);
    } catch (err) {
      alert('Failed to add bank.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  function updateBranchField(index: number, key: keyof BankBranch, value: string) {
    const updatedBranches = [...formData.Branches];
    updatedBranches[index] = { ...updatedBranches[index], [key]: value };
    setFormData({ ...formData, Branches: updatedBranches });
  }

  return (
    <div className="rounded-xl bg-white px-8 py-10 shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Bank Setup</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Add Bank
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full table-auto text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Bank Name</th>
              <th className="px-6 py-3">Created Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : banks.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No banks found.</td>
              </tr>
            ) : (
              banks.map((bank) => (
                <tr
                  key={bank.Code}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{bank.Code}</td>
                  <td className="px-6 py-4">{bank.Description}</td>
                  <td className="px-6 py-4">{new Date(bank.CreatedDate).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[720px] p-6">
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

          <div className="flex justify-end">
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
