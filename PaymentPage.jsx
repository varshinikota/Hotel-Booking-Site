// PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from './BookingContext';
import { FaUserEdit, FaCreditCard, FaHotel } from 'react-icons/fa';
import './PaymentPage.css'; // Importing custom CSS

function PaymentPage() {
  const { bookingDetails, setBookingDetails } = useBooking();
  const navigate = useNavigate();

  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Local state for editing booking details
  const [name, setName] = useState(bookingDetails.name || '');
  const [email, setEmail] = useState(bookingDetails.email || '');
  const [phone, setPhone] = useState(bookingDetails.phone || '');
  const [checkInDate, setCheckInDate] = useState(
    bookingDetails.checkInDate ? new Date(bookingDetails.checkInDate) : new Date()
  );
  const [checkOutDate, setCheckOutDate] = useState(
    bookingDetails.checkOutDate
      ? new Date(bookingDetails.checkOutDate)
      : new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [rooms, setRooms] = useState(bookingDetails.rooms || 1);
  const [guests, setGuests] = useState(bookingDetails.guests || 1);

  // Maximum rooms and guests
  const MAX_ROOMS = 5;
  const MAX_GUESTS = MAX_ROOMS * 3; // Assuming 3 guests per room

  // Automatically adjust the number of rooms based on the number of guests
  useEffect(() => {
    const requiredRooms = Math.ceil(guests / 3); // Each room accommodates 3 guests
    if (requiredRooms > MAX_ROOMS) {
      setRooms(MAX_ROOMS);
      alert(
        `Based on the number of guests, the maximum rooms allowed are ${MAX_ROOMS}. Please adjust the number of guests or rooms accordingly.`
      );
    } else {
      setRooms(requiredRooms);
    }
  }, [guests]);

  // Calculate room price and guests fee dynamically
  const roomPrice = bookingDetails.perRoomPrice * rooms;
  const guestsFee = bookingDetails.perGuestFee * guests;

  // Calculate total price (roomPrice + guestsFee)
  const totalPrice = roomPrice + guestsFee;

  /**
   * Handles saving changes made in the "Your Details" section.
   */
  const handleSaveChanges = () => {
    // Check-out date validation
    if (checkOutDate <= checkInDate) {
      alert('Check-out date must be greater than check-in date.');
      return;
    }

    // Ensure rooms do not exceed MAX_ROOMS
    if (rooms > MAX_ROOMS) {
      alert(`You can book a maximum of ${MAX_ROOMS} rooms.`);
      setRooms(MAX_ROOMS);
      return;
    }

    setIsEditing(false);

    // Update booking details in BookingContext
    setBookingDetails((prev) => ({
      ...prev,
      name,
      email,
      phone,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      rooms,
      guests,
      price: totalPrice, // Update price to include roomPrice + guestsFee
    }));
  };

  /**
   * Handles booking the hotel by sending booking details to the server.
   */
  const handleBookNow = async () => {
    // Validate dates
    if (checkOutDate <= checkInDate) {
      alert('Check-out date must be greater than check-in date.');
      return;
    }

    // Validate rooms
    if (rooms > MAX_ROOMS) {
      alert(`You can book a maximum of ${MAX_ROOMS} rooms.`);
      return;
    }

    // Prepare booking data
    const payableAmount = totalPrice + 290 - 200;
    const bookingData = {
      name,
      email,
      phone,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      rooms,
      guests,
      totalPrice: payableAmount, // Payable Amount
      hotelName: bookingDetails.hotelName,
      hotelLocation: bookingDetails.hotelLocation,
      dateBooked: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:3001/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to book the hotel.');
      }

      const data = await response.json();
      console.log('Booking successful:', data);

      // Update context with booking ID
      setBookingDetails((prev) => ({
        ...prev,
        id: data.id, // Store the booking ID from the server
      }));

      // Navigate to confirmation page
      navigate('/confirmation');
    } catch (error) {
      console.error('Error booking the hotel:', error);
      alert('There was an error booking the hotel. Please try again.');
    }
  };

  /**
   * Handles changes to the number of guests.
   *
   * @param {string} value - The new number of guests as a string.
   */
  const handleGuestsChange = (value) => {
    const newGuests = parseInt(value, 10);
    if (newGuests > MAX_GUESTS) {
      alert(
        `The maximum number of guests allowed is ${MAX_GUESTS} (${MAX_ROOMS} rooms × 3 guests).`
      );
      setGuests(MAX_GUESTS);
    } else if (newGuests < 1) {
      setGuests(1);
    } else {
      setGuests(newGuests);
    }
  };

  return (
    <div className="payment-page">
      {/* Alert Banner */}
      <div className="alert-banner">
        🎉 Yay! You just saved ₹200 on this booking!
      </div>

      <div className="payment-container">
        {/* Left Section: Your Details and Payment Method */}
        <div className="left-section">
          {/* Your Details Section */}
          <div className="details-card">
            <h2 className="section-heading">
              <FaUserEdit className="icon" /> 1. Your Details
            </h2>
            {isEditing ? (
              <form className="details-form">
                {/* Name Field */}
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Phone Field */}
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                {/* Check-in Date Field */}
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    value={checkInDate.toISOString().substr(0, 10)}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      if (checkOutDate <= newDate) {
                        alert('Check-in date must be before check-out date.');
                      } else {
                        setCheckInDate(newDate);
                      }
                    }}
                    required
                  />
                </div>

                {/* Check-out Date Field */}
                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    value={checkOutDate.toISOString().substr(0, 10)}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      if (newDate <= checkInDate) {
                        alert('Check-out date must be greater than check-in date.');
                      } else {
                        setCheckOutDate(newDate);
                      }
                    }}
                    required
                  />
                </div>

                {/* Rooms Field */}
                <div className="form-group">
                  <label>Rooms</label>
                  <input
                    type="number"
                    value={rooms}
                    readOnly
                    min="1"
                    max={MAX_ROOMS}
                  />
                </div>

                {/* Guests Field */}
                <div className="form-group">
                  <label>Guests</label>
                  <input
                    type="number"
                    value={guests}
                    min="1"
                    max={MAX_GUESTS}
                    onChange={(e) => handleGuestsChange(e.target.value)}
                    required
                  />
                </div>

                {/* Save Changes Button */}
                <button
                  type="button"
                  className="save-button"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="details-display">
                {/* Display Booking Details */}
                <p>
                  <strong>Name:</strong> {name}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
                <p>
                  <strong>Phone:</strong> {phone}
                </p>
                <p>
                  <strong>Check-in:</strong> {checkInDate.toDateString()}
                </p>
                <p>
                  <strong>Check-out:</strong> {checkOutDate.toDateString()}
                </p>
                <p>
                  <strong>Rooms:</strong> {rooms}
                </p>
                <p>
                  <strong>Guests:</strong> {guests}
                </p>
                {/* Modify Button */}
                <button
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Modify
                </button>
              </div>
            )}
          </div>

          {/* Payment Method Section */}
          <div className="payment-method-card">
            <h2 className="section-heading">
              <FaCreditCard className="icon" /> 2. Choose Payment Method
            </h2>
            <p className="secure-text">100% safe and secure payments</p>
            <div className="payment-options">
              {/* Pay at Hotel Option */}
              <div className="payment-option">
                <h3>Pay at Hotel</h3>
                <p>
                  ⭐ No payment needed today. We will confirm your stay without any
                  charge. Pay directly at the hotel during your stay.
                </p>
              </div>

              {/* Pay Now Option */}
              <div className="payment-option">
                <h3>Pay Now</h3>
                <p>
                  Secure your booking now by paying online. Quick and easy payment
                  process.
                </p>
              </div>
            </div>
            {/* Book Now Button */}
            <button className="book-button" onClick={handleBookNow}>
              Book Now
            </button>
          </div>
        </div>

        {/* Right Section: Booking Summary */}
        <div className="right-section">
          <div className="summary-card">
            <h2 className="hotel-name">
              <FaHotel className="icon" /> {bookingDetails.hotelName}
            </h2>
            <p className="hotel-location">{bookingDetails.hotelLocation}</p>
            <div className="price-breakdown">
              {/* Room Price */}
              <p className="flex justify-between">
                <span>Room price for {rooms} Room{rooms > 1 ? 's' : ''}:</span>
                <span>₹{roomPrice}</span>
              </p>
              {/* Guests Fee */}
              <p className="flex justify-between">
                <span>Guests fee:</span>
                <span>₹{guestsFee}</span>
              </p>
              {/* Instant Discount */}
              <p className="flex justify-between">
                <span>Instant discount:</span>
                <span>-₹200</span>
              </p>
              {/* Taxes & Fees */}
              <p className="flex justify-between">
                <span>Taxes & Fees:</span>
                <span>₹290</span>
              </p>
              <hr className="my-2" />
              {/* Total Payable Amount */}
              <p className="total-payable font-semibold flex justify-between">
                <span>Payable Amount:</span>
                <span>₹{roomPrice + guestsFee + 290 - 200}</span>
              </p>
            </div>
            <p className="booking-notice">
              ⚡ 12 people booked this hotel today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
