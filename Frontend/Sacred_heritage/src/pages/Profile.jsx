
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateProfile } from "../redux/slices/authSlice";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function Profile() {
  const dispatch = useDispatch();

  const {
    user,
    loading,
    error,
    successMessage
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Populate form whenever Redux user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  }

  // Update profile
  async function handleSubmit(event) {
    event.preventDefault();

    const profileData = {
      name: formData.name.trim(),
      phone: formData.phone.trim()
    };

    if (!profileData.name) {
      alert("Please enter your name.");
      return;
    }

    await dispatch(updateProfile(profileData));
  }

  if (!user) {
    return (
      <div className="page-container">
        <h2>Profile information is not available.</h2>
        <p>Please log in again to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Profile Heading */}
        <div className="profile-heading">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <h1>My Profile</h1>
          <p>Manage your Sacred Heritage account.</p>
        </div>

        {/* Profile Form */}
        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >
          <div className="profile-form-group">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="profile-form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              disabled
            />

            <small>Email address cannot be changed here.</small>
          </div>

          <div className="profile-form-group">
            <label htmlFor="phone">Phone Number</label>

            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="profile-form-group">
            <label>Account Role</label>

            <input
              type="text"
              value={user.role || "user"}
              disabled
            />
          </div>

          {/* Error Message */}
          {error && (
            <ErrorMessage message={error} />
          )}

          {/* Success Message */}
          {successMessage && (
            <p className="profile-success-message">
              {successMessage}
            </p>
          )}

          {/* Update Button */}
          <button
            type="submit"
            className="profile-update-button"
            disabled={loading}
          >
            {loading ? "Updating Profile..." : "Save Changes"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Profile;
