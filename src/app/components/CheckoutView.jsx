"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

export default function CheckoutView({ cartItems }) {
  // const { locale } = useParams();
  const [shippingOption, setShippingOption] = useState("dhaka");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const router = useRouter();
  const t = useTranslations("checkout");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const session = useSession();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
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

  const [address, setAddress] = useState([]);
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
    if (!paymentMethod) return;
    setShowSummaryModal(true);
    // alert(`Proceeding with: ${paymentMethod}`);
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
          setFormData(data?.address);
          setAddress(data);
        }
      } catch (err) {
        // // // console.error("Failed to fetch address:", err);
      }
    };

    fetchAddressFromDb();
  }, [session]);

  const handleFormSubmit = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update-address`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setAddress(data.address || formData); // Update state with new address
        setShowForm(false); // Hide the form
      } else {
        // // // console.error("Failed to update address:", data.error);
        alert("Failed to update address. Please try again.");
      }
    } catch (err) {
      // // // console.error("Submit error:", err);
      alert("Something went wrong while updating the address.");
    }
  };

  const handleSslPayment = async () => {
    if (!session?.data?.user?.email) return;

    const orderData = {
      email: session.data.user.email,
      fullName: formData.fullName,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
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
      email: session.data.user.email,
      fullName: formData.fullName,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
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

          {!showForm && (
            <>
              {formData.fullName ? (
                <>
                  <div className="bg-[#f0f8ff] p-4 rounded-lg text-sm text-gray-700">
                    <p>
                      <strong>{t("fields.fullName")}:</strong> {formData.fullName}
                    </p>
                    <p>
                      <strong>{t("address")}:</strong> {formData.street},{" "}
                      {formData.city}, {formData.state}, {formData.zip}
                    </p>
                    <p>
                      <strong>{t("fields.country")}:</strong> {formData.country}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 bg-[#67bee4] hover:bg-[#50addb] text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    {t("editShipping")}
                  </button>
                </>
              ) : (
                <>
                  <p>No shipping address added.</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 bg-[#67bee4] hover:bg-[#50addb] text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    {t("addShipping")}
                  </button>
                </>
              )}
            </>
          )}

          {showForm && (
            <div className="space-y-4">
              {["fullName", "street", "city", "state", "zip", "country"].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-gray-600 capitalize">
                      {t(`fields.${field}`)}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                )
              )}
              <button
                onClick={handleFormSubmit}
                className="mt-4 bg-[#67bee4] hover:bg-[#50addb] text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                {t("saveShipping")}
              </button>
            </div>
          )}
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
          {/* Shipping Options */}
          <div className="mt-4">
            <h3 className="text-sm font-bold  mb-2">{t("selectShipping")}</h3>
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

          {/* Payment Method */}
          <div className="mt-6">
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
            className={`w-full mt-6 text-white font-semibold py-3 rounded-lg transition ${paymentMethod
              ? "bg-[#67bee4] hover:bg-[#50addb]"
              : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {paymentMethod === "cod" ? t("confirm") : t("proceed")}


          </button>
        </div>
      </div>

      {/* Checkout Summary Modal */}
      {showSummaryModal && (
        <div className="fixed   inset-0 bg-white backdrop-blur-lg bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 space-y-4 shadow-lg relative border-2 border-gray-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              {t("summaryModal.title")}
            </h3>

            <div className="text-sm space-y-1">
              <p>
                <strong>{t("summaryModal.paymentMethod")}:</strong>{" "}
                {paymentMethod === "ssl"
                  ? t("methodsS.ssl")
                  : t("methodsS.cod")}
              </p>
              <p>
                <strong>{t("summaryModal.name")}:</strong> {formData.fullName}
              </p>
              <p>
                <strong>{t("summaryModal.address")}:</strong> {formData.street},{" "}
                {formData.city}, {formData.state} - {formData.zip},{" "}
                {formData.country}
              </p>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                {t("summaryModal.items")}:
              </h4>
              <ul className="text-sm text-gray-700 space-y-1 max-h-32 overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>
                      {item.title?.[locale]} × {item.quantity}
                    </span>
                    <span>৳ {item.discountedPrice * item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-3 text-sm text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span>{t("summaryModal.subtotal")}</span>
                <span>৳ {subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>{t("summaryModal.discount")}</span>
                  <span>-৳ {discount}</span>
                </div>
              )}
              {giftWrap && (
                <div className="flex justify-between">
                  <span>{t("summaryModal.giftWrap")}</span>
                  <span>৳ {giftWrapCost}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>{t("summaryModal.total")}</span>
                <span>৳ {grandTotal}</span>
              </div>
            </div>

            
            {/* Terms & Conditions Checkbox */}
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-5 w-5 accent-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                />
                <div className="text-sm text-gray-700">
                  <span>
                    During checkout, I have read and agree to the{" "}
                  </span>
                  <a
                    href="/terms"
                    target="_blank"
                    className="text-blue-600 font-medium underline hover:text-blue-800 transition"
                  >
                    Terms & Conditions
                  </a>
                  <span>, </span>
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    className="text-blue-600 font-medium underline hover:text-blue-800 transition"
                  >
                    Privacy Policy
                  </a>
                  <span>, and </span>
                  <a
                    href="/refund-policy"
                    target="_blank"
                    className="text-blue-600 font-medium underline hover:text-blue-800 transition"
                  >
                    Return & Refund Policy
                  </a>
                  <span>.</span>
                </div>
              </label>
            </div>


            {/* Confirm Buttons */}
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
              >
                {t("summaryModal.cancel")}
              </button>

              {paymentMethod === "ssl" && (
                <button
                  onClick={handleSslPayment}
                  disabled={!agreeTerms} // disable until checked
                  className={`px-4 py-2 text-sm rounded text-white ${agreeTerms
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  {t("summaryModal.confirmOrder")}
                </button>
              )}

              {paymentMethod === "cod" && (
                <button
                  onClick={handleCodPayment}
                  disabled={!agreeTerms} // disable until checked
                  className={`px-4 py-2 text-sm rounded text-white ${agreeTerms
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  {t("summaryModal.confirmOrder")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
