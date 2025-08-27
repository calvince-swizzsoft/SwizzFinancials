
import React, { useState } from "react";
import axios from "axios";

interface GeneralLedgerEntry {
  [key: string]: string | number | boolean | null;
}

interface GeneralLedgerFormData {
  BranchId: string;
  PostingPeriodId: string;
  LedgerNumber: number;
  TotalValue: number;
  Remarks: string;
  Status: number;
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

const LedgerForm: React.FC = () => {
  const [formData, setFormData] = useState<GeneralLedgerFormData>({
    BranchId: "",
    PostingPeriodId: "",
    LedgerNumber: 0,
    TotalValue: 0,
    Remarks: "",
    Status: 0,
    CreatedBy: "",
    CreatedDate: "",
    CanSuppressMakerCheckerValidation: false,
    GeneralLedgerAuthOption: 0,
    StartDate: "",
    EndDate: "",
    CustomerAccountTypeProductCode: 0,
    RecordStatus: 0,
    GeneralLedgerEntries: [
      {
        EntryId: "",
        Amount: 0,
        Description: "",
        EntryDate: "",
        IsCredit: false,
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState<string | null>(null);

  const handleChange = (key: keyof GeneralLedgerFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEntryChange = (index: number, entryKey: string, value: string) => {
    const updatedEntries = [...formData.GeneralLedgerEntries];
    const isDate = entryKey.toLowerCase().includes("date");
    const isNumber = /^[0-9]+(\.[0-9]+)?$/.test(value);

    updatedEntries[index][entryKey] = isDate
      ? `${value}T00:00:00`
      : isNumber
      ? parseFloat(value)
      : value;

    setFormData((prev) => ({
      ...prev,
      GeneralLedgerEntries: updatedEntries,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/AddGeneralLedgers`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      setResponseMsg("General Ledger added successfully!");
      console.log("Response:", response.data);
    } catch (error: any) {
      console.error("Error:", error);
      setResponseMsg("Failed to add General Ledger.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white mx-auto rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4">General Ledger Form</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
        {Object.entries(formData).map(([key, value]) => {
          if (key === "GeneralLedgerEntries") return null;

          const isDate = key.toLowerCase().includes("date");
          const inputType =
            typeof value === "boolean"
              ? "checkbox"
              : isDate
              ? "date"
              : typeof value === "number"
              ? "number"
              : "text";

          return (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{key}</label>
              <input
                type={inputType}
                name={key}
                className="border rounded px-3 py-2"
                value={
                  typeof value === "boolean"
                    ? undefined
                    : isDate && value
                    ? String(value).substring(0, 10)
                    : value
                }
                checked={typeof value === "boolean" ? value : undefined}
                onChange={(e) => {
                  const val =
                    inputType === "checkbox"
                      ? e.target.checked
                      : inputType === "number"
                      ? parseFloat(e.target.value)
                      : e.target.value;
                  handleChange(key as keyof GeneralLedgerFormData, val);
                }}
              />
            </div>
          );
        })}

        <div className="col-span-4 mt-6">
          <h3 className="text-xl font-semibold mb-2">Ledger Entries</h3>

          {formData.GeneralLedgerEntries.map((entry, index) => (
            <div key={index} className="p-4 border rounded-md mb-4 bg-gray-50">
              <h4 className="font-semibold mb-2">Entry #{index + 1}</h4>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(entry).map(([entryKey, entryValue]) => {
                  const isDate = entryKey.toLowerCase().includes("date");
                  const inputType =
                    typeof entryValue === "boolean"
                      ? "checkbox"
                      : isDate
                      ? "date"
                      : typeof entryValue === "number"
                      ? "number"
                      : "text";

                  return (
                    <div key={entryKey} className="flex flex-col">
                      <label className="text-sm font-medium mb-1">{entryKey}</label>
                      <input
                        type={inputType}
                        name={entryKey}
                        className="border rounded px-3 py-2"
                        value={
                          typeof entryValue === "boolean"
                            ? undefined
                            : isDate && entryValue
                            ? String(entryValue).substring(0, 10)
                            : entryValue ?? ""
                        }
                        checked={typeof entryValue === "boolean" ? entryValue : undefined}
                        onChange={(e) =>
                          handleEntryChange(index, entryKey, e.target.value)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-4 flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit General Ledger"}
          </button>
        </div>
        {responseMsg && (
          <div className="col-span-4 mt-2 text-sm text-center text-green-700 font-semibold">
            {responseMsg}
          </div>
        )}
      </form>
    </div>
  );
};

export default LedgerForm;
