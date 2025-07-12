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

const dummyMembers: Member[] = [
  {
    memberID: 1,
    fullName: "John Doe",
    gender: "Male",
    dateOfBirth: "1990-01-15",
    nationalID: "12345678",
    occupation: "Software Developer",
    maritalStatus: "Single",
    email: "john.doe@example.com",
    phone: "0712345678",
    address: "123 Tech Street, Nairobi",
    emergencyContactName: "Jane Doe",
    emergencyContactPhone: "0722333444",
    preferredContactMethod: "Phone",
    membershipStatus: "Active",
    profileCompletionPercentage: 100,
    membershipCardNumber: "MCN001-JD",
    joinDate: "2023-07-01",
    profilePicture: null,
  },
  {
    memberID: 2,
    fullName: "Alice Kimani",
    gender: "Female",
    dateOfBirth: "1985-04-20",
    nationalID: "22334455",
    occupation: "Teacher",
    maritalStatus: "Married",
    email: "alice.kimani@example.com",
    phone: "0712345679",
    address: "456 School Lane, Nakuru",
    emergencyContactName: "Peter Kimani",
    emergencyContactPhone: "0722333455",
    preferredContactMethod: "Email",
    membershipStatus: "Pending",
    profileCompletionPercentage: 85,
    membershipCardNumber: "MCN002-AK",
    joinDate: "2023-06-15",
    profilePicture: null,
  },
  {
    memberID: 3,
    fullName: "Felix Otieno",
    gender: "Male",
    dateOfBirth: "1992-07-10",
    nationalID: "11223344",
    occupation: "Accountant",
    maritalStatus: "Single",
    email: "felix.otieno@example.com",
    phone: "0712345680",
    address: "789 Finance Road, Kisumu",
    emergencyContactName: "Mary Otieno",
    emergencyContactPhone: "0722333466",
    preferredContactMethod: "Phone",
    membershipStatus: "Active",
    profileCompletionPercentage: 92,
    membershipCardNumber: "MCN003-FO",
    joinDate: "2023-08-01",
    profilePicture: null,
  },
  {
    memberID: 4,
    fullName: "Grace Wambui",
    gender: "Female",
    dateOfBirth: "1994-12-01",
    nationalID: "33445566",
    occupation: "Engineer",
    maritalStatus: "Single",
    email: "grace.wambui@example.com",
    phone: "0712345681",
    address: "123 Ngong Lane, Nairobi",
    emergencyContactName: "James Wambui",
    emergencyContactPhone: "0722333477",
    preferredContactMethod: "Phone",
    membershipStatus: "Active",
    profileCompletionPercentage: 97,
    membershipCardNumber: "MCN004-GW",
    joinDate: "2023-09-10",
    profilePicture: null,
  },
  {
    memberID: 5,
    fullName: "Brian Mwangi",
    gender: "Male",
    dateOfBirth: "1991-03-25",
    nationalID: "44556677",
    occupation: "Doctor",
    maritalStatus: "Married",
    email: "brian.mwangi@example.com",
    phone: "0712345682",
    address: "456 Hospital Rd, Nairobi",
    emergencyContactName: "Sarah Mwangi",
    emergencyContactPhone: "0722333488",
    preferredContactMethod: "Phone",
    membershipStatus: "Inactive",
    profileCompletionPercentage: 60,
    membershipCardNumber: "MCN005-BM",
    joinDate: "2023-05-22",
    profilePicture: null,
  },
  {
    memberID: 6,
    fullName: "Emily Njeri",
    gender: "Female",
    dateOfBirth: "1989-11-11",
    nationalID: "55667788",
    occupation: "Nurse",
    maritalStatus: "Married",
    email: "emily.njeri@example.com",
    phone: "0712345683",
    address: "789 Wellness Way, Thika",
    emergencyContactName: "Kevin Njeri",
    emergencyContactPhone: "0722333499",
    preferredContactMethod: "Email",
    membershipStatus: "Active",
    profileCompletionPercentage: 88,
    membershipCardNumber: "MCN006-EN",
    joinDate: "2023-07-10",
    profilePicture: null,
  },
  {
    memberID: 7,
    fullName: "Mark Kiptoo",
    gender: "Male",
    dateOfBirth: "1987-06-17",
    nationalID: "66778899",
    occupation: "Lawyer",
    maritalStatus: "Single",
    email: "mark.kiptoo@example.com",
    phone: "0712345684",
    address: "123 Law Street, Eldoret",
    emergencyContactName: "Paul Kiptoo",
    emergencyContactPhone: "0722333500",
    preferredContactMethod: "Phone",
    membershipStatus: "Pending",
    profileCompletionPercentage: 70,
    membershipCardNumber: "MCN007-MK",
    joinDate: "2023-07-25",
    profilePicture: null,
  },
  {
    memberID: 8,
    fullName: "Lucy Achieng",
    gender: "Female",
    dateOfBirth: "1993-10-03",
    nationalID: "77889900",
    occupation: "Civil Servant",
    maritalStatus: "Married",
    email: "lucy.achieng@example.com",
    phone: "0712345685",
    address: "456 Public Ave, Kisii",
    emergencyContactName: "George Achieng",
    emergencyContactPhone: "0722333511",
    preferredContactMethod: "Email",
    membershipStatus: "Active",
    profileCompletionPercentage: 94,
    membershipCardNumber: "MCN008-LA",
    joinDate: "2023-08-10",
    profilePicture: null,
  },
  {
    memberID: 9,
    fullName: "David Omondi",
    gender: "Male",
    dateOfBirth: "1990-02-28",
    nationalID: "88990011",
    occupation: "Lecturer",
    maritalStatus: "Single",
    email: "david.omondi@example.com",
    phone: "0712345686",
    address: "789 Campus Road, Nairobi",
    emergencyContactName: "Nancy Omondi",
    emergencyContactPhone: "0722333522",
    preferredContactMethod: "Phone",
    membershipStatus: "Active",
    profileCompletionPercentage: 95,
    membershipCardNumber: "MCN009-DO",
    joinDate: "2023-09-01",
    profilePicture: null,
  },
  {
    memberID: 10,
    fullName: "Janet Wanjiku",
    gender: "Female",
    dateOfBirth: "1995-09-19",
    nationalID: "99001122",
    occupation: "Architect",
    maritalStatus: "Single",
    email: "janet.wanjiku@example.com",
    phone: "0712345687",
    address: "123 Design Blvd, Mombasa",
    emergencyContactName: "Daniel Wanjiku",
    emergencyContactPhone: "0722333533",
    preferredContactMethod: "Email",
    membershipStatus: "Active",
    profileCompletionPercentage: 99,
    membershipCardNumber: "MCN010-JW",
    joinDate: "2023-10-01",
    profilePicture: null,
  },
];

export default function ViewMember() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    setMembers(dummyMembers); // load dummy data immediately
  }, []);

  return (
    <div>
      <PageIntro />
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
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                Filter
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                See all
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
              {members.map((member) => (
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
        </div>
      </div>
    </div>
  );
}
