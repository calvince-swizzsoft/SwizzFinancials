import { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import PageIntro from "./PageIntro";
import { Modal } from "../ui/modal";

import { Zoomies } from 'ldrs/react'
import 'ldrs/react/Zoomies.css'
import ComponentCard from "../common/ComponentCard";
import Alert from "../ui/alert/Alert";
import Button from "../ui/button/Button";



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



export default function ViewMember() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  //const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [subscriptionForm, setSubscriptionForm] = useState({
    planID: 1,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState("");






  useEffect(() => {
  setLoading(true);
  setError("");

  //fetch(`http://102.209.56.234:8586/api/club/getAllMembers`)
  fetch(`http://197.232.170.121:8594/api/club/getAllMembers`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      return response.json();
    })
    .then((resmember: { data: Member[] }) => {
      setMembers(resmember.data);
      console.log(resmember.data);
    })
    .catch((error) => {
      console.error("Error fetching members:", error);
      setError("Something went wrong while fetching members.");
    })
    .finally(() => {
      setLoading(false);
    });
}, []);



const totalPages = Math.ceil(
  members.filter((member) =>
    (member.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (member.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (member.membershipCardNumber?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  ).length / pageSize
);


console.log(paymentPhone);

const handlePaymentSubmit = async () => {
  const payload = {
    SessionID: "1",
    Phonenumber: paymentPhone,
    Amount: "5",
    accno: "254719119560",
    TransactionType: "DirectDeposit",
    TransactionType2: "DirectDeposit",
    OrgCode: "68"
  };

 
  const subscriptionPayload = {
    memberId: selectedMember?.memberID,
    planId: subscriptionForm.planID,
    startDate: subscriptionForm.startDate,
    endDate: subscriptionForm.endDate,
    isActive: true,
  };

  try {
    const res = await fetch("http://197.232.170.121:8599/api/payments/c2brequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log(res);

    if (!res.ok) throw new Error("Payment failed");

    // Step 2: Register subscription
    const subRes = await fetch(
      "http://197.232.170.121:8594/api/club/createMemberSubscription",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscriptionPayload),
      }
    );

    if (!subRes.ok) throw new Error("Subscription failed");

    alert("Subscribed Successfully");
    closePaymentModal();
  } catch (error) {
    console.error(error);
    alert("Payment failed. Please try again.");
  }
};



 const openPaymentModal = (member: Member) => {
  setSelectedMember(member);
  setPaymentPhone(member.phone || "");
  setIsPaymentModalOpen(true);
};

  const closePaymentModal = () => {
    setPaymentPhone("");
    setIsPaymentModalOpen(false);
  };












  return (
    <div>
      {/*loading*/}
      {loading ? 
      <ComponentCard title="">
      <div className="p-3 text-center text-gray-500 bg-white rounded-xl" style={{display:"flex", justifyContent:'center',alignItems:"center",flexDirection:"column"}}>
        <div className="mb-3">Loading members...</div>
        <div>
        <Zoomies
          size="200"
          stroke="5"
          bgOpacity="0.1"
          speed="1.4"
          color="blue" 
        />
        </div>
      </div>
      </ComponentCard> 
      :
      <>
       {error ?
       <ComponentCard title="" >
        <div className="p-6 text-center text-red-500">
          <Alert
              variant="error"
              title={error}
              message=""
              showLink={false}
            />
        </div>
        </ComponentCard>
        :
      <>  
      <PageIntro />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
        style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}>
        <div className="max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between px-5 py-3 ">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Member List
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search by name, email, or card"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-800 dark:text-gray-300"
                style={{width:"350px"}}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                Export
              </button>
            </div>
          </div>
          <hr />

          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Card Number</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Join Date</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {members
                .filter((member) =>
                    (member.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                    (member.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                    (member.membershipCardNumber?.toLowerCase() || "").includes(searchTerm.toLowerCase())
                  )
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((member) => (
                <TableRow key={member.memberID}  className="odd:bg-white even:bg-blue-50 dark:odd:bg-gray-900 dark:even:bg-blue-900">
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {member.fullName}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {member.occupation}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{member.membershipCardNumber}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{member.email}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        member.membershipStatus === "Active"
                          ? "success"
                          : member.membershipStatus === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {member.membershipStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {new Date(member.joinDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                      <Button
                        onClick={() => openPaymentModal(member)}
                        size="sm"
                        variant="primary"
                      >
                        Subscribe
                      </Button>

                  </TableCell>


                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center items-center gap-3 py-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>





          <Modal isOpen={isPaymentModalOpen} onClose={closePaymentModal} className="max-w-md m-4">
  <div className="p-6">
    <h2 className="text-lg font-semibold mb-4">Initiate Payment for {selectedMember?.fullName}</h2>

    <div className="space-y-4">
      {/* Plan ID Dropdown */}
      <div>
        <label className="block text-sm font-medium">Plan ID</label>
        <select
          value={subscriptionForm.planID}
          onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, planID: +e.target.value }))}
          className="w-full mt-1 p-2 border rounded"
        >
          <option value={1}>Basic</option>
          <option value={2}>Standard</option>
          <option value={3}>Premium</option>
        </select>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium">Start Date</label>
        <input
          type="date"
          value={subscriptionForm.startDate}
          onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, startDate: e.target.value }))}
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium">End Date</label>
        <input
          type="date"
          value={subscriptionForm.endDate}
          onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, endDate: e.target.value }))}
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium">Phone Number</label>
        <input
          type="text"
          value={paymentPhone}
          onChange={(e) => setPaymentPhone(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
          placeholder="e.g., 254712345678"
        />
      </div>
    </div>

    <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={closePaymentModal}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Cancel
      </button>
      <button
        onClick={handlePaymentSubmit}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Subscribe
      </button>
    </div>
  </div>
</Modal>



        </div>
      </div>
      </>
        }
      </>
      }
    </div>
  );
}
