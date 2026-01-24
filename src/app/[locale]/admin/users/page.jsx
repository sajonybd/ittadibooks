

"use client";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [modalUser, setModalUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedRole, setUpdatedRole] = useState("");
  const [usersData, setUserData] = useState([]);
  const [roleFilter, setRoleFilter] = useState("user"); // default filter only user role
  const { locale } = useParams();

  const getUsers = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getAll`
    );
    setUserData(data?.users || []);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = usersData
    .filter(
      (user) =>
        // user.role !== "admin" && // always exclude admins
        (roleFilter === "all" ? true : user.role === roleFilter) &&
        (user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.role.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // always sort by name

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/updateRole/${modalUser._id}`,
        { role: updatedRole }
      );
      if (res.status === 200) {
        setUserData((prev) =>
          prev.map((user) =>
            user._id === modalUser._id ? { ...user, role: updatedRole } : user
          )
        );
        setModalUser((prev) => ({ ...prev, role: updatedRole }));
        setEditMode(false);
      }
    } catch (err) {
      // handle error
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Users</h2>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          className="input input-bordered w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select select-bordered w-full sm:w-52"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="user">Show Users</option>
          <option value="moderator">Show Moderators</option>
          {/* <option value="all">Show All (except Admins)</option> */}
          <option value="admin">Show Admins</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline btn-info"
                    onClick={() => {
                      setModalUser(user);
                      setUpdatedRole(user.role);
                      setEditMode(false);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View/Edit Modal */}
      <Dialog
        open={!!modalUser}
        onClose={() => {
          setModalUser(null);
          setEditMode(false);
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm "
      >
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative border-gray-400 border-2">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            onClick={() => setModalUser(null)}
          >
            <X />
          </button>
          <Dialog.Title className="text-xl font-bold mb-4 text-gray-800">
            User Details
          </Dialog.Title>

          {modalUser && (
            <div className="space-y-2 text-gray-800">
              <p>
                <strong>Name:</strong> {modalUser.name}
              </p>
              <p>
                <strong>Email:</strong> {modalUser.email}
              </p>

              <div>
                <strong>Role:</strong>{" "}
                {editMode ? (
                  <select
                    className="select select-bordered mt-1"
                    value={updatedRole}
                    onChange={(e) => setUpdatedRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                ) : (
                  <span className="ml-1">{modalUser.role}</span>
                )}
              </div>

              <div>
                <strong>Address:</strong>{" "}
                {modalUser.address &&
                (modalUser.address.street ||
                  modalUser.address.city ||
                  modalUser.address.state) ? (
                  <div className="ml-2 text-sm mt-1 space-y-1">
                    {modalUser.address.street && (
                      <p>Street: {modalUser.address.street}</p>
                    )}
                    {modalUser.address.city && (
                      <p>City: {modalUser.address.city}</p>
                    )}
                    {modalUser.address.state && (
                      <p>State: {modalUser.address.state}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 ml-1">
                    Not added
                  </span>
                )}
              </div>

              {!editMode ? (
                <button
                  className="btn btn-sm bg-[#599ab6] mt-4 text-white"
                  onClick={() => setEditMode(true)}
                >
                  Edit Role
                </button>
              ) : (
                <button
                  className="btn btn-sm bg-[#599ab6] text-white mt-4"
                  onClick={handleSave}
                >
                  Save
                </button>
              )}
            </div>
          )}
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
