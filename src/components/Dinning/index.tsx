import { useState } from "react";
import Order from "./Order";
import OrderedList from "./OrderedList";

export default function Dinning() {
  const [activeTab, setActiveTab] = useState("foodOrder");

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 dark:bg-white/[0.03] xl:px-10 xl:py-12 rounded-2xl" style={{boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"}}>

      {/* Banner */}
        <div className="mx-auto w-full mb-10 relative">
          <div className="relative rounded-2xl bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 p-6 shadow-lg flex items-center justify-between gap-6 text-white overflow-visible">
            
            {/* Text Content */}
            <div className="flex-1 z-10">
              <h2 className="text-3xl font-bold mb-2">UKC Dining Delight!</h2>
              <p className="text-lg">
                Cook smart. Track orders. Deliver perfection.
              </p>
            </div>

            {/* Image with Side Arcs */}
            <div className="absolute -top-12 right-4 w-[220px] h-[220px] z-20">
              {/* Image */}
              <img
                src="/images/chicken-for-bg.png"
                className="relative w-full h-full object-contain drop-shadow-lg z-30"
                alt="Chicken"
              />

              {/* Only Left and Right Borders */}
              <div className="absolute inset-0 rounded-full border-4 border-white opacity-40 scale-110" style={{clipPath: 'inset(20% 0 20% 0)'}}></div>
              <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 scale-140" style={{clipPath: 'inset(20% 0 20% 0)'}}></div>
              <div className="absolute inset-0 rounded-full border-4 border-white opacity-10 scale-165" style={{clipPath: 'inset(20% 0 20% 0)'}}></div>
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
        {activeTab === "foodOrder" && <Order />}
        {activeTab === "orderList" && <OrderedList/>}
      </div>

      {/* Floating Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-10px) rotate(-3deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
