// types.ts
export interface GeneralLedgerEntry {
  GeneralLedgerId: string;
  BranchId: string;
  ChartOfAccountId: string;
  ChartOfAccountAccountType: number;
  ChartOfAccountAccountCode: number;
  ChartOfAccountAccountName: string;
  ChartOfAccountCostCenterId: string | null;
  ChartOfAccountCostCenterDescription: string | null;
  ContraChartOfAccountId: string;
  ContraChartOfAccountAccountType: number;
  ContraChartOfAccountAccountCode: number;
  ContraChartOfAccountAccountName: string;
  ContraChartOfAccountCostCenterId: string | null;
  ContraChartOfAccountCostCenterDescription: string | null;
  CustomerAccountId: string | null;
  EntryType: number;
  CustomerAccountCustomerId: string | null;
  CustomerAccountCustomerType: number;
  PrimaryDescription: string;
  SecondaryDescription: string;
  Reference: string;
  Amount: number;
  ValueDate: string;
  Status: number;
  CreatedBy: string;
  CreatedDate: string;
  CreditFullAccountNumber: string;
  DebitFullAccountNumber: string;
}

export interface LedgerPayload {
  BranchId: string;
  PostingPeriodId: string;
  LedgerNumber: number;
  TotalValue: number;
  Remarks: string;
  Status: number;
  AuditedBy: string | null;
  AuditRemarks: string | null;
  AuditedDate: string | null;
  AuthorizedBy: string | null;
  AuthorizationRemarks: string | null;
  AuthorizedDate: string | null;
  PostedEntries: string;
  CreatedBy: string;
  CreatedDate: string;
  CanSuppressMakerCheckerValidation: boolean;
  GeneralLedgerAuthOption: number;
  StartDate: string;
  EndDate: string;
  CustomerAccountTypeProductCode: number;
  RecordStatus: number;
  GeneralLedgerEntries: GeneralLedgerEntry[];
}
