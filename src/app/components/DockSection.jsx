"use client";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React from "react";

export default function DockSection() {
  const t = useTranslations("NavLinks");

  const pathname = usePathname();
 

  return (
    <div className="dock dock-md bg-[#F9FAFB] hidden shadow-lg">
      {/* home */}
      <button>
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            fill={
              pathname === "/bn" || pathname === "/en"
                ? "#51acec"
                : "currentColor"
            }
            strokeLinejoin="miter"
            strokeLinecap="butt"
          >
            <polyline
              points="1 11 12 2 23 11"
              fill="none"
              stroke={
                pathname === "/bn" || pathname === "/en"
                  ? "#51acec"
                  : "currentColor"
              }
              strokeMiterlimit="10"
              strokeWidth="2"
            ></polyline>
            <path
              d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7"
              fill="none"
              stroke={
                pathname === "/bn" || pathname === "/en"
                  ? "#51acec"
                  : "currentColor"
              }
              strokeLinecap="square"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></path>
            <line
              x1="12"
              y1="22"
              x2="12"
              y2="18"
              fill="none"
              stroke={
                pathname === "/bn" || pathname === "/en"
                  ? "#51acec"
                  : "currentColor"
              }
              strokeLinecap="square"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></line>
          </g>
        </svg>
        <span
          className={`dock-label ${
            pathname === "/bn" || pathname === "/en" ? "text-[#51acec] font-semibold" : ""
          }`}
        >
          {t("home")}
        </span>
      </button>
      {/* wishlist */}
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="hover:text-[#51acec] duration-150 size-[1.2em]"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M19.285 12.645a3.8 3.8 0 0 0-5.416-5.332q-.288.288-.732.707l-.823.775l-.823-.775q-.445-.42-.733-.707a3.8 3.8 0 0 0-5.374 0c-1.468 1.469-1.485 3.844-.054 5.32l6.984 6.984l6.97-6.972zm-14.75-6.18a5 5 0 0 1 7.072 0q.273.274.707.682q.432-.408.707-.683a5 5 0 0 1 7.125 7.017l-7.125 7.126a1 1 0 0 1-1.414 0L4.48 13.48a5 5 0 0 1 .055-7.017z"
          ></path>
        </svg>
        <span className="dock-label">{t("wishlist")}</span>
      </button>

      {/* cart */}
      <button className="dock-active">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 56 56"
          className="hover:text-[#51acec] duration-150 size-[1.2em]"
        >
          <path
            fill="currentColor"
            d="M20.008 39.649H47.36c.913 0 1.71-.75 1.71-1.758s-.797-1.758-1.71-1.758H20.406c-1.336 0-2.156-.938-2.367-2.367l-.375-2.461h29.742c3.422 0 5.18-2.11 5.672-5.461l1.875-12.399a7 7 0 0 0 .094-.89c0-1.125-.844-1.899-2.133-1.899H14.641l-.446-2.976c-.234-1.805-.89-2.72-3.28-2.72H2.687c-.937 0-1.734.822-1.734 1.76c0 .96.797 1.781 1.735 1.781h7.921l3.75 25.734c.493 3.328 2.25 5.414 5.649 5.414m31.054-25.454L49.4 25.422c-.188 1.453-.961 2.344-2.344 2.344l-29.906.023l-1.993-13.594ZM21.86 51.04a3.766 3.766 0 0 0 3.797-3.797a3.78 3.78 0 0 0-3.797-3.797c-2.132 0-3.82 1.688-3.82 3.797c0 2.133 1.688 3.797 3.82 3.797m21.914 0c2.133 0 3.82-1.664 3.82-3.797c0-2.11-1.687-3.797-3.82-3.797c-2.109 0-3.82 1.688-3.82 3.797c0 2.133 1.711 3.797 3.82 3.797"
          ></path>
        </svg>
        <span className="dock-label">{t("cart")}</span>
      </button>

      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="hover:text-[#51acec] duration-150 size-[1.2em]"
          viewBox="0 0 24 24"
        >
          <g fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path
              strokeLinejoin="round"
              d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
            ></path>
            <circle cx={12} cy={7} r={3}></circle>
          </g>
        </svg>
        <span className="dock-label">{t("settings")}</span>
      </button>
    </div>
  );
}
