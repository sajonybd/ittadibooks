"use client";
import React from "react";

export default function ReturnRefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        রিটার্ন এবং রিফান্ড পলিসি
      </h1>

      <p className="mb-8 text-center text-gray-600">
        স্বাগতম <span className="font-semibold">ইত্যাদি গ্রন্থ প্রকাশ</span>-এ।  
        আমরা আমাদের গ্রাহকদের সর্বোচ্চ সন্তুষ্টি নিশ্চিত করার চেষ্টা করি।  
        নিচে আমাদের রিফান্ড এবং রিটার্ন নীতিমালা বিস্তারিতভাবে দেওয়া হলো।
      </p>

      {/* Refund Policy */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">রিফান্ড নীতিমালা</h2>
        <p className="mb-4">
          গ্রাহকের সন্তুষ্টিকে আমরা সর্বাধিক গুরুত্ব দিই। যদি কোনো কারণে আপনার অর্ডার
          সম্পূর্ণ করা সম্ভব না হয়, তাহলে নিম্নোক্ত শর্তে অর্থ ফেরত দেওয়া হবে:
        </p>

        <h3 className="text-lg font-semibold mb-2">রিফান্ড পাওয়ার যোগ্যতা</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>যদি অর্ডারকৃত বই স্টকে না থাকে বা অর্ডার বাতিল হয়।</li>
          <li>যদি নির্ধারিত সময়ের (৭–১০ কর্মদিবস) মধ্যে ডেলিভারি না হয়।</li>
          <li>যদি অনলাইনে অতিরিক্ত অর্থ কেটে নেওয়া হয়।</li>
          <li>যদি ভুল বা ক্ষতিগ্রস্ত বই সরবরাহ করা হয়।</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">রিফান্ডের মাধ্যম</h3>
        <p className="mb-4">
          রিফান্ড গ্রাহকের ব্যবহৃত মূল পেমেন্ট মাধ্যমেই প্রদান করা হবে (বিকাশ, নগদ,
          রকেট, ব্যাংক ট্রান্সফার বা কার্ড পেমেন্ট)। ক্যাশ অন ডেলিভারি অর্ডারের ক্ষেত্রে
          রিফান্ড প্রযোজ্য নয়।
        </p>

        <h3 className="text-lg font-semibold mb-2">রিফান্ডের সময়সীমা</h3>
        <p className="mb-4">
          সাধারণত ৭–১০ কর্মদিবসের মধ্যে রিফান্ড সম্পন্ন হয়। কিছু বিশেষ ক্ষেত্রে বেশি সময়
          লাগতে পারে। নির্ধারিত সময়ে রিফান্ড না পেলে, আমাদের সাথে যোগাযোগ করুন{" "}
          <a
            href="mailto:info@ittadibooks.com"
            className="text-blue-600 underline"
          >
            info@ittadibooks.com
          </a>
          এ।
        </p>
      </section>

      {/* Return Policy */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">রিটার্ন নীতিমালা</h2>
        <p className="mb-4">
          আমরা চাই আপনার কেনাকাটা হোক ঝামেলাহীন ও নিরাপদ। তবে কিছু নির্দিষ্ট ক্ষেত্রে
          বই ফেরত (Return) গ্রহণ করা হবে:
        </p>

        <h3 className="text-lg font-semibold mb-2">রিটার্ন গ্রহণযোগ্য কারণসমূহ</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>যদি অর্ডার অনুযায়ী সঠিক বই না পৌঁছায়।</li>
          <li>যদি বই ক্ষতিগ্রস্ত অবস্থায় পাওয়া যায় (ফাটা, ভেজা বা ছেঁড়া)।</li>
          <li>যদি ছাপার গুরুতর ত্রুটি থাকে এবং বইটি পড়া অসম্ভব হয়।</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">রিটার্ন অগ্রহণযোগ্য হবে যদি</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>বইটি একাধিকবার ব্যবহার/পড়া হয়ে থাকে।</li>
          <li>বইয়ের কভার বা পৃষ্ঠায় কোনো পরিবর্তন, লিখন বা ক্ষতি করা হয়।</li>
          <li>গ্রাহক শুধুমাত্র মত পরিবর্তন করেছেন বা বইটি আর প্রয়োজন নেই।</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">ডেলিভারি চার্জ নীতি</h3>
        <p className="mb-4">
          যদি গ্রাহক ব্যক্তিগত কারণে (যেমন শুধু মত বদলানো) রিটার্ন করতে চান, তবে ডেলিভারি
          চার্জ গ্রাহককে বহন করতে হবে।  
          বৈধ রিটার্নের ক্ষেত্রে (যেমন ভুল বা ক্ষতিগ্রস্ত বই), আমরা সম্পূর্ণ রিফান্ড /
          রিপ্লেসমেন্ট ও উভয় দিকের ডেলিভারি চার্জ কভার করবো।
        </p>

        <h3 className="text-lg font-semibold mb-2">রিটার্ন প্রক্রিয়া</h3>
        <ol className="list-decimal pl-6 mb-4 space-y-1">
          <li>আমাদের কাস্টমার কেয়ারে যোগাযোগ করুন।</li>
          <li>অর্ডার আইডি ও সমস্যার বিস্তারিত তথ্য দিন।</li>
          <li>অনুমোদনের পর রিটার্ন প্রসেস শুরু হবে।</li>
          <li>নির্দিষ্ট ঠিকানায় বই ফেরত পাঠাতে হবে নির্ধারিত সময়ের মধ্যে।</li>
        </ol>

        <p className="mt-6 text-sm text-gray-500">
          নোট: ইত্যাদি গ্রন্থ প্রকাশ কর্তৃপক্ষের সিদ্ধান্ত অনুযায়ী যে কোনো সময় এই নীতিমালা পরিবর্তন
          করা হতে পারে।
        </p>
      </section>
    </div>
  );
}
