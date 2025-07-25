
import { useState } from "react";
import { FaUtensils, FaCoffee, FaCocktail, FaConciergeBell } from 'react-icons/fa'

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends MenuItem {
  qty: number;
}

export default function Order() {
  const menu: MenuItem[] = [
    { id: 1, name: "Pasta Bolognese", price: 50.5, image: "public/images/Pasta-Bolognese-TIMG.jpg", category: "Lunch" },
    { id: 2, name: "Spicy Fried Chicken", price: 45.7, image: "public/images/poultry-yangnyeom-dak-pixabay-641881-4x3-1.jpg", category: "Lunch" },
    { id: 3, name: "Grilled Steak", price: 80.0, image: "public/images/Perfect-Grilled-Steak-with-Herb-Butter-iowagirleats-Featured-1200x2-1.jpg", category: "Dinner" },
    { id: 4, name: "Fish And Chips", price: 90.4, image: "public/images/463a982e-32c9-4e28-9259-99311da16106.jpeg", category: "Dinner" },
    { id: 5, name: "Beef Bourguignon", price: 75.5, image: "public/images/beef_bourguignon_1.webp", category: "Dinner" },
    { id: 6, name: "Spaghetti Carbonara", price: 35.3, image: "public/images/spaghetti-carbonara-recipe-snippet.jpg", category: "Lunch" },
    { id: 7, name: "Orange Juice", price: 15.0, image: "public/images/Orangejuice.jpg", category: "Drinks" },
    { id: 8, name: "Pancakes", price: 25.0, image: "public/images/Sunday Pancakes Recipe NZ Chelsea Sugar.jpg", category: "Breakfast" }
  ];


  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>([]);

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
    setCart((prevCart) => {
      return prevCart
        .map((x) =>
          x.id === item.id ? { ...x, qty: x.qty - 1 } : x
        )
        .filter((x) => x.qty > 0);
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = 2;
  const total = subtotal + tax;

  const filteredMenu =
  selectedCategory.toLowerCase() === "all"
    ? menu
    : menu.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50 p-6 border-gray-100" >
      <div className="mb-8 flex flex-wrap gap-3 justify-center sm:justify-start">
            {[
              { key: "All", icon: <FaConciergeBell />, label: "All" },
              { key: "Breakfast", icon: <FaCoffee />, label: "Breakfast" },
              { key: "Lunch", icon: <FaUtensils />, label: "Lunch" },
              { key: "Drinks", icon: <FaCocktail />, label: "Drinks" },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition 
                  ${
                    selectedCategory === key
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-700/50"
                      : " text-gray-700 border-blue-600"
                  }`}
                  style={{border:"0.3px solid rgba(155, 155, 155, 0.5)"}}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Menu Section */}
        <div className="col-span-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{selectedCategory} Menu</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <img src={item.image} alt={item.name} className="rounded-lg w-full h-32 object-cover mb-3" />
                <div className="text-base font-medium text-gray-700 mb-1">
                  {item.name}
                </div>
                <div className="text-lg font-bold text-blue-600">${item.price}</div>
                <button
                  onClick={() => addToCart(item)}
                  className="mt-3 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm font-medium"
                >
                  + Add to Order
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Section */}
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
                <button className="w-full rounded-md border border-blue-600 text-blue-600 py-2 font-medium hover:bg-blue-50">
                  Credit Card
                </button>
                <button className="w-full rounded-md border border-gray-400 text-gray-600 py-2 font-medium hover:bg-gray-50">
                  Cash
                </button>
              </div>
              <button className="w-full rounded-md bg-blue-600 py-3 text-white font-semibold text-base hover:bg-blue-700">
                Place An Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
