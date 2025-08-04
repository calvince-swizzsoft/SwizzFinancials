

import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useState } from "react";
import axios from "axios";




// Define the member form data type
interface MemberFormData {
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
  profilePicture: File | null;
}




export default function PageIntro() {
  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState<MemberFormData>({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    nationalID: "",
    occupation: "",
    maritalStatus: "",
    email: "",
    phone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    preferredContactMethod: "",
    membershipStatus: "",
    profileCompletionPercentage: 0,
    membershipCardNumber: "",
    joinDate: "",
    profilePicture: null,
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "profileCompletionPercentage"
          ? parseInt(value) || 0
          : value,
    }));
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        profilePicture: e.target.files![0],
      }));
    }
  };



  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = { ...formData, profilePicture: null }; // adjust if backend doesn't handle files
      console.log("Submitting member:", payload);
      const response = await axios.post("http://197.232.170.121:8599/api/club/postMember", payload);

      if (response.data.status === "00") {
        alert("Member added successfully!");
        closeModal();
      } else {
        console.error("API Error:", response.data.statusDescription);
        setError(response.data.statusDescription || "Failed to add member.");
      }
    } catch (err) {
      console.error("Network or server error:", err);
      setError("Failed to add member. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 lg:p-6 mb-6" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 flex items-center justify-center bg-white border border-gray-200 rounded-full dark:border-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                Member
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 xl:text-left">
                Enroll new members, track profiles, membership status, and history
              </p>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path fillRule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clipRule="evenodd" />
            </svg>
            Add New Member
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[900px] m-4">
        <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add New Member
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Fill out the form to add a new member.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[400px] overflow-y-auto px-2 pb-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <Label>Full Name</Label>
                  <Input name="fullName" value={formData.fullName} onChange={handleChange} />
                </div>
                <div>
                  <Label>Gender</Label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
                <div>
                  <Label>National ID</Label>
                  <Input name="nationalID" value={formData.nationalID} onChange={handleChange} />
                </div>
                
                <div>
                  <Label>Occupation</Label>
                  <Input name="occupation" value={formData.occupation} onChange={handleChange} />
                </div>
                <div>
                  <Label>Marital Status</Label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                
                <div>
                  <Label>Address</Label>
                  <Input name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div>
                  <Label>Emergency Contact Name</Label>
                  <Input name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />
                </div>
                <div>
                  <Label>Emergency Contact Phone</Label>
                  <Input name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} />
                </div>
                <div>
                  <Label>Preferred Contact Method</Label>
                  <Input name="preferredContactMethod" value={formData.preferredContactMethod} onChange={handleChange} />
                </div>

                <div>
                  <Label>Membership Status</Label>
                  <select
                    name="membershipStatus"
                    value={formData.membershipStatus}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <div>
                  <Label>Profile Completion %</Label>
                  <Input
                    name="profileCompletionPercentage"
                    type="number"
                    value={formData.profileCompletionPercentage.toString()}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Membership Card Number</Label>
                  <Input name="membershipCardNumber" value={formData.membershipCardNumber} onChange={handleChange} />
                </div>
                <div>
                  <Label>Join Date</Label>
                  <Input name="joinDate" type="date" value={formData.joinDate} onChange={handleChange} />
                </div>
                <div>
                  <Label>Profile Picture (optional)</Label>
                  <Input name="profilePicture" type="file" onChange={handleFileChange} />
                </div>
              </div>

              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            <div className="flex items-center gap-3 px-2 mt-2 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} disabled={loading}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Member"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}





