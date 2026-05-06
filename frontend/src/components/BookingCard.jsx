function BookingCard({ booking, payBooking }) {
  const bookingId = booking._id || booking.id;

  let priceText = null;

  if (booking.estimatedPrice > 0) {
    priceText = (
      <p>
        Price: €{Number(booking.estimatedPrice).toFixed(2)}
      </p>
    );
  }

  let payButton = null;

  if (booking.status !== "completed") {
    payButton = (
      <button
        onClick={handlePay}
        className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
      >
        Pay Now
      </button>
    );
  }

  let discountText = null;

  if (booking.discountApplied) {
    discountText = (
      <div>
        <p className="text-gray-500 line-through">
          Original Price: €{Number(booking.basePrice).toFixed(2)}
        </p>

        <p className="text-green-700">
          Discount Applied: {booking.discountPercent}%
        </p>
      </div>
    );
  }

  let bookingStatus = booking.status;

  if (!bookingStatus) {
    bookingStatus = "pending";
  }

  function handlePay() {
    payBooking(bookingId);
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="text-lg font-bold">
        {booking.startLocation} → {booking.endLocation}
      </h3>

      <p>Ride Date: {new Date(booking.dateTime).toLocaleString()}</p>

      <p>Booked On: {new Date(booking.createdAt).toLocaleString()}</p>

      <p>Passengers: {booking.passengers}</p>

      <p>Cab Type: {booking.cabType}</p>

      {priceText}

      {payButton}

      {discountText}

      <p className="mt-4">Status: {bookingStatus}</p>
    </div>
  );
}

export default BookingCard;