// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage";
import Hotels from "./Components/Hotels";
import HotelDetails from "./Components/HotelDetails";
import PaymentPage from "./Components/PaymentPage";
import BookingConfirmation from "./Components/BookingConfirmation";
import BookingDeleted from "./Components/BookingDeleted"; // Import BookingDeleted Component
import { BookingProvider } from "./Components/BookingContext";

function App() {
  return (
    <BookingProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/hotels/:city" element={<Hotels />} />
          <Route path="/hotels/:city/:hotelId" element={<HotelDetails />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/confirmation" element={<BookingConfirmation />} />
          <Route path="/deleted" element={<BookingDeleted />} /> {/* New Route */}
        </Routes>
    </BookingProvider>
  );
}

export default App;
