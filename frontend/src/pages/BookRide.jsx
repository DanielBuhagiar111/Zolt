import { useState } from "react";

function BookRide({
  user,
  API_URL,
  setMessage,
  loadBookings,
  setActivePage,
}) {
  const [bookingForm, setBookingForm] = useState({
    startLocation: "",
    endLocation: "",
    dateTime: "",
    passengers: 1,
    cabType: "Economic",
  });

  const [fareEstimate, setFareEstimate] = useState(null);

  const handleChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });

    setFareEstimate(null);
  };

  const showEstimatedPrice = async () => {
    try {
      setMessage("");
      setFareEstimate(null);

      if (
        !bookingForm.startLocation ||
        !bookingForm.endLocation ||
        !bookingForm.dateTime
      ) {
        setMessage("Please fill in pickup, dropoff, and date/time first.");
        return;
      }

      const userId = user.id || user._id;

      const startQuery = encodeURIComponent(`${bookingForm.startLocation}, Malta`);
      const endQuery = encodeURIComponent(`${bookingForm.endLocation}, Malta`);

      const startResponse = await fetch(
        `${API_URL}/locations/coordinates?q=${startQuery}`
      );
      const startData = await startResponse.json();

      if (!startResponse.ok) {
        setMessage(startData.message || "Could not get pickup location.");
        return;
      }

      const endResponse = await fetch(
        `${API_URL}/locations/coordinates?q=${endQuery}`
      );
      const endData = await endResponse.json();

      if (!endResponse.ok) {
        setMessage(endData.message || "Could not get dropoff location.");
        return;
      }

      const customerResponse = await fetch(`${API_URL}/customers/${userId}`);
      const customerData = await customerResponse.json();

      if (!customerResponse.ok) {
        setMessage(customerData.message || "Could not get customer details.");
        return;
      }

      const discount = customerData.hasDiscount ? 0.9 : 1;

      const fareResponse = await fetch(`${API_URL}/fares/estimate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dep_lat: startData.lat,
          dep_lng: startData.lng,
          arr_lat: endData.lat,
          arr_lng: endData.lng,
          cabType: bookingForm.cabType,
          dateTime: bookingForm.dateTime,
          passengers: Number(bookingForm.passengers),
          discount,
        }),
      });

      const fareData = await fareResponse.json();

      if (!fareResponse.ok) {
        setMessage(fareData.message || "Could not estimate fare.");
        return;
      }

      setFareEstimate(fareData);
    } catch (error) {
      console.error(error);
      setMessage("Server error while estimating fare.");
    }
  };

  const createBooking = async (e) => {
    e.preventDefault();

    if (!fareEstimate) {
      setMessage("Please show the estimated price before confirming.");
      return;
    }

    try {
      const userId = user.id || user._id;

      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...bookingForm,
          estimatedPrice: fareEstimate.totalPrice,
          basePrice: fareEstimate.basePrice,
          discountApplied: fareEstimate.discountApplied,
          discountPercent: fareEstimate.discountPercent,
          discountMultiplier: fareEstimate.discountMultiplier,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Booking failed.");
        return;
      }

      setMessage("Booking confirmed successfully.");

      setBookingForm({
        startLocation: "",
        endLocation: "",
        dateTime: "",
        passengers: 1,
        cabType: "Economic",
      });

      setFareEstimate(null);

      loadBookings(userId);
      setActivePage("bookings");
    } catch (error) {
      console.error(error);
      setMessage("Server error while creating booking.");
    }
  };

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Book a Ride</h2>

      <div className="bg-white rounded-2xl shadow p-8">
        <h3 className="text-xl font-bold mb-5">Ride Details</h3>

        <form onSubmit={createBooking} className="space-y-5">
          <Input
            label="Pickup Location"
            name="startLocation"
            value={bookingForm.startLocation}
            onChange={handleChange}
            placeholder="e.g. Msida"
          />

          <Input
            label="Dropoff Location"
            name="endLocation"
            value={bookingForm.endLocation}
            onChange={handleChange}
            placeholder="e.g. Valletta"
          />

          <Input
            label="Date and Time"
            type="datetime-local"
            name="dateTime"
            value={bookingForm.dateTime}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Number of Passengers
            </label>

            <select
              name="passengers"
              value={bookingForm.passengers}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} passenger{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cab Type</label>

            <select
              name="cabType"
              value={bookingForm.cabType}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="Economic">Economic</option>
              <option value="Premium">Premium</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <button
            type="button"
            onClick={showEstimatedPrice}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
          >
            Show Estimated Price
          </button>

          {fareEstimate && (
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              {fareEstimate.discountApplied && (
                <>
                  <p className="text-sm text-green-700 font-semibold">
                    Discount applied: {fareEstimate.discountPercent}%
                  </p>

                  <p className="text-sm line-through text-gray-500">
                    Original Price: €{Number(fareEstimate.basePrice).toFixed(2)}
                  </p>
                </>
              )}

              <p className="text-lg font-bold">
                Estimated Price: €{Number(fareEstimate.totalPrice).toFixed(2)}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </section>
  );
}

function Input({ label, type = "text", name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full border rounded-lg p-3"
      />
    </div>
  );
}

export default BookRide;