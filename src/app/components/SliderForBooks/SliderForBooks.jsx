

"use client";
import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./Slidestyles.css";
import BookCard from "../BookCard";
import SkeletonForBookCollection from "../SkeletonForBookCollection/SkeletonForBookCollection";

export default function SliderForBooks({ books }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,

    slides: {
      perView: 5,
      spacing: 10,
    },

    breakpoints: {
      "(max-width: 2560px)": {
        slides: {
          perView: 5,
          spacing: 10,
        },
      },
      "(max-width: 1280px)": {
        slides: {
          perView: 5,
          spacing: 10,
        },
      },
      "(max-width: 1024px)": {
        slides: {
          perView: 4,
          spacing: 10,
        },
      },
      "(max-width: 768px)": {
        slides: {
          perView: 3,
          spacing: 8,
        },
      },
      "(max-width: 480px)": {
        slides: {
          perView: 2,
          spacing: 6,
        },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },

    created() {
      setLoaded(true);
    },
  });
 
  // 🔁 Force re-calc when loaded or books update
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [books, loaded]);

  // 🐛 Fix issue: one slide on first load
  useEffect(() => {
    const timeout = setTimeout(() => {
      instanceRef.current?.update();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="navigation-wrapper relative  h-full">
      <div ref={sliderRef} className="keen-slider">
        {books.length > 0 ? (
          books.map((book, index) => (
            <div
              key={index}
              className={`keen-slider__slide number-slides${index + 1
                } h-fit bg-[#fffdfd] border-[1px] border-gray-300 rounded-2xl shadow  p-2 hover:shadow-lg transition`}
            >
              <BookCard book={book} />
              <div
                id="downSection"
                className="hidden absolute bottom-0 left-0 right-0 bg-white p-4 rounded-lg shadow-lg"
              >
                <div className="flex justify-between gap-2 mt-2">
                  <button
                    title="Add to Wishlist"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-400 hover:border-gray-500 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M19.285 12.645a3.8 3.8 0 0 0-5.416-5.332q-.288.288-.732.707l-.823.775l-.823-.775q-.445-.42-.733-.707a3.8 3.8 0 0 0-5.374 0c-1.468 1.469-1.485 3.844-.054 5.32l6.984 6.984l6.97-6.972zm-14.75-6.18a5 5 0 0 1 7.072 0q.273.274.707.682q.432-.408.707-.683a5 5 0 0 1 7.125 7.017l-7.125 7.126a1 1 0 0 1-1.414 0L4.48 13.48a5 5 0 0 1 .055-7.017z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    title="Add to Cart"
                    className="flex-1 px-4 py-2 rounded-full bg-[#51acec] text-white font-medium hover:bg-[#66a7c9] transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-10">
            {[1, 2, 3, 4, 5, 6].map((sk, idx) => (
              <SkeletonForBookCollection key={idx} />
            ))}
          </div>
        )}
      </div>

      {loaded && instanceRef.current && instanceRef.current.track?.details && (
        <>
          <Arrow
            left
            onClick={(e) => e.stopPropagation() || instanceRef.current?.prev()}
            disabled={currentSlide === 0}
          />
          <Arrow
            onClick={(e) => e.stopPropagation() || instanceRef.current?.next()}
            disabled={
              currentSlide ===
              instanceRef.current.track.details.slides.length - 1
            }
          />
        </>
      )}
    </div>
  );
}

function Arrow(props) {
  const disabled = props.disabled ? " arrow--disabled" : "";
  return (
    <svg
      onClick={props.onClick}
      className={`arrow  ${props.left ? "arrow--left" : "arrow--right"
        } ${disabled}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left ? (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      ) : (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}
