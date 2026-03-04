"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

export default function CheckoutView({ cartItems }) {
  // const { locale } = useParams();
  const [shippingOption, setShippingOption] = useState("dhaka");

  const t = useTranslations("checkout");
  const session = useSession();
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    email: "",
  });
  const { locale } = useParams();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [activePromoCodes, setActivePromoCodes] = useState([]);

   

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/promo/getAll`);
        const data = await res.json();
        if (data?.promoCodes) {
          const filtered = data.promoCodes.filter((p) => p.active);
          setActivePromoCodes(filtered);
        }
      } catch (err) {
        // // console.error("Failed to fetch promo codes:", err);
      }
    };

    fetchPromoCodes();
    const interval = setInterval(fetchPromoCodes, 5 * 60 * 1000);  
    return () => clearInterval(interval);
  }, []);

  const localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");

  const cartItemsMain = cartItems.map((item) => {
    const localItem = localCart.find(
      (l) => l.bookId === item.bookId || l.bookId === item.bookId
    );
    return {
      ...item,
      quantity: localItem?.quantity || 1, // fallback to 1 if not found
    };
  });

  const subtotal = cartItemsMain.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );
  const giftWrapCost = giftWrap ? 20 : 0;
  const shippingCost = shippingOption === "dhaka" ? 60 : 120;

  const grandTotal = subtotal + shippingCost + giftWrapCost - discount;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  

  const handleApplyPromo = () => {
    const promo = activePromoCodes.find(
      (p) => p.code.toLowerCase() === promoCode.trim().toLowerCase()
    );
  
    if (!promo) {
      toast.error("Invalid promo code");
      setDiscount(0);
      return;
    }

    let discountAmount = 0;
    if (promo.discountType === "fixed") {
      discountAmount = promo.discountValue;
    } else if (promo.discountType === "percentage") {
      discountAmount = (subtotal * promo.discountValue) / 100;
    }

    setDiscount(discountAmount);
    toast.success(`Promo applied! Discount: ৳${discountAmount}`);
  };
  const handleProceed = () => {
    if (!String(formData.fullName || "").trim()) {
      toast.error("Full Name is required");
      return;
    }
    if (!String(formData.mobile || "").trim()) {
      toast.error("Mobile Number is required");
      return;
    }
    if (!String(formData.street || "").trim()) {
      toast.error("Delivery Address is required");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (paymentMethod === "ssl") {
      handleSslPayment();
      return;
    }
    handleCodPayment();
  };

  useEffect(() => {
    const fetchAddressFromDb = async () => {
      if (!session?.data?.user?.email) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/get-address`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session?.data.user.email }),
          }
        );

        const data = await res.json();
        if (data) {
          setFormData((prev) => ({
            ...prev,
            ...(data?.address || {}),
            postalCode: data?.address?.postalCode || data?.address?.zip || "",
          }));
        }
      } catch (err) {
        // // // console.error("Failed to fetch address:", err);
      }
    };

    fetchAddressFromDb();
  }, [session]);

  const handleSslPayment = async () => {
    if (!session?.data?.user?.email) return;

    const orderData = {
      fullName: formData.fullName,
      mobile: formData.mobile,
      email: formData.email || session.data.user.email,
      address: {
        street: formData.street,
        city: formData.city || "",
        state: formData.state || "",
        postalCode: formData.postalCode || "",
        country: formData.country || "",
      },
      items: cartItemsMain.map((item) => ({
        bookId: item.bookId,
        title: item.title,
        quantity: item.quantity,
        price: item.discountedPrice,
      })),
      subtotal,
      shippingCost,
      giftWrapCost,
      discount,
      grandTotal,
      paymentMethod: "ssl",
    };

    // setPayLoading(true);

    toast
      .promise(
        (async () => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderData),
            }
          );

          const data = await res.json();
 

          if (data?.data?.GatewayPageURL) {
            setTimeout(() => {
              window.location.replace(data.data.GatewayPageURL);
            }, 1000);
            return "Redirecting to SSLCommerz...";
          } else {
 
          }
        })(),
        {
          loading: "Preparing payment...",
          success: <b>Redirecting to SSLCommerz</b>,
          error: <b>Failed to start payment.</b>,
        }
      )
      .finally(() => {
        // setPayLoading(false);
      });
  };
  const handleCodPayment = async () => {
    if (!session?.data?.user?.email) return;

    const orderData = {
      fullName: formData.fullName,
      mobile: formData.mobile,
      email: formData.email || session.data.user.email,
      address: {
        street: formData.street,
        city: formData.city || "",
        state: formData.state || "",
        postalCode: formData.postalCode || "",
        country: formData.country || "",
      },
      items: cartItemsMain.map((item) => ({
        bookId: item.bookId,
        title: item.title,
        quantity: item.quantity,
        price: item.discountedPrice,
      })),
      subtotal,
      shippingCost,
      giftWrapCost,
      discount,
      grandTotal,
      paymentMethod: "cod",
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/cashondelivery`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      if (res.redirected) {
        window.location.href = res.url; // redirect to success page
      } else {
        const data = await res.json();
        // // // console.error("COD Error:", data);
      }
    } catch (error) {
      // // // console.error("COD Payment Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] py-10 px-4 md:px-16 rounded-lg">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 md:p-10 shadow-2xl rounded-2xl">
        {/* Address Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("shippingTitle")}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Full Name (আপনার নাম) *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Mobile Number (মোবাইল নাম্বার) *
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Delivery Address (ঠিকানা) *
              </label>
              <textarea
                name="street"
                value={formData.street || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Shipping Options */}
            <div className="mt-2">
              <h3 className="text-sm font-bold mb-2">{t("selectShipping")}</h3>
              <div className="space-y-2 text-sm font-semibold">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shippingOption"
                    value="dhaka"
                    checked={shippingOption === "dhaka"}
                    onChange={() => setShippingOption("dhaka")}
                    className="accent-blue-600"
                  />
                  ঢাকা সিটি (৳ 60)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shippingOption"
                    value="outside"
                    checked={shippingOption === "outside"}
                    onChange={() => setShippingOption("outside")}
                    className="accent-blue-600"
                  />
                  ঢাকার বাইরে (৳ 120)
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-2">
              <h3 className="text-xl font-semibold mb-2">{t("selectMethod")}</h3>
              <div className="space-y-2">
                {["ssl", "cod"].map((method) => (
                  <label
                    key={method}
                    className="flex items-center gap-2 text-base text-gray-800"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-blue-600"
                    />
                    {t(`methods.${method}`)}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleProceed}
              disabled={!paymentMethod}
              className={`w-full mt-2 text-white font-semibold py-3 rounded-lg transition ${paymentMethod
                ? "bg-[#67bee4] hover:bg-[#50addb]"
                : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              {paymentMethod === "cod" ? "Place COD Order" : "Pay Now"}
            </button>
          </div>
        </div>

        {/* Order Summary & Payment */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("orderSummary")}
          </h2>

          <div className="space-y-4">
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-gray-200 p-4 rounded-lg"
              >
                <Image
                  src={item.cover?.url}
                  height={80}
                  width={64}
                  className="w-16 h-20 object-cover object-center rounded-md"
                  alt={item.title?.[locale]}
                />
                <div className="flex-1">
                  <h3 className="text-gray-800 font-semibold">
                    {item.title?.[locale]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("qty")}: {item.quantity}
                  </p>
                </div>
                <p className="text-gray-800 font-medium">
                  ৳ {item.discountedPrice * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Promo Code */}
          <div className="mt-6">
            <label className="block mb-1 text-sm font-medium">
              {t("promoCode.label")}
            </label>
            <div className="flex flex-col lg:flex-row gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder={t("promoCode.placeholder")}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button
                onClick={handleApplyPromo}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                {t("promoCode.apply")}
              </button>
            </div>
            {discount > 0 && (
              <p className="text-green-600 mt-1 text-sm">
                {t("promoCode.success")}
              </p>
            )}
          </div>

          {/* Gift Wrap */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={() => setGiftWrap(!giftWrap)}
              className="accent-blue-600"
            />
            <label className="text-gray-700 text-sm">
              {t("giftWrap.label", { price: giftWrapCost })}
            </label>
          </div>
          {/* Summary Totals */}
          <div className="border-t pt-4 mt-4 text-right space-y-1 text-sm text-gray-800 font-medium">
            <div className="flex justify-between">
              <span>{t("summary.subtotal")}</span>
              <span>৳ {subtotal}</span>
            </div>
            {/* shipping */}
            <div className="flex justify-between">
              <span>{t("shipping")}</span>
              <span>৳ {shippingCost}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>{t("summary.discount")}</span>
                <span>-৳ {discount}</span>
              </div>
            )}

            {giftWrap && (
              <div className="flex justify-between">
                <span>{t("summary.giftWrap")}</span>
                <span>৳ {giftWrapCost}</span>
              </div>
            )}

            <div className="flex justify-between font-bold border-t pt-2 text-base text-gray-800">
              <span>{t("total")}</span>
              <span>৳ {grandTotal}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
