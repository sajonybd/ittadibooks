

"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OrderSuccessPage() {
  const params = useParams();
  const id = params.id;
  const t = useTranslations("ordersuccess");
  const [loading, setLoading] = useState(true); // Track deletion status
const { locale } = useParams();
  useEffect(() => {
    const clearCart = async () => {
      // Clear localStorage
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartBookIds");
      localStorage.removeItem("cartCount");

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/clear`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          // // // console.error("Failed to clear cart from DB");
        }
      } catch (error) {
        // // // console.error("Error clearing cart from DB:", error);
      }

      setLoading(false); // Allow page to render
    };

    clearCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-gray-600">
        loading...
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4">
      <CheckCircle size={80} className="text-green-500 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        {t("successTitle")}
      </h1>

      {id && (
        <p className="text-base text-gray-600 mb-2">
          {t("orderIdLabel")}: <span className="font-bold">{id}</span>
        </p>
      )}

      <p className="text-sm text-gray-600 mb-6">{t("thankYou")}</p>

      <Link href="/">
        <button className="bg-[#51acec] hover:saturate-150 text-white font-semibold px-6 py-2 rounded-md">
          {t("backToHome")}
        </button>
      </Link>
    </div>
  );
}
