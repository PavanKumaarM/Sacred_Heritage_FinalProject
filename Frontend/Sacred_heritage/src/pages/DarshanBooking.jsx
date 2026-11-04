
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAvailableSlots,
  createBooking,
  clearSlots,
  clearBookingMessage
} from "../redux/slices/bookingSlice";

import bookingService from "../services/bookingService";
import SlotSelector from "../components/booking/SlotSelector";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function DarshanBooking() {
  const { templeId, darshanTypeId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { slots, loading, actionLoading, error, selectedBooking, successMessage } =
    useSelector((state) => state.booking);

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [visitorCount, setVisitorCount] = useState(1);
  const [visitorNames, setVisitorNames] = useState([""]);

  const [darshanType, setDarshanType] = useState(null);
  const [temple, setTemple] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    async function loadDetails() {
      try {
        setDetailsLoading(true);

        const [typeResponse, templeResponse] = await Promise.all([
          bookingService.getDarshanTypes(templeId),
          import("../services/templeService").then((module) =>
            module.default.getTempleById(templeId)
          )
        ]);

        const foundType = (typeResponse.types || []).find(
          (type) => type._id === darshanTypeId
        );

        setDarshanType(foundType || null);
        setTemple(templeResponse.data || null);

        if (!foundType) {
          setDetailsError("Darshan type not found.");
        }
      } catch (err) {
        setDetailsError(err.message);
      } finally {
        setDetailsLoading(false);
      }
    }

    loadDetails();
  }, [templeId, darshanTypeId]);

  useEffect(() => {
    dispatch(clearSlots());
    setSelectedSlot("");

    if (date) {
      dispatch(
        fetchAvailableSlots({
          templeId,
          darshanTypeId,
          date
        })
      );
    }
  }, [dispatch, templeId, darshanTypeId, date]);

  useEffect(() => {
    setVisitorNames((previousNames) =>
      Array.from({ length: visitorCount }, (_, index) =>
        previousNames[index] || ""
      )
    );
  }, [visitorCount]);

  useEffect(() => {
    if (successMessage && selectedBooking) {
      // Booking created successfully.
    }
  }, [successMessage, selectedBooking]);

  function handleVisitorNameChange(index, value) {
    const updatedNames = [...visitorNames];
    updatedNames[index] = value;
    setVisitorNames(updatedNames);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!date || !selectedSlot) {
      alert("Please select a date and time slot.");
      return;
    }

    if (visitorNames.some((name) => !name.trim())) {
      alert("Please enter the name of every visitor.");
      return;
    }

    dispatch(clearBookingMessage());

    dispatch(
      createBooking({
        templeId,
        darshanTypeId,
        slotId: selectedSlot,
        visitorCount: Number(visitorCount),
        visitorNames
      })
    );
  }

  if (detailsLoading) {
    return <Loader message="Loading booking details..." />;
  }

  if (detailsError) {
    return <ErrorMessage message={detailsError} />;
  }

  return (
    <div className="page-container">
      <Link to={`/temples/${templeId}/darshan`} className="back-link">
        ← Back to Darshan Options
      </Link>

      <div className="page-heading">
        <h1>Book Your Darshan</h1>
        <p>{temple?.name}</p>
      </div>

      <div className="booking-layout">
        <div className="booking-summary">
          <h2>{darshanType?.name}</h2>
          <p>{darshanType?.description}</p>
          <p>Price per visitor: ₹{darshanType?.price}</p>
          <p>Duration: {darshanType?.durationMinutes} minutes</p>
        </div>

        {successMessage && selectedBooking ? (
          <div className="booking-success">
            <h2>Booking Successful!</h2>
            <p>{successMessage}</p>
            <p>
              Booking reference:{" "}
              <strong>{selectedBooking.bookingReference}</strong>
            </p>

            <Link to="/my-bookings" className="primary-button">
              View My Bookings
            </Link>
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            <label>Select Date</label>

            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(event) => setDate(event.target.value)}
              required
            />

            <label>Select Available Slot</label>

            {loading ? (
              <Loader message="Checking available slots..." />
            ) : (
              <SlotSelector
                slots={slots}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
              />
            )}

            <label>Number of Visitors</label>

            <input
              type="number"
              min="1"
              max="10"
              value={visitorCount}
              onChange={(event) =>
                setVisitorCount(
                  Math.max(1, Math.min(10, Number(event.target.value)))
                )
              }
              required
            />

            <h3>Visitor Details</h3>

            {visitorNames.map((name, index) => (
              <div key={index}>
                <label>Visitor {index + 1} Name</label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    handleVisitorNameChange(index, event.target.value)
                  }
                  placeholder={`Enter visitor ${index + 1} name`}
                  required
                />
              </div>
            ))}

            {error && <ErrorMessage message={error} />}

            <button
              type="submit"
              className="primary-button"
              disabled={actionLoading}
            >
              {actionLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default DarshanBooking;
