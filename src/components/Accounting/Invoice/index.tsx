import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Type definitions
interface Member {
  memberId: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  nationalId: string;
  occupation: string;
  maritalStatus: string;
  email: string;
  phone: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  preferredContactMethod: string;
  membershipStatus: string;
  profileCompletionPercentage: number;
  membershipCardNumber: string;
  joinDate: string;
  profilePicture: string | null;
}

interface Invoice {
  invoiceId: number;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  status: string;
  pdfPath: string;
  member: Member;
}

export const InvoiceComponent: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const apiURL = `http://197.232.170.121:8599/api/club/getAllInvoices`;

  useEffect(() => {
    axios.get(apiURL)
      .then(res => {
        setInvoices(res.data);
        if (res.data.length > 0) {
          setSelectedInvoice(res.data[0]); // Select the first invoice by default
        }
      })
      .catch(err => {
        setError('Failed to fetch invoices.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  const downloadPDF = () => {
    if (!selectedInvoice) return;

    const byteCharacters = atob(selectedInvoice.pdfPath);
    const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `Invoice-${selectedInvoice.invoiceId}.pdf`;
    link.click();
  };

  if (loading) return <div className="p-4 bg-white">Loading invoices...</div>;
  if (error) return <div className="p-4 text-red-500 bg-white">{error}</div>;
  if (!selectedInvoice) return <div className="p-4 bg-white">No invoice selected.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Invoices</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="space-y-2">
          {invoices.map(inv => (
            <div
              key={inv.invoiceId}
              onClick={() => setSelectedInvoice(inv)}
              className={`p-3 border rounded cursor-pointer ${
                selectedInvoice.invoiceId === inv.invoiceId
                  ? 'bg-blue-100 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <p className="font-medium">#{inv.invoiceId}</p>
              <p className="text-sm text-gray-600">{formatDate(inv.invoiceDate)}</p>
              <p className="text-sm text-gray-700 font-semibold">{inv.member.fullName}</p>
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Invoice #{selectedInvoice.invoiceId}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-lg">Invoice Details</h4>
              <p><strong>Invoice Date:</strong> {formatDate(selectedInvoice.invoiceDate)}</p>
              <p><strong>Due Date:</strong> {formatDate(selectedInvoice.dueDate)}</p>
              <p><strong>Status:</strong> <span className="uppercase">{selectedInvoice.status}</span></p>
              <p><strong>Total Amount:</strong> ${selectedInvoice.totalAmount.toFixed(2)}</p>
            </div>

            <div>
              <h4 className="font-medium text-lg">Member Information</h4>
              <p><strong>Name:</strong> {selectedInvoice.member.fullName}</p>
              <p><strong>Email:</strong> {selectedInvoice.member.email}</p>
              <p><strong>Phone:</strong> {selectedInvoice.member.phone}</p>
              <p><strong>Membership Card:</strong> {selectedInvoice.member.membershipCardNumber}</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium mb-2">Invoice PDF</h4>
            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Download PDF
            </button>

            <div className="mt-4 border rounded shadow-sm h-[600px]">
              <iframe
                title="Invoice PDF"
                src={`data:application/pdf;base64,${selectedInvoice.pdfPath}`}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
