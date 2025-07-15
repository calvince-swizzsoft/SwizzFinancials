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

const SubBill: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<MemberSubscription[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get<MemberSubscription[]>(
          "http://197.232.170.121:8594/api/club/getAllMemberSubscription"
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

  return (
    <ComponentCard title="Member Subscriptions">
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
                  <td className="px-4 py-2">{sub.planId}</td>
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
