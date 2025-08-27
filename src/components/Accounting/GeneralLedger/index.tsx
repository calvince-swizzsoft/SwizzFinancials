import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal";
import LedgerForm from "./AddGeneralLedgers";

interface LedgerBalance {
  Id: string;
  Code: number;
  Description: string;
  Balance: number;
  TypeDescription: string;
  CostCenterDescription: string;
  CreatedDate: string;
}

export default function GeneralLedger() {
  const [balances, setBalances] = useState<LedgerBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/GetGeneralLeadgersBalances`,
        {
          headers: { "ngrok-skip-browser-warning": "true" },
        }
      );
      setBalances(res.data?.Data || []);
    } catch (err) {
      console.error("Failed to load ledger balances:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="p-6 mx-auto">
        <h2 className="text-xl font-semibold mb-6">General Ledger Balances</h2>

        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setIsOpen(true)}
        >
          + Post General Ledger
        </button>

        <div className="overflow-auto mt-4 max-h-[480px] border border-gray-200 rounded">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2">Code</th>
                <th className="px-4 py-2">Account Name</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Cost Center</th>
                <th className="px-4 py-2 text-right">Balance</th>
                <th className="px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : balances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No ledger balances found.
                  </td>
                </tr>
              ) : (
                balances.map((item) => (
                  <tr key={item.Id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{item.Code}</td>
                    <td className="px-4 py-2">{item.Description.trim()}</td>
                    <td className="px-4 py-2">{item.TypeDescription}</td>
                    <td className="px-4 py-2">{item.CostCenterDescription}</td>
                    <td className="px-4 py-2 text-right">
                      {item.Balance?.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(item.CreatedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ➕ Ledger Posting Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[1200px] m-4">
        <LedgerForm />
      </Modal>
    </div>
  );
}
