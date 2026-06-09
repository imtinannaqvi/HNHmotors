import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Existing Components & Pages
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Sliders from './components/Sliders';
import AboutUs from './pages/AboutUs';
import CarDetails from './pages/CarDetails';
import ContactUs from './pages/ContactUs';
import Listings from './pages/Listings';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Components & Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddCar from './pages/admin/AddCar';
import ManageCars from './pages/admin/ManageCars';
import AdminSettings from './pages/admin/AdminSettings';
import EditCar from './pages/admin/EditCar'; // 1. Added EditCar import

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Sliders />
            <Listings />
          </>
        } />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/car/:id" element={<CarDetails />} />

        {/* Admin Routes (Nested in AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="edit-car/:id" element={<EditCar />} /> {/* 2. Added EditCar route */}
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;