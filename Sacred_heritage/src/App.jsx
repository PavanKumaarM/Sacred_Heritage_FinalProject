
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";

import Home from "./pages/Home.jsx";
import ExploreTemples from "./pages/ExploreTemples.jsx";
import TempleDetails from "./pages/TempleDetails.jsx";
import TempleProducts from "./pages/TempleProducts.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import DarshanOptions from "./pages/DarshanOptions.jsx";
import DarshanBooking from "./pages/DarshanBooking.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Favorites from "./pages/Favorites.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/temples" element={<ExploreTemples />} />

          <Route
            path="/temples/:id"
            element={<TempleDetails />}
          />

          <Route
            path="/temples/:id/products"
            element={<TempleProducts />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/darshan/:templeId"
            element={<DarshanOptions />}
          />

          <Route
            path="/darshan/:templeId/book"
            element={<DarshanBooking />}
          />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/my-bookings" element={<MyBookings />} />

          <Route path="/my-orders" element={<MyOrders />} />

          <Route path="/favorites" element={<Favorites />} />

          <Route path="/about" element={<About />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={<Admin />} />

          <Route
            path="*"
            element={
              <div className="not-found">
                <h1>404</h1>
                <p>Page not found</p>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
