


"use client";

import { useEffect, useState } from "react";

export default function AdminHomePage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/dashboardDetails`); // 🔹 your API route
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        // // console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, Admin!</h2>
        <p className="text-gray-600 mt-1">Here’s your dashboard overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {stats.totalOrders}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {stats.totalUsers}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-yellow-500">
          <h3 className="text-sm font-semibold text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            ৳ {stats.revenue}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-red-500">
          <h3 className="text-sm font-semibold text-gray-500">Pending Orders</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {stats.pendingOrders}
          </p>
        </div>
      </div>
    </div>
  );
}
