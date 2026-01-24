"use client";

import React from "react";

const CustomDateInput = React.forwardRef(
  ({ value, onClick, onChange }, ref) => (
    <input
      type="text"
      onClick={onClick}
      onChange={onChange}
      ref={ref}
      value={value}
      className="border-[1px] border-[#969696] py-2 px-4 rounded-lg w-full cursor-text text-black"
      placeholder="DD/MM/YYYY"
    />
  )
);

CustomDateInput.displayName = "CustomDateInput";

export default CustomDateInput;
