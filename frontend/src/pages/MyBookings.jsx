import BookingCard from "../components/BookingCard";

function MyBookings({
  user,
  API_URL,
  bookings,
  setMessage,
  loadBookings,
  loadPayments,
}) {
  async function payBooking(bookingId) {
    try {
      const userId = user.id || user._id;

      const response = await fetch(API_URL + "/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          bookingId: bookingId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Payment failed.");
        return;
      }

      setMessage("Payment completed successfully.");
      loadBookings(userId);
      loadPayments(userId);
    } catch (error) {
      console.log(error);
      setMessage("Server error while processing payment.");
    }
  }

  let bookingList;

  if (bookings.length === 0) {
    bookingList = (
      <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
        No bookings found.
      </div>
    );
  } else {
    bookingList = bookings.map(function (booking) {
      return (
        <BookingCard
          key={booking._id || booking.id}
          booking={booking}
          payBooking={payBooking}
        />
      );
    });
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">My Bookings</h2>

      <div className="grid gap-5">{bookingList}</div>
    </section>
  );
}

export default MyBookings;