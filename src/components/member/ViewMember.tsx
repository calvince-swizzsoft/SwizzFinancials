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
  const pageSize = 5;



  useEffect(() => {
  setLoading(true);
  setError("");

  fetch("http://197.232.170.121:8594/api/club/getAllMembers")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      return response.json();
    })
    .then((data: Member[]) => {
      setMembers(data);
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
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membershipCardNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ).length / pageSize
);





  return (
    <div>
      <PageIntro />
      {loading && <div className="p-6 text-center text-gray-500">Loading members...</div>}
      {error && <div className="p-6 text-center text-red-500">{error}</div>}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
        style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}>
        <div className="max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between px-5 py-3">
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
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {members
                .filter((member) =>
                  member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  member.membershipCardNumber.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((member) => (
                <TableRow key={member.memberID}>
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

        </div>
      </div>
    </div>
  );
}
