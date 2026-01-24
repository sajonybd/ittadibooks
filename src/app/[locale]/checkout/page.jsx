

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const savedAddress = {
  fullName: "Md Shihab",
  street: "123 Dhaka Street",
  city: "Dhaka",
  state: "Dhaka Division",
  zip: "1207",
  country: "Bangladesh",
};


export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(savedAddress);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const giftWrapCost = giftWrap ? 20 : 0;
  const grandTotal = subtotal + giftWrapCost - discount;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApplyPromo = () => {
    if (promoCode === "SAVE100") {
      setDiscount(100);
    } else {
      alert("Invalid promo code");
      setDiscount(0);
    }
  };

  const handleProceed = () => {
    if (!paymentMethod) return;
    setShowSummaryModal(true);
    // alert(`Proceeding with: ${paymentMethod}`);
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] py-10 px-4 md:px-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 md:p-10 shadow-2xl rounded-2xl">
        {/* Address Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("shippingTitle")}
          </h2>

          {!showForm && (
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
                onClick={() => setShowForm(false)}
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
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-gray-200 p-4 rounded-lg"
              >
                <img
                  src={item.cover}
                  className="w-16 h-20 object-cover rounded-md"
                  alt={item.title}
                />
                <div className="flex-1">
                  <h3 className="text-gray-800 font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    {t("qty")}: {item.quantity}
                  </p>
                </div>
                <p className="text-gray-800 font-medium">
                  ৳ {item.price * item.quantity}
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
          <div className="border-t pt-4 mt-4 text-right space-y-1 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>{t("summary.subtotal")}</span>
              <span>৳ {subtotal}</span>
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
                  className="flex items-center gap-2 text-base text-gray-700"
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
            className={`w-full mt-6 text-white font-semibold py-3 rounded-lg transition ${
              paymentMethod
                ? "bg-[#67bee4] hover:bg-[#50addb]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {t("proceed")}
          </button>
        </div>
      </div>

      {/* Checkout Summary Modal */}
      {showSummaryModal && (
        <div className="fixed top-20 inset-0 bg-white backdrop-blur-lg bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4 shadow-lg relative border-2 border-gray-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              {t("summaryModal.title")}
            </h3>

            <div className="text-sm space-y-1">
              <p>
                <strong>{t("summaryModal.paymentMethod")}:</strong>{" "}
                {paymentMethod === "ssl" ? t("methodsS.ssl") : t("methodsS.cod")}
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
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>৳ {item.price * item.quantity}</span>
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

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
              >
                {t("summaryModal.cancel")}
              </button>
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  alert(
                    t("summaryModal.orderPlacedAlert", {
                      method: paymentMethod.toUpperCase(),
                    })
                  );
                  // Replace alert with actual order submission logic
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
              >
                {t("summaryModal.confirmOrder")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
