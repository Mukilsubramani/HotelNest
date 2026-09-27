// Main App Component with React Router routes and MDB Layout
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import HotelListPage from './pages/HotelListPage';
import AddHotelPage from './pages/AddHotelPage';
import EditHotelPage from './pages/EditHotelPage';
import HotelDetail from './pages/HotelDetail';
import './App.css';

function App() {
  return (
    <div className="mdb-app-layout">
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main Page Routing */}
      <div className="mdb-app-body">
        <Routes>
          {/* Hotel List View matching MDB design */}
          <Route path="/" element={<HotelListPage />} />

          {/* Add Hotel Form */}
          <Route path="/add" element={<AddHotelPage />} />

          {/* Edit Hotel Form */}
          <Route path="/edit/:id" element={<EditHotelPage />} />

          {/* Hotel Detail Page */}
          <Route path="/hotel/:id" element={<HotelDetail />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Full-width MDB Footer */}
      <Footer />

      {/* Global Toast Notification */}
      <Toast />
    </div>
  );
}

export default App;
