import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from '../ui/modal'; // Adjust the path if needed
import { useNavigate } from 'react-router';

interface GuestType {
  id: number;
  fullnames: string;
  email: string;
  capacity: number;
  idNumber: string;
  createdDate: string | null;
  phone: string;
}


export default function Guest({setActiveTab}:any) {
  const [guests, setGuests] = useState<GuestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    FullNames: '',
    Email: '',
    Phone: '',
    IDNumber: '',
  });

  const fetchGuests = async () => {
    try {
      const response = await axios.get('http://197.232.170.121:8599/api/club/getGuests');
      setGuests(response.data);
    } catch (err) {
      setError('Failed to fetch guest data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://197.232.170.121:8599/api/club/guest', formData);
      setShowBookingModal(false);
      setFormData({
        FullNames: '',
        Email: '',
        Phone: '',
        IDNumber: '',
      });
      fetchGuests(); // Refresh list
    } catch (err) {
      alert('Failed to add guest');
    }
  };


  const handleGuestSelect = (guestId: number) => {
    navigate('/rooms', { state: { guestId } });
    setActiveTab('rooms')
  };

 

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 sm:text-2xl">
            Guest List
          </h3>
          <button
            onClick={() => setShowBookingModal(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Guest
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border divide-y divide-gray-200 rounded-md shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Full Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID Number</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Phone</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {guests.map((guest) => (
                  <tr key={guest.id}>
                    <td className="px-4 py-2 text-sm text-gray-800">{guest.fullnames}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{guest.email}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{guest.idNumber}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{guest.phone}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                        <button onClick={()=>handleGuestSelect(guest.id)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                            Book a Room
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Guest Modal */}
      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} className="max-w-[600px] m-4 p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Guest</h2>
        <form onSubmit={handleAddGuest} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="FullNames"
              value={formData.FullNames}
              onChange={handleInputChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="Phone"
              value={formData.Phone}
              onChange={handleInputChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="+254712345678"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">ID Number</label>
            <input
              type="text"
              name="IDNumber"
              value={formData.IDNumber}
              onChange={handleInputChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Guest
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
