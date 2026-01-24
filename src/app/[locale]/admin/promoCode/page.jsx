"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PromoAdminPage() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("fixed");
  const [discountValue, setDiscountValue] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchPromoCodes = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/promo/getAll`);
      setPromoCodes(res.data.promoCodes);
    } catch (err) {
      // // console.error("Failed to fetch promo codes:", err);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const handleAdd = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/promo/add`, {
        code,
        discountType,
        discountValue: Number(discountValue),
      });
      setCode("");
      setDiscountValue("");
      fetchPromoCodes();
    } catch (err) {
      // // console.error("Failed to add promo code:", err);
    }
  };

  const handleEdit = (promo) => {
    setCode(promo.code);
    setDiscountType(promo.discountType);
    setDiscountValue(promo.discountValue);
    setEditingId(promo._id);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/promo/update`, {
        id: editingId,
        code,
        discountType,
        discountValue: Number(discountValue),
      });
      setCode("");
      setDiscountType("fixed");
      setDiscountValue("");
      setEditingId(null);
      fetchPromoCodes();
    } catch (err) {
      // // console.error("Failed to save edit:", err);
    }
  };

  const handleToggleActive = async (id, newStatus) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/promo/update`, {
        id,
        active: newStatus,
      });
      fetchPromoCodes();
    } catch (err) {
      // // console.error("Failed to toggle active:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/promo/delete?id=${id}`);
      fetchPromoCodes();
    } catch (err) {
      // // console.error("Failed to delete promo code:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Promo Codes</h2>

      {/* Add / Edit Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="fixed">Fixed</option>
          <option value="percentage">Percentage</option>
        </select>
        <input
          type="number"
          placeholder="Discount Value"
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={editingId ? handleSaveEdit : handleAdd}
          className="bg-blue-500 text-white px-4 rounded"
        >
          {editingId ? "Save" : "Add"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setCode("");
              setDiscountType("fixed");
              setDiscountValue("");
            }}
            className="bg-gray-400 text-white px-4 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Promo Codes Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Code</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Value</th>
            <th className="border px-2 py-1">Active</th>
            <th className="border px-2 py-1  w-[200px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {promoCodes.map((p) => (
            <tr key={p._id}>
              <td className="border px-2 py-1">{p.code}</td>
              <td className="border px-2 py-1">{p.discountType}</td>
              <td className="border px-2 py-1">{p.discountValue}</td>
              <td className="border px-2 py-1">{p.active ? "Yes" : "No"}</td>
              <td className="border px-2 py-1 flex gap-2">
                {/* Edit button */}
                <button
                  className="bg-yellow-400 px-2 py-1 rounded text-white"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>

                {/* Toggle Active */}
                <button
                  className={`px-2 py-1 rounded text-white ${
                    p.active ? "bg-red-500" : "bg-green-500"
                  }`}
                  onClick={() => handleToggleActive(p._id, !p.active)}
                >
                  {p.active ? "Deactivate" : "Activate"}
                </button>

                {/* Delete button */}
                <button
                  className="bg-gray-500 px-2 py-1 rounded text-white"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
