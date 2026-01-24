 

"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const t = useTranslations("login");
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("/"); // fallback

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const cb = url.searchParams.get("callbackUrl");
      if (cb) setCallbackUrl(cb);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (res?.ok) {
      router.push(callbackUrl);
    } else {
      alert("Invalid email or password");
    }
  };

  const handleSocialLogin = (provider) => {
    signIn(provider, { callbackUrl });
  };
  const handleShowPass = () => {
    setShowPass(!showPass);
  };
  return (
    <section className="mb-5">
      <div className="flex bg-white items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-8">
        <div className="xl:mx-auto xl:w-full shadow-md p-4 xl:max-w-sm 2xl:max-w-md">
          <h2 className="text-center text-2xl font-bold text-black">
            {t("title")}
          </h2>
          <div className="flex justify-center">
            <Link
              href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="mt-2 text-sm text-gray-600 hover:underline"
            >
              {t("subtitle")}
            </Link>
          </div>

          <form onSubmit={handleLogin} className="mt-8">
            <div className="space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">
                  {t("email")}
                </label>
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-gray-900">
                    {t("password")}
                  </label>
                  <a
                    href="#"
                    className="text-sm font-semibold text-black hover:underline"
                  >
                    {t("forgot")}
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    required
                  />
                  {showPass ? (
                    <button
                      type="button"
                      onClick={handleShowPass}
                      className="absolute right-4 top-[13px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"
                        ></path>
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleShowPass}
                      className="absolute right-4 top-[13px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"
                        ></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2.5 rounded-md font-semibold hover:bg-black/80"
              >
                {t("submit")}
              </button>
            </div>
          </form>

          <div className="mt-4 space-y-3">
            <button
              onClick={() => handleSocialLogin("google")}
              className="w-full flex items-center justify-center border border-gray-400 rounded-md py-2.5 px-3.5 bg-white text-gray-700 hover:bg-gray-100"
              type="button"
            >
              <Image
                src="/assets/images/google.jpg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              {t("google")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
