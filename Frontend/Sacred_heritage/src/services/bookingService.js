
import api from "./api";

const bookingService = {
  // Get darshan types for a temple
  getDarshanTypes: async (templeId) => {
    return await api.get(`/darshan/types/${templeId}`);
  },

  // Get available slots for selected date and darshan type
  getAvailableSlots: async (templeId, darshanTypeId, date) => {
    const query = new URLSearchParams({
      templeId,
      darshanTypeId,
      date
    });

    return await api.get(`/darshan/slots?${query.toString()}`);
  },

  // Create a darshan booking
  createBooking: async (bookingData) => {
    return await api.post("/bookings", bookingData);
  },

  // Get booking and order history
  getHistory: async () => {
    return await api.get("/history");
  },

  // Cancel a booking
  cancelBooking: async (bookingId) => {
    return await api.patch(`/bookings/${bookingId}/cancel`);
  }
};

export default bookingService;
