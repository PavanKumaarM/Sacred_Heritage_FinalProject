
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { fetchProfile } from "./redux/slices/authSlice";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Loader from "./components/common/Loader";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

import Home from "./pages/Home";
import ExploreTemples from "./pages/ExploreTemples";
import TempleDetails from "./pages/TempleDetails";
import TempleProducts from "./pages/TempleProducts";
import TempleSpecificProducts from "./pages/TempleSpecificProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";

import DarshanOptions from "./pages/DarshanOptions";
import DarshanBooking from "./pages/DarshanBooking";
import MyBookings from "./pages/MyBookings";

import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Admin from "./pages/Admin";

import NotFound from "./pages/NotFound";


function App() {
  const dispatch = useDispatch();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Restore the user's session after a page refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchProfile()).finally(() => {
        setCheckingAuth(false);
      });
    } else {
      setCheckingAuth(false);
    }
  }, [dispatch]);

  if (checkingAuth) {
    return <Loader message="Restoring your session..." />;
  }

  return (
    <>
      <Navbar />

      <main>
        <Routes>
          
          <Route path="*" element={<NotFound />} />

          <Route path="/" element={<Home />} />

          <Route path="/temples" element={<ExploreTemples />} />
          <Route path="/temples/:id" element={<TempleDetails />} />

          <Route
            path="/temples/:id/products"
            element={<TempleSpecificProducts />}
          />

          <Route path="/products" element={<TempleProducts />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          <Route
            path="/temples/:id/darshan"
            element={<DarshanOptions />}
          />

          <Route
            path="/darshan/:templeId/book/:darshanTypeId"
            element={<DarshanBooking />}
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route path="/favorites" element={<Favorites />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
