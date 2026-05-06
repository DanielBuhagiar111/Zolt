import { useState } from "react";
import LocationCard from "../components/LocationCard";

function Locations({ user, API_URL, locations, setMessage, loadLocations }) {
  const [locationForm, setLocationForm] = useState({
    name: "",
    address: "",
  });

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setLocationForm({
      ...locationForm,
      [name]: value,
    });
  }

  async function addLocation(e) {
    e.preventDefault();

    try {
      const userId = user.id || user._id;

      const response = await fetch(API_URL + "/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          name: locationForm.name,
          address: locationForm.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not add location.");
        return;
      }

      setMessage("Location added successfully.");

      setLocationForm({
        name: "",
        address: "",
      });

      loadLocations(userId);
    } catch (error) {
      console.log(error);
      setMessage("Server error while adding location.");
    }
  }

  async function deleteLocation(locationId) {
    try {
      const userId = user.id || user._id;

      const response = await fetch(API_URL + "/locations/" + locationId, {
        method: "DELETE",
      });

      if (!response.ok) {
        setMessage("Could not delete location.");
        return;
      }

      setMessage("Location removed.");
      loadLocations(userId);
    } catch (error) {
      console.log(error);
      setMessage("Server error while deleting location.");
    }
  }

  async function updateLocation(locationId, updatedLocation) {
    try {
      const userId = user.id || user._id;

      const response = await fetch(API_URL + "/locations/" + locationId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLocation),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not update location.");
        return;
      }

      setMessage("Location updated successfully.");
      loadLocations(userId);
    } catch (error) {
      console.log(error);
      setMessage("Server error while updating location.");
    }
  }

  let locationList;

  if (locations.length === 0) {
    locationList = (
      <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
        No favourite locations found.
      </div>
    );
  } else {
    locationList = locations.map(function (location) {
      return (
        <LocationCard
          key={location._id || location.id}
          location={location}
          deleteLocation={deleteLocation}
          updateLocation={updateLocation}
        />
      );
    });
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Favourite Locations</h2>

      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <form onSubmit={addLocation} className="space-y-4">
          <Input
            label="Location Name"
            name="name"
            value={locationForm.name}
            onChange={handleChange}
            placeholder="Home"
          />

          <Input
            label="Address"
            name="address"
            value={locationForm.address}
            onChange={handleChange}
            placeholder="Valletta, Malta"
          />

          <button className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600">
            Add Location
          </button>
        </form>
      </div>

      <div className="grid gap-5">{locationList}</div>
    </section>
  );
}

function Input({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      <input
        type="text"
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

export default Locations;