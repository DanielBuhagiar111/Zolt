function Navbar({ activePage, setActivePage, logout, showMenu = true }) {
  const navItems = [
    { key: "book", label: "Book a Ride" },
    { key: "bookings", label: "My Bookings" },
    { key: "payments", label: "Payments" },
    { key: "locations", label: "Locations" },
    { key: "inbox", label: "Inbox" },
  ];

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

      {showMenu && (
        <>
          <div className="flex gap-8 text-sm">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={
                  activePage === item.key
                    ? "text-purple-300 font-semibold border-b-2 border-purple-400 pb-1"
                    : "text-gray-200 hover:text-purple-300"
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={logout}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;