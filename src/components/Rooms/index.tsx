

import React, { useState } from 'react';
import RoomPage from './RoomPage';
import BookingPage from './BookingPage';
import Guest from './Guest';



const Rooms: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'booking' | 'guest'>('guest');

  //const changeActivetabFromChild = (data) =>{
   // setActiveTab(data)
 // }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Tab Headers */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab('guest')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'guest' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          Guest
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'rooms' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          Rooms
        </button>
        <button
          onClick={() => setActiveTab('booking')}
          className={`ml-4 px-4 py-2 font-medium ${
            activeTab === 'booking' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          Booking
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === 'rooms' ? <RoomPage /> : activeTab === 'booking' ? <BookingPage />: <Guest setActiveTab={setActiveTab}/>}
    </div>
  );
};

export default Rooms;
