import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaWifi, FaSwimmingPool, FaConciergeBell } from 'react-icons/fa';
import { MdRestaurant, MdLocalParking, MdSpa } from 'react-icons/md';
import hotelsData from '../../server/db.json';
import './Hotels.css'; // Importing custom CSS

function Hotels() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const cityHotels = hotelsData.hotels.filter(
      (hotel) => hotel.city.toLowerCase() === city.toLowerCase()
    );
    setHotels(cityHotels);
  }, [city]);

  const handleCardClick = (hotelId) => {
    navigate(`/hotels/${city}/${hotelId}`);
  };

  return (
    <div className="hotels-page">
      <h1 className="page-title">Hotels in {city}</h1>
      <div className="hotels-list">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="hotel-card"
            onClick={() => handleCardClick(hotel.id)}
          >
            <div className="hotel-image-container">
              <img
                src={hotel.image || '/placeholder-image.jpg'}
                alt={hotel.name}
                className="hotel-image"
              />
            </div>
            <div className="hotel-info">
              <h2 className="hotel-name">{hotel.name}</h2>
              <p className="hotel-location">{hotel.location}</p>
              <div className="hotel-rating">
                <FaStar className="star-icon" />
                <span>4.5</span>
                <span className="rating-count">(200 reviews)</span>
              </div>
              <div className="hotel-amenities">
                {(hotel.amenities || []).includes('Free Wifi') && (
                  <div className="amenity">
                    <FaWifi className="amenity-icon" />
                    <span>Free Wifi</span>
                  </div>
                )}
                {(hotel.amenities || []).includes('Swimming Pool') && (
                  <div className="amenity">
                    <FaSwimmingPool className="amenity-icon" />
                    <span>Pool</span>
                  </div>
                )}
                {(hotel.amenities || []).includes('Restaurant') && (
                  <div className="amenity">
                    <MdRestaurant className="amenity-icon" />
                    <span>Restaurant</span>
                  </div>
                )}
                {(hotel.amenities || []).includes('Spa') && (
                  <div className="amenity">
                    <MdSpa className="amenity-icon" />
                    <span>Spa</span>
                  </div>
                )}
                {/* Add more amenities as needed */}
              </div>
            </div>
            <div className="hotel-price-container">
              <p className="hotel-price">₹{hotel.price}</p>
              {hotel.originalPrice && (
                <p className="hotel-original-price">₹{hotel.originalPrice}</p>
              )}
              {hotel.discount && (
                <p className="hotel-discount">{hotel.discount} off</p>
              )}
              <button
                className="book-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(hotel.id);
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
