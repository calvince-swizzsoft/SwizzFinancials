import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../ui/modal";

interface User {
  userId: number;
  phoneNumber: string;
  email: string;
  lastLogin: string | null;
  failedLoginAttempts: number;
  accountLocked: boolean;
  createdAt: string;
  updatedAt: string | null;
  firstLogin: number;
}

export default function MobileUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    lastLogin: new Date().toISOString(),
    failedLoginAttempts: 0,
    accountLocked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const getUsers = async () => {
    try {
      const res = await axios.get<User[]>(
        "http://197.232.170.121:8599/api/club/getAllUsers"
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://197.232.170.121:8599/api/club/createUser",
        formData
      );
      setIsOpen(false);
      setFormData({
        phoneNumber: "",
        email: "",
        lastLogin: new Date().toISOString(),
        failedLoginAttempts: 0,
        accountLocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      getUsers();
    } catch (err) {
      console.error("Error creating user", err);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[900px]">
          <h3 className="mb-4 font-semibold text-gray-800 text-2xl text-center">Mobile Users</h3>
          <button
            onClick={openModal}
            className="mb-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add User
          </button>

          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Account Locked</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td className="px-4 py-2 border">{user.phoneNumber}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">
                    {user.accountLocked ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2 border">{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4">Create New User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-left text-sm font-medium">Phone Number</label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-left text-sm font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="mr-3 px-4 py-2 rounded border text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
