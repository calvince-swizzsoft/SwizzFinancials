import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddRoomForm from './AddRoomForm';

interface Room {
  id: number;
  roomNumber: string;
  roomType: number;
  capacity: number;
  createdDate: string | null;
  createdBy: number;
  available: boolean;
  image: string | null; // Base64 image
}

const RoomPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get('http://197.232.170.121:8599/api/club/room')
      .then((res) => setRooms(res.data))
      .catch((err) => console.error('Failed to fetch rooms:', err));
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Rooms</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Room
        </button>
      </div>

      <AddRoomForm isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />

      {/* Table Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Rooms</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  {room.image ? (
                    <img
                      src={`data:image/jpeg;base64,${room.image}`}
                      alt={`Room ${room.roomNumber}`}
                      className="h-16 w-24 object-cover rounded-md border"
                    />
                  ) : (
                    <span className="text-gray-400 italic text-sm">No image</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{room.roomNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{room.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      room.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {room.available ? 'Available' : 'Occupied'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomPage;
