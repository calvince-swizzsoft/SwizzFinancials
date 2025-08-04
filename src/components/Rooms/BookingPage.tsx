/*
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Booking {
  id: number;
  bookingType: string | null;
  memberID: number;
  guestID: number;
  roomId: number;
  checkInDate: string;
  checOutDate: string;
  bookingDate: string | null;
  transactionRef: string | null;
  status: string | null;
}

interface NewBooking {
  GuestID: number;
  RoomId: number;
  CheckInDate: string;
  ChecOutDate: string;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [newBooking, setNewBooking] = useState<NewBooking>({
    GuestID: 1,
    RoomId: 7,
    CheckInDate: "",
    ChecOutDate: "",
  });
  const [refresh, setRefresh] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://197.232.170.121:8599/api/roomBooking/getAllBookings"
      );
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [refresh]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    try {
      await axios.post(
        "http://197.232.170.121:8599/api/roomBooking/createBooking",
        newBooking
      );
      alert("Room booked successfully!");
      setNewBooking({ GuestID: 1, RoomId: 7, CheckInDate: "", ChecOutDate: "" });
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed.");
    }
  };

  return (
    <div className="min-h-screen px-5 py-7 bg-gray-50 dark:bg-black">
      <div className="max-w-5xl mx-auto mt-10">
        <h4 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">Existing Bookings</h4>
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700 dark:text-white">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">MemberID</th>
                <th className="px-4 py-2">GuestID</th>
                <th className="px-4 py-2">Room ID</th>
                <th className="px-4 py-2">Check-In</th>
                <th className="px-4 py-2">Check-Out</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2">{b.id}</td>
                  <td className="px-4 py-2">{b.memberID}</td>
                  <td className="px-4 py-2">{b.guestID}</td>
                  <td className="px-4 py-2">{b.roomId}</td>
                  <td className="px-4 py-2">{b.checkInDate}</td>
                  <td className="px-4 py-2">{b.checOutDate}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
*/


import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface GuestBooking {
  bookingId: number;
  bookingType: string | null;
  checkInDate: string;
  checOutDate: string;
  bookingDate: string | null;
  transactionRef: string | null;
  status: string | null;
  guestId: number;
  fullNames: string;
  email: string;
  phone: string;
  idNumber: string;
  guestCapacity: number;
  guestCreatedDate: string | null;
  roomId: number;
  roomNumber: string;
  isAvailable: boolean;
  image: string;
  roomCapacity: number;
  roomCreatedDate: string | null;
  createdBy: string;
  roomTypeId: number;
  roomType: string;
  pricePerNight: number;
}

const GuestBookingsTable: React.FC = () => {
  const [bookings, setBookings] = useState<GuestBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get<GuestBooking[]>('http://197.232.170.121:8599/api/club/guestBookingsList')
      .then((response) => {
        setBookings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching guest bookings:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Guest Bookings List</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Guest Name</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Room</th>
            <th className="px-4 py-2 border">Room Type</th>
            <th className="px-4 py-2 border">Check-in</th>
            <th className="px-4 py-2 border">Check-out</th>
            <th className="px-4 py-2 border">Price/Night</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.bookingId} className="text-center">
              <td className="px-4 py-2 border">
                <img
                  src={`data:image/jpeg;base64,${booking.image}`}
                  alt="Guest"
                  className="w-12 h-12 object-cover rounded mx-auto"
                />
              </td>
              <td className="px-4 py-2 border">{booking.fullNames}</td>
              <td className="px-4 py-2 border">{booking.phone}</td>
              <td className="px-4 py-2 border">{booking.email}</td>
              <td className="px-4 py-2 border">{booking.roomNumber}</td>
              <td className="px-4 py-2 border">{booking.roomType}</td>
              <td className="px-4 py-2 border">
                {new Date(booking.checkInDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border">
                {new Date(booking.checOutDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border">${booking.pricePerNight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuestBookingsTable;

