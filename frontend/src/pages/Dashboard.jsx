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

  const loadBookings = async (userId) => {
    const response = await fetch(`${API_URL}/bookings/user/${userId}`);
    if (response.ok) setBookings(await response.json());
  };

  const loadPayments = async (userId) => {
    const response = await fetch(`${API_URL}/payments/user/${userId}`);
    if (response.ok) setPayments(await response.json());
  };

  const loadLocations = async (userId) => {
    const response = await fetch(`${API_URL}/locations/user/${userId}`);
    if (response.ok) setLocations(await response.json());
  };

  const loadNotifications = async (userId) => {
    const response = await fetch(`${API_URL}/customers/${userId}/notifications`);
    if (response.ok) setNotifications(await response.json());
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/");
      return;
    }

    setUser(storedUser);
    loadDashboardData(storedUser.id || storedUser._id);
  }, [navigate]);

  useEffect(() => {
    if (!user || activePage !== "inbox") return;

    const userId = user.id || user._id;

    loadNotifications(userId);

    const interval = setInterval(() => {
      loadNotifications(userId);
    }, 3000);

    return () => clearInterval(interval);
  }, [activePage, user]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) {
    return null;
  }

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
            loadBookings={loadBookings}
            setActivePage={setActivePage}
          />
        )}

        {activePage === "bookings" && (
          <MyBookings
            user={user}
            API_URL={API_URL}
            bookings={bookings}
            setMessage={setMessage}
            loadBookings={loadBookings}
            loadPayments={loadPayments}
          />
        )}

        {activePage === "payments" && <Payments payments={payments} />}

        {activePage === "locations" && (
          <Locations
            user={user}
            API_URL={API_URL}
            locations={locations}
            setMessage={setMessage}
            loadLocations={loadLocations}
          />
        )}

        {activePage === "inbox" && <Inbox notifications={notifications} />}
      </main>
    </div>
  );
}

export default Dashboard;