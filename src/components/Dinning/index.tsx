import { useState } from "react";
import { FaUtensils } from "react-icons/fa";
import Order from "./Order";

export default function Dinning() {
  const [activeTab, setActiveTab] = useState("foodOrder");

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 dark:bg-white/[0.03] xl:px-10 xl:py-12 rounded-2xl">

      {/* Banner */}
      <div className="mx-auto w-full mb-10">
        <div className="rounded-2xl bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 p-6 shadow-lg flex items-center justify-between gap-6 text-white">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">UKC Dinning Delight!</h2>
            <p className="text-lg">
              Hungry? Order your favorite meals now and enjoy fast delivery right at your table.
            </p>
          </div>
          <div className="text-6xl">
            <FaUtensils />
          </div>
        </div>
      </div>


      {/* Tabs */}
      <div className="flex justify-center space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "foodOrder"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("foodOrder")}
        >
          Food Order
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "orderList"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("orderList")}
        >
          Order List
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6 mx-auto">
        {activeTab === "foodOrder" && (   
          <Order/>
        )}

        {activeTab === "orderList" && (
          <div>
            <h4 className="text-xl font-semibold mb-4">📝 Your Orders</h4>
            <p>Here is your list of previous orders.</p>
            {/* Replace this section with your actual order list component */}
          </div>
        )}
      </div>
    </div>
  );
}



{
            /*<div>
            <h4 className="text-xl font-semibold mb-4">🍛 Choose your meal</h4>
            <p>Place your food order here.</p>
            Replace this section with your actual food ordering form/component 
            <Order/>
          </div> */
          }