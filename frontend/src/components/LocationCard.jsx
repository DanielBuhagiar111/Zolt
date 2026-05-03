function LocationCard({ location, deleteLocation }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
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

      <button
        onClick={() => deleteLocation(location._id || location.id)}
        className="mt-4 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
      >
        Remove
      </button>
    </div>
  );
}

export default LocationCard;