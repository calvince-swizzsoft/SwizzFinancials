import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash } from "react-icons/fi";
import ChartOfAccountModal from "./ChartOfAccountModal";


// Types
type AccountStatus = "Active" | "Inactive";
type AccountType = "Asset" | "Liability" | "Revenue" | "Expense";

interface Account {
  id: string;
  name: string;
  code: string;
  type: AccountType;
  balance: number;
  status: AccountStatus;
}

interface ApiResponse {
  Success: boolean;
  Message: string;
  Data: ApiAccount[];
}

interface ApiAccount {
  Id: string;
  AccountName: string;
  AccountCode: number;
  AccountTypeDescription: string;
  IsLocked: boolean;
}

export default function QuickBooksTabsChartOfAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeTab, setActiveTab] = useState<AccountType>("Asset");
  const [loading, setLoading] = useState<boolean>(true);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          `${import.meta.env.VITE_ACCOUNT_URL}/api/values/GetChartOfAccount`,
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );

        const apiData = res.data.Data || [];

        const formattedData: Account[] = apiData
          .filter((item) =>
            ["Asset", "Liability", "Revenue", "Expense"].includes(item.AccountTypeDescription)
          )
          .map((item) => ({
            id: item.Id,
            name: item.AccountName,
            code: String(item.AccountCode),
            type: item.AccountTypeDescription as AccountType,
            // Mocking balance for now
            balance: Math.floor(Math.random() * 100000), // Replace with real balance from API
            status: item.IsLocked ? "Inactive" : "Active",
          }));

        setAccounts(formattedData);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const groupedAccounts: Record<AccountType, Account[]> = {
    Asset: accounts.filter((a) => a.type === "Asset"),
    Liability: accounts.filter((a) => a.type === "Liability"),
    Revenue: accounts.filter((a) => a.type === "Revenue"),
    Expense: accounts.filter((a) => a.type === "Expense"),
  };

  const totals: Record<AccountType, number> = {
    Asset: groupedAccounts.Asset.reduce((sum, acc) => sum + acc.balance, 0),
    Liability: groupedAccounts.Liability.reduce((sum, acc) => sum + acc.balance, 0),
    Revenue: groupedAccounts.Revenue.reduce((sum, acc) => sum + acc.balance, 0),
    Expense: groupedAccounts.Expense.reduce((sum, acc) => sum + acc.balance, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 rounded-2xl" style={{boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"}}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Chart of Accounts</h1>
          <button
          onClick={() => setIsItemModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Create Chart of Account
        </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {(["Asset", "Liability", "Revenue", "Expense"] as const).map((type) => (
            <div key={type} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm">{type}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {totals[type].toLocaleString("en-US", {
                  style: "currency",
                  currency: "Ksh",
                })}
              </h3>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          {(["Asset", "Liability", "Revenue", "Expense"] as const).map((tab) => (
            <button
              key={tab}
              className={`pb-2 px-4 font-medium transition ${
                activeTab === tab
                  ? "border-b-4 border-green-600 text-green-600"
                  : "text-gray-500 hover:text-green-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table or Loading */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading accounts...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="p-3 font-semibold">Code</th>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Balance</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedAccounts[activeTab].map((account) => (
                  <tr
                    key={account.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{account.code}</td>
                    <td className="p-3">{account.name}</td>
                    <td className="p-3 text-green-700 font-medium">
                      {account.balance.toLocaleString("en-US", {
                        style: "currency",
                        currency: "Ksh",
                      })}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          account.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td className="p-3 text-right flex gap-2 justify-end">
                      <button className="text-blue-600 hover:bg-blue-100 p-2 rounded-full">
                        <FiEdit />
                      </button>
                      <button className="text-red-600 hover:bg-red-100 p-2 rounded-full">
                        <FiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                {groupedAccounts[activeTab].length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400">
                      No accounts found in {activeTab}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ChartOfAccountModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
      />
    </div>
  );
}
