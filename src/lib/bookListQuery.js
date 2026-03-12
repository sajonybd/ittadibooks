export function buildBookListQuery({
  page = 1,
  limit = 12,
  sort = "ALL_BOOKS",
  collection,
  category,
  authors = [],
  publishers = [],
  ebookOnly = false,
  inStockOnly = false,
}) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("sort", sort);

  if (collection) {
    params.set("collection", collection);
  }

  if (category) {
    params.set("category", category);
  }

  if (authors.length) {
    params.set("authors", authors.join(","));
  }

  if (publishers.length) {
    params.set("publishers", publishers.join(","));
  }

  if (ebookOnly) {
    params.set("ebookOnly", "true");
  }

  if (inStockOnly) {
    params.set("inStockOnly", "true");
  }

  return params.toString();
}
