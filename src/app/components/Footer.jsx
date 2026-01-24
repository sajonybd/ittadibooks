import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 mt-05">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ittadi Books</h2>
          <p className="text-sm">
            Discover a wide collection of books across genres. We’re dedicated
            to readers, learners, and thinkers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/ittadi-books">Ittadi Books</Link>
            </li>
            <li>
              <Link href="/terms">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/refund-policy">Return & Refund Policy</Link>
            </li>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>

            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/categories/Literature">Literature</Link>
            </li>
            <li>
              <Link href="/categories/Fiction">Fiction</Link>
            </li>
            <li>
              <Link href="/categories/Poetry">Poetry</Link>
            </li>
            <li>
              <Link href="/categories/History">History</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="text-sm">Email: info@ittadibooks.com</p>
          <p className="text-sm">Phone: +880 1735 393639</p>
         
          <p className="text-sm">
            Address: 38/3, P K Roy Road Banglabazar Dhaka-1100
          </p>
          <p className="text-sm">TIN: 490200233284</p>
        </div>
      </div>

      <div className="w-full lg:px-5 py-5 mx-auto">
        <Image
          src="/assets/images/ssl.png"
          width={1800}
          height={800}
          className="w-full h-full"
          alt="SSL Commerz"
        />
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Ittadi Books. All rights reserved.
        Developed by{" "}
        <a
          href="https://digiaidit.com/"
          className="text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          DigiAid
        </a>
        .
      </div>
    </footer>
  );
}
