

import { getAllBooks } from "@/lib/booksCache";
import { getCategories, getNavbarAuthors } from "@/lib/siteDataCache";
import NavBarClient from "./NavBarClient";


export const revalidate = false;

export default async function Navbar() {
  const [books, authors, categories] = await Promise.all([
    getAllBooks(),
    getNavbarAuthors(),
    getCategories(),
  ]);

  return (
    <NavBarClient books={books} authors={authors} categories={categories} />
  );
}
