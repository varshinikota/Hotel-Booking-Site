import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import hotelsData from '../../server/db.json';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './HotelDetails.css'; // Importing custom CSS
import { useBooking } from './BookingContext';

// Utility function to add days without mutating the original date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

function HotelDetails() {
  const { city, hotelId } = useParams();
  const { bookingDetails, setBookingDetails } = useBooking();
  const [hotel, setHotel] = useState(null);

  const navigate = useNavigate();

  // Define amenityIcons within the HotelDetails component to ensure it's in scope
  const amenityIcons = {
    "Free Wifi": "🌐",
    Elevator: "🏢",
    "Power Backup": "🔋",
    Spa: "💆‍♀️",
    "Swimming Pool": "🏊‍♂️",
    Gym: "🏋️‍♂️",
    Restaurant: "🍽️",
    "24/7 Front Desk": "🕰️",
    "Free Parking": "🅿️",
    "Conference Hall": "📅",
    "Air Conditioning": "❄️",
    Television: "📺",
    Geyser: "🚿",
    "Pet Friendly": "🐾",
    "Breakfast Included": "🍳",
    Bar: "🍺",
    "Room Service": "🛎️",
    "Airport Shuttle": "✈️",
    "Non-Smoking Rooms": "🚭",
    "Laundry Service": "👕",
    "Business Center": "💼",
    "Mini Bar": "🍸",
    "Breakfast Buffet": "🥞",
    "Free Breakfast": "🥐",
    "Swimming Pool Access": "🏊",
    "Free Cancellation": "❌",
    "Free Refund": "💸",
    "Shuttle Service": "🚌",
    Terrace: "🏞️",
    "Barbecue Area": "🔥",
    Garden: "🌳",
    "Spa and Wellness Center": "🧖‍♀️",
    "24-hour Security": "🔒",
    "Kid-friendly": "👶",
    "Smoking Area": "🚬",
    "Wheelchair Accessible": "♿",
    "Restaurant On-site": "🍴",
    "High-Speed Internet": "⚡️",
    "TV in Room": "📺",
    "Parking Available": "🅿️",
    "Outdoor Pool": "🏊‍♀️",
    "Free Airport Pickup": "🚕",
    "Concierge Service": "🛎️",
    "Laundry Facilities": "🧺",
    "In-room Safe": "🔒",
    "Ironing Service": "🧷",
    Babysitting: "👶🍼",
    "Massage Services": "💆",
    "Yoga Classes": "🧘‍♂️",
    "Guided Tours": "🗺️",
    "Bike Rental": "🚲",
    "Car Rental": "🚗",
    "Free Breakfast Buffet": "🍞",
    "24-hour Room Service": "🛎️🕰️",
    "Live Music": "🎶",
    Nightclub: "💃",
    "Rooftop Bar": "🍹🏙️",
    Casino: "🎰",
    "Hot Tub": "🛁",
    Sauna: "🧖‍♂️",
    Fireplace: "🔥",
    "Cable TV": "📺",
    Microwave: "🍲",
    Refrigerator: "🥶",
    Dishwasher: "🍽️",
    Toaster: "🍞",
    "Coffee Maker": "☕️",
    "Electric Kettle": "🔌☕️",
    "Hair Dryer": "💇‍♀️",
    Iron: "🧷",
    Hangers: "👕",
    "Safe Deposit Box": "🔐",
    "Valet Parking": "🚗🅿️",
    "Poolside Bar": "🍸🏊‍♂️",
    "Lounge Area": "🛋️",
    Library: "📚",
    "Game Room": "🎮",
    Arcade: "🕹️",
    "Bowling Alley": "🎳",
    Karaoke: "🎤",
    "Wine Cellar": "🍷",
    "Juice Bar": "🍹",
    "Pet Grooming": "🐾✂️",
    "Smoking Rooms": "🚭🛏️",
    "Non-Smoking Areas": "🚭🏞️",
    Helipad: "🚁",
    "Business Lounge": "💼🛋️",
    "Meeting Rooms": "📋🧑‍💼",
    "Event Space": "🎉🏟️",
    "Festival Events": "🎊",
    "Art Gallery": "🖼️",
    "Outdoor Activities": "🏞️🚴‍♀️",
    Skiing: "🎿",
    "Scuba Diving": "🤿",
    "Hiking Trails": "🥾🌲",
    Fishing: "🎣",
    "Golf Course": "⛳️",
    // Add more amenities and their corresponding emojis as needed
  };

  useEffect(() => {
    // Filter hotels based on the selected city (case-insensitive)
    const cityHotels = hotelsData.hotels.filter(
      (hotel) => hotel.city.toLowerCase() === city.toLowerCase()
    );

    // Find the selected hotel by ID (handles hotel.id as a string or number)
    const selectedHotel = cityHotels.find(
      (hotel) => String(hotel.id) === String(hotelId)
    );

    setHotel(selectedHotel || null);

    if (selectedHotel) {
      // Set the price per room based on the selected hotel
      setBookingDetails((prev) => ({
        ...prev,
        hotelName: selectedHotel.name,
        hotelLocation: selectedHotel.location,
        perRoomPrice: parseInt(selectedHotel.price.replace(/[^0-9]/g, '')) || 500, // Fallback to 500 if parsing fails
      }));
    }
  }, [city, hotelId, setBookingDetails]);

  /**
   * Calculates the total price based on check-in and check-out dates, number of rooms, and price per room.
   * Ensures at least one day is counted.
   *
   * @param {Date} checkIn - The check-in date.
   * @param {Date} checkOut - The check-out date.
   * @param {number} rooms - Number of rooms booked.
   * @param {number} pricePerRoom - Price per room.
   * @param {number} perGuestFee - Additional fee per guest.
   * @param {number} guests - Number of guests.
   * @returns {number} - The total calculated price.
   */
  const calculateTotalPrice = (checkIn, checkOut, rooms, pricePerRoom, perGuestFee, guests) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const daysOfStay = Math.max(1, Math.ceil((checkOut - checkIn) / msInDay)); // Minimum 1 day
    return Math.round(daysOfStay * (rooms * pricePerRoom + guests * perGuestFee)); // Round to the nearest integer
  };

  /**
   * Calculates the room price based on check-in and check-out dates, number of rooms, and price per room.
   *
   * @returns {number} - The calculated room price.
   */
  const calculateRoomPrice = () => {
    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const msInDay = 1000 * 60 * 60 * 24;
    const daysOfStay = Math.max(1, Math.ceil((checkOut - checkIn) / msInDay));
    return Math.round(daysOfStay * bookingDetails.rooms * bookingDetails.perRoomPrice);
  };

  /**
   * Handles changes to the check-in and check-out dates.
   *
   * @param {Date} date - The selected date.
   * @param {string} type - Type of date ('checkInDate' or 'checkOutDate').
   */
  const handleDateChange = (date, type) => {
    setBookingDetails((prev) => {
      const updatedDetails = { ...prev, [type]: date };
      updatedDetails.price = calculateTotalPrice(
        new Date(updatedDetails.checkInDate),
        new Date(updatedDetails.checkOutDate),
        updatedDetails.rooms,
        updatedDetails.perRoomPrice,
        updatedDetails.perGuestFee,
        updatedDetails.guests
      );
      return updatedDetails;
    });
  };

  /**
   * Handles changes to the number of rooms.
   * Ensures the number of rooms does not exceed 5 or fall below 1.
   *
   * @param {number} rooms - The new number of rooms.
   */
  const handleRoomsChange = (rooms) => {
    let adjustedRooms = rooms;
    if (rooms > 5) {
      adjustedRooms = 5;
      alert('You can book a maximum of 5 rooms.');
    } else if (rooms < 1) {
      adjustedRooms = 1;
    }

    setBookingDetails((prev) => ({
      ...prev,
      rooms: adjustedRooms,
      price: calculateTotalPrice(
        new Date(prev.checkInDate),
        new Date(prev.checkOutDate),
        adjustedRooms,
        prev.perRoomPrice,
        prev.perGuestFee,
        prev.guests
      ),
    }));
  };

  /**
   * Handles changes to the number of guests.
   * Automatically adjusts the number of rooms based on the number of guests (3 guests per room).
   * Ensures the number of rooms does not exceed 5.
   *
   * @param {number} guests - The new number of guests.
   */
  const handleGuestsChange = (guests) => {
    const requiredRooms = Math.ceil(guests / 3); // Each room accommodates 3 guests
    let adjustedRooms = requiredRooms;

    if (requiredRooms > 5) {
      adjustedRooms = 5;
      alert(
        'Based on the number of guests, the maximum rooms allowed are 5. Please adjust the number of guests or rooms accordingly.'
      );
    }

    setBookingDetails((prev) => ({
      ...prev,
      guests,
      rooms: adjustedRooms,
      price: calculateTotalPrice(
        new Date(prev.checkInDate),
        new Date(prev.checkOutDate),
        adjustedRooms,
        prev.perRoomPrice,
        prev.perGuestFee,
        guests
      ),
    }));
  };

  /**
   * Handles the booking process and navigates to the payment page.
   */
  const handleBooking = () => {
    // Here you can add logic to save the booking details to your backend or db.json
    // For now, we'll navigate to the payment page
    navigate('/payment');
  };

  // If the hotel is not found, display a message
  if (!hotel) {
    return (
      <div className="not-found">
        <h2>Hotel not found</h2>
      </div>
    );
  }

  // Calculate the number of days of stay for price breakdown
  const checkIn = new Date(bookingDetails.checkInDate);
  const checkOut = new Date(bookingDetails.checkOutDate);
  const msInDay = 1000 * 60 * 60 * 24;
  const daysOfStay = Math.max(1, Math.ceil((checkOut - checkIn) / msInDay));

  // Calculate room price and guests fee
  const roomPrice = bookingDetails.perRoomPrice * bookingDetails.rooms * daysOfStay;
  const guestsFee = bookingDetails.perGuestFee * bookingDetails.guests * daysOfStay;

  return (
    <div className="hotel-details-page">
      {/* Image Gallery Section */}
      <div className="image-gallery">
        <div className="main-image">
          <img src={hotel.image || '/placeholder.jpg'} alt={hotel.name} />
        </div>
        <div className="thumbnail-images">
          {hotel.additionalImages && hotel.additionalImages.length > 0 ? (
            hotel.additionalImages.map((image, index) => (
              <div key={index} className="thumbnail">
                <img src={image} alt={`Additional View ${index + 1}`} />
              </div>
            ))
          ) : (
            <div className="thumbnail">
              <img src="/placeholder.jpg" alt="No additional images available" />
            </div>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="details-section">
        <div className="left-content">
          {/* Hotel Information */}
          <h1 className="hotel-name">{hotel.name}</h1>
          <p className="hotel-location">{hotel.location}</p>
          <div className="highlight">
            Located 2 Km From Satyam Inox Patel Nagar
          </div>

          {/* Amenities Section */}
          <h2 className="section-title">Amenities</h2>
          <div className="amenities-grid">
            {hotel.amenities && hotel.amenities.length > 0 ? (
              hotel.amenities.map((amenity, index) => (
                <div key={index} className="amenity">
                  <span
                    className="icon"
                    role="img"
                    aria-label={amenity}
                    title={amenity}
                  >
                    {amenityIcons[amenity] || '✔️'}
                  </span>
                  <span className="name">{amenity}</span>
                </div>
              ))
            ) : (
              <p>No amenities listed for this hotel.</p>
            )}
          </div>

          {/* About Section */}
          <h2 className="section-title">About this Hotel</h2>
          <p className="hotel-description">
            {hotel.about ||
              'Hotel J P is a pleasant accommodation located in East Patel Nagar. Some landmarks near the hotel include Sardar Vallabhbhai Patel Hospital, Patel Nagar Junction, Laxmi Narayan Mandir, and Talkatora Garden.'}
          </p>
        </div>

        {/* Booking Section */}
        <div className="booking-section">
          {/* Price Details */}
          <div className="price-details">
            {/* Display the actual room price in red */}
            <div className="current-price">₹{roomPrice}</div>
            <div className="original-price">
              {/* Uncomment and update if needed
              <span>₹6029</span>
              <span className="discount">78% off</span>
              */}
            </div>
          </div>
          <p className="taxes">+ taxes & fees: ₹290</p>

          {/* Date Picker for Check-in */}
          <div className="date-picker-section">
            <label>Check-in Date</label>
            <DatePicker
              selected={bookingDetails.checkInDate ? new Date(bookingDetails.checkInDate) : null}
              onChange={(date) => handleDateChange(date, 'checkInDate')}
              className="date-picker-input"
              minDate={new Date()}
            />
          </div>

          {/* Date Picker for Check-out */}
          <div className="date-picker-section">
            <label>Check-out Date</label>
            <DatePicker
              selected={bookingDetails.checkOutDate ? new Date(bookingDetails.checkOutDate) : null}
              onChange={(date) => {
                if (
                  date &&
                  bookingDetails.checkInDate &&
                  date <= bookingDetails.checkInDate
                ) {
                  alert('Check-out date must be greater than check-in date.');
                } else {
                  handleDateChange(date, 'checkOutDate');
                }
              }}
              className="date-picker-input"
              minDate={
                bookingDetails.checkInDate
                  ? addDays(bookingDetails.checkInDate, 1)
                  : new Date()
              }
            />
          </div>

          {/* Rooms Input */}
          <div className="input-group">
            <label>Rooms</label>
            <input
              type="number"
              min="1"
              max="5"
              value={bookingDetails.rooms}
              onChange={(e) => handleRoomsChange(Number(e.target.value))}
            />
          </div>

          {/* Guests Input */}
          <div className="input-group">
            <label>Guests</label>
            <input
              type="number"
              min="1"
              value={bookingDetails.guests}
              onChange={(e) => handleGuestsChange(Number(e.target.value))}
            />
          </div>

          {/* Coupon Section */}
          <div className="coupon-applied">FREEDOM78 coupon applied</div>

          {/* Savings Summary */}
          <div className="savings-summary">
            <p>
              <span>Your savings</span>
              <span className="savings-amount">₹200</span>
            </p>
            <p>
              <span>Total price</span>
              <span className="total-amount">₹{roomPrice + guestsFee}</span>
            </p>
          </div>

          {/* Continue Booking Button */}
          <button
            className="book-now-button"
            onClick={handleBooking}
          >
            Continue to Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;