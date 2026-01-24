import "./globals.css";

export const metadata = {
  title: "Ittadi Books | Bookstore",
  description:
    "Buy Bengali and English books online from Ittadi Prokashani. Discover a wide range of academic, literature, and children's books with fast delivery across Bangladesh and worldwide.",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
