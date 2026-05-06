import NotificationCard from "../components/NotificationCard";

function Inbox({ notifications }) {
  let notificationList;

  if (notifications.length === 0) {
    notificationList = (
      <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
        No notifications yet.
      </div>
    );
  } else {
    notificationList = notifications.map(function (notification) {
      return (
        <NotificationCard
          key={notification._id || notification.id}
          notification={notification}
        />
      );
    });
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Inbox</h2>

      <div className="grid gap-5">{notificationList}</div>
    </section>
  );
}

export default Inbox;