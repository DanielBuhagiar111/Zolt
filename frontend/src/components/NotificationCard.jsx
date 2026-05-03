function NotificationCard({ notification }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-bold">
        {notification.title || "Notification"}
      </h3>

      <p className="mt-2">{notification.message}</p>

      {notification.createdAt && (
        <p className="text-sm text-gray-500 mt-3">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default NotificationCard;