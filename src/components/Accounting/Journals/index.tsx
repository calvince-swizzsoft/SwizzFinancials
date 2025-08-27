import { useEffect, useState } from 'react';
import axios from 'axios';

interface Journal {
  Id: string;
  BranchDescription: string;
  GLAccountCode: number;
  GLAccountName: string;
  ContraGLAccountCode: number;
  ContraGLAccountName: string;
  Debit: number;
  Credit: number;
  BookBalance: number;
  RunningBalance: number;
  JournalValueDate: string;
  JournalCreatedDate: string;
  JournalReference: string;
  JournalPrimaryDescription: string;
  JournalSecondaryDescription: string;
  JournalTransactionCode: number;
  JournalTransactionCodeDescription: string;
  ApplicationUserName: string;
  EnvironmentUserName: string;
  EnvironmentMachineName: string;
  EnvironmentDomainName: string;
  EnvironmentOSVersion: string;
  EnvironmentMACAddress: string;
  EnvironmentMotherboardSerialNumber: string;
  EnvironmentProcessorId: string;
  EnvironmentIPAddress: string;
  [key: string]: any;
}



const journalEntryFilters = [
  { value: "JournalPostingPeriod", label: "Posting Period" },
  { value: "JournalBranch", label: "Branch" },
  { value: "JournalPrimaryDescription", label: "Primary Description" },
  { value: "JournalSecondaryDescription", label: "Secondary Description" },
  { value: "JournalReference", label: "Reference" },
  { value: "JournalApplicationUserName", label: "App. User Name" },
  { value: "JournalEnvironmentUserName", label: "Env. User Name" },
  { value: "JournalEnvironmentMachineName", label: "Env. Machine Name" },
  { value: "JournalEnvironmentDomainName", label: "Env. Domain Name" },
  { value: "JournalEnvironmentOSVersion", label: "Env. OS Version" },
  { value: "JournalEnvironmentMACAddress", label: "Env. MAC Address" },
  { value: "JournalEnvironmentMotherboardSerialNumber", label: "Env. Motherboard Serial #" },
  { value: "JournalEnvironmentProcessorId", label: "Env. Processor Id" },
  { value: "JournalEnvironmentIPAddress", label: "Env. IP Address" },
  { value: "ChartOfAccount", label: "G/L Account Name" },
  { value: "ContraChartOfAccount", label: "Contra G/L Account Name" },
  { value: "Amount", label: "Amount" },
  { value: "CustomerSerialNumber", label: "Serial Number" },
  { value: "CustomerPersonalIdentificationNumber", label: "Personal Identification #" },
  { value: "CustomerFirstName", label: "First Name" },
  { value: "CustomerLastName", label: "Last Name" },
  { value: "CustomerIdentityCardNumber", label: "Identity Card #" },
  { value: "CustomerPayrollNumbers", label: "Payroll Numbers" },
  { value: "CustomerNonIndividual_Description", label: "Org. Name" },
  { value: "CustomerNonIndividual_RegistrationNumber", label: "Org. Registration #" },
  { value: "CustomerAddressLine1", label: "Address Line 1" },
  { value: "CustomerAddressLine2", label: "Address Line 2" },
  { value: "CustomerStreet", label: "Street" },
  { value: "CustomerPostalCode", label: "Postal Code" },
  { value: "CustomerCity", label: "City" },
  { value: "CustomerEmail", label: "Email" },
  { value: "CustomerLandLine", label: "Land Line" },
  { value: "CustomerMobileLine", label: "Mobile Line" },
  { value: "CustomerReference1", label: "Account Number" },
  { value: "CustomerReference2", label: "Membership Number" },
  { value: "CustomerReference3", label: "Personal File Number" },
];


export default function JournalComponent() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  //const [amounttext, setAmounttext] = useState(2000);

  useEffect(() => {
    const fetchJournals = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_ACCOUNT_URL}/api/values/getGeneralLedgerTransactions`, {
            params: {
              pageIndex: 0,
              pageSize: 0,
              journalEntryFilter: 16,
              startDate: '12-01-2010',
              endDate: '12-12-2025',
              text: 1
            },
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
          }
        );
        const data = res.data?.Data || [];
        setJournals(data);
      } catch (err) {
        console.error('Error fetching journals:', err);
        setJournals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <p>Loading transactions...</p>;
  if (journals.length === 0) return <p>No journal transactions found.</p>;

  return (
    <div className="p-6 bg-white rounded">
      <h2 className="text-xl font-semibold mb-4">Journal Transactions</h2>
      <div className="divide-y">
        

<select>
  {journalEntryFilters.map(filter => (
    <option key={filter.value} value={filter.value}>
      {filter.label}
    </option>
  ))}
</select>





        {journals.map((j) => (
          <div key={j.Id} className="py-3">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggle(j.Id)}>
              <div>
                <p><strong>{new Date(j.JournalValueDate).toLocaleDateString()}</strong> — GL Account: {j.GLAccountName} (Code: {j.GLAccountCode})</p>
                <p className="text-sm text-gray-600">
                  Contra: {j.ContraGLAccountName} | Debit: {j.Debit.toLocaleString()} | Credit: {j.Credit.toLocaleString()} | Running Balance: {j.RunningBalance.toLocaleString()}
                </p>
              </div>
              <button className="text-blue-600">
                {expanded[j.Id] ? 'Show Less' : 'Show More'}
              </button>
            </div>
            <hr className='mt-4'/>

            {expanded[j.Id] && (
              <div className="mt-2 bg-gray-100 p-4 rounded text-sm text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><strong>Branch:</strong> {j.BranchDescription}</p>
                  <p><strong>Reference:</strong> {j.JournalReference || '-'}</p>
                  <p><strong>Primary Description:</strong> {j.JournalPrimaryDescription || '-'}</p>
                  <p><strong>Secondary Description:</strong> {j.JournalSecondaryDescription || '-'}</p>
                  <p><strong>Transaction Code:</strong> {j.JournalTransactionCode} ({j.JournalTransactionCodeDescription || '-'})</p>
                  <p><strong>Book Balance:</strong> {j.BookBalance.toLocaleString()}</p>
                  <p><strong>Created Date:</strong> {new Date(j.JournalCreatedDate).toLocaleString()}</p>

                  <p><strong>Running Balance:</strong>  {j.RunningBalance.toLocaleString()}</p>
                  <p><strong>Credit:</strong>  {j.Credit.toLocaleString()}</p>
                  <p><strong> Debit:</strong> {j.Debit.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
