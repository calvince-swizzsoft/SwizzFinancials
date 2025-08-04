import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import axios from "axios";





export default function EcommerceMetrics() {

  const [subscriptions, setSubscriptions] = useState([]);


  const [memberCount, setMemberCount] = useState<number>(0);
  useEffect(() => {
  fetch(`http://197.232.170.121:8594/api/club/getAllMembers`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      return response.json();
    })
    .then((resmember) => {
      setMemberCount(resmember.data.length);
    })
    .catch((error) => {
      console.error("Error fetching members:", error);
    })
    
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          "http://197.232.170.121:8599/api/club/subscriptionsList"
        )
        setSubscriptions(response.data)
      } catch (err) {
        console.log("Failed to load subscriptions.")
      }
    }

    fetchSubscriptions()
}, []);

console.log(subscriptions);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
      style={{
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Members
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {memberCount.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        style={{
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Subscribers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {subscriptions.length}
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
