import AdminLayout from "../../components/AdminLayout";
import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const res = await apiFetch("/api/admin/stats");
    setStats(res.stats);
  }

  const Card = ({ title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {!stats ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          <Card title="Total Users" value={stats.users} />
          <Card title="Products" value={stats.products} />
          <Card title="Orders" value={stats.orders} />
          <Card title="Revenue" value={`₹${stats.revenue}`} />
        </div>
      )}
    </AdminLayout>
  );
}
