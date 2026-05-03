import NotificationCard from "../components/NotificationCard";

function Inbox({ notifications }) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Inbox</h2>

      <div className="grid gap-5">
        {notifications.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification._id || notification.id}
              notification={notification}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default Inbox;