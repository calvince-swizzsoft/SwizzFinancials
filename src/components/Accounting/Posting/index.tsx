import React, { useState, useEffect } from "react";
import axios from "axios";
import { TransactionModel } from "../GeneralLedger/types";

interface ChartOfAccount {
  id: string;
  name: string;
  accountNumber: string;
}

interface BranchItem {
  id: string;
  name: string;
}

interface JournalRow {
  id: string;
  debitAmount: number;
  creditAmount: number;
  chartOfAccountId: string;
  chartOfAccountName: string;
  contraChartOfAccountId: string;
  contraChartOfAccountName: string; 
  description: string;
}

const PostingPage: React.FC = () => {
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([]);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [rows, setRows] = useState<JournalRow[]>([
    {
      id: "1",
      debitAmount: 0,
      creditAmount: 0,
      chartOfAccountId: "",
      chartOfAccountName: "",
      contraChartOfAccountId: "",
      contraChartOfAccountName: "",
      description: ""
    }
  ]);
  const [form, setForm] = useState<Partial<TransactionModel>>({
    BranchId: "",
    TransactionCode: 1,
    PrimaryDescription: "",
    Reference: "",
    ValueDate: new Date().toISOString().slice(0, 10)
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  // Fetch Chart of Accounts
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

    fetchChartOfAccounts();
    fetchBranches();
  }, []);

  const addRow = () => {
    const newRow: JournalRow = {
      id: Date.now().toString(),
      debitAmount: 0,
      creditAmount: 0,
      chartOfAccountId: "",
      chartOfAccountName: "",
      contraChartOfAccountId: "",
      contraChartOfAccountName: "",
      description: ""
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof JournalRow, value: any) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value } as JournalRow;
        if (field === 'chartOfAccountId') {
          const account = chartOfAccounts.find(acc => acc.id === value);
          updatedRow.chartOfAccountName = account?.name || "";
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  // Helper: Check if a row is self-balanced (has both chartOfAccountId and contraChartOfAccountId)
  const isRowSelfBalanced = (row: JournalRow) => {
    return (
      row.chartOfAccountId &&
      row.contraChartOfAccountId &&
      row.chartOfAccountId !== "" &&
      row.contraChartOfAccountId !== ""
    );
  };

  // Modified: Calculate total debits/credits, skipping self-balanced rows
  const getTotalDebits = () =>
    rows.reduce(
      (sum, row) =>
        isRowSelfBalanced(row) ? sum : sum + (row.debitAmount || 0),
      0
    );
  const getTotalCredits = () =>
    rows.reduce(
      (sum, row) =>
        isRowSelfBalanced(row) ? sum : sum + (row.creditAmount || 0),
      0
    );


  const isBalanced = () => Math.abs(getTotalDebits() - getTotalCredits()) < 0.01;


  const isValid = () => {
    return (
      form.BranchId &&
      form.BranchId.trim().length > 0 &&
      rows.every(
        (row) =>
          (isRowSelfBalanced(row) && (row.debitAmount > 0 || row.creditAmount > 0)) ||
          (row.chartOfAccountId &&
            (row.debitAmount > 0 || row.creditAmount > 0))
      ) &&
      isBalanced()
    );

  }

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    setSubmitting(true);
    setMessage("");

    try {
      const payload = rows.map(row=>({
        TotalValue: row.debitAmount || row.creditAmount,
        CreditAmount: row.creditAmount || 0,
        DebitAmount: row.debitAmount || 0,
        BranchId: form.BranchId!,
        TransactionCode: form.TransactionCode,
        PrimaryDescription: form.PrimaryDescription || "",
        Reference: form.Reference || "",
        ValueDate: form.ValueDate || new Date().toISOString().slice(0, 10),
        CreditChartOfAccountId: row.creditAmount > 0 ? row.chartOfAccountId : null,
        DebitChartOfAccountId: row.debitAmount > 0 ? row.chartOfAccountId : null,
        ChartOfAccountId: row.chartOfAccountId || null,
        ContraChartOfAccountId: row.contraChartOfAccountId || null,

      }));
      //console.log(payload)

      const url = `${import.meta.env.VITE_ACCOUNT_URL}/api/values/PostJournal`;
      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
      });

      //console.log(res.data)

      if (res?.data?.Success) {
        setMessage("Journal posted successfully.");
        setRows([{ id: "1", debitAmount: 0, creditAmount: 0, chartOfAccountId: "", chartOfAccountName: "", contraChartOfAccountId: "", contraChartOfAccountName: "", description: "" }]);
        setForm({ BranchId: "", TransactionCode: 1, PrimaryDescription: "", Reference: "", ValueDate: new Date().toISOString().slice(0, 10) });
      } else {
        setMessage(res?.data?.Message || "Failed to post journal.");
      }
    } catch (err: any) {
      setMessage("Error occurred while posting journal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Posting</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
            <select
              name="BranchId"
              value={form.BranchId || ""}
              onChange={handleFormChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              required
            >
              <option value="">Select Branch</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date</label>
            <input
              type="date"
              name="TransactionDate"
              value={form.ValueDate || ""}
              onChange={handleFormChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
            <input
              type="text"
              name="Reference"
              value={form.Reference || ""}
              onChange={handleFormChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="Journal reference"
            />
          </div>
        </div>

        {/* Journal Rows */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Journal Entries</h3>
            <button type="button" onClick={addRow} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">+ Add Row</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chart of Account</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Debit</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Conra Chart of Account</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2">
                      <select
                        value={row.chartOfAccountId}
                        onChange={(e) => updateRow(row.id, 'chartOfAccountId', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        required
                      >
                        <option value="">Select Account</option>
                        {chartOfAccounts.map(account => (
                          <option key={account.id} value={account.id}>
                            {account.accountNumber ? `${account.accountNumber} - ` : ""}{account.name || "Unnamed Account"}
                          </option>
                        ))}
                      </select>
                    </td>
               
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={row.debitAmount || ""}
                        onChange={(e) => updateRow(row.id, 'debitAmount', Number(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={row.creditAmount || ""}
                        onChange={(e) => updateRow(row.id, 'creditAmount', Number(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={row.contraChartOfAccountId}
                        onChange={(e) => updateRow(row.id, 'contraChartOfAccountId', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                
                      >
                        <option value="">Select Account</option>
                        {chartOfAccounts.map(account => (
                          <option key={account.id} value={account.id}>
                            {account.accountNumber ? `${account.accountNumber} - ` : ""}{account.name || "Unnamed Account"}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {rows.length > 1 && (
                        <button type="button" onClick={() => removeRow(row.id)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-3 py-2 font-medium">Totals</td>
                  <td className="px-3 py-2 text-right font-medium">{getTotalDebits().toFixed(2)}</td>
                  <td className="px-3 py-2 text-right font-medium">{getTotalCredits().toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={2} className="px-3 py-1"></td>
                  <td colSpan={2} className="px-3 py-1 text-center">
                    <span className={`text-sm font-medium ${isBalanced() ? 'text-green-600' : 'text-red-600'}`}>
                      {isBalanced() ? '✓ Balanced' : '✗ Not Balanced'}
                    </span>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Primary Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Description</label>
          <textarea
            name="PrimaryDescription"
            value={form.PrimaryDescription || ""}
            onChange={(e) => setForm(prev => ({ ...prev, PrimaryDescription: e.target.value }))}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            placeholder="Overall journal description"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!isValid() || submitting}
            className={`px-4 py-2 rounded text-white text-sm ${
              !isValid() || submitting ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Posting..." : "Post Journal"}
          </button>
        </div>
      </form>

      {message && (
        <div className="mt-4 text-sm text-gray-700">{message}</div>
      )}
    </div>
  );
};

export default PostingPage;

