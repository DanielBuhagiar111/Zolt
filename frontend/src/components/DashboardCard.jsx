function DashboardCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}

export default DashboardCard;