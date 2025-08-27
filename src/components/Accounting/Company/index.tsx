
import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Modal } from '../../ui/modal';

import CompanyDetails from './CompanyDetails';

interface Company {
  Id: string;
  Description: string;
  ApplicationDisplayName: string;
  Vision: string;
  Mission: string;
  Motto: string;
  RegistrationNumber: string;
  PersonalIdentificationNumber: string;
  AddressAddressLine1: string;
  AddressAddressLine2: string;
  AddressStreet: string;
  AddressPostalCode: string;
  AddressCity: string;
  AddressEmail: string;
  AddressLandLine: string;
  AddressMobileLine: string;
  CreatedDate: string;
  RecoveryPriority?: string;
  TransactionReceiptTopIndentation?: string;
  TransactionReceiptLeftIndentation?: string;
  TransactionReceiptFooter?: string;
  TimeDurationStartTime?: string;
  TimeDurationEndTime?: string;
  EnforceTwoFactorAuthentication?: boolean;
  EnforceSystemLock?: boolean;
  EnforceSingleUserSession?: boolean;
  EnforceBiometricsForCashWithdrawal?: boolean;
  ApplicationMembershipTextAlertsEnabled?: boolean;
  IsFileTrackingEnforced?: boolean;
  EnforceBudgetControl?: boolean;
  IsWithholdingTaxAgent?: boolean;
  MembershipTerminationNoticePeriod?: string;
  FingerprintBiometricThreshold?: number;
  IsLocked?: boolean;
}

interface ApiResponse {
  Data: Company | Company[];
}

interface FormData {
  Description: string;
  ApplicationDisplayName: string;
  Vision: string;
  Mission: string;
  Motto: string;
  RegistrationNumber: string;
  PersonalIdentificationNumber: string;
  AddressAddressLine1: string;
  AddressAddressLine2: string;
  AddressStreet: string;
  AddressPostalCode: string;
  AddressCity: string;
  AddressEmail: string;
  AddressLandLine: string;
  AddressMobileLine: string;
}


export default function CompanySetup() {

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  //filters
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const [formData, setFormData] = useState<FormData>({
      Description: '',
      ApplicationDisplayName: '',
      Vision: '',
      Mission: '',
      Motto: '',
      RegistrationNumber: '',
      PersonalIdentificationNumber: '',
      AddressAddressLine1: '',
      AddressAddressLine2: '',
      AddressStreet: '',
      AddressPostalCode: '',
      AddressCity: '',
      AddressEmail: '',
      AddressLandLine: '',
      AddressMobileLine: '',
    });

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res: AxiosResponse<ApiResponse> = await axios.get(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/GetCompany`,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      const data = res.data.Data;
      const companiesArray = Array.isArray(data) ? data : [data];
      setCompanies(companiesArray);
      setSelectedCompany(companiesArray[0]);
    } catch (err) {
      console.error('Error fetching company:', err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/addCompany`,
        {
          ...formData,
          CreatedDate: new Date().toISOString(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      alert('Company added');
      setIsOpen(false);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      alert('Error saving');
    } finally {
      setSubmitting(false);
    }
  };



  // Extract unique cities for dropdown
  const uniqueCities = Array.from(new Set(companies.map(c => c.AddressCity).filter(Boolean)));


  // Apply filters to companies
  const filteredCompanies = companies.filter(company =>
    (company.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.ApplicationDisplayName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (cityFilter === '' || company.AddressCity === cityFilter)
  );


  

  return (
    <div className="flex h-screen bg-gray-100 text-sm rounded-2xl p-4">
      {/* Company List */}
      
      <div className="w-1/3 border-r bg-white overflow-y-auto p-6 rounded-bl-2xl rounded-tl-2xl">
  <div className="flex justify-between items-center mb-4 bg-blue-100 p-3 rounded-2xl">
    <h2 className="text-lg font-semibold text-gray-800">Company List</h2>
    <button
      className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
      onClick={() => setIsOpen(true)}
    >
      + Add Company
    </button>
  </div>

  {/* 🔍 Filters */}
  <div className="space-y-3 mb-4">
    <input
      type="text"
      placeholder="Search by name or description"
      className="w-full border px-3 py-2 rounded"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    <select
      className="w-full border px-3 py-2 rounded"
      value={cityFilter}
      onChange={(e) => setCityFilter(e.target.value)}
    >
      <option value="">All Cities</option>
      {uniqueCities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  </div>

  {/* 🏢 Company Items */}
  {loading ? (
    <p>Loading companies...</p>
  ) : filteredCompanies.length === 0 ? (
    <p>No companies match the filters.</p>
  ) : (
    filteredCompanies.map((company, index) => (
      <div
        key={index}
        onClick={() => setSelectedCompany(company)}
        className={`cursor-pointer border rounded-md p-4 mb-3 ${
          selectedCompany?.Id === company.Id ? 'bg-blue-600 border-indigo-300 text-white' : 'text-gray-500'
        }`}
      >
        <h3 className="font-semibold ">{company.Description}</h3>
        <p className="text-xs">{company.Motto}</p>
        <p className="text-xs mt-1">{company.AddressCity}</p>
      </div>
    ))
  )}
</div>


      


  <div className="flex-1 overflow-y-auto p-6 bg-white">
    {selectedCompany && <CompanyDetails company={selectedCompany} />}
  </div>













      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-4xl m-4 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Company</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => (
            <input
              key={key}
              name={key}
              placeholder={key}
              value={value}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required={['Description', 'ApplicationDisplayName'].includes(key)}
            />
          ))}
          <div className="col-span-2 text-right">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              {submitting ? 'Saving...' : 'Save Company'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
