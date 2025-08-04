import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal"; // adjust the path if needed

interface Advert {
  advertID?: number;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  advertType: string;
  displayLocation: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  clickCount: number;
  viewCount: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string | null;
}

const BankSetup: React.FC = () => {
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [isItemModalOpen2, setIsItemModalOpen2] = useState(false);

  const [formData, setFormData] = useState<Advert>({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    advertType: "Banner",
    displayLocation: "Homepage Top",
    startDate: "",
    endDate: "",
    isActive: true,
    priority: 1,
    clickCount: 0,
    viewCount: 0,
    createdBy: "admin",
  });

  useEffect(() => {
    fetchAdverts();
  }, []);

  const fetchAdverts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Advert[]>(
        "http://197.232.170.121:8599/api/club/getAllAdverts"
      );
      setAdverts(response.data);
    } catch (err) {
      setError("Failed to load advertisements.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://197.232.170.121:8599/api/club/createAdvert", formData);
      await fetchAdverts();
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        linkUrl: "",
        advertType: "Banner",
        displayLocation: "Homepage Top",
        startDate: "",
        endDate: "",
        isActive: true,
        priority: 1,
        clickCount: 0,
        viewCount: 0,
        createdBy: "admin",
      });
      setIsItemModalOpen2(false);
      alert("Advert created successfully.");
    } catch (err) {
      alert("Failed to create advert.");
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-10 bg-white rounded-2xl">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Club Advertisements</h2>
        <button
          onClick={() => setIsItemModalOpen2(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Advert
        </button>
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isItemModalOpen2}
        onClose={() => setIsItemModalOpen2(false)}
        className="max-w-[600px] m-4"
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <h2 className="text-lg font-semibold text-gray-700">New Advertisement</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            rows={3}
          />
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFormData({ ...formData, imageUrl: (reader.result as string).split(',')[1] });
                };
                reader.readAsDataURL(file);
              }
            }}
            className="border p-2 rounded w-full"
          />

          {/* Optional Preview */}
          {formData.imageUrl && (
            <img
              src={`data:image/jpeg;base64,${formData.imageUrl}`}
              alt="Preview"
              className="w-full h-40 object-contain border rounded mt-2"
            />
          )}

          <input
            type="text"
            name="linkUrl"
            placeholder="Link URL"
            value={formData.linkUrl}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          <div className="flex gap-2">
            <input
              type="date"
              name="startDate"
              value={formData.startDate.split("T")[0]}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value + "T00:00:00" })
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate.split("T")[0]}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value + "T23:59:59" })
              }
              className="border p-2 rounded w-full"
            />
          </div>
          <select
            name="advertType"
            value={formData.advertType}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="Banner">Banner</option>
            <option value="Popup">Popup</option>
          </select>
          <select
            name="displayLocation"
            value={formData.displayLocation}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="Homepage Top">Homepage Top</option>
            <option value="Sidebar">Sidebar</option>
          </select>
          <input
            type="number"
            name="priority"
            placeholder="Priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <span>Is Active</span>
          </label>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Submit
          </button>
        </form>
      </Modal>

      {/* Advertisement Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-center col-span-full">Loading...</p>}
        {error && <p className="text-center col-span-full text-red-500">{error}</p>}
        {adverts.map((ad) => (
          <div
            key={ad.advertID}
            className="rounded-xl overflow-hidden border border-gray-200 shadow hover:shadow-lg transition "
          >
              <img
                src={`data:image/jpeg;base64,${ad.imageUrl}`}
                alt={ad.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="font-bold text-lg text-gray-800">{ad.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{ad.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  From: {new Date(ad.startDate).toLocaleDateString()} <br />
                  To: {new Date(ad.endDate).toLocaleDateString()}
                </p>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BankSetup;
