// BookingDeleted.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingDeleted.css'; // Importing custom CSS

function BookingDeleted() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Navigate to the homepage or desired route
  };

  return (
    <div className="booking-deleted-container">
      {/* Deletion Confirmation Message */}
      <div className="deletion-message">
        <span className="deletion-icon">❌</span>
        <p>Your booking has been successfully canceled.</p>
      </div>

      {/* Go Home Button */}
      <div className="go-home-button-container">
        <button className="go-home-button" onClick={handleGoHome}>
          Go to Homepage
        </button>
      </div>

      {/* Informative Note */}
      <div className="informative-note">
        <h3>We're sorry to see you go!</h3>
        <p>
          If you have any questions or need assistance, please contact our support team at{' '}
          <a href="mailto:support@hotel.com">support@hotel.com</a>.
        </p>
      </div>
    </div>
  );
}

export default BookingDeleted;
