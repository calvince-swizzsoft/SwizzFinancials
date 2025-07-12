import { useState } from "react";

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

const initialRoles: Role[] = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to the system",
    permissions: ["Manage Users", "Manage Facilities", "View Reports", "Settings"],
  },
  {
    id: 2,
    name: "Chef",
    description: "Access to kitchen and menu systems",
    permissions: ["View Menu", "Edit Menu"],
  },
  {
    id: 3,
    name: "Caddie",
    description: "Assigned to assist members in sporting facilities",
    permissions: ["View Bookings", "Assist Members"],
  },
];

const allPermissions = [
  "Manage Users",
  "Manage Facilities",
  "View Reports",
  "Settings",
  "View Menu",
  "Edit Menu",
  "View Bookings",
  "Assist Members",
];

export default function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Roles & Permissions
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Define and manage user roles and access levels in the system.
      </p>

      <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border px-4 py-2 text-left dark:text-gray-300">#</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Role</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Description</th>
            <th className="border px-4 py-2 text-left dark:text-gray-300">Permissions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.05]">
              <td className="border px-4 py-2">{role.id}</td>
              <td className="border px-4 py-2 font-medium">{role.name}</td>
              <td className="border px-4 py-2">{role.description}</td>
              <td className="border px-4 py-2">
                <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                  {role.permissions.map((perm, i) => (
                    <li key={i}>{perm}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
