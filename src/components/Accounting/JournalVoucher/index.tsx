import React, { useState, useEffect } from "react";
import axios from "axios";

interface ChartOfAccount {
 id: string;
 name: string;
 accountNumber: string;
}

interface BranchItem {
 id: string;
 name: string;
}

interface PostingPeriod {
 id: string;
 description: string;
}

interface JournalVoucherEntryDTO {
 Id?: string;
 JournalVoucherId?: string;
 ChartOfAccountId: string;
 CustomerAccountId?: string;
 Amount: number; // Positive for debit, negative for credit
}

interface JournalVoucherDTO {
 Id?: string;
 BranchId: string;
 PostingPeriodId: string;
 ChartOfAccountId: string; // Main account (first entry)
 Type: number;
 TotalValue: number;
 PrimaryDescription: string;
 SecondaryDescription?: string;
 Reference: string;
 ValueDate: string;
 JournalVoucherEntries: JournalVoucherEntryDTO[];
}

interface JournalEntryRow {
 id: string;
 type: string;
 branch: string;
 chartOfAccountId: string;
 chartOfAccountName: string;
 costCenter: string;
 fullAccountNumber: string;
 customerName: string;
 accountNumber: string;
 membershipNumber: string;
 personalFileNumber: string;
 primaryDescription: string;
 secondaryDescription: string;
 debitAmount: number;
 creditAmount: number;
}

