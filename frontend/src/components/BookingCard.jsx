function BookingCard({ booking, payBooking }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="text-lg font-bold">
        {booking.startLocation} → {booking.endLocation}
      </h3>

      <p>Date: {new Date(booking.dateTime).toLocaleString()}</p>
      <p>Passengers: {booking.passengers}</p>
      <p>Cab Type: {booking.cabType}</p>
      <p>Status: {booking.status || "pending"}</p>

      {booking.status !== "completed" && (
        <button
          onClick={() => payBooking(booking._id || booking.id)}
          className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
        >
          Pay Now
        </button>
      )}
    </div>
  );
}

export default BookingCard;