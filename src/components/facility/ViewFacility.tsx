import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import { Modal } from "../ui/modal"; // assuming modal is in this path
import Button from "../ui/button/Button";
import { useNavigate } from "react-router";

interface Facility {
  facilityId: number;
  name: string;
  description: string;
  capacity: number;
  location: string | null;
  image: string | null;
}

export default function ViewFacility() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await fetch("http://197.232.170.121:8594/api/facilities/all");
      const data = await res.json();
      setFacilities(data);
    } catch (err) {
      console.error("Failed to fetch facilities:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (facility: Facility) => {
    setSelectedFacility(facility);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedFacility(null);
    setIsOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this facility?")) return;
    try {
      await fetch(`http://197.232.170.121:8594/api/facilities/delete/${id}`, {
        method: "DELETE",
      });
      setFacilities((prev) => prev.filter((f) => f.facilityId !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (selectedFacility) {
      setSelectedFacility({
        ...selectedFacility,
        [name]: name === "capacity" ? parseInt(value) : value,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1]; // remove prefix
      if (selectedFacility) {
        setSelectedFacility({ ...selectedFacility, image: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    if (!selectedFacility) return;
    try {
      await fetch(
        `http://197.232.170.121:8594/api/facilities/update/${selectedFacility.facilityId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedFacility),
        }
      );
      closeModal();
      fetchFacilities(); // refresh
    } catch (err) {
      alert("Update failed.");
    }
  };

  const renderImage = (image: string | null) => {
    if (!image) return <div className="text-gray-400 italic">No image</div>;
    return (
      <img
        src={
          image.startsWith("http")
            ? image
            : `data:image/jpeg;base64,${image}`
        }
        alt="Facility"
        className="w-full h-40 object-cover rounded"
      />
    );
  };

  return (
    <ComponentCard title="Facilities">
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div style={{display:"flex", justifyContent:"space-between",justifyItems:"center"}} className="mb-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Facilities</h2>
            <Button onClick={()=>navigate('/FacilityRegistration')}>Add Facilities</Button>
        </div>
        <hr className="mb-6"/>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <div
                key={facility.facilityId}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
              >
                {renderImage(facility.image)}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {facility.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {facility.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Capacity:</strong> {facility.capacity}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Location:</strong>{" "}
                    {facility.location ?? (
                      <span className="italic text-gray-400">Not specified</span>
                    )}
                  </p>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    onClick={() => openModal(facility)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    onClick={() => handleDelete(facility.facilityId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Editing */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[900px] m-4">
        {selectedFacility && (
          <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-900">
            <h2 className="text-xl font-bold mb-4">Edit Facility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Facility Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedFacility.name}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={selectedFacility.capacity}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={selectedFacility.location || ""}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={selectedFacility.description}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1">Image</label>
                {selectedFacility.image && (
                  <img
                    src={
                      selectedFacility.image.startsWith("http")
                        ? selectedFacility.image
                        : `data:image/jpeg;base64,${selectedFacility.image}`
                    }
                    alt="Preview"
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Update Facility
              </button>
            </div>
          </div>
        )}
      </Modal>
    </ComponentCard>
  );
}
