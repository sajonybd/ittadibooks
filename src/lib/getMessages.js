import axios from "axios";
 

// lib/getMessages.js
export async function getMessages(locale) {
 
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/i18n/${locale}`
  );
  if (!res.ok) return "Failed to fetch i18n messages";
  return res.json();
}
