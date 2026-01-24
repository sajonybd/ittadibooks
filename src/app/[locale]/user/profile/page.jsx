"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
// const { locale } = useRouter();
  const [profileData, setProfileData] = useState({
    name: "",
    image: "",
  });

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchImageFromDb = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/user-image`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email }),
          }
        );

        const data = await res.json();

        setProfileData({
          name: session.user.name || "",
          image: data.image || "/assets/images/profile/profile.png",
        });
      } catch (err) {
        // // // console.error("Failed to fetch image:", err);
        setProfileData({
          name: session.user.name || "",
          image: "/assets/images/profile/profile.png",
        });
      }
    };
    const fetchAddressFromDb = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/get-address`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });

        const data = await res.json();
        if (data.address) {
          setAddress(data.address);
        }
      } catch (err) {
        // // // console.error("Failed to fetch address:", err);
      }
    };

    fetchAddressFromDb();

    fetchImageFromDb();
  }, [session]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_uploads"); // Replace with your actual preset
    formData.append("folder", "user-profiles-ittadi-books"); // Upload to specific folder

    setUploading(true);

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/mdshihab/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error("No secure_url in response");

      // Update local state
      setProfileData({ ...profileData, image: data.secure_url });

      // Call API to update image in MongoDB
      const dbRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update-image`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: data.secure_url }),
      });

      if (!dbRes.ok) throw new Error("Failed to update image in DB");
    } catch (err) {
      // // // console.error("Image upload or DB update failed:", err);
      alert("Image upload or save failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      alert("Profile updated!");
    } catch (err) {
      // // // console.error(err);
      alert("Error updating profile");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update-address`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });

      if (!res.ok) throw new Error("Failed to update address");
      alert("Address updated!");
    } catch (err) {
      // // // console.error(err);
      alert("Error updating address");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* Profile Info */}
      <form
        onSubmit={handleProfileSubmit}
        className="space-y-4 bg-[#F3F4F6] p-4 rounded shadow-lg"
      >
        <h2 className="text-xl font-semibold">Profile Details</h2>

        <div className="flex items-center space-x-4">
          <Image
            src={profileData.image || "/assets/images/profile/profile.png"}
            width={80}
            height={80}
            alt="Profile"
            className="rounded-full"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
        </div>

        {uploading && (
          <p className="text-sm text-gray-500">Uploading image...</p>
        )}

        <input
          type="text"
          name="name"
          value={profileData.name}
          onChange={handleProfileChange}
          placeholder="Full Name"
          className="border p-2 rounded w-full"
          required
        />

        <button
          type="submit"
          className="bg-[#51acec] text-white px-4 py-2 rounded "
        >
          Save Profile
        </button>
      </form>

      {/* Shipping Address */}
      <form
        onSubmit={handleAddressSubmit}
        className="space-y-4 bg-[#F3F4F6] p-4 rounded shadow"
      >
        <h2 className="text-xl font-semibold">Shipping Address</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={address.street}
            onChange={handleAddressChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleAddressChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleAddressChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={handleAddressChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={address.country}
            onChange={handleAddressChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-[#51acec] text-white px-4 py-2 rounded "
        >
          Save Address
        </button>
      </form>
    </div>
  );
}
