import { useState } from "react";

function LocationCard({ location, deleteLocation, updateLocation }) {
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: location.name,
    address: location.address,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    updateLocation(location._id || location.id, formData);
    setEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      {editing ? (
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
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-bold">{location.name}</h3>
          <p>{location.address}</p>

          {location.weather && !location.weather.error && (
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
          )}

          {location.weather?.error && (
            <p className="mt-3 text-red-500">{location.weather.error}</p>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>

            <button
              onClick={() => deleteLocation(location._id || location.id)}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LocationCard;