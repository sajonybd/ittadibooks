import { useEffect, useRef, useState } from "react";
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
export default function RatingCom({rating,setRating}) {
  const ratingRef = useRef(null);
 

  return (
    <Rating
      style={{ maxWidth: 180 }}
      ref={ratingRef}
      value={rating}
      onChange={setRating}
    />
  );
}
