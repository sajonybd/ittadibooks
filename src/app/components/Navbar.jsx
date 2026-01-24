

import { getAllBooks } from "@/lib/booksCache";
import NavBarClient from "./NavBarClient";


export const revalidate = false;

export default async function Navbar() {
  const books = await getAllBooks()

  return <NavBarClient books={books} />;
}
