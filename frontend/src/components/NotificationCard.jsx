function NotificationCard({ notification }) {
  let title = notification.title;

  if (!title) {
    title = "Notification";
  }

  let dateText = null;

  if (notification.createdAt) {
    dateText = (
      <p className="text-sm text-gray-500 mt-3">
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-bold">{title}</h3>

      <p className="mt-2">{notification.message}</p>

      {dateText}
    </div>
  );
}

export default NotificationCard;