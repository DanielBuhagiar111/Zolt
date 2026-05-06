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
  const API_URL = import.meta.env.VITE_API_URL + "/api";

  const [activePage, setActivePage] = useState("book");
  const [user, setUser] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");

  async function loadDashboardData(userId) {
    try {
      const bookingsRes = await fetch(API_URL + "/bookings/user/" + userId);
      const paymentsRes = await fetch(API_URL + "/payments/user/" + userId);
      const locationsRes = await fetch(API_URL + "/locations/user/" + userId);
      const notificationsRes = await fetch(
        API_URL + "/customers/" + userId + "/notifications"
      );

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData);
      }

      if (locationsRes.ok) {
        const locationsData = await locationsRes.json();
        setLocations(locationsData);
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData);
      }
    } catch (error) {
      console.log(error);
      setMessage("Could not load dashboard data.");
    }
  }

  async function loadBookings(userId) {
    const response = await fetch(API_URL + "/bookings/user/" + userId);

    if (response.ok) {
      const data = await response.json();
      setBookings(data);
    }
  }

  async function loadPayments(userId) {
    const response = await fetch(API_URL + "/payments/user/" + userId);

    if (response.ok) {
      const data = await response.json();
      setPayments(data);
    }
  }

  async function loadLocations(userId) {
    const response = await fetch(API_URL + "/locations/user/" + userId);

    if (response.ok) {
      const data = await response.json();
      setLocations(data);
    }
  }

  async function loadNotifications(userId) {
    const response = await fetch(
      API_URL + "/customers/" + userId + "/notifications"
    );

    if (response.ok) {
      const data = await response.json();
      setNotifications(data);
    }
  }

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/");
      return;
    }

    setUser(storedUser);

    const userId = storedUser.id || storedUser._id;
    loadDashboardData(userId);
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (activePage !== "inbox") {
      return;
    }

    const userId = user.id || user._id;

    loadNotifications(userId);

    const interval = setInterval(function () {
      loadNotifications(userId);
    }, 3000);

    return function () {
      clearInterval(interval);
    };
  }, [activePage, user]);

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  }

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
        {message !== "" && (
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