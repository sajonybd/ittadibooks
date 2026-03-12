"use client";

import { useEffect, useMemo, useState } from "react";
import Pagination from "@/app/components/Pagination";

const badgeStyles = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  cod: "bg-blue-100 text-blue-700",
  ssl: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
};

const normalizeLabel = (value, fallback = "N/A") => {
  if (!value) return fallback;
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const isSameLocalDay = (left, right) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const formatOrderTime = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  const now = new Date();

  if (isSameLocalDay(date, now)) {
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ago`;
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editPaymentStatus, setEditPaymentStatus] = useState("pending");
  const [editDeliveryStatus, setEditDeliveryStatus] = useState("pending");
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusNotice, setStatusNotice] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, sortKey, sortOrder]);

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
          search: searchTerm.trim(),
          sortField: sortKey,
          sortOrder,
        });

        const res = await fetch(`/api/admin/orders/getAll?${params.toString()}`);
        const data = await res.json();

        if (!mounted) return;

        if (res.ok && data?.success) {
          setOrders(data.orders || []);
          setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
        } else {
          setOrders([]);
          setPagination({ page: 1, limit: 20, total: 0, totalPages: 1 });
        }
      } catch {
        if (!mounted) return;
        setOrders([]);
        setPagination({ page: 1, limit: 20, total: 0, totalPages: 1 });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, [page, searchTerm, sortKey, sortOrder, reloadKey]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const tableRows = useMemo(() => {
    return orders.map((order) => {
      const paymentStatus = String(order?.paymentStatus || "pending").toLowerCase();
      const deliveryStatus = String(order?.deliveryStatus || "pending").toLowerCase();
      const paymentMethod = String(order?.paymentMethod || "cod").toLowerCase();

      return {
        id: order?.orderId || order?.paymentTransactionId || String(order?._id || "-"),
        customer: order?.fullName || "N/A",
        email: order?.email || "N/A",
        amount: Number(order?.grandTotal || 0),
        createdAt: order?.createdAt,
        paymentStatus,
        paymentMethod,
        deliveryStatus,
        raw: order,
      };
    });
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Orders</h1>
      {statusNotice && (
        <p className="mb-3 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
          {statusNotice}
        </p>
      )}

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
          {["createdAt", "orderId", "customer", "email", "amount"].map((key) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`px-3 py-1 rounded cursor-pointer transition ${
                sortKey === key ? "bg-[#51acec] text-white" : "bg-white hover:bg-blue-100"
              }`}
            >
              {key === "createdAt"
                ? "Date"
                : key === "orderId"
                ? "Order ID"
                : key === "customer"
                ? "Customer"
                : key === "email"
                ? "Email"
                : "Amount"}
              {sortKey === key && <span>{sortOrder === "asc" ? " ↑" : " ↓"}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#51acec] text-white">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Order Time</th>
              <th className="p-4 text-left">Amount (৳)</th>
              <th className="p-4 text-left">Payment Status</th>
              <th className="p-4 text-left">Payment Method</th>
              <th className="p-4 text-left">Delivery Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && tableRows.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-600">
                  No orders found.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-600">
                  Loading orders...
                </td>
              </tr>
            )}
            {!loading &&
              tableRows.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.customer}</td>
                  <td className="p-4">{order.email}</td>
                  <td className="p-4 whitespace-nowrap">{formatOrderTime(order.createdAt)}</td>
                  <td className="p-4 font-semibold">৳ {order.amount}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        badgeStyles[order.paymentStatus] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {normalizeLabel(order.paymentStatus)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        badgeStyles[order.paymentMethod] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {normalizeLabel(order.paymentMethod)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        badgeStyles[order.deliveryStatus] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {normalizeLabel(order.deliveryStatus)}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(order.raw);
                        setEditPaymentStatus(String(order.raw?.paymentStatus || "pending").toLowerCase());
                        setEditDeliveryStatus(String(order.raw?.deliveryStatus || "pending").toLowerCase());
                      }}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.page || 1}
        totalPages={pagination.totalPages || 1}
        totalItems={pagination.total || 0}
        pageSize={pagination.limit || 20}
        onPageChange={(nextPage) => setPage(nextPage)}
      />

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
              Order Details - {selectedOrder?.orderId || selectedOrder?.paymentTransactionId || selectedOrder?._id}
            </h2>

            <p className="mb-2"><strong>Customer:</strong> {selectedOrder?.fullName || "N/A"}</p>
            <p className="mb-2"><strong>Email:</strong> {selectedOrder?.email || "N/A"}</p>
            <p className="mb-2"><strong>Phone:</strong> {selectedOrder?.mobile || "N/A"}</p>
            <p className="mb-2"><strong>Order Time:</strong> {formatOrderTime(selectedOrder?.createdAt)}</p>
            <p className="mb-2"><strong>Amount:</strong> ৳ {selectedOrder?.grandTotal || 0}</p>
            <p className="mb-2"><strong>Payment:</strong> {normalizeLabel(selectedOrder?.paymentMethod)}</p>
            <p className="mb-2"><strong>Address:</strong> {selectedOrder?.address?.street || "N/A"}</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {["pending", "paid", "failed", "refunded"].map((status) => (
                    <option key={status} value={status}>
                      {normalizeLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Delivery Status
                </label>
                <select
                  value={editDeliveryStatus}
                  onChange={(e) => setEditDeliveryStatus(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                    <option key={status} value={status}>
                      {normalizeLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Items:</h3>
              <ul className="list-disc list-inside max-h-40 overflow-y-auto text-gray-700">
                {(selectedOrder?.items || []).map((item, idx) => (
                  <li key={idx}>
                    {item?.title?.bn || item?.title?.en || item?.title || item?.name || "Item"} × {item?.quantity || item?.qty || 1}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={async () => {
                  if (!selectedOrder?._id && !selectedOrder?.orderId) return;
                  try {
                    setSavingStatus(true);
                    const targetId =
                      (typeof selectedOrder?._id === "string"
                        ? selectedOrder._id
                        : selectedOrder?._id?.$oid) || selectedOrder?.orderId;
                    const res = await fetch(`/api/admin/orders/update/${targetId}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        paymentStatus: editPaymentStatus,
                        deliveryStatus: editDeliveryStatus,
                      }),
                    });

                    if (!res.ok) {
                      throw new Error("Failed");
                    }

                    setSelectedOrder(null);
                    setReloadKey((k) => k + 1);
                    setStatusNotice("Order status updated successfully.");
                  } catch {
                    setStatusNotice("Failed to update order status.");
                  } finally {
                    setSavingStatus(false);
                  }
                }}
                disabled={savingStatus}
                className="px-4 py-2 bg-[#51acec] text-white rounded hover:bg-[#4690ac] disabled:opacity-60"
              >
                {savingStatus ? "Saving..." : "Save Status"}
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