const PostingPage: React.FC = () => {
 const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([]);
 const [branches, setBranches] = useState<BranchItem[]>([]);
 const [postingPeriods, setPostingPeriods] = useState<PostingPeriod[]>([]);
 const [rows, setRows] = useState<JournalEntryRow[]>([
   {
     id: "1",
     type: "Debit G/L Account",
     branch: "",
     chartOfAccountId: "",
     chartOfAccountName: "",
     costCenter: "",
     fullAccountNumber: "",
     customerName: "",
     accountNumber: "",
     membershipNumber: "",
     personalFileNumber: "",
     primaryDescription: "",
     secondaryDescription: "",
     debitAmount: 0,
     creditAmount: 0
   }
 ]);
 const [form, setForm] = useState({
   type: "Debit G/L Account",
   glAccount: "",
   postingPeriod: "Fiscal Year 2017",
   reference: "",
   valueDate: "3/15/2018",
   glAccountDetail: "",
   primaryDescription: "",
   secondaryDescription: "",
   branch: "",
   reference2: "",
   principal: "0.00"
 });
 const [submitting, setSubmitting] = useState(false);
 const [message, setMessage] = useState<string>("");

 // Fetch data
 useEffect(() => {
   const fetchChartOfAccounts = async () => {
     try {
       const url = `${import.meta.env.VITE_ACCOUNT_URL}/api/values/GetChartOfAccount`;
       const res = await axios.get(url, {
         headers: { "ngrok-skip-browser-warning": "true" },
       });
       if (res?.data?.Success && res?.data?.Data) {
         const accounts = Array.isArray(res.data.Data) ? res.data.Data : [res.data.Data];
         setChartOfAccounts(
           accounts.map((acc: any) => ({
             id: acc.Id ?? acc.id ?? acc.AccountId ?? acc.accountID,
             name: acc.AccountName ?? acc.accountName ?? acc.name ?? "",
             accountNumber: String(acc.AccountCode ?? acc.accountCode ?? acc.accountNumber ?? "")
           }))
         );
       }
     } catch (err) {
       console.error("Failed to fetch Chart of Accounts:", err);
     }
   };

   const fetchBranches = async () => {
     try {
       const url = `${import.meta.env.VITE_ACCOUNT_URL}/api/values/branches`;
       const res = await axios.get(url, {
         headers: { "ngrok-skip-browser-warning": "true" },
       });
       if (res?.data?.Success && res?.data?.Data) {
         const items = Array.isArray(res.data.Data) ? res.data.Data : [res.data.Data];
         setBranches(
           items.map((b: any) => ({
             id: b.Id ?? b.id ?? b.BranchId ?? b.branchId,
             name: b.Description ?? b.description ?? b.Name ?? b.name ?? "Branch"
           }))
         );
       }
     } catch (err) {
       console.error("Failed to fetch branches:", err);
     }
   };

   // Mock posting periods - replace with actual API call
   const fetchPostingPeriods = async () => {
     setPostingPeriods([
       { id: "period-1", description: "Fiscal Year 2017" },
       { id: "period-2", description: "Fiscal Year 2018" },
       { id: "period-3", description: "Fiscal Year 2019" }
     ]);
   };

   fetchChartOfAccounts();
   fetchBranches();
   fetchPostingPeriods();
 }, []);

 const addRow = () => {
   const newRow: JournalEntryRow = {
     id: Date.now().toString(),
     type: "Debit G/L Account",
     branch: "",
     chartOfAccountId: "",
     chartOfAccountName: "",
     costCenter: "",
     fullAccountNumber: "",
     customerName: "",
     accountNumber: "",
     membershipNumber: "",
     personalFileNumber: "",
     primaryDescription: "",
     secondaryDescription: "",
     debitAmount: 0,
     creditAmount: 0
   };
   setRows([...rows, newRow]);
 };

 const removeRow = (id: string) => {
   if (rows.length > 1) {
     setRows(rows.filter((row: JournalEntryRow) => row.id !== id));
   }
 };

 const updateRow = (id: string, field: keyof JournalEntryRow, value: any) => {
   setRows(rows.map((row: JournalEntryRow) => {
     if (row.id === id) {
       const updatedRow = { ...row, [field]: value };
       if (field === 'chartOfAccountId') {
         const account = chartOfAccounts.find((acc: ChartOfAccount) => acc.id === value);
         updatedRow.chartOfAccountName = account?.name || "";
         updatedRow.fullAccountNumber = account?.accountNumber || "";
       }
       return updatedRow;
     }
     return row;
   }));
 };

 const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
   const { name, value } = e.target;
   setForm((prev) => ({ ...prev, [name]: value }));
 };

 const getTotalDebits = () => rows.reduce((sum: number, row: JournalEntryRow) => sum + (row.debitAmount || 0), 0);
 const getTotalCredits = () => rows.reduce((sum: number, row: JournalEntryRow) => sum + (row.creditAmount || 0), 0);
 const isBalanced = () => Math.abs(getTotalDebits() - getTotalCredits()) < 0.01;

 const getApportioned = () => getTotalDebits();
 const getShortage = () => Math.max(0, getTotalCredits() - getTotalDebits());

 const isValid = () => {
   return form.glAccount && form.glAccount.trim().length > 0 &&
          form.postingPeriod && form.postingPeriod.trim().length > 0 &&
          rows.every((row: JournalEntryRow) => row.chartOfAccountId && (row.debitAmount > 0 || row.creditAmount > 0)) &&
          isBalanced() &&
          getTotalDebits() > 0;
 };

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!isValid()) return;

   setSubmitting(true);
   setMessage("");

   try {
     // Convert rows to JournalVoucherEntryDTO format
     const journalVoucherEntries: JournalVoucherEntryDTO[] = rows
       .filter((row: JournalEntryRow) => row.debitAmount > 0 || row.creditAmount > 0)
       .map((row: JournalEntryRow) => ({
         ChartOfAccountId: row.chartOfAccountId,
         CustomerAccountId: row.customerName || undefined,
         Amount: row.debitAmount > 0 ? row.debitAmount : -row.creditAmount
       }));

     const payload: JournalVoucherDTO = {
       BranchId: form.branch,
       PostingPeriodId: form.postingPeriod,
       ChartOfAccountId: form.glAccount,
       Type: 1,
       TotalValue: getTotalDebits(),
       PrimaryDescription: form.primaryDescription || "Journal Batch Entry",
       SecondaryDescription: form.secondaryDescription || "Direct Journal Posting",
       Reference: form.reference || `BATCH-${Date.now()}`,
       ValueDate: form.valueDate,
       JournalVoucherEntries: journalVoucherEntries
     };

     console.log("Payload:", payload);

     const url = `${import.meta.env.VITE_ACCOUNT_URL}/api/values/PostJournalVoucher`;
     const res = await axios.post(url, payload, {
       headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
     });

     if (res?.data?.Success) {
       setMessage("Journal posted successfully.");
       // Reset form
       setRows([{
         id: "1",
         type: "Debit G/L Account",
         branch: "",
         chartOfAccountId: "",
         chartOfAccountName: "",
         costCenter: "",
         fullAccountNumber: "",
         customerName: "",
         accountNumber: "",
         membershipNumber: "",
         personalFileNumber: "",
         primaryDescription: "",
         secondaryDescription: "",
         debitAmount: 0,
         creditAmount: 0
       }]);
       setForm({
         type: "Debit G/L Account",
         glAccount: "",
         postingPeriod: "Fiscal Year 2017",
         reference: "",
         valueDate: "3/15/2018",
         glAccountDetail: "",
         primaryDescription: "",
         secondaryDescription: "",
         branch: "",
         reference2: "",
         principal: "0.00"
       });
     } else {
       setMessage(res?.data?.Message || "Failed to post journal.");
     }
   } catch (err: any) {
     console.error("Error posting journal:", err);
     setMessage(err.response?.data?.error || "Error occurred while posting journal.");
   } finally {
     setSubmitting(false);
   }
 };

 return (
   <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
     <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Journal Voucher Posting</h2>

     <form onSubmit={handleSubmit} className="space-y-6">
       {/* Header Row */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
           <select
             name="type"
             value={form.type}
             onChange={handleFormChange}
             className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
           >
             <option value="Debit G/L Account">Debit G/L Account</option>
             <option value="Credit G/L Account">Credit G/L Account</option>
           </select>
         </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">G/L Account:</label>
           <div className="flex gap-1">
             <input
               type="text"
               name="glAccount"
               value={form.glAccount}
               onChange={handleFormChange}
               className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
               placeholder="Enter account"
             />
             <button type="button" className="px-2 py-1 border border-gray-300 rounded text-sm">📋</button>
           </div>
         </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Posting Period:</label>
           <div className="flex gap-1">
             <select
               name="postingPeriod"
               value={form.postingPeriod}
               onChange={handleFormChange}
               className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
             >
               {postingPeriods.map((p: PostingPeriod) => (
                 <option key={p.id} value={p.description}>{p.description}</option>
               ))}
             </select>
             <button type="button" className="px-2 py-1 border border-gray-300 rounded text-sm">📋</button>
           </div>
         </div>
       </div>

       {/* Second Row */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Reference:</label>
           <div className="flex gap-1">
             <input
               type="text"
               name="reference"
               value={form.reference}
               onChange={handleFormChange}
               className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
               placeholder="Enter Text..."
             />
             <button type="button" className="px-2 py-1 text-red-500 border border-gray-300 rounded text-sm">✗</button>
           </div>
         </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Value Date:</label>
           <div className="flex gap-1">
             <input
               type="text"
               name="valueDate"
               value={form.valueDate}
               onChange={handleFormChange}
               className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
               placeholder="MM/DD/YYYY"
             />
             <button type="button" className="px-2 py-1 border border-gray-300 rounded text-sm">📅</button>
           </div>
         </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Principal:</label>
           <input
             type="text"
             name="principal"
             value={form.principal}
             onChange={handleFormChange}
             className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-right"
             placeholder="Ksh.0.00"
           />
         </div>
       </div>

       {/* Voucher Details Section */}
       <div className="bg-blue-50 p-4 rounded">
         <h3 className="text-sm font-medium text-gray-700 mb-3">Voucher Details</h3>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
             <select
               name="type"
               value={form.type}
               onChange={handleFormChange}
               className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
             >
               <option value="Debit G/L Account">Debit G/L Account</option>
               <option value="Credit G/L Account">Credit G/L Account</option>
             </select>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">G/L Account:</label>
             <div className="flex gap-1">
               <input
                 type="text"
                 name="glAccountDetail"
                 value={form.glAccountDetail}
                 onChange={handleFormChange}
                 className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
                 placeholder="Enter Text..."
               />
               <button type="button" className="px-2 py-1 border border-gray-300 rounded text-sm">📋</button>
             </div>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Branch:</label>
             <div className="flex gap-1">
               <select
                 name="branch"
                 value={form.branch}
                 onChange={handleFormChange}
                 className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
               >
                 <option value="">Select Branch</option>
                 {branches.map((b: BranchItem) => (
                   <option key={b.id} value={b.id}>{b.name}</option>
                 ))}
               </select>
               <button type="button" className="px-2 py-1 border border-gray-300 rounded text-sm">📋</button>
             </div>
           </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Primary Description:</label>
             <div className="flex gap-1">
               <input
                 type="text"
                 name="primaryDescription"
                 value={form.primaryDescription}
                 onChange={handleFormChange}
                 className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
                 placeholder="Enter Text..."
               />
               <button type="button" className="px-2 py-1 text-red-500 border border-gray-300 rounded text-sm">✗</button>
             </div>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Description:</label>
             <div className="flex gap-1">
               <input
                 type="text"
                 name="secondaryDescription"
                 value={form.secondaryDescription}
                 onChange={handleFormChange}
                 className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
                 placeholder="Enter Text..."
               />
               <button type="button" className="px-2 py-1 text-red-500 border border-gray-300 rounded text-sm">✗</button>
             </div>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Reference:</label>
             <div className="flex gap-1">
               <input
                 type="text"
                 name="reference2"
                 value={form.reference2}
                 onChange={handleFormChange}
                 className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
                 placeholder="Enter Text..."
               />
               <button type="button" className="px-2 py-1 text-red-500 border border-gray-300 rounded text-sm">✗</button>
             </div>
           </div>
         </div>
         
         <div className="mt-4">
           <label className="block text-sm font-medium text-gray-700 mb-1">Principal:</label>
           <input
             type="text"
             name="principal"
             value={form.principal}
             onChange={handleFormChange}
             className="w-32 rounded border border-gray-300 px-3 py-2 text-sm text-right bg-gray-100"
             placeholder="Ksh.0.00"
             readOnly
           />
         </div>
       </div>

       {/* Voucher Entries Table */}
       <div className="space-y-4">
         <div className="flex justify-between items-center">
           <h3 className="text-sm font-medium bg-gray-200 px-3 py-1 rounded">📋 Voucher Entries</h3>
           <button type="button" onClick={addRow} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Add</button>
         </div>

         <div className="overflow-x-auto">
           <table className="min-w-full border border-gray-200 text-xs">
             <thead className="bg-gray-100">
               <tr>
                 <th className="px-2 py-2 text-left font-medium text-gray-700">Type</th>
                 <th className="px-2 py-2 text-left font-medium text-gray-700">Branch</th>
                 <th className="px-2 py-2 text-left font-medium text-gray-700">G/L Account Name</th>
                 <th className="px-2 py-2 text-left font-medium text-gray-700">G/L Account Cost Center</th>
                 <th className="px-2 py-2 text-left font-medium text-gray-700">Full Account Number</th>
                 <th className="px-2 py-2 text-left font-medium text-gray-700">Customer Name</th>
                 <th className="px-2 py-2 text-left font-medium text-gray-700">Account Number</th>
                 <th className="px-2 py-2 text-left font-medium text-gray-700">Membership Number</th>
                 <th className="px-2 py-2 text-left font-medium text-gray-700">Personal File Number</th>
                 <th className="px-2 py-2 text-left font-medium text-gray-700">Primary Description</th>
                 <th className="px-2 py-2 text-center font-medium text-gray-700">✗</th>
               </tr>
             </thead>
             <tbody>
               {rows.map((row: JournalEntryRow) => (
                 <tr key={row.id} className="border-t">
                   <td className="px-2 py-2">
                     <select
                       value={row.type}
                       onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateRow(row.id, 'type', e.target.value)}
                       className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                     >
                       <option value="Debit G/L Account">Debit G/L Account</option>
                       <option value="Credit G/L Account">Credit G/L Account</option>
                     </select>
                   </td>
                   
                   <td className="px-2 py-2">
                     <select
                       value={row.branch}
                       onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateRow(row.id, 'branch', e.target.value)}
                       className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                     >
                       <option value="">Select</option>
                       {branches.map((b: BranchItem) => (
                         <option key={b.id} value={b.id}>{b.name}</option>
                       ))}
                     </select>
                   </td>
                   
                   <td className="px-2 py-2">
                     <select
                       value={row.chartOfAccountId}
                       onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateRow(row.id, 'chartOfAccountId', e.target.value)}
                       className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                       required
                     >
                       <option value="">Select Account</option>
                       {chartOfAccounts.map((account: ChartOfAccount) => (
                         <option key={account.id} value={account.id}>
                           {account.accountNumber ? `${account.accountNumber} - ` : ""}{account.name || "Unnamed Account"}
                         </option>
                       ))}
                     </select>
                   </td>
                   
                   <td className="px-2 py-2">
                     <input
                       type="text"
                       value={row.costCenter}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRow(row.id, 'costCenter', e.target.value)}
                       className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                       placeholder="Cost Center"
                     />
                   </td>
                   
                   <td className="px-2 py-2">
                     <input
                       type="text"
                       value={row.fullAccountNumber}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRow(row.id, 'fullAccountNumber', e.target.value)}
                       className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                       placeholder="Full Account #"
                     />
                   </td>
                   
                   <td className="px-2 py-2">
                     <input
                       type="text"
                       value={row.customerName}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRow(row.id, 'customerName', e.target.value)}
                       className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                       placeholder="Customer Name"
                     />
                   </td>
                   
                   <td className="px-2 py-2">
                     <input
                       type="text"
                       value={row.accountNumber}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRow(row.id, 'accountNumber', e.target.value)}
                       className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                       placeholder="Account #"
                     />
                   </td>
                   
                   <td className="px-2 py-2">
                     <input
                       type="text"
                       value={row.membershipNumber}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRow(row.id, 'membershipNumber', e.target.value)}
                       className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                       placeholder="Membership #"
                     />
                   </td>
                   
                   <td className="px-2 py-2">
                     <input
                       type="text"
                       value={row.personalFileNumber}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRow(row.id, 'personalFileNumber', e.target.value)}
                       className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                       placeholder="Personal File #"
                     />
                   </td>
                   
                   <td className="px-2 py-2">
                     <input
                       type="text"
                       value={row.primaryDescription}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRow(row.id, 'primaryDescription', e.target.value)}
                       className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                       placeholder="Description"
                     />
                   </td>
                   
                   <td className="px-2 py-2 text-center">
                     {rows.length > 1 && (
                       <button type="button" onClick={() => removeRow(row.id)} className="text-red-600 hover:text-red-800 text-xs">✗</button>
                     )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>

       {/* Totals Section */}
       <div className="bg-blue-100 p-4 rounded">
         <div className="flex justify-between items-center">
           <div className="flex gap-8">
             <div>
               <label className="block text-sm font-medium text-gray-700">Apportioned:</label>
               <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-right min-w-24">
                 Ksh.{getApportioned().toFixed(2)}
               </div>
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700">Shortage:</label>
               <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-right min-w-24">
                 Ksh.{getShortage().toFixed(2)}
               </div>
             </div>
           </div>
           
           <div className="flex gap-2">
             <button type="button" className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">Remove</button>
             <button type="button" className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">Add</button>
           </div>
         </div>
       </div>

       {/* Action Buttons */}
       <div className="flex justify-end gap-3">
         <button
           type="submit"
           disabled={!isValid() || submitting}
           className={`px-6 py-2 rounded text-white text-sm ${
             !isValid() || submitting ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
           }`}
         >
           {submitting ? "Creating..." : "Create"}
         </button>
       </div>
     </form>

     {message && (
       <div className={`mt-4 text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
         {message}
       </div>
     )}
   </div>
 );
};

export default PostingPage;