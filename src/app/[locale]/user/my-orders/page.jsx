



"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
// const { locale } = useRouter();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`);
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        // // // console.error("Error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <p className="text-gray-500">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">You have not placed any orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-3 border-b">Order ID</th>
                <th className="p-3 border-b">Book Titles</th>
                <th className="p-3 border-b">Order Date</th>
                <th className="p-3 border-b">Total (৳)</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order,idx) => (
                <tr key={idx} className="text-sm hover:bg-gray-50">
                  <td className="p-3 border-b font-medium">
                    {order.orderId || "N/A"}
                  </td>
                  <td className="p-3 border-b">
                    {order.items
                      ?.map((item) => item.title?.en || item.title)
                      .join(", ")}
                  </td>
                  <td className="p-3 border-b">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border-b">৳ {order.grandTotal}</td>
                  <td className="p-3 border-b">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
