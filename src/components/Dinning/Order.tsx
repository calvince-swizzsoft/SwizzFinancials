import { useEffect, useState } from "react";
import axios from "axios";
import { 
 // FaConciergeBell, 
  FaSearch, FaPlus, 
  FaEllipsisV, 
  } from "react-icons/fa";
import { Modal } from "../ui/modal";
import { MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import AddMenuItemModal from "./AddMenuItemModal";



interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable?: boolean;
  categoryID?: {
    categoryID: number;
  };
}


interface Category {
  categoryID: number;
  categoryName: string;
}

interface CartItem extends MenuItem {
  qty: number;
}

export default function Order() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  


  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  //mpesa
  const [paymentMethod, setPaymentMethod] = useState("M-Pesa");
  const [phoneNumber, setPhoneNumber] = useState("254"); // start with '254' for Kenya
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [isItemModalOpen2, setIsItemModalOpen2] = useState(false);





  // Dropdown menu state
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    fetchAllCategoriesAndItems();
  }, []);

  const fetchAllCategoriesAndItems = () => {
    setLoading(true);
    axios
      .get("http://197.232.170.121:8599/api/menu-categories")
      .then((response) => {
        setCategories(response.data);

        const allItems = response.data.flatMap((cat: any) =>
          cat.menuItemsCollection.map((item: any) => ({
            id: item.itemID,
            name: item.itemName,
            description: item.description,
            price: item.price,
            image: `data:image/jpeg;base64,${item.menuImage}`,
          }))
        );
        setMenuItems(allItems);
        setFilteredItems(allItems);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load categories and menu items");
        setLoading(false);
      });
  };

  const fetchMenuItemsByCategory = (categoryId: number) => {
    setLoading(true);
    axios
      .get(`http://197.232.170.121:8599/api/menu-categories/${categoryId}`)
      .then((response) => {
        const items = response.data.menuItemsCollection.map((item: any) => ({
          id: item.itemID,
          name: item.itemName,
          description: item.description,
          price: item.price,
          image: `data:image/jpeg;base64,${item.menuImage}`,
        }));
        setMenuItems(items);
        setFilteredItems(items);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load menu items");
        setLoading(false);
      });
  };

  // Search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(menuItems);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      setFilteredItems(
        menuItems.filter(
          (item) =>
            item.name.toLowerCase().includes(lowerSearch) ||
            item.description.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [searchTerm, menuItems]);

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const exists = prevCart.find((x) => x.id === item.id);
      if (exists) {
        return prevCart.map((x) =>
          x.id === item.id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
  };

  const removeOneFromCart = (item: MenuItem) => {
    setCart((prevCart) =>
      prevCart
        .map((x) =>
          x.id === item.id ? { ...x, qty: x.qty - 1 } : x
        )
        .filter((x) => x.qty > 0)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = 2;
  const total = subtotal + tax;

  //payment
  const placeOrder = async () => {
  if (cart.length === 0) {
    alert("Cart is empty.");
    return;
  }

  if (!phoneNumber || phoneNumber.length < 10) {
    alert("Please enter a valid phone number.");
    return;
  }
  if (paymentMethod === "M-Pesa") {
  if (!phoneNumber || phoneNumber.length < 10) {
    alert("Please enter a valid M-Pesa number.");
    return;
  }
} else if (paymentMethod === "Credit Card") {
  if (!cardNumber || !expiryDate || !cvv) {
    alert("Please fill in all credit card details.");
    return;
  }
}


  if (paymentMethod === "M-Pesa") {
    setIsPlacingOrder(true);
    try {
      for (const item of cart) {
        await axios.post("http://197.232.170.121:8599/api/orders", {
          itemID: { itemID: item.id },
          quantity: item.qty,
          paymentMethod: "M-Pesa",
          phone: phoneNumber,
          orderStatus: "PENDING",
        });
      }
      Swal.fire({
        title: "Success!",
        text: "Your M-Pesa order has been placed successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });

      setCart([]);
      setPhoneNumber("254"); // reset input
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while placing the order.",
        icon: "error",
        confirmButtonText: "Retry",
      });

    } finally {
      setIsPlacingOrder(false);
    }
  } else {
    alert(`Order with ${paymentMethod} is not yet implemented.`);
  }
};




  // Handle Add/Edit Category Modal
  const openAddModal = () => {
    setEditCategory(null);
    setCategoryName("");
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditCategory(category);
    setCategoryName(category.categoryName);
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editCategory) {
        await axios.put(`http://197.232.170.121:8599/api/menu-categories/${editCategory.categoryID}`, {
          categoryName,
        });
      } else {
        await axios.post("http://197.232.170.121:8599/api/menu-categories", {
          categoryName,
        });
      }
      setIsModalOpen(false);
      fetchAllCategoriesAndItems();
    } catch (error) {
      alert("Failed to save category");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  const openEditItemModal = (item: MenuItem) => {
    setEditItem(item);
    setIsItemModalOpen(true);
  };


   

  return (
    <div className="min-h-screen p-6 border-gray-100" style={{backgroundColor:"rgb(165 165 165 / 9%)", borderRadius:"12px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"}}>
      <div className="flex justify-between items-center mb-6">
        {/* Category Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setSelectedCategory("All");
              fetchAllCategoriesAndItems();
            }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              selectedCategory === "All" ? "bg-blue-600 text-white" : "text-gray-700 border-blue-600"
            }`}
            style={{ border: "0.3px solid rgba(155, 155, 155, 0.5)" }}
          >
            All
          </button>
          {categories.map((cat) => (
            <div key={cat.categoryID} className="relative flex items-center">
              <button
                onClick={() => {
                  setSelectedCategory(cat.categoryName);
                  fetchMenuItemsByCategory(cat.categoryID);
                }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  selectedCategory === cat.categoryName ? "bg-blue-600 text-white" : "text-gray-700 border-blue-600"
                }`}
                style={{ border: "0.3px solid rgba(155, 155, 155, 0.5)" }}
              >
                {cat.categoryName}
              </button>
              <FaEllipsisV
                className="ml-2 text-gray-500 hover:text-blue-600 cursor-pointer"
                onClick={() => setOpenDropdown(openDropdown === cat.categoryID ? null : cat.categoryID)}
              />
              {openDropdown === cat.categoryID && (
                <div className="absolute top-10 right-0 bg-white shadow-md rounded border p-2 w-32 z-10">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search + Add Category */}
        <div className="flex gap-3">
          <div className="flex items-center w-64 border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>
         <hr className="border-t-2 border-white my-4" />

      {/* Menu Items */}
      <div className="grid grid-cols-12 gap-6">
        {/* Menu Section */}
        <div className="col-span-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {selectedCategory} Menu
          </h2>

          <button className="rounded-md bg-blue-600 px-4 py-2 mb-4 text-white hover:bg-blue-700 text-sm text-center font-medium" onClick={() => setIsItemModalOpen2(true)}>+ Add Menu Item</button>

          {/** add button for post menu image here  */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Edit icon positioned in top-right corner */}
                  <button
                    onClick={() => openEditItemModal(item)}
                    className="absolute top-2 right-2 bg-blue-600 p-2 rounded-full shadow hover:bg-orange-600 z-10"
                    title="Edit"
                  >
                    <MdEdit className="text-white text-sm" />
                  </button>

                  <img src={item.image} alt={item.name} className="rounded-lg w-full h-32 object-cover mb-3" />
                  <div className="text-base font-medium text-gray-700 mb-1">{item.name}</div>
                  <div className="text-sm text-gray-500 mb-2">{item.description}</div>
                  <div className="text-lg font-bold text-blue-600">${item.price}</div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm text-center font-medium"
                    >
                      + Add to Order
                    </button>
                  </div>
                </div>

              ))
            ) : (
              <div className="col-span-12 text-center text-gray-500">No items found.</div>
            )}
          </div>
        </div>

        {/* ✅ Invoice Section */}
        <div className="col-span-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Invoice</h2>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center gap-2">
                    <img src={item.image} className="rounded w-10 h-10 object-cover" alt="food" />
                    <span>{item.name} x{item.qty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeOneFromCart(item)}
                      className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>${(item.price * item.qty).toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-5" />

            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>${subtotal.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(1)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span>${total.toFixed(1)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex gap-2">
                <button
                  className={`w-full rounded-md border py-2 font-medium ${
                    paymentMethod === "Credit Card"
                      ? "border-blue-600 text-blue-600 bg-blue-50"
                      : "border-gray-400 text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setPaymentMethod("Credit Card")}
                >
                  Credit Card
                </button>
                <button
                  className={`w-full rounded-md border py-2 font-medium ${
                    paymentMethod === "Cash"
                      ? "border-blue-600 text-blue-600 bg-blue-50"
                      : "border-gray-400 text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setPaymentMethod("Cash")}
                >
                  Cash
                </button>
                <button
                  className={`w-full rounded-md border py-2 font-medium ${
                    paymentMethod === "M-Pesa"
                      ? "border-green-600 text-green-600 bg-green-50"
                      : "border-gray-400 text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setPaymentMethod("M-Pesa")}
                >
                  M-Pesa
                </button>
              </div>


{/* Dynamic Payment Fields */}
{paymentMethod === "M-Pesa" && (
  <input
    type="tel"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    placeholder="Enter M-Pesa Phone Number"
    className="w-full px-4 py-2 border border-gray-300 rounded mb-3"
  />
)}

{paymentMethod === "Credit Card" && (
  <div className="space-y-3 mb-3">
    <input
      type="text"
      value={cardNumber}
      onChange={(e) => setCardNumber(e.target.value)}
      placeholder="Card Number"
      className="w-full px-4 py-2 border border-gray-300 rounded"
    />
    <div className="flex gap-2">
      <input
        type="text"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        placeholder="MM/YY"
        className="w-1/2 px-4 py-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
        placeholder="CVV"
        className="w-1/2 px-4 py-2 border border-gray-300 rounded"
      />
    </div>
  </div>
)}

{/* Place Order Button */}
<button
  className="w-full rounded-md bg-blue-600 py-3 text-white font-semibold text-base hover:bg-blue-700 flex items-center justify-center gap-2"
  onClick={placeOrder}
  disabled={isPlacingOrder}
>
  {isPlacingOrder ? (
    <>
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      Processing...
    </>
  ) : (
    "Place An Order"
  )}
</button>


              


            </div>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[500px] m-4">
        <form onSubmit={handleCategorySubmit} className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">{editCategory ? "Edit Category" : "Add Category"}</h2>
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {editCategory ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} className="max-w-[500px] m-4">
  {editItem && (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await axios.put(`http://197.232.170.121:8599/api/menu-items/${editItem.id}`, {
            itemName: editItem.name,
            description: editItem.description,
            price: editItem.price,
            isAvailable: true,
            categoryID: {
              categoryID: editItem.categoryID?.categoryID || 1,
            },
          });
          setIsItemModalOpen(false);
          fetchAllCategoriesAndItems();
        } catch (err) {
          alert("Failed to update item");
        }
      }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4">Edit Menu Item</h2>

      <input
        type="text"
        value={editItem.name}
        onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
        placeholder="Item Name"
        required
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />

      <input
        type="text"
        value={editItem.description}
        onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
        placeholder="Description"
        required
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />

      <input
        type="number"
        value={editItem.price}
        onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })}
        placeholder="Price"
        required
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => setIsItemModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Update Item
        </button>
      </div>
    </form>
  )}
</Modal>

  <AddMenuItemModal
    isItemModalOpen2={isItemModalOpen2}
    setIsItemModalOpen2={setIsItemModalOpen2}
  />
    </div>
  );
}
