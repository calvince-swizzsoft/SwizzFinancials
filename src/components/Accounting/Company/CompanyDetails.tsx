import React from 'react';

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

const CompanyDetails: React.FC<{ company: Company }> = ({ company }) => {
  const sections = [
    {
      title: 'Basic Info',
      items: {
        ID: company.Id,
        'Display Name': company.ApplicationDisplayName,
        Description: company.Description,
        'Created Date': company.CreatedDate,
        'Registration Number': company.RegistrationNumber,
        PIN: company.PersonalIdentificationNumber,
      },
    },
    {
      title: 'Vision & Motto',
      items: {
        Vision: company.Vision,
        Mission: company.Mission,
        Motto: company.Motto,
      },
    },
    {
      title: 'Address Details',
      items: {
        'Line 1': company.AddressAddressLine1,
        'Line 2': company.AddressAddressLine2,
        Street: company.AddressStreet,
        'Postal Code': company.AddressPostalCode,
        City: company.AddressCity,
        Email: company.AddressEmail,
        'Land Line': company.AddressLandLine,
        'Mobile Line': company.AddressMobileLine,
      },
    },
    {
      title: 'Transaction Receipt Settings',
      items: {
        'Top Indentation': company.TransactionReceiptTopIndentation || 'N/A',
        'Left Indentation': company.TransactionReceiptLeftIndentation || 'N/A',
        Footer: company.TransactionReceiptFooter || 'N/A',
      },
    },
    {
      title: 'System Enforcement',
      items: {
        '2FA': company.EnforceTwoFactorAuthentication ? 'Yes' : 'No',
        'System Lock': company.EnforceSystemLock ? 'Yes' : 'No',
        'Single Session': company.EnforceSingleUserSession ? 'Yes' : 'No',
        'Biometric Withdrawal': company.EnforceBiometricsForCashWithdrawal ? 'Yes' : 'No',
        'Biometric Threshold': company.FingerprintBiometricThreshold || 0,
        Locked: company.IsLocked ? 'Yes' : 'No',
      },
    },
    {
      title: 'Membership & Tax',
      items: {
        'Text Alerts Enabled': company.ApplicationMembershipTextAlertsEnabled ? 'Yes' : 'No',
        'File Tracking Enforced': company.IsFileTrackingEnforced ? 'Yes' : 'No',
        'Budget Control': company.EnforceBudgetControl ? 'Yes' : 'No',
        'Tax Agent': company.IsWithholdingTaxAgent ? 'Yes' : 'No',
        'Notice Period': company.MembershipTerminationNoticePeriod || 'N/A',
      },
    },
  ];

  return (
    <div className="columns-2 gap-6 space-y-6 p-6 bg-blue-100 rounded-2xl">
      {sections.map((section, index) => (
        <div
          key={index}
          className="break-inside-avoid bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
        >
          <h2 className="font-semibold mb-4 text-indigo-600 rounded-2xl bg-blue-100 p-3">{section.title}</h2>
          <div className="space-y-2 text-sm text-gray-700">
            {Object.entries(section.items).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium text-gray-600">{key}:</span>
                <span className="text-right text-gray-800">{value || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyDetails;
