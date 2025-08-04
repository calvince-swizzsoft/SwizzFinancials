
import { useEffect, useState } from "react";
import axios from "axios";
import { GeneralLedgerEntry, LedgerPayload } from "./types";
import { Modal } from "../../ui/modal";
import LedgerForm from "./AddGeneralLedgers";

export default function GeneralLedger() {
  const [entries, setEntries] = useState<GeneralLedgerEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<any[]>([]);
  const [postingResponse, setPostingResponse] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // modal state

  const fetchLedgers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/GetGeneralLeadgers?pagesize=0&&pageindex=0`,
        {
          headers: { "ngrok-skip-browser-warning": "true" },
        }
      );
      setEntries(res.data.Data || []);
    } catch (err) {
      console.error("Failed to load ledgers");
    } finally {
      setLoading(false);
    }
  };

  const fetchBalances = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/GetGeneralLeadgersBalances`,
        {
          headers: { "ngrok-skip-browser-warning": "true" },
        }
      );
      setBalances(res.data.Data || []);
    } catch (err) {
      console.error("Failed to load balances");
    }
  };

  useEffect(() => {
    fetchLedgers();
    fetchBalances();
  }, []);

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">General Ledgers</h2>

        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setIsOpen(true)}
        >
          + Post General Ledger
        </button>

        {postingResponse && (
          <p className="mb-4 text-green-600">{postingResponse}</p>
        )}

        

        <h3 className="text-lg font-semibold mt-8">Ledger Balances</h3>

        <div className="overflow-auto mt-2 max-h-64 border border-gray-200 rounded">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2">Account</th>
                <th className="px-4 py-2 text-right">Debit</th>
                <th className="px-4 py-2 text-right">Credit</th>
                <th className="px-4 py-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {balances?.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{item.accountName || "N/A"}</td>
                  <td className="px-4 py-2 text-right">
                    {item.debit != null ? item.debit.toFixed(2) : "0.00"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {item.credit != null ? item.credit.toFixed(2) : "0.00"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {item.balance != null ? item.balance.toFixed(2) : "0.00"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 👉 Modal with AddGeneralLedger */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[1200px] m-4">
              <LedgerForm/>
      </Modal>
    </div>
  );
}
