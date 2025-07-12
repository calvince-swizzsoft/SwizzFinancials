import { useState } from "react";
// import PageIntro from "./PageIntro";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";

export default function SubBill() {
  const [billingData, setBillingData] = useState({
    monthlyDues: 1000,
    invoicePrefix: "INV",
    lateFeePercent: 10,
    reminderDaysBeforeDue: 3,
    autoGenerateInvoices: true,
    autoSendReminders: true,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setBillingData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Saved billing config:", billingData);
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 ">
      <div className="max-w-5xl mx-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
          Subscription & Billing Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Automate dues, invoices, late fees, and payment reminders.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <Label>Monthly Dues (KES)</Label>
            <Input
              type="number"
              name="monthlyDues"
              value={billingData.monthlyDues}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Invoice Prefix</Label>
            <Input
              type="text"
              name="invoicePrefix"
              value={billingData.invoicePrefix}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Late Fee (%)</Label>
            <Input
              type="number"
              name="lateFeePercent"
              value={billingData.lateFeePercent}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Reminder Days Before Due</Label>
            <Input
              type="number"
              name="reminderDaysBeforeDue"
              value={billingData.reminderDaysBeforeDue}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoGenerateInvoices"
              name="autoGenerateInvoices"
              checked={billingData.autoGenerateInvoices}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <Label htmlFor="autoGenerateInvoices">Auto-generate Invoices</Label>
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoSendReminders"
              name="autoSendReminders"
              checked={billingData.autoSendReminders}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <Label htmlFor="autoSendReminders">Auto-send Payment Reminders</Label>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
            <Button>Save Settings</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
