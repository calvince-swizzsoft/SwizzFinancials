import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from '../../ui/modal';

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
}

export default function CompanySetup() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
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

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://43d797ae2495.ngrok-free.app/api/values/GetCompany', {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = res.data?.Data?.[0];
      if (data) setCompany(data);
    } catch (err) {
      console.error('Error fetching company:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...formData,
      ImageBuffer: null,
      TransactionReceiptTopIndentation: 5,
      TransactionReceiptLeftIndentation: 10,
      TransactionReceiptFooter: 'Thank you for doing business with us.',
      FingerprintBiometricThreshold: 85,
      MembershipTerminationNoticePeriod: 30,
      TimeDurationStartTime: '08:00:00',
      TimeDurationEndTime: '17:00:00',
      ApplicationMembershipTextAlertsEnabled: true,
      EnforceCustomerAccountMakerChecker: true,
      BypassJournalVoucherAudit: false,
      BypassCreditBatchAudit: false,
      BypassDebitBatchAudit: false,
      BypassRefundBatchAudit: false,
      BypassWireTransferBatchAudit: false,
      BypassLoanDisbursementBatchAudit: false,
      BypassJournalReversalBatchAudit: false,
      BypassInterAccountTransferBatchAudit: false,
      BypassExpensePayableAudit: false,
      BypassGeneralLedgerAudit: false,
      ExcludeChargesInTransactionReceipt: true,
      ExcludeChequeMaturityDateInTransactionReceipt: false,
      TrackGuarantorCommittedInvestments: true,
      TransferNetRefundableAmountToSavingsAccountOnDeathClaimSettlement: true,
      ReceiveLoanRequestBeforeLoanRegistration: false,
      LocalizeOnlineNotifications: true,
      IsWithholdingTaxAgent: false,
      EnforceBudgetControl: true,
      IsFileTrackingEnforced: true,
      ExcludeCustomerAccountBalanceInTransactionReceipt: false,
      EnforceFixedDepositBands: false,
      EnforceBiometricsForCashWithdrawal: true,
      EnforceTwoFactorAuthentication: true,
      RecoverArrearsOnCashDeposit: true,
      RecoverArrearsOnExternalChequeClearance: false,
      RecoverArrearsOnFixedDepositPayment: true,
      AllowDebitBatchToOverdrawAccount: false,
      EnforceSystemLock: true,
      EnforceTellerLimits: true,
      EnforceTellerCashTransferAcknowledgement: false,
      EnforceSingleUserSession: true,
      CustomerMembershipTextAlertsEnabled: true,
      EnforceInvestmentProductExemptions: false,
      EnforceMobileToBankReconciliationVerification: false,
      IsLocked: false,
      CreatedBy: 'admin',
      CreatedDate: new Date().toISOString(),
    };

    try {
      await axios.post('https://43d797ae2495.ngrok-free.app/api/values/addCompany', payload);
      alert('Company added successfully');
      setIsOpen(false);
      fetchCompany();
    } catch (err) {
      console.error('Failed to add company:', err);
      alert('Failed to add company');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="rounded-xl bg-white px-8 py-10 shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Company Profile</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Add Company
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : company ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div><strong>Company:</strong> {company.Description}</div>
          <div><strong>Display Name:</strong> {company.ApplicationDisplayName}</div>
          <div><strong>Vision:</strong> {company.Vision}</div>
          <div><strong>Mission:</strong> {company.Mission}</div>
          <div><strong>Motto:</strong> {company.Motto}</div>
          <div><strong>PIN:</strong> {company.PersonalIdentificationNumber}</div>
          <div><strong>Reg No:</strong> {company.RegistrationNumber}</div>
          <div><strong>City:</strong> {company.AddressCity}</div>
          <div><strong>Street:</strong> {company.AddressStreet}</div>
          <div><strong>Email:</strong> {company.AddressEmail}</div>
          <div><strong>Mobile:</strong> {company.AddressMobileLine}</div>
        </div>
      ) : (
        <div className="text-center text-gray-500">No company data found.</div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[1200px] m-4 p-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Add Company</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="Description" placeholder="Company Name" value={formData.Description} onChange={handleChange} className="rounded border px-4 py-2" required />
          <input name="ApplicationDisplayName" placeholder="Display Name" value={formData.ApplicationDisplayName} onChange={handleChange} className="rounded border px-4 py-2" required />
          <input name="Vision" placeholder="Vision" value={formData.Vision} onChange={handleChange} className="rounded border px-4 py-2" required />
          <input name="Mission" placeholder="Mission" value={formData.Mission} onChange={handleChange} className="rounded border px-4 py-2" />
          <input name="Motto" placeholder="Motto" value={formData.Motto} onChange={handleChange} className="rounded border px-4 py-2" />
          <input name="RegistrationNumber" placeholder="Reg. Number" value={formData.RegistrationNumber} onChange={handleChange} className="rounded border px-4 py-2" />
          <input name="PersonalIdentificationNumber" placeholder="PIN" value={formData.PersonalIdentificationNumber} onChange={handleChange} className="rounded border px-4 py-2" />
          <input name="AddressAddressLine1" placeholder="Address Line 1" value={formData.AddressAddressLine1} onChange={handleChange} className="rounded border px-4 py-2" />
          <input name="AddressAddressLine2" placeholder="Address Line 2" value={formData.AddressAddressLine2} onChange={handleChange} className="rounded border px-4 py-2" />
          <input name="AddressStreet" placeholder="Street" value={formData.AddressStreet} onChange={handleChange} className="rounded border px-4 py-2" />
          <input name="AddressPostalCode" placeholder="Postal Code" value={formData.AddressPostalCode} onChange={handleChange} className="rounded border px-4 py-2" />
          <input name="AddressCity" placeholder="City" value={formData.AddressCity} onChange={handleChange} className="rounded border px-4 py-2" />
          <input name="AddressEmail" placeholder="Email" type="email" value={formData.AddressEmail} onChange={handleChange} className="rounded border px-4 py-2" />
          <input name="AddressLandLine" placeholder="Landline" value={formData.AddressLandLine} onChange={handleChange} className="rounded border px-4 py-2" />
          <input name="AddressMobileLine" placeholder="Mobile" value={formData.AddressMobileLine} onChange={handleChange} className="rounded border px-4 py-2" />
          <div className="md:col-span-2 text-right mt-4">
            <button type="submit" disabled={submitting} className="rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
              {submitting ? 'Saving...' : 'Save Company'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
