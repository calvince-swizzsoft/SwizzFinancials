import PageBreadcrumb from "../common/PageBreadCrumb";
import PageMeta from "../common/PageMeta";


interface ReportEntry {
  memberName: string;
  engagementLevel: string;
  totalPayments: number;
  outstandingBalance: number;
  lastPaymentDate: string;
  facilitiesUsed: string[];
}

const reportData: ReportEntry[] = [
  {
    memberName: "John Doe",
    engagementLevel: "High",
    totalPayments: 12000,
    outstandingBalance: 0,
    lastPaymentDate: "2024-06-25",
    facilitiesUsed: ["Gym", "Pool", "Conference Room"],
  },
  {
    memberName: "Alice Kimani",
    engagementLevel: "Medium",
    totalPayments: 9000,
    outstandingBalance: 1000,
    lastPaymentDate: "2024-06-10",
    facilitiesUsed: ["Tennis Court", "Pool"],
  },
  {
    memberName: "Mark Kiptoo",
    engagementLevel: "Low",
    totalPayments: 5000,
    outstandingBalance: 3000,
    lastPaymentDate: "2024-05-15",
    facilitiesUsed: ["Conference Room"],
  },
  {
    memberName: "Janet Wanjiku",
    engagementLevel: "High",
    totalPayments: 14000,
    outstandingBalance: 0,
    lastPaymentDate: "2024-07-01",
    facilitiesUsed: ["Pool", "Gym", "Tennis Court"],
  },
  {
    memberName: "Felix Otieno",
    engagementLevel: "Medium",
    totalPayments: 8000,
    outstandingBalance: 1500,
    lastPaymentDate: "2024-06-20",
    facilitiesUsed: ["Conference Room", "Gym"],
  },
  {
    memberName: "Grace Wambui",
    engagementLevel: "High",
    totalPayments: 13000,
    outstandingBalance: 0,
    lastPaymentDate: "2024-07-05",
    facilitiesUsed: ["Pool", "Tennis Court"],
  },
  {
    memberName: "David Omondi",
    engagementLevel: "Low",
    totalPayments: 4000,
    outstandingBalance: 6000,
    lastPaymentDate: "2024-04-22",
    facilitiesUsed: ["None"],
  },
  {
    memberName: "Emily Njeri",
    engagementLevel: "Medium",
    totalPayments: 9500,
    outstandingBalance: 500,
    lastPaymentDate: "2024-06-30",
    facilitiesUsed: ["Conference Room", "Gym"],
  },
  {
    memberName: "Brian Mwangi",
    engagementLevel: "High",
    totalPayments: 15000,
    outstandingBalance: 0,
    lastPaymentDate: "2024-07-10",
    facilitiesUsed: ["Tennis Court", "Gym"],
  },
  {
    memberName: "Lucy Achieng",
    engagementLevel: "Medium",
    totalPayments: 7800,
    outstandingBalance: 1200,
    lastPaymentDate: "2024-06-18",
    facilitiesUsed: ["Pool", "Gym"],
  },
];


export default function Reports() {
  return (
    <div>
      <PageMeta title="Reports & Analytics" description="View all performance and finance reports" />
      <PageBreadcrumb pageTitle="Reports & Analytics" />

      <div className=" rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Member Reports Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left text-gray-500 dark:text-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2 border">Member Name</th>
                <th className="px-4 py-2 border">Engagement Level</th>
                <th className="px-4 py-2 border">Total Payments (KES)</th>
                <th className="px-4 py-2 border">Outstanding Balance (KES)</th>
                <th className="px-4 py-2 border">Last Payment Date</th>
                <th className="px-4 py-2 border">Facilities Used</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((entry, index) => (
                <tr key={index} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 border font-medium">{entry.memberName}</td>
                  <td className="px-4 py-2 border">{entry.engagementLevel}</td>
                  <td className="px-4 py-2 border">{entry.totalPayments.toLocaleString()}</td>
                  <td className="px-4 py-2 border text-red-600">
                    {entry.outstandingBalance > 0 ? entry.outstandingBalance.toLocaleString() : "None"}
                  </td>
                  <td className="px-4 py-2 border">{entry.lastPaymentDate}</td>
                  <td className="px-4 py-2 border">{entry.facilitiesUsed.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
