// Homepage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCity, FaCalendarAlt, FaUsers, FaSearch, FaUserCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Homepage.css'; // Importing custom CSS
import image from '/lg1.png'; // Ensure the path is correct
import backgroundImage from '/hotel-window.jpg'; // Ensure the path is correct
import { useAuth } from '../AuthContext.jsx';
import { useBooking } from './BookingContext.jsx'; // Import BookingContext

function SearchComponent() {
  const navigate = useNavigate();
  const { bookingDetails, setBookingDetails } = useBooking(); // Access bookingDetails and setBookingDetails from context
  const [location, setLocation] = useState('');
  const [isGuestPopupOpen, setIsGuestPopupOpen] = useState(false);
  
  // Local states for rooms and guests to manage immediate UI updates
  const [rooms, setRooms] = useState(bookingDetails.rooms);
  const [adults, setAdults] = useState(bookingDetails.guests);
  const [guestsLabel, setGuestsLabel] = useState(`${rooms} Room${rooms > 1 ? 's' : ''}, ${adults} Guest${adults > 1 ? 's' : ''}`);
  
  // Define allowed cities
  const allowedCities = ['delhi', 'kolkata', 'mumbai'];

  // Utility function to add days without mutating the original date
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const handleGuestSelection = () => {
    setGuestsLabel(`${rooms} Room${rooms > 1 ? 's' : ''}, ${adults} Guest${adults > 1 ? 's' : ''}`);
    setIsGuestPopupOpen(false);
    
    // Update booking details in context
    setBookingDetails((prev) => ({
      ...prev,
      rooms,
      guests: adults,
      price: calculateTotalPrice(
        prev.checkInDate,
        prev.checkOutDate,
        rooms,
        prev.perRoomPrice,
        prev.perGuestFee,
        adults
      ),
    }));
  };

  /**
   * Calculates the total price based on check-in and check-out dates, number of rooms, and guests.
   *
   * @param {Date} checkIn - The check-in date.
   * @param {Date} checkOut - The check-out date.
   * @param {number} rooms - Number of rooms booked.
   * @param {number} perRoomPrice - Price per room.
   * @param {number} perGuestFee - Additional fee per guest.
   * @param {number} guests - Number of guests.
   * @returns {number} - The total calculated price.
   */
  const calculateTotalPrice = (checkIn, checkOut, rooms, perRoomPrice, perGuestFee, guests) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const daysOfStay = Math.max(1, Math.ceil((checkOut - checkIn) / msInDay)); // Minimum 1 day
    return Math.round(daysOfStay * (rooms * perRoomPrice + guests * perGuestFee)); // Round to the nearest integer
  };

  const handleSearch = () => {
    const enteredCity = location.trim().toLowerCase();

    if (location.trim() === '') {
      alert('Please enter a city.');
      return;
    }
    if (!allowedCities.includes(enteredCity)) {
      alert('We currently do not have hotels in the specified city. Please choose Delhi, Kolkata, or Mumbai.');
      return;
    }
    if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
      alert('Please select both check-in and check-out dates.');
      return;
    }
    if (bookingDetails.checkOutDate <= bookingDetails.checkInDate) {
      alert('Check-out date must be greater than check-in date.');
      return;
    }

    // Capitalize the first letter for navigation
    const cityCapitalized = enteredCity.charAt(0).toUpperCase() + enteredCity.slice(1);
    navigate(`/hotels/${cityCapitalized}`);
  };

  // Effect to synchronize local room and guest states with context
  React.useEffect(() => {
    setRooms(bookingDetails.rooms);
    setAdults(bookingDetails.guests);
    setGuestsLabel(`${bookingDetails.rooms} Room${bookingDetails.rooms > 1 ? 's' : ''}, ${bookingDetails.guests} Guest${bookingDetails.guests > 1 ? 's' : ''}`);
  }, [bookingDetails.rooms, bookingDetails.guests]);

  return (
    <div className="search-component">
      <div className="search-fields">
        {/* Search by City */}
        <div className="search-field">
          <FaCity className="icon" />
          <input
            type="text"
            placeholder="Search by city"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Check-in Date */}
        <div className="search-field">
          <FaCalendarAlt className="icon" />
          <DatePicker
            selected={bookingDetails.checkInDate ? new Date(bookingDetails.checkInDate) : null}
            onChange={(date) => {
              setBookingDetails((prev) => ({
                ...prev,
                checkInDate: date,
                price: calculateTotalPrice(
                  date,
                  prev.checkOutDate,
                  prev.rooms,
                  prev.perRoomPrice,
                  prev.perGuestFee,
                  prev.guests
                ),
              }));
            }}
            placeholderText="Check-in"
            className="date-picker"
            minDate={new Date()}
          />
        </div>

        {/* Check-out Date */}
        <div className="search-field">
          <FaCalendarAlt className="icon" />
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
                setBookingDetails((prev) => ({
                  ...prev,
                  checkOutDate: date,
                  price: calculateTotalPrice(
                    prev.checkInDate,
                    date,
                    prev.rooms,
                    prev.perRoomPrice,
                    prev.perGuestFee,
                    prev.guests
                  ),
                }));
              }
            }}
            placeholderText="Check-out"
            className="date-picker"
            minDate={bookingDetails.checkInDate ? addDays(bookingDetails.checkInDate, 1) : new Date()}
          />
        </div>

        {/* Guests Selection */}
        <div className="search-field guests-field">
          <FaUsers className="icon" />
          <div
            className="guests-input"
            onClick={() => setIsGuestPopupOpen(!isGuestPopupOpen)}
          >
            {guestsLabel}
          </div>
          {isGuestPopupOpen && (
            <div className="guests-popup">
              <div className="guest-option">
                <span>Rooms</span>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rooms}
                  onChange={(e) => {
                    let newRooms = Number(e.target.value);
                    if (newRooms < 1) newRooms = 1;
                    if (newRooms > 5) newRooms = 5;
                    setRooms(newRooms);

                    // Adjust guests if necessary
                    const maxGuests = newRooms * 3;
                    if (adults > maxGuests) {
                      setAdults(maxGuests);
                      alert(`Based on the number of rooms, the maximum guests allowed are ${maxGuests}.`);
                    }
                  }}
                />
              </div>
              <div className="guest-option">
                <span>Adults</span>
                <input
                  type="number"
                  min="1"
                  value={adults}
                  onChange={(e) => {
                    let newAdults = Number(e.target.value);
                    if (newAdults < 1) newAdults = 1;

                    // Calculate required rooms based on new guests
                    const requiredRooms = Math.ceil(newAdults / 3);
                    if (requiredRooms > rooms && rooms < 5) {
                      setRooms((prevRooms) => Math.min(prevRooms + 1, 5));
                      setAdults(newAdults);
                      setGuestsLabel(`${Math.min(rooms + 1, 5)} Room${Math.min(rooms + 1, 5) > 1 ? 's' : ''}, ${newAdults} Guest${newAdults > 1 ? 's' : ''}`);
                    } else if (requiredRooms > 5) {
                      setAdults(15); // Maximum guests with 5 rooms (3 per room)
                      setRooms(5);
                      setGuestsLabel(`5 Rooms, 15 Guests`);
                      alert('Maximum of 5 rooms and 15 guests allowed.');
                    } else {
                      setAdults(newAdults);
                      setGuestsLabel(`${rooms} Room${rooms > 1 ? 's' : ''}, ${newAdults} Guest${newAdults > 1 ? 's' : ''}`);
                    }

                    // Update booking details in context
                    setBookingDetails((prev) => ({
                      ...prev,
                      rooms: Math.min(Math.ceil(newAdults / 3), 5),
                      guests: newAdults,
                      price: calculateTotalPrice(
                        prev.checkInDate,
                        prev.checkOutDate,
                        Math.min(Math.ceil(newAdults / 3), 5),
                        prev.perRoomPrice,
                        prev.perGuestFee,
                        newAdults
                      ),
                    }));
                  }}
                />
              </div>
              {/* Removed Children Selection */}
              <button className="done-button" onClick={handleGuestSelection}>
                Done
              </button>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button className="search-button" onClick={handleSearch}>
          <FaSearch className="search-icon" /> Search
        </button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Section */}
        <div className="footer-column">
          <h2>Company</h2>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="footer-column">
          <h2>Support</h2>
          <ul>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">FAQs</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Resources Section */}
        <div className="footer-column">
          <h2>Resources</h2>
          <ul>
            <li>
              <a href="#">Documentation</a>
            </li>
            <li>
              <a href="#">Community</a>
            </li>
            <li>
              <a href="#">Partners</a>
            </li>
            <li>
              <a href="#">Guides</a>
            </li>
          </ul>
        </div>

        {/* Stay Connected Section */}
        <div className="footer-column">
          <h2>Stay Connected</h2>
          <p>Subscribe to our newsletter for updates</p>
          <input type="email" placeholder="Your email" />
          <button className="subscribe-button">Subscribe</button>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 TripNest Hotels, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Homepage() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleCityClick = (city) => {
    navigate(`/hotels/${city}`);
  };

  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="header">
        <nav className="navigation">
          <div className="logo">
            <img alt="TripNest" src={image} />
          </div>
          <div className="nav-links">
            <a href="#" onClick={() => handleCityClick('Delhi')}>
              Delhi
            </a>
            <a href="#" onClick={() => handleCityClick('Kolkata')}>
              Kolkata
            </a>
            <a href="#" onClick={() => handleCityClick('Mumbai')}>
              Mumbai
            </a>
          </div>
          <div className="auth-buttons">
            {isLoggedIn ? (
              <>
                <FaUserCircle className="user-icon" />
                <button className="logout-button" onClick={handleLogoutClick}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <button className="login-button" onClick={handleLoginClick}>
                  Log in
                </button>
                <button className="signup-button">Sign up</button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to TripNest</h1>
          <p className="hero-subtitle">
            Discover and book the best hotels effortlessly
          </p>
          <SearchComponent />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
