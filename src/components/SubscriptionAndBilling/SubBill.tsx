import React, { useEffect, useState } from "react";
import axios from "axios";

interface MemberSubscription {
  memberId: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  nationalId: string | null;
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
  subscriptionId: number;
  planId: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  planName: string;
  monthlyFee: number;
  lateFee: number;
  description: string;
}

const SubBill: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<MemberSubscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get<MemberSubscription[]>(
          "http://197.232.170.121:8599/api/club/subscriptionsList"
        );
        setSubscriptions(response.data);
      } catch (err) {
        setError("Failed to load subscriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.fullName.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12 shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Subscription Billing</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by member name..."
          className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && filteredSubscriptions.length === 0 && (
        <p className="text-gray-500">No subscriptions found.</p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-100 text-left text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2">Subscription ID</th>
                <th className="px-4 py-2">Member</th>
                <th className="px-4 py-2">Plan</th>
                <th className="px-4 py-2">Start</th>
                <th className="px-4 py-2">End</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubscriptions.map((sub) => (
                <React.Fragment key={sub.subscriptionId}>
                  <tr className="bg-white">
                    <td className="px-4 py-2">{sub.subscriptionId}</td>
                    <td className="px-4 py-2">{sub.fullName}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                        {sub.planName}
                      </span>
                    </td>
                    <td className="px-4 py-2">{sub.startDate}</td>
                    <td className="px-4 py-2">{sub.endDate}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                          sub.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {sub.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleRow(sub.subscriptionId)}
                        className=" text-white bg-blue-500 hover:underline text-xs  p-2 rounded-full"
                      >
                        {expandedRow === sub.subscriptionId ? "Show Less" : "Show More"}
                      </button>
                    </td>
                  </tr>

                  {expandedRow === sub.subscriptionId && (
                      <tr className="bg-blue-50 border-t border-gray-300">
                        <td colSpan={7} className="px-6 py-4 text-sm text-gray-700 border border-gray-300">
                          <div className="grid grid-cols-2 gap-4 border border-gray-200 p-4 rounded">
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Gender:</strong> {sub.gender}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Date of Birth:</strong> {sub.dateOfBirth}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>National ID:</strong> {sub.nationalId}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Occupation:</strong> {sub.occupation}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Marital Status:</strong> {sub.maritalStatus}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Email:</strong> {sub.email}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Phone:</strong> {sub.phone}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Address:</strong> {sub.address}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Emergency Contact:</strong> {sub.emergencyContactName} ({sub.emergencyContactPhone})
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Preferred Contact:</strong> {sub.preferredContactMethod}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Membership Status:</strong> {sub.membershipStatus}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Card Number:</strong> {sub.membershipCardNumber}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Join Date:</strong> {sub.joinDate}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Profile Completion:</strong> {sub.profileCompletionPercentage}%
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Monthly Fee:</strong> KES {sub.monthlyFee}
                            </p>
                            <p className="border border-gray-300 p-2 rounded bg-white">
                              <strong>Late Fee:</strong> KES {sub.lateFee}
                            </p>
                            <p className="col-span-2 border border-gray-300 p-2 rounded bg-white">
                              <strong>Description:</strong> {sub.description}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}


                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubBill;
