
import Home from './pages/Home';
import './i18n' 
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Register from "./pages/Register"
import Login from "./pages/Login"
import ProductPage from './components/ProductPage';
import Collections from './pages/Collections';
// import Comments from './components/Comments'
import CollectionPage from './pages/CollectionPage';

import CategoriesPage from './components/CategoriesPage';
import About from './pages/About';
import FavoritesPage from './pages/FavoritesPage';
import delivery from "./pages/Delivery"
import Delivery from './pages/Delivery';
// import Contact from './pages/ContactUs';
import ContactUs from './pages/ContactUs';
import Profile from "./pages/Profile"
import MyOrders from "./pages/MyOrders"

import AdminProducts from './pages/AdminProducts';
import AdminOrders from "./pages/AdminOrders"
import AdminCategories from "./pages/AdminCategories"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/collections/:id" element={<CollectionPage />} />
        <Route path="/collections" element={<CategoriesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/contacts" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<MyOrders />} />

        {/* ADMIN  */}
        {/* <ProtectedRoute  role="ADMIN"><AdminProducts /></ProtectedRoute> */}
        <Route path="/AdminProducts" element={<AdminProducts />} />
        <Route path="/AdminOrders" element={<AdminOrders/>} />
        <Route path="/AdminCategories" element={<AdminCategories />} />
    

      </Routes>
    </>
  )
}

export default App