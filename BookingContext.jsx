// BookingContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState({
    id: null, // Booking ID from db.json
    hotelName: "",
    hotelLocation: "",
    price: 802, // Initial base price for 1 room, 1 guest
    checkInDate: new Date(),
    checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Default 1-day stay
    rooms: 1,
    guests: 1,
    perRoomPrice: 500, // Price per room
    perGuestFee: 50, // Additional fee per guest
  });

  // Automatically adjust the number of rooms based on the number of guests
  useEffect(() => {
    const totalGuests = bookingDetails.guests;
    const requiredRooms = Math.ceil(totalGuests / 3); // Each room accommodates 3 guests

    // Update only if rooms need adjustment to avoid unnecessary re-renders
    if (requiredRooms !== bookingDetails.rooms) {
      setBookingDetails((prevDetails) => ({
        ...prevDetails,
        rooms: requiredRooms > 5 ? 5 : requiredRooms, // Max 5 rooms
      }));
    }
  }, [bookingDetails.guests, bookingDetails.rooms]);

  // Dynamically calculate the total price based on rooms and guests
  useEffect(() => {
    const totalPrice =
      bookingDetails.rooms * bookingDetails.perRoomPrice +
      bookingDetails.guests * bookingDetails.perGuestFee;

    // Update only if the calculated price is different to avoid re-renders
    if (totalPrice !== bookingDetails.price) {
      setBookingDetails((prevDetails) => ({
        ...prevDetails,
        price: totalPrice,
      }));
    }
  }, [bookingDetails.rooms, bookingDetails.guests, bookingDetails.price]);

  return (
    <BookingContext.Provider value={{ bookingDetails, setBookingDetails }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
