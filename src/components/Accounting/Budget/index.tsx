import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from '../../ui/modal';

// Interfaces
interface BudgetEntry {
  Id: string;
  BudgetId: string;
  BudgetDescription: string;
  BudgetBranchId: string;
  BudgetPostingPeriodId: string;
  BudgetPostingPeriodDurationStartDate: string;
  BudgetPostingPeriodDurationEndDate: string;
  Type: number;
  TypeDescription: string;
  ChartOfAccountId: string;
  ChartOfAccountAccountType: number;
  ChartOfAccountAccountCode: number;
  ChartOfAccountAccountName: string;
  ChartOfAccountName: string;
  ChartOfAccountCostCenterId: string;
  ChartOfAccountCostCenterDescription: string;
  LoanProductId: string;
  LoanProductDescription: string;
  Amount: number;
  MonthlyBudget: number;
  ActualToDate: number;
  BudgetToDate: number;
  BudgetBalance: number;
  Reference: string;
  CreatedBy: string | null;
  CreatedDate: string;
}

interface Budget {
  Id: string;
  PostingPeriodId: string;
  PostingPeriodDescription: string;
  PostingPeriodDurationStartDate: string;
  PostingPeriodDurationEndDate: string;
  BranchId: string;
  BranchDescription: string;
  BranchCode: number;
  Description: string;
  TotalValue: number;
  CreatedDate: string;
  BudgetEntries: BudgetEntry[];
}

