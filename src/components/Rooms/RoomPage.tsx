import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddRoomForm from './AddRoomForm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal } from '../ui/modal';
import { useLocation } from 'react-router';

interface Room {
  id: number;
  roomNumber: string;
  roomType: number;
  capacity: number;
  createdDate: string | null;
  createdBy: number;
  available: boolean;
  image: string | null;
}

const RoomPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  

  const [filter, setFilter] = useState<'all' | 'available' | 'occupied'>('all');
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const location = useLocation();
  const guestId = location.state?.guestId;

  useEffect(() => {
    axios
      .get('http://197.232.170.121:8599/api/club/room')
      .then((res) => setRooms(res.data))
      .catch((err) => console.error('Failed to fetch rooms:', err));
  }, []);

  const filteredRooms = rooms.filter((room) => {
    if (filter === 'available') return room.available;
    if (filter === 'occupied') return !room.available;
    return true;
  });

  const handleBookRoom = async () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) {
      alert('Please fill all fields');
      return;
    }

    const payload = {
      GuestID: guestId,
      RoomId: selectedRoom.id,
      CheckInDate: checkInDate.toISOString().split('T')[0],
      ChecOutDate: checkOutDate.toISOString().split('T')[0],
    };

    try {
      await axios.post('http://197.232.170.121:8599/api/roomBooking/createBooking', payload);
      setBookingSuccess('Room booked successfully!');
      setShowBookingModal(false);
      setSelectedRoom(null);
      setCheckInDate(null);
      setCheckOutDate(null);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Rooms</h2>
        <button
          onClick={() => setShowAddRoomModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Room
        </button>
      </div>

      {/* Add Room Modal */}
      <Modal isOpen={showAddRoomModal} onClose={() => setShowAddRoomModal(false)} className="max-w-[600px] m-4">
        <AddRoomForm isOpen={showAddRoomModal} closeModal={() => setShowAddRoomModal(false)} />
      </Modal>

      {/* Filter */}
      <div className="mb-6">
        <span className="mr-2 font-medium">Filter:</span>
        {['all', 'available', 'occupied'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-3 py-1 mr-2 rounded ${
              filter === type
                ? type === 'available'
                  ? 'bg-green-600 text-white'
                  : type === 'occupied'
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="border rounded-xl shadow-sm hover:shadow-md bg-gray-50">
            {room.image ? (
              <img
                src={`data:image/jpeg;base64,${room.image}`}
                alt={`Room ${room.roomNumber}`}
                className="w-full h-40 object-cover rounded-t-xl"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-gray-200 text-sm text-gray-500 italic rounded-t-xl">
                No image
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">Room {room.roomNumber}</h3>
              <p className="text-sm text-gray-600">Capacity: {room.capacity}</p>
              <p className="text-sm mt-1">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    room.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {room.available ? 'Available' : 'Occupied'}
                </span>
              </p>
              <div className="mt-4 text-right">
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowBookingModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                >
                  Book Room
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} className="max-w-[600px] m-4">
        {selectedRoom && (
          <div className='p-5'>
            <h2 className="text-xl font-bold mb-4">Book Room {selectedRoom.roomNumber}</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Check-In Date</label>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                className="w-full border px-3 py-2 rounded"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Check-Out Date</label>
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                className="w-full border px-3 py-2 rounded"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleBookRoom}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Success Message */}
      {bookingSuccess && (
        <div className="mt-4 text-green-600 font-medium">{bookingSuccess}</div>
      )}
    </div>
  );
};

export default RoomPage;
