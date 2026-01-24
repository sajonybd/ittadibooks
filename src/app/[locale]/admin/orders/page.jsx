"use client";

import { useState, useMemo } from "react";

const ordersData = [
  {
    id: "ORD001",
    customer: "John Doe",
    email: "john@example.com",
    amount: 2500,
    paymentStatus: "Paid",
    deliveryType: "Home Delivery",
    deliveryStatus: "Shipped",
    items: [
      { name: "Book 1", qty: 2 },
      { name: "Book 2", qty: 1 },
    ],
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    amount: 1800,
    paymentStatus: "Unpaid",
    deliveryType: "Store Pickup",
    deliveryStatus: "Pending",
    items: [{ name: "Book 3", qty: 1 }],
  },
  {
    id: "ORD003",
    customer: "Alice Johnson",
    email: "alice.j@example.com",
    amount: 3200,
    paymentStatus: "Paid",
    deliveryType: "Home Delivery",
    deliveryStatus: "Delivered",
    items: [
      { name: "Book 4", qty: 3 },
      { name: "Book 5", qty: 1 },
    ],
  },
];

const badgeStyles = {
  Paid: "bg-green-100 text-green-700",
  Unpaid: "bg-red-100 text-red-700",
  "Home Delivery": "bg-blue-100 text-blue-700",
  "Store Pickup": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(ordersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sorting function
  const sortedOrders = useMemo(() => {
    let filtered = orders.filter((order) =>
      [order.id, order.customer, order.email]
        .some((field) =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    filtered.sort((a, b) => {
      let aKey = a[sortKey].toLowerCase();
      let bKey = b[sortKey].toLowerCase();

      if (aKey < bKey) return sortOrder === "asc" ? -1 : 1;
      if (aKey > bKey) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [orders, searchTerm, sortKey, sortOrder]);

  // Handle column header click to sort
  const handleSort = (key) => {
    if (sortKey === key) {
      // toggle sort order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Orders</h1>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by Order ID, Customer, or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2 items-center text-gray-700">
          <span>Sort by:</span>
          {["id", "customer", "email"].map((key) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`px-3 py-1 rounded cursor-pointer transition ${
                sortKey === key
                  ? "bg-[#51acec] text-white"
                  : "bg-white hover:bg-blue-100"
              }`}
            >
              {key === "id"
                ? "Order ID"
                : key === "customer"
                ? "Customer"
                : "Email"}
              {sortKey === key && (
                <span>{sortOrder === "asc" ? " ↑" : " ↓"}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#51acec] text-white">
            <tr>
              <th className="p-4 text-left cursor-pointer">Order ID</th>
              <th className="p-4 text-left cursor-pointer">Customer</th>
              <th className="p-4 text-left cursor-pointer">Email</th>
              <th className="p-4 text-left">Amount (৳)</th>
              <th className="p-4 text-left">Payment Status</th>
              <th className="p-4 text-left">Delivery Type</th>
              <th className="p-4 text-left">Delivery Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-600">
                  No orders found.
                </td>
              </tr>
            )}
            {sortedOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-4">{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">{order.email}</td>
                <td className="p-4 font-semibold">৳ {order.amount}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      badgeStyles[order.paymentStatus] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      badgeStyles[order.deliveryType] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.deliveryType}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      badgeStyles[order.deliveryStatus] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.deliveryStatus}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:underline"
                  >
                    View/Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedOrder && (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white border-2 border-gray-400 rounded-lg max-w-lg w-full p-6 relative shadow-lg">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Order Details - {selectedOrder.id}
            </h2>

            <p className="mb-2">
              <strong>Customer:</strong> {selectedOrder.customer}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {selectedOrder.email}
            </p>
            <p className="mb-2">
              <strong>Amount:</strong> ৳ {selectedOrder.amount}
            </p>
            <p className="mb-2">
              <strong>Payment Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  badgeStyles[selectedOrder.paymentStatus] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >
                {selectedOrder.paymentStatus}
              </span>
            </p>
            <p className="mb-2">
              <strong>Delivery Type:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  badgeStyles[selectedOrder.deliveryType] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >
                {selectedOrder.deliveryType}
              </span>
            </p>
            <p className="mb-2">
              <strong>Delivery Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  badgeStyles[selectedOrder.deliveryStatus] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >
                {selectedOrder.deliveryStatus}
              </span>
            </p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Items:</h3>
              <ul className="list-disc list-inside max-h-40 overflow-y-auto text-gray-700">
                {selectedOrder.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.qty}
                  </li>
                ))}
              </ul>
            </div>

            {/* Future: You can add edit fields here */}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              {/* Save button could go here if editing */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
