import { useState } from "react";

function BookRide({ user, API_URL, setMessage, loadBookings, setActivePage }) {
  const [bookingForm, setBookingForm] = useState({
    startLocation: "",
    endLocation: "",
    dateTime: "",
    passengers: 1,
    cabType: "Economic",
  });

  const [fareEstimate, setFareEstimate] = useState(null);

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setBookingForm({
      ...bookingForm,
      [name]: value,
    });

    setFareEstimate(null);
  }

  async function showEstimatedPrice() {
    try {
      setMessage("");
      setFareEstimate(null);

      if (
        bookingForm.startLocation === "" ||
        bookingForm.endLocation === "" ||
        bookingForm.dateTime === ""
      ) {
        setMessage("Please fill in pickup, dropoff, and date/time first.");
        return;
      }

      const userId = user.id || user._id;

      const startQuery = encodeURIComponent(bookingForm.startLocation + ", Malta");
      const endQuery = encodeURIComponent(bookingForm.endLocation + ", Malta");

      const startResponse = await fetch(
        API_URL + "/locations/coordinates?q=" + startQuery
      );
      const startData = await startResponse.json();

      if (!startResponse.ok) {
        setMessage(startData.message || "Could not get pickup location.");
        return;
      }

      const endResponse = await fetch(
        API_URL + "/locations/coordinates?q=" + endQuery
      );
      const endData = await endResponse.json();

      if (!endResponse.ok) {
        setMessage(endData.message || "Could not get dropoff location.");
        return;
      }

      const customerResponse = await fetch(API_URL + "/customers/" + userId);
      const customerData = await customerResponse.json();

      if (!customerResponse.ok) {
        setMessage(customerData.message || "Could not get customer details.");
        return;
      }

      let discount = 1;

      if (customerData.hasDiscount === true) {
        discount = 0.9;
      }

      const fareResponse = await fetch(API_URL + "/fares/estimate", {
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
          discount: discount,
        }),
      });

      const fareData = await fareResponse.json();

      if (!fareResponse.ok) {
        setMessage(fareData.message || "Could not estimate fare.");
        return;
      }

      setFareEstimate(fareData);
    } catch (error) {
      console.log(error);
      setMessage("Server error while estimating fare.");
    }
  }

  async function createBooking(e) {
    e.preventDefault();

    if (fareEstimate === null) {
      setMessage("Please show the estimated price before confirming.");
      return;
    }

    try {
      const userId = user.id || user._id;

      const response = await fetch(API_URL + "/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          startLocation: bookingForm.startLocation,
          endLocation: bookingForm.endLocation,
          dateTime: bookingForm.dateTime,
          passengers: bookingForm.passengers,
          cabType: bookingForm.cabType,
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
      console.log(error);
      setMessage("Server error while creating booking.");
    }
  }

  let confirmButtonClass =
    "w-full py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700";

  if (fareEstimate === null) {
    confirmButtonClass =
      "w-full py-3 rounded-lg font-semibold text-white bg-gray-400 cursor-not-allowed";
  }

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

          <p className="text-sm text-gray-500 -mt-3">
            Rides between 00:00 and 08:00 cost 20% extra.
          </p>

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
              <option value="1">1 passenger</option>
              <option value="2">2 passengers</option>
              <option value="3">3 passengers</option>
              <option value="4">4 passengers</option>
              <option value="5">5 passengers</option>
              <option value="6">6 passengers</option>
              <option value="7">7 passengers</option>
              <option value="8">8 passengers</option>
            </select>

            <p className="text-sm text-gray-500 mt-1">
              1-4 passengers: standard price · 5-8 passengers: double price ·
              More than 8 not allowed
            </p>
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

            <p className="text-sm text-gray-500 mt-1">
              Economic: standard fare · Premium: +20% · Executive: +40%
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800">
            <p className="font-semibold">Discount information</p>
            <p>
              After 3 completed bookings, a 10% discount becomes available
              automatically.
            </p>
          </div>

          <button
            type="button"
            onClick={showEstimatedPrice}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
          >
            Show Estimated Price
          </button>

          {fareEstimate !== null && (
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              {fareEstimate.discountApplied === true && (
                <div>
                  <p className="text-sm text-green-700 font-semibold">
                    Discount applied: {fareEstimate.discountPercent}%
                  </p>

                  <p className="text-sm line-through text-gray-500">
                    Original Price: €{Number(fareEstimate.basePrice).toFixed(2)}
                  </p>
                </div>
              )}

              <p className="text-lg font-bold">
                Estimated Price: €{Number(fareEstimate.totalPrice).toFixed(2)}
              </p>

              <div className="text-sm text-gray-700 mt-3 space-y-1">
                <p>Base Fare: €{Number(fareEstimate.cabFare).toFixed(2)}</p>
                <p>Cab Type Multiplier: ×{fareEstimate.cabMultiplier}</p>
                <p>
                  Passenger Multiplier: ×{fareEstimate.passengersMultiplier}
                </p>
                <p>Time Multiplier: ×{fareEstimate.daytimeMultiplier}</p>

                {fareEstimate.discountApplied === true && (
                  <p className="text-green-700">
                    Discount Applied: -{fareEstimate.discountPercent}%
                  </p>
                )}

                {fareEstimate.discountApplied === false && (
                  <p>No discount applied</p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={fareEstimate === null}
            className={confirmButtonClass}
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </section>
  );
}

function Input({ label, type, name, value, onChange, placeholder }) {
  if (!type) {
    type = "text";
  }

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