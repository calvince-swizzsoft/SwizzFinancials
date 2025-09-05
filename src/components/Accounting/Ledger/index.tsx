import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";

interface Transaction {
  Id: string;
  JournalPrimaryDescription: string;
  JournalReference: string;
  Amount: number;
  Debit: number;
  Credit: number;
  BookBalance: number;
  ContraGLAccountDescription: string;
  JournalValueDate: string;
}

export default function LedgerTransactionsPage() {
  const { id } = useParams<{ id: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountName, setAccountName] = useState<string>("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Fetch transactions for this chart of account
        const res = await axios.get(
          `${import.meta.env.VITE_ACCOUNT_URL}/api/values/GeneralLedgerTransactions?chartOfAccountId=${id}`,
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );
        console.log(res.data.PageCollection)
        setTransactions(res.data.PageCollection || []);
      } catch (error) {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchAccountName = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_ACCOUNT_URL}/api/values/GetChartOfAccount`,
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );
        const account = (res.data.Data || []).find((a: any) => a.Id === id);
        setAccountName(account ? account.AccountName : "");
      } catch {
        setAccountName("");
      }
    };

    fetchTransactions();
    fetchAccountName();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 rounded-2xl">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Ledger Transactions for: <span className="text-green-700">{accountName}</span>
          </h1>
          <Link to="/ChartOfAccounts" className="text-blue-600 underline">
            &larr; Back to Chart of Accounts
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No transactions found.</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Description</th>
                  {/* <th className="p-3 font-semibold">Reference</th> */}
                  <th className="p-3 font-semibold">Debit</th>
                  <th className="p-3 font-semibold">Credit</th>
                  <th className="p-3 font-semibold">Contra Account</th>
                  {/* <th className="p-3 font-semibold">Balance</th> */}
    
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.Id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{tx.JournalValueDate}</td>
                    <td className="p-3">{tx.JournalPrimaryDescription}</td>
                    {/* <td className="p-3">{tx.JournalReference}</td> */}
                    <td className="p-3 text-green-700">{tx.Debit?.toLocaleString()}</td>
                    <td className="p-3 text-red-700">{tx.Credit?.toLocaleString()}</td>
                    {/* <td className="p-3 font-medium">{tx.BookBalance?.toLocaleString()}</td> */}
                    <td className="p-3">{tx.ContraGLAccountDescription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}