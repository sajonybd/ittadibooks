

"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 font-sans px-6 md:px-20 py-20">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center">
        {t("title")}
      </h1>

      {/* Map */}
      <div className="rounded-xl overflow-hidden shadow-lg w-full h-80 mb-16">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.1548985552013!2d90.41190399999999!3d23.706161899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b90775f37bfb%3A0xdb0da4d6b6d6dd78!2z4KaH4Kak4KeN4Kav4Ka-4Kam4Ka_IOCml-CnjeCmsOCmqOCnjeCmpSDgpqrgp43gprDgppXgpr7gprY!5e0!3m2!1sen!2sbd!4v1756197930407!5m2!1sen!2sbd"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Main Contact Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 bg-white p-10 rounded-xl shadow-xl">
        {/* Contact Info */}
        <div className="space-y-6 text-gray-700">
          <h2 className="text-2xl font-semibold mb-4">
            {t("contactInfoTitle")}
          </h2>

          {/* Address */}
          <div className="flex items-start gap-4">
            <div className="text-blue-500">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
            </div>
            <p>{t("contactInfoAddress")}</p>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <div className="text-blue-500">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1.003 1.003 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C9.61 21 3 14.39 3 6.5a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1.003 1.003 0 0 1-.24 1.01l-2.21 2.2z" />
              </svg>
            </div>
            <p>{t("contactInfoPhone")}</p>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="text-blue-500">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4H4c-1.1 0-2 .9-2 2v1.2l10 6.3 10-6.3V6c0-1.1-.9-2-2-2zm0 4.25-8 5.05-8-5.05V18h16V8.25z" />
              </svg>
            </div>
            <p>{t("contactInfoEmail")}</p>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitted && (
            <div className="p-4 bg-green-100 text-green-700 rounded shadow">
              {t("successMessage")}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-600">
              {t("name")}
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder={t("namePlaceholder")}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-600">
              {t("email")}
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder={t("emailPlaceholder")}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-600">
              {t("message")}
            </label>
            <textarea
              name="message"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder={t("messagePlaceholder")}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#51acec] hover:bg-[#5ca5c5] text-white font-semibold px-6 py-3 rounded-md transition duration-200"
          >
            {t("sendMessage")}
          </button>
        </form>
      </div>
    </div>
  );
}
