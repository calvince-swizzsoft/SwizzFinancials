import React, { useState } from "react";
import axios from "axios";
 // Replace with your actual Modal component
import Swal from "sweetalert2";
import { Modal } from "../ui/modal";

interface MenuItem {
  itemName: string;
  description: string;
  price: number;
  isAvailable: boolean;
  categoryID: {
    categoryID: number;
  };
  menuImage: string; // base64 string
}

const AddMenuItemModal = ({
  isItemModalOpen2,
  setIsItemModalOpen2,
}: {
  isItemModalOpen2: boolean;
  setIsItemModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [formData, setFormData] = useState<MenuItem>({
    itemName: "",
    description: "",
    price: 0,
    isAvailable: true,
    categoryID: { categoryID: 1 },
    menuImage: "",
  });

  const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
        ) => {
        const { name, value, type } = e.target;

        const newValue =
            type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1]; // remove data:image prefix
      setFormData((prev) => ({ ...prev, menuImage: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post("http://197.232.170.121:8599/api/menu-items", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      Swal.fire("Success", "Menu item added!", "success");
      setIsItemModalOpen2(false);
    } catch (err) {
      Swal.fire("Error", "Failed to add item", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isItemModalOpen2}
      onClose={() => setIsItemModalOpen2(false)}
      className="max-w-[500px] m-4"
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Add New Menu Item</h2>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          placeholder="Item Name"
          className="w-full mb-2 p-2 border"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full mb-2 p-2 border"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full mb-2 p-2 border"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
          />
          Available
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white mt-4 px-4 py-2 rounded"
        >
          {loading ? "Posting..." : "Post Menu Item"}
        </button>
      </div>
    </Modal>
  );
};

export default AddMenuItemModal;
