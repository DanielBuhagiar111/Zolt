function BookingCard({ booking, payBooking }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="text-lg font-bold">
        {booking.startLocation} → {booking.endLocation}
      </h3>

      <p>Date: {new Date(booking.dateTime).toLocaleString()}</p>

      <p>Passengers: {booking.passengers}</p>

      <p>Cab Type: {booking.cabType}</p>

      {booking.estimatedPrice > 0 && (
        <p>
          Price: €
          {Number(booking.estimatedPrice).toFixed(2)}
        </p>
      )}

      {booking.status !== "completed" && (
        <button
          onClick={() => payBooking(booking._id || booking.id)}
          className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
        >
          Pay Now
        </button>
      )}

      {booking.discountApplied && (
        <>
          <p className="text-gray-500 line-through">
            Original Price: €
            {Number(booking.basePrice).toFixed(2)}
          </p>

          <p className="text-green-700">
            Discount Applied: {booking.discountPercent}%
          </p>
        </>
      )}



      <p className="mt-4">
        Status: {booking.status || "pending"}
      </p>
    </div>
  );
}

export default BookingCard;