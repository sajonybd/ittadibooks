

'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function UserDashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome{session?.user?.name ? `, ${session.user.name}` : ''}
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your books, account settings, and more from your dashboard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/user/my-orders"
            className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition hover:bg-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">📦 My Orders</h2>
            <p className="text-gray-600">View and manage your book orders.</p>
          </Link>

          <Link
            href="/user/wishlist"
            className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition hover:bg-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">❤️ Wishlist</h2>
            <p className="text-gray-600">See your saved books and manage them.</p>
          </Link>

          <Link
            href="/user/profile"
            className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition hover:bg-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">👤 Profile</h2>
            <p className="text-gray-600">Edit your personal and shipping details.</p>
          </Link>

          <Link
            href="/user/password"
            className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition hover:bg-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">🔐 Change Password</h2>
            <p className="text-gray-600">Secure your account with a new password.</p>
          </Link>

          {/* Add more features here if needed */}
        </div>
      </div>
    </div>
  );
}
