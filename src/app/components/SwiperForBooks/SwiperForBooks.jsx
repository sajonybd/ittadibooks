import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './SwiperForBooks.css';

// import required modules
import { Navigation, Pagination } from 'swiper/modules';
import BookCard from '../BookCard';
import 'swiper/css/navigation';
export default function SwiperForBooks({ books }) {
    return (
        <>
            <div className='swiperDiv'>
                <Swiper
                    // slidesPerView={5}
                    breakpoints={{
                        320: { // mobile
                            slidesPerView: 2,
                            spaceBetween: 8,
                        },
                        375: { // mobile
                            slidesPerView: 2,
                            spaceBetween: 8,
                        },
                        640: { // small devices
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        768: { // tablets
                            slidesPerView: 3,
                            spaceBetween: 15,
                        },
                        1024: { // laptops
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                        1280: { // desktops
                            slidesPerView: 5,
                            spaceBetween: 25,
                        },
                    }}
                    navigation={true}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination, Navigation]}
                    className="mySwiper booksSwiper"
                >
                    {
                        books.length > 0 && books.map((book, idx) => (
                            <SwiperSlide className="h-full" key={idx}>
                                <BookCard book={book} />
                            </SwiperSlide>
                        ))
                    }


                </Swiper>
            </div>
        </>
    );
}
