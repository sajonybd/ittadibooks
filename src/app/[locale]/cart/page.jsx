import { redirect } from "next/navigation";

export default async function CartPage({ params }) {
  const resolved = params && typeof params.then === "function" ? await params : params;
  const locale = resolved?.locale || "bn";
  redirect(`/${locale}/checkout`);
}
