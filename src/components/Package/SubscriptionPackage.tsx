
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaEdit } from 'react-icons/fa';
import { Modal } from '../ui/modal';
import { MdEdit } from "react-icons/md";

interface SubscriptionPlan {
  planId: number;
  planName: string;
  monthlyFee: number;
  lateFee: number;
  description: string;
}

export default function SubscriptionPackage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [billingType, setBillingType] = useState<'monthly' | 'quarterly'>('monthly');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

    //adding new plan
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [lateFee, setLateFee] = useState('');
  const [description, setDescription] = useState('');


  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get<SubscriptionPlan[]>(
        'http://197.232.170.121:8599/api/club/getAllSubscriptionPlan'
      );
      setPlans(res.data);
    } catch (err) {
      setError('Failed to load plans.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedPlan(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selectedPlan) return;
    setSelectedPlan({ ...selectedPlan, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!selectedPlan) return;
    try {
      await axios.put(
        `http://197.232.170.121:8594/api/club/updateSubscriptionPlan/${selectedPlan.planId}`,
        {
          ...selectedPlan,
          monthlyFee: parseFloat(selectedPlan.monthlyFee.toString()),
          lateFee: parseFloat(selectedPlan.lateFee.toString()),
        }
      );
      fetchPlans(); // refetch updated plans
      closeModal();
    } catch (err) {
      alert('Failed to update plan.');
    }
  };

  const getColorByIndex = (i: number) => {
    const styles = [
      'bg-white border border-purple-300',
      'bg-white border border-pink-300',
      'bg-white border border-indigo-300',
      'bg-gradient-to-br from-purple-100 to-purple-200 text-black',
    ];
    return styles[i % styles.length];
  };





  const handleAddPlanSubmit = async (e:any) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      'http://197.232.170.121:8599/api/club/createSubscriptionPlan',
      {
        planName,
        monthlyFee: parseFloat(monthlyFee),
        lateFee: parseFloat(lateFee),
        description,
      }
    );
    console.log(response);
    alert("Plan added successfully!");
    setAddModalOpen(false);
    // Refresh the list
    fetchPlans(); 
  } catch (error) {
    console.error("Error adding plan:", error);
    alert("Failed to add plan.");
  }
};

const handleDelete = async (planId: number) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this plan?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://197.232.170.121:8599/api/club/deleteSubscriptionPlan/${planId}`);
    alert("Plan deleted successfully.");
    fetchPlans(); // refresh plans
  } catch (error) {
    console.error("Error deleting plan:", error);
    alert("Failed to delete the plan.");
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-8 lg:px-20 rounded-2xl" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}>

      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Subscription plan</h2>
        <p className="text-gray-500 mb-8">
          List best plans, ensuring a perfect match. Need more or less? Customize the subscription for a seamless fit.
        </p>
        <div className='mb-6'>
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                onClick={() => setAddModalOpen(true)}
            >
                + Add New Plan
            </button>
        </div>

        {/* Billing toggle */}
        <div className="inline-flex mb-12 bg-white border border-gray-300 rounded-full overflow-hidden">
          <button
            onClick={() => setBillingType('monthly')}
            className={`px-6 py-2 text-sm font-medium ${
              billingType === 'monthly' ? 'bg-purple-500 text-white' : 'text-gray-700'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingType('quarterly')}
            className={`px-6 py-2 text-sm font-medium ${
              billingType === 'quarterly' ? 'bg-purple-500 text-white' : 'text-gray-700'
            }`}
          >
            Quarterly (save 10%)
          </button>
        </div>

        {loading && <p>Loading plans...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Subscription cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={plan.planId}
              className={`relative rounded-2xl p-6 shadow-md transition hover:shadow-xl ${getColorByIndex(i)}`}
            >
              <button
                onClick={() => openModal(plan)}
                className="absolute top-3 right-3 text-purple-600 hover:text-purple-800 bg-gray-100 p-2 rounded-2xl"
                title="Edit Plan"
              >
                <MdEdit />
              </button>

              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                  {plan.planName}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                KES{' '}
                {billingType === 'quarterly'
                  ? (plan.monthlyFee * 3 * 0.9).toFixed(0)
                  : plan.monthlyFee}
                <span className="text-sm font-medium text-gray-500"> /{billingType}</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              <hr className='mt-5 p-3'/>
              <ul className="text-sm text-gray-700 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <FaCheck className="text-green-600" />
                  Unlimited Facility Access
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-green-600" />
                  Late Fee: KES {plan.lateFee}
                </li>
              </ul>
              <button
                 onClick={() => handleDelete(plan.planId)}
                 className="w-full rounded-lg bg-red-600 text-white px-4 py-2 mt-4  hover:bg-red-700 transition"
                >
                    Delete
                </button>

            </div>
          ))}
        </div>
      </div>

      {/* Modal with your preferred component */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Edit Subscription Plan</h2>

          {selectedPlan && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Plan Name</label>
                  <input
                    name="planName"
                    value={selectedPlan.planName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm">Monthly Fee</label>
                  <input
                    name="monthlyFee"
                    type="number"
                    value={selectedPlan.monthlyFee}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm">Late Fee</label>
                  <input
                    name="lateFee"
                    type="number"
                    value={selectedPlan.lateFee}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm">Description</label>
                  <textarea
                    name="description"
                    value={selectedPlan.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={4}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Save Changes
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/**add new plan */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} className="max-w-[900px] m-4">
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Subscription Plan</h2>
            <form onSubmit={handleAddPlanSubmit} className="grid gap-4">
            <input
                type="text"
                placeholder="Plan Name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <input
                type="number"
                placeholder="Monthly Fee"
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <input
                type="number"
                placeholder="Late Fee"
                value={lateFee}
                onChange={(e) => setLateFee(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <div className="flex justify-end gap-3">
                <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 border rounded"
                >
                Cancel
                </button>
                <button
                type="submit"
                className=" bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                Submit
                </button>
            </div>
            </form>
        </div>
        </Modal>

    </div>
  );
}
