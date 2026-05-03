import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import BookRide from "./BookRide";
import MyBookings from "./MyBookings";
import Payments from "./Payments";
import Locations from "./Locations";
import Inbox from "./Inbox";

function Dashboard() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api";

  const [activePage, setActivePage] = useState("book");
  const [user, setUser] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect

    const loadDashboardData = async (userId) => {
      try {
        const [bookingsRes, paymentsRes, locationsRes, notificationsRes] =
          await Promise.all([
            fetch(`${API_URL}/bookings/user/${userId}`),
            fetch(`${API_URL}/payments/user/${userId}`),
            fetch(`${API_URL}/locations/user/${userId}`),
            fetch(`${API_URL}/customers/${userId}/notifications`),
          ]);

        if (bookingsRes.ok) setBookings(await bookingsRes.json());
        if (paymentsRes.ok) setPayments(await paymentsRes.json());
        if (locationsRes.ok) setLocations(await locationsRes.json());
        if (notificationsRes.ok) setNotifications(await notificationsRes.json());
      } catch (error) {
        console.error(error);
        setMessage("Could not load dashboard data.");
      }
    };

    const logout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    };

  return (
    <div className="min-h-screen bg-purple-50 text-slate-900">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        logout={logout}
      />

      <main className="max-w-5xl mx-auto p-8">
        {message && (
          <div className="mb-6 bg-purple-100 border border-purple-300 text-purple-800 p-4 rounded-xl">
            {message}
          </div>
        )}

        {activePage === "book" && (
          <BookRide
            user={user}
            API_URL={API_URL}
            setMessage={setMessage}
            loadDashboardData={loadDashboardData}
            setActivePage={setActivePage}
          />
        )}

        {activePage === "bookings" && (
          <MyBookings
            user={user}
            API_URL={API_URL}
            bookings={bookings}
            setMessage={setMessage}
            loadDashboardData={loadDashboardData}
          />
        )}

        {activePage === "payments" && <Payments payments={payments} />}

        {activePage === "locations" && (
          <Locations
            user={user}
            API_URL={API_URL}
            locations={locations}
            setMessage={setMessage}
            loadDashboardData={loadDashboardData}
          />
        )}

        {activePage === "inbox" && <Inbox notifications={notifications} />}
      </main>
    </div>
  );
}

export default Dashboard;