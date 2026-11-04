
import api from "./api";

const bookingService = {
  // Get available darshan types for a temple
  getDarshanTypes: async (templeId) => {
    return api.get(`/darshan/types/${templeId}`);
  },

  // Get available slots for a selected date and darshan type
  getAvailableSlots: async (templeId, darshanTypeId, date) => {
    const query = new URLSearchParams({
      templeId,
      darshanTypeId,
      date,
    });

    return api.get(`/darshan/slots?${query.toString()}`);
  },

  // Create a darshan booking
  createBooking: async (bookingData) => {
    return api.post("/bookings", bookingData);
  },

  // Get booking and order history
  getHistory: async () => {
    return api.get("/history");
  },

  // Cancel an existing booking
  cancelBooking: async (bookingId) => {
    return api.patch(`/bookings/${bookingId}/cancel`);
  },
};

export default bookingService;
