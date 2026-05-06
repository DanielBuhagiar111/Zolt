import { useState } from "react";

function LocationCard({ location, deleteLocation, updateLocation }) {
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: location.name,
    address: location.address,
  });

  const locationId = location._id || location.id;

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSave() {
    updateLocation(locationId, formData);
    setEditing(false);
  }

  function handleCancel() {
    setEditing(false);
  }

  function handleEdit() {
    setEditing(true);
  }

  function handleDelete() {
    deleteLocation(locationId);
  }

  let weatherBox = null;

  if (location.weather && !location.weather.error) {
    weatherBox = (
      <div className="mt-3 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-blue-700 font-semibold">
          {location.weather.condition}, {location.weather.temperature}°C
        </p>

        <p className="text-sm text-gray-600">
          Feels like: {location.weather.feelsLike}°C
        </p>

        <p className="text-sm text-gray-600">
          Humidity: {location.weather.humidity}%
        </p>

        <p className="text-sm text-gray-600">
          Wind: {location.weather.windKph} kph
        </p>
      </div>
    );
  }

  let weatherError = null;

  if (location.weather && location.weather.error) {
    weatherError = (
      <p className="mt-3 text-red-500">{location.weather.error}</p>
    );
  }

  let cardContent;

  if (editing) {
    cardContent = (
      <div className="space-y-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>

          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  } else {
    cardContent = (
      <div>
        <h3 className="font-bold">{location.name}</h3>

        <p>{location.address}</p>

        {weatherBox}

        {weatherError}

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return <div className="bg-white p-6 rounded-2xl shadow">{cardContent}</div>;
}

export default LocationCard;