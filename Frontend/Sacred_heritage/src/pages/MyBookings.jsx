
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchHistory,
  cancelBooking
} from "../redux/slices/bookingSlice";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function MyBookings() {
  const dispatch = useDispatch();

  const {
    bookings,
    loading,
    actionLoading,
    error,
    successMessage
  } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  function handleCancel(bookingId) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (confirmCancel) {
      dispatch(cancelBooking(bookingId));
    }
  }

  if (loading) {
    return <Loader message="Loading your bookings..." />;
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>My Darshan Bookings</h1>
        <p>View your booking details and status.</p>
      </div>

      {error && <ErrorMessage message={error} />}

      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h2>No bookings found</h2>
          <p>Your darshan bookings will appear here.</p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <h3>
                {booking.templeId?.name || "Temple"}
              </h3>

              <p>
                <strong>Darshan:</strong>{" "}
                {booking.darshanType?.name || "Darshan"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {booking.slot?.date
                  ? new Date(booking.slot.date).toLocaleDateString()
                  : "Not available"}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {booking.slot?.startTime || "-"} -{" "}
                {booking.slot?.endTime || "-"}
              </p>

              <p>
                <strong>Visitors:</strong> {booking.visitorCount}
              </p>

              <p>
                <strong>Amount:</strong> ₹{booking.amount}
              </p>

              <p>
                <strong>Reference:</strong>{" "}
                {booking.bookingReference}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-${booking.status?.toLowerCase()}`}>
                  {booking.status}
                </span>
              </p>

              {booking.status !== "CANCELLED" && (
                <button
                  className="danger-button"
                  disabled={actionLoading}
                  onClick={() => handleCancel(booking._id)}
                >
                  {actionLoading ? "Please wait..." : "Cancel Booking"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
