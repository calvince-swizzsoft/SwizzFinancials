import React, { useEffect, useState } from "react"
import axios from "axios"
import ComponentCard from "../common/ComponentCard"

interface MemberSubscription {
  subscriptionId: number
  memberId: number
  planId: number
  startDate: string
  endDate: string
  isActive: boolean
}



interface Member {
  memberID: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  nationalID: string;
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

const SubBill: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<MemberSubscription[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [memberList, setMemberList] = useState<Member[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get<MemberSubscription[]>(
          "http://102.209.56.234:8586/api/club/getAllMemberSubscription"
        )
        setSubscriptions(response.data)
      } catch (err) {
        setError("Failed to load subscriptions.")
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])





  
  useEffect(() => {
    fetch("http://102.209.56.234:8586/api/club/getAllMembers")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setMemberList(data.data);
      })
      .catch((err) => console.error("Failed to load members:", err));
  }, []);


  const getMemberName = (memberId: number): string => {
    const member = memberList.find((m) => m.memberID === memberId);
    return member ? member.fullName : "Unknown Member";
  };


  return (
    <ComponentCard title="Subscribers">
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && subscriptions.length === 0 && (
        <p className="text-gray-500">No subscriptions found.</p>
      )}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-100 text-left text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2">Subscription ID</th>
                <th className="px-4 py-2">Member ID</th>
                <th className="px-4 py-2">Member</th>
                <th className="px-4 py-2">Plan ID</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscriptions.map((sub, index) => (
                <tr
                  key={sub.subscriptionId}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                >
                  <td className="px-4 py-2">{sub.subscriptionId}</td>
                  <td className="px-4 py-2">{sub.memberId}</td>
                  <td className="px-4 py-2">{getMemberName(sub.memberId)}</td>
                  <td className="px-4 py-2">
                    {sub.planId === 1 && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                        Basic
                      </span>
                    )}
                    {sub.planId === 2 && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Standard
                      </span>
                    )}
                    {sub.planId === 3 && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
                        Premium
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">{sub.startDate}</td>
                  <td className="px-4 py-2">{sub.endDate}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                        sub.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sub.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ComponentCard>
  )
}

export default SubBill
