import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Sliders from './components/Sliders';
import Special from './components/Speical';
import AboutUs from './pages/AboutUs';
import CarDetails from './pages/CarDetails';
import ContactUs from './pages/ContactUs';
import Listings from './pages/Listings';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddCar from './pages/admin/AddCar';
import ManageCars from './pages/admin/ManageCars';
import AdminSettings from './pages/admin/AdminSettings';
import EditCar from './pages/admin/EditCar';
import ManageUsers from './pages/admin/ManageUsers';
import ManageSpecialOffers from './pages/admin/ManageSpecialOffers';
import Enquire from './pages/admin/Enquire';
import WhyChos from './components/WhyChos';
import FaqPreview from './components/FaqPreview';
import Faqs from './pages/Faqs';
import CarTabs from './components/CarTabs';

const PublicLayout = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <PublicLayout>
        <Routes>
          <Route path="/" element={
            <>
              <Sliders />
              <Listings />
              <CarTabs/>
              <WhyChos/>
              <Special/>
              <FaqPreview/>
            </>
          } />
          <Route path="/about"    element={<AboutUs />} />
          <Route path="/contact"  element={<ContactUs />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/car/:id"  element={<CarDetails />} />
          <Route path="/faqs" element={<Faqs />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index                    element={<AdminDashboard />} />
            <Route path="add-car"           element={<AddCar />} />
            <Route path="manage-cars"       element={<ManageCars />} />
            <Route path="edit-car/:id"      element={<EditCar />} />
            <Route path="settings"          element={<AdminSettings />} />
            <Route path="users"             element={<ManageUsers />} />
            <Route path="enquiries"         element={<Enquire />} />
            <Route path="special-offers"    element={<ManageSpecialOffers />} />
          </Route>
        </Routes>
      </PublicLayout>
    </Router>
  );
}

export default App;