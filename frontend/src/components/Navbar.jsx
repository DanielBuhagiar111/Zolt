function Navbar({ activePage, setActivePage, logout, showMenu }) {
  if (showMenu === undefined) {
    showMenu = true;
  }

  function openBookPage() {
    setActivePage("book");
  }

  function openBookingsPage() {
    setActivePage("bookings");
  }

  function openPaymentsPage() {
    setActivePage("payments");
  }

  function openLocationsPage() {
    setActivePage("locations");
  }

  function openInboxPage() {
    setActivePage("inbox");
  }

  function getButtonClass(pageName) {
    if (activePage === pageName) {
      return "text-purple-300 font-semibold border-b-2 border-purple-400 pb-1";
    }

    return "text-gray-200 hover:text-purple-300";
  }

  let menu = null;

  if (showMenu) {
    menu = (
      <div className="flex gap-8 text-sm">
        <button onClick={openBookPage} className={getButtonClass("book")}>
          Book a Ride
        </button>

        <button
          onClick={openBookingsPage}
          className={getButtonClass("bookings")}
        >
          My Bookings
        </button>

        <button
          onClick={openPaymentsPage}
          className={getButtonClass("payments")}
        >
          Payments
        </button>

        <button
          onClick={openLocationsPage}
          className={getButtonClass("locations")}
        >
          Locations
        </button>

        <button onClick={openInboxPage} className={getButtonClass("inbox")}>
          Inbox
        </button>
      </div>
    );
  }

  let logoutButton = null;

  if (showMenu) {
    logoutButton = (
      <button
        onClick={logout}
        className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg font-semibold"
      >
        Logout
      </button>
    );
  }

  return (
    <nav className="bg-[#140c24] text-white px-8 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-3xl">
          <img src="/favicon.svg" alt="Logo" />
        </span>

        <h1 className="text-2xl font-bold tracking-wide text-purple-300">
          Zolt
        </h1>
      </div>

      {menu}

      {logoutButton}
    </nav>
  );
}

export default Navbar;