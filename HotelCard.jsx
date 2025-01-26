'use client';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import image from '/TripNest-2.png';
import backgroundImage from '/hotel-window.jpg';

// HotelCard Component
function HotelCard({ hotel }) {
  return (
    <div className="border rounded-lg shadow-lg p-4 flex flex-col bg-white">
      <img
        src={hotel.image || '/placeholder-image.jpg'}
        alt={hotel.name}
        className="rounded-lg mb-4 h-40 w-full object-cover"
      />
      <h3 className="font-semibold text-lg">{hotel.name}</h3>
      <p className="text-gray-500 text-sm">{hotel.location}</p>
      <p className="text-green-600 font-bold text-lg mt-2">
        ₹{hotel.price} <span className="line-through text-gray-400 text-sm">₹{hotel.originalPrice}</span> {hotel.discount} off
      </p>
      <p className="text-sm text-gray-500 mt-1">+ ₹{hotel.taxes} taxes per room per night</p>
      <div className="mt-2">
        <p className="text-gray-700 text-sm font-semibold">Amenities:</p>
        <ul className="text-gray-500 text-sm">
          {hotel.amenities.map((amenity, index) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex justify-between">
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded">View Details</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Book Now</button>
      </div>
    </div>
  );
}

// CityHotels Component
function CityHotels({ city, hotels }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{city} Hotels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </div>
    </section>
  );
}

// Mock Data for Hotels
const hotelData = {
  Delhi: [
    {
      name: 'Townhouse Chhatarpur Near Metro Park',
      location: 'Chhatarpur, Delhi',
      price: 830,
      originalPrice: 3097,
      discount: '72%',
      taxes: 189,
      amenities: ['Elevator', 'Free Wifi', 'Geyser', '+5 more'],
      image: '', // Add the image URL here
    },
    {
      name: 'Super Hotel O Rohini Sector 20',
      location: 'Puth Kalan, Delhi',
      price: 817,
      originalPrice: 3065,
      discount: '73%',
      taxes: 146,
      amenities: ['Free Wifi', 'Geyser', 'Power backup', '+4 more'],
      image: '', // Add the image URL here
    },
    {
      name: 'Hotel O Rohini Sector 20 Near Maharaja Agrasen Institute',
      location: 'Rohini, Delhi',
      price: 724,
      originalPrice: 3157,
      discount: '71%',
      taxes: 169,
      amenities: ['Elevator', 'Free Wifi', 'Geyser', '+3 more'],
      image: '', // Add the image URL here
    },
  ],
  Kolkata: [
    {
      name: 'The Park Hotel',
      location: 'Park Street, Kolkata',
      price: 1200,
      originalPrice: 4000,
      discount: '70%',
      taxes: 300,
      amenities: ['Pool', 'Free Wifi', 'Spa', '+3 more'],
      image: '', // Add the image URL here
    },
    // Add more hotels for Kolkata...
  ],
  Mumbai: [
    {
      name: 'Sea View Hotel',
      location: 'Marine Drive, Mumbai',
      price: 1800,
      originalPrice: 5000,
      discount: '64%',
      taxes: 250,
      amenities: ['Sea View', 'Free Wifi', 'Breakfast Included', '+2 more'],
      image: '', // Add the image URL here
    },
    // Add more hotels for Mumbai...
  ],
};

// Main Component
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

  return (
    <div>
      <header className="bg-white py-0.1">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="" src={image} className="h-8 w-auto lg:h-12" />
            </a>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4">
        <CityHotels city="Delhi" hotels={hotelData.Delhi} />
        <CityHotels city="Kolkata" hotels={hotelData.Kolkata} />
        <CityHotels city="Mumbai" hotels={hotelData.Mumbai} />
      </div>
    </div>
  );
}
