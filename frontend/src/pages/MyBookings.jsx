import BookingCard from "../components/BookingCard";

function MyBookings({ user, API_URL, bookings, setMessage, loadDashboardData }) {
  const payBooking = async (bookingId) => {
    try {
      const userId = user.id || user._id;

      const response = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          bookingId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Payment failed.");
        return;
      }

      setMessage("Payment completed successfully.");
      loadDashboardData(userId);
    } catch (error) {
      console.error(error);
      setMessage("Server error while processing payment.");
    }
  };

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">My Bookings</h2>

      <div className="grid gap-5">
        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
            No bookings found.
          </div>
        ) : (
          bookings.map((booking) => (
            <BookingCard
              key={booking._id || booking.id}
              booking={booking}
              payBooking={payBooking}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default MyBookings;