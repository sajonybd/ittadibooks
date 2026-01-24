import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      email,
      fullName,
      address,
      items,
      subtotal,
      shippingCost,
      giftWrapCost,
      discount,
      grandTotal,
      paymentMethod,
    } = await req.json();

    const tran_id = `TXN_${Date.now()}_${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const init_url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    const formData = new FormData();
    formData.append("store_id", process.env.NEXT_SSL_ID);
    formData.append("store_passwd", process.env.NEXT_SSL_PASS);
    formData.append("total_amount", `${grandTotal.toFixed(2)}`);
    formData.append("currency", "BDT");
    formData.append("tran_id", tran_id);
    formData.append(
      "success_url",
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/success-payment?id=${tran_id}`
    );
    formData.append(
      "fail_url",
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/failed-payment`
    );
    formData.append(
      "cancel_url",
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cancel-payment`
    );

    // Customer Info
    formData.append("cus_name", fullName || "Customer");
    formData.append("cus_email", email || "unknown@mail.com");
    formData.append("cus_add1", address.street || "N/A");
    formData.append("cus_add2", address.street || "N/A");
    formData.append("cus_city", address.city || "Dhaka");
    formData.append("cus_state", address.state || "Dhaka");
    formData.append("cus_postcode", address.postalCode || "0000");
    formData.append("cus_country", address.country || "Bangladesh");
    formData.append("cus_phone", "01700000000");
    formData.append("cus_fax", "01700000000");

    // Shipping Info
    formData.append("ship_name", fullName || "Customer");
    formData.append("ship_add1", address.street || "N/A");
    formData.append("ship_add2", address.apartment || "N/A");
    formData.append("ship_city", address.city || "Dhaka");
    formData.append("ship_state", address.state || "Dhaka");
    formData.append("ship_postcode", address.postalCode || "0000");
    formData.append("ship_country", address.country || "Bangladesh")
    // Product Info
 
    formData.append("shipping_method", "Courier");
    formData.append("product_name", "Book Order");
    formData.append("product_category", "Books");
    formData.append("product_profile", "general");
    formData.append("multi_card_name", "mastercard,visacard,amexcard");

    // You can also pass some custom values
    formData.append("value_a", email); // use for post-payment tracking

    // Send request to SSLCommerz
    const response = await fetch(init_url, {
      method: "POST",
      body: formData,
    });

    const sslRes = await response.json();
 

    if (sslRes.status !== "SUCCESS") {
      return NextResponse.json(
        { error: "Payment gateway failed" },
        { status: 500 }
      );
    }

    // Save order in DB with pending status
    const db = await connectDb();
    await db.collection("orders").insertOne({
      email,
      fullName,
      address,
      items,
      subtotal,
      shippingCost,
      giftWrapCost,
      discount,
      grandTotal,
      paymentMethod,
      paymentTransactionId: tran_id,
      paymentStatus: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({ data: sslRes });
  } catch (e) {
    // // // console.error("Create Payment Error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