export default function BudgetComponent() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form data shape for adding budget (simplified for example)
  const [formData, setFormData] = useState({
    Description: '',
    BranchId: '',
    PostingPeriodId: '',
    TotalValue: 0,
    CreatedBy: 'admin_user',
    CreatedDate: new Date().toISOString(),
    BudgetEntries: [
      {
        ChartOfAccountId: '',
        LoanProductId: '',
        Type: 1,
        Amount: 0,
        Reference: '',
        CreatedBy: 'admin_user',
        CreatedDate: new Date().toISOString(),
      },
    ],
  });

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/GetBudgets?pagesize=0&pageindex=0`,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      const data: Budget[] = res.data?.Data || [];
      setBudgets(data);
      if (data.length > 0) setSelectedBudget(data[0]);
      else setSelectedBudget(null);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      setBudgets([]);
      setSelectedBudget(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/AddBudgets`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      alert('Budget successfully added!');
      setIsOpen(false);
      fetchBudgets();
    } catch (err) {
      alert('Failed to add budget.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen  bg-gray-100 rounded-2xl shadow-lg p-4">
      {/* Left side: Budget list */}
      <div className="w-1/3 border-r p-6 overflow-y-auto rounded-l-2xl bg-white">
        <div className="flex justify-between items-center mb-6 bg-blue-100 p-3 rounded-2xl">
          <h2 className="text-xl font-semibold">Budgets</h2>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            + Add Budget
          </button>
        </div>

        {loading ? (
          <p>Loading budgets...</p>
        ) : budgets.length === 0 ? (
          <p className="text-gray-500">No budgets found.</p>
        ) : (
          budgets.map((budget) => (
            <div
              key={budget.Id}
              className={`p-4 mb-3 rounded cursor-pointer border ${
                selectedBudget?.Id === budget.Id
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              onClick={() => setSelectedBudget(budget)}
            >
              <h3 className="font-medium">{budget.Description}</h3>
              <p className="text-xs">
                <strong>Total:</strong> {budget.TotalValue.toLocaleString()}
              </p>
              <p className="text-xs">
                <strong>Period:</strong> {budget.PostingPeriodDescription}
              </p>
              <p className="text-xs">
                <strong>Branch:</strong> {budget.BranchDescription} (Code: {budget.BranchCode})
              </p>
            </div>
          ))
        )}
      </div>

      {/* Right side: Budget entries */}
      <div className="flex-1 p-6 overflow-y-auto rounded-br-2xl rounded-tr-2xl bg-white">
        <h2 className="text-xl font-semibold mb-4">Budget Entries</h2>

        {selectedBudget ? (
          <>
            <div className="mb-4 text-sm text-gray-600 space-y-1">
              <p>
                <strong>Branch:</strong> {selectedBudget.BranchDescription}
              </p>
              <p>
                <strong>Period:</strong> {selectedBudget.PostingPeriodDescription}
              </p>
              <p>
                <strong>Duration:</strong>{' '}
                {new Date(selectedBudget.PostingPeriodDurationStartDate).toLocaleDateString()} –{' '}
                {new Date(selectedBudget.PostingPeriodDurationEndDate).toLocaleDateString()}
              </p>
            </div>

            {(selectedBudget.BudgetEntries?.length ?? 0) === 0 ? (
              <p className="text-gray-600">No entries available for this budget.</p>
            ) : (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter entries by account name..."
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-2">#</th>
                      <th className="text-left p-2">Account</th>
                      <th className="text-left p-2">Loan Product</th>
                      <th className="text-left p-2">Cost Center</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBudget.BudgetEntries.filter((entry) =>
                      entry.ChartOfAccountAccountName.toLowerCase().includes(filter.toLowerCase())
                    ).map((entry, index) => (
                      <React.Fragment key={entry.Id}>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{entry.ChartOfAccountAccountName.trim()}</td>
                          <td className="p-2">{entry.LoanProductDescription}</td>
                          <td className="p-2">{entry.ChartOfAccountCostCenterDescription}</td>
                          <td className="p-2">{entry.Amount.toLocaleString()}</td>
                          <td className="p-2">
                            <button
                              onClick={() => toggleRow(entry.Id)}
                              className="text-blue-600 hover:underline"
                            >
                              {expandedRows[entry.Id] ? 'Show Less' : 'Show More'}
                            </button>
                          </td>
                        </tr>
                        {expandedRows[entry.Id] && (
                          <tr className="border-b bg-blue-50 text-sm text-gray-700">
                            <td colSpan={6} className="p-4">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <p><strong>Reference:</strong> {entry.Reference}</p>
                                <p><strong>Monthly Budget:</strong> {entry.MonthlyBudget?.toFixed(2)}</p>
                                <p><strong>Budget To Date:</strong> {entry.BudgetToDate?.toFixed(2)}</p>
                                <p><strong>Actual To Date:</strong> {entry.ActualToDate?.toFixed(2)}</p>
                                <p><strong>Created Date:</strong> {new Date(entry.CreatedDate).toLocaleDateString()}</p>
                                <p><strong>Chart Code:</strong> {entry.ChartOfAccountAccountCode}</p>
                                <p><strong>Account Type:</strong> {entry.ChartOfAccountAccountType}</p>
                                <p><strong>Type:</strong> {entry.TypeDescription}</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        ) : (
          <p>Select a budget to view its entries.</p>
        )}
      </div>

      {/* Modal: Add Budget */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[720px] p-6">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">Add New Budget</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.Description}
            onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
            placeholder="Budget Description"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            value={formData.BranchId}
            onChange={(e) => setFormData({ ...formData, BranchId: e.target.value })}
            placeholder="Branch ID"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            value={formData.PostingPeriodId}
            onChange={(e) => setFormData({ ...formData, PostingPeriodId: e.target.value })}
            placeholder="Posting Period ID"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            value={formData.TotalValue}
            onChange={(e) => setFormData({ ...formData, TotalValue: parseFloat(e.target.value) })}
            placeholder="Total Value"
            className="w-full p-2 border rounded"
            required
          />

          {formData.BudgetEntries.map((entry, idx) => (
            <div key={idx} className="border-t pt-2">
              <h4 className="font-medium text-sm">Entry {idx + 1}</h4>
              <input
                type="text"
                value={entry.Reference}
                onChange={(e) => {
                  const updated = [...formData.BudgetEntries];
                  updated[idx].Reference = e.target.value;
                  setFormData({ ...formData, BudgetEntries: updated });
                }}
                placeholder="Reference"
                className="w-full p-2 border rounded mt-2"
              />
              <input
                type="number"
                value={entry.Amount}
                onChange={(e) => {
                  const updated = [...formData.BudgetEntries];
                  updated[idx].Amount = parseFloat(e.target.value);
                  setFormData({ ...formData, BudgetEntries: updated });
                }}
                placeholder="Amount"
                className="w-full p-2 border rounded mt-2"
              />
            </div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  BudgetEntries: [
                    ...formData.BudgetEntries,
                    {
                      ChartOfAccountId: '',
                      LoanProductId: '',
                      Type: 1,
                      Amount: 0,
                      Reference: '',
                      CreatedBy: 'admin_user',
                      CreatedDate: new Date().toISOString(),
                    },
                  ],
                })
              }
              className="text-sm text-indigo-600 hover:underline"
            >
              + Add Entry
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
            >
              {submitting ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
