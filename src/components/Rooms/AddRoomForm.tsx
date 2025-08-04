import { useState } from "react";
import { Modal } from "../ui/modal";
import { useLocation } from 'react-router';

interface AddRoomFormProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function AddRoomForm({ isOpen, closeModal }: AddRoomFormProps) {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [createdBy, setCreatedBy] = useState(1001);
  const [available, setAvailable] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        let base64Cleaned = result.replace(/^data:image\/\w+;base64,/, '');
        // 2. Remove only the FIRST slash "/"
        //base64Cleaned = base64Cleaned.replace('/', '');

        setImageBase64(base64Cleaned);    
      };
      reader.readAsDataURL(file);
    }
  };



  console.log(imageBase64);
  console.log(available);

  const location = useLocation();
  const guestId = location.state?.guestId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://197.232.170.121:8599/api/club/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: {guestId},
          roomNumber,
          roomType: parseInt(roomType),
          capacity: parseInt(capacity.toString()),
          createdDate: null,
          createdBy,
          image: imageBase64, // send as Base64 string or null
          available,
        }),
      });

      if (response.ok) {
        alert("Room created successfully!");
        closeModal();
      } else {
        const error = await response.json();
        console.error(error);
        alert("Failed to create room.");
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Room</h2>

        {/* Room Number */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Room Number</label>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Room Type */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Room Type (ID)</label>
          <input
            type="number"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Capacity */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Capacity</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Availability */}
        <div className="mb-4">
            <label className="inline-flex items-center">
                <input
                type="checkbox"
                checked={available === 1}
                onChange={() => setAvailable(available === 1 ? 0 : 1)}
                className="mr-2"
                />
                <span className="text-gray-700">Available</span>
            </label>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Room Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {imageBase64 && (
            <img src={`data:image/png;base64,${imageBase64}`} alt="Preview" className="mt-2 h-32 object-cover rounded" />

          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Room
          </button>
        </div>
      </form>
    </Modal>
  );
}
