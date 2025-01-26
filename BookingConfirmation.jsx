import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from './BookingContext';
import './BookingConfirmation.css'; // Importing custom CSS

function BookingConfirmation() {
  const { bookingDetails, setBookingDetails } = useBooking(); // Access booking context
  const navigate = useNavigate(); // Hook for navigation

  /**
   * Handler to cancel the booking.
   * Sends a DELETE request to the server to cancel the booking.
   * Resets booking details in the context and navigates to the BookingDeleted page upon success.
   */
  const handleDeleteBooking = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to cancel your booking? This action cannot be undone.'
    );

    if (confirmDelete) {
      console.log('Booking is being cancelled...'); // Debugging log

      if (bookingDetails.id) {
        try {
          const response = await fetch(`http://localhost:3001/bookings/${bookingDetails.id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to cancel the booking.');
          }

          console.log('Booking cancelled successfully.'); // Debugging log

          // Clear booking details from context
          setBookingDetails({
            id: null,
            hotelName: "",
            hotelLocation: "",
            price: 0, // Reset to 0 to reflect no active booking
            checkInDate: null, // Reset dates to null
            checkOutDate: null,
            rooms: 1,
            guests: 1,
            perRoomPrice: 500, // Default per room price
            perGuestFee: 50,   // Default per guest fee
          });

          // Navigate to BookingDeleted page
          navigate('/deleted');
        } catch (error) {
          console.error('Error cancelling the booking:', error);
          alert('There was an error cancelling your booking. Please try again.');
        }
      } else {
        console.error('No booking ID found.');
        alert('Unable to cancel the booking as no booking ID was found.');
      }
    }
  };

  /**
   * Formats a given date string into a more readable format.
   * Returns 'N/A' if the date is not provided.
   *
   * @param {string} dateString - The date string to format.
   * @returns {string} - The formatted date or 'N/A'.
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate the number of days of stay
  const checkIn = new Date(bookingDetails.checkInDate);
  const checkOut = new Date(bookingDetails.checkOutDate);
  const msInDay = 1000 * 60 * 60 * 24;
  const daysOfStay = Math.max(1, Math.ceil((checkOut - checkIn) / msInDay));

  // Calculate room price and guests fee
  const roomPrice = bookingDetails.perRoomPrice * bookingDetails.rooms * daysOfStay;
  const guestsFee = bookingDetails.perGuestFee * bookingDetails.guests * daysOfStay;

  /**
   * Calculates the total payable amount.
   * Formula: Room Price + Guests Fee + Taxes & Fees - Discount
   *
   * @returns {number} - The total payable amount.
   */
  const calculateTotalAmount = () => {
    const taxesAndFees = 290;
    const discount = 200;
    return roomPrice + guestsFee + taxesAndFees - discount;
  };

  /**
   * Ensures that booking details are present before rendering.
   * If not, navigates back to the homepage.
   */
  React.useEffect(() => {
    if (!bookingDetails.id) {
      // No active booking found, redirect to homepage
      navigate('/');
    }
  }, [bookingDetails.id, navigate]);

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Success Message */}
      <div className="bg-green-100 text-green-800 px-6 py-4 rounded-lg mb-6 flex items-center space-x-4">
        <span className="text-2xl">✅</span>
        <p className="text-lg font-medium">
          Your booking has been confirmed! Thank you for choosing us.
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hotel Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Hotel Details</h3>
            <p className="text-gray-600">{bookingDetails.hotelName}</p>
            <p className="text-gray-600">{bookingDetails.hotelLocation}</p>
          </div>

          {/* Stay Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Stay Information</h3>
            <p className="text-gray-600">
              <strong>Check-in:</strong> {formatDate(bookingDetails.checkInDate)}
            </p>
            <p className="text-gray-600">
              <strong>Check-out:</strong> {formatDate(bookingDetails.checkOutDate)}
            </p>
            <p className="text-gray-600">
              <strong>Guests:</strong> {bookingDetails.rooms} Room{bookingDetails.rooms > 1 ? 's' : ''}, {bookingDetails.guests} Guest{bookingDetails.guests > 1 ? 's' : ''}
            </p>
          </div>

          {/* Price Info */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Summary</h3>
            <p className="text-gray-600 flex justify-between">
              <span>Room Price ({bookingDetails.rooms} Room{bookingDetails.rooms > 1 ? 's' : ''}):</span>
              <span>₹{roomPrice}</span>
            </p>
            <p className="text-gray-600 flex justify-between">
              <span>Guests Fee:</span>
              <span>₹{guestsFee}</span>
            </p>
            <p className="text-gray-600 flex justify-between">
              <span>Discount:</span>
              <span>-₹200</span>
            </p>
            <p className="text-gray-600 flex justify-between">
              <span>Taxes & Fees:</span>
              <span>₹290</span>
            </p>
            <hr className="my-2" />
            <p className="font-semibold text-gray-800 flex justify-between">
              <span>Total Amount:</span>
              <span>₹{calculateTotalAmount()}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Cancel Booking Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleDeleteBooking}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Cancel Booking
        </button>
      </div>

      {/* Thank You Note */}
      <div className="mt-6 text-center">
        <h3 className="text-xl font-medium text-gray-800">
          We look forward to hosting you!
        </h3>
        <p className="text-gray-600 mt-2">
          If you have any questions, feel free to contact us at{' '}
          <a href="mailto:support@tripnest.com" className="text-blue-500">
            support@tripnest.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default BookingConfirmation;