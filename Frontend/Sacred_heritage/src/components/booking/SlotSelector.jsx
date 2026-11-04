
function SlotSelector({ slots, selectedSlot, setSelectedSlot }) {
  if (slots.length === 0) {
    return <p>No available slots for this date.</p>;
  }

  return (
    <div className="slot-container">
      {slots.map((slot) => (
        <button
          key={slot._id}
          type="button"
          className={
            selectedSlot === slot._id
              ? "slot-button selected-slot"
              : "slot-button"
          }
          onClick={() => setSelectedSlot(slot._id)}
        >
          {slot.startTime} - {slot.endTime}
        </button>
      ))}
    </div>
  );
}

export default SlotSelector;
