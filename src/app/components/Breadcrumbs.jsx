const sortLabels = {
  ALL_BOOKS: "All Books",
  bestSellers: "Best Sellers",
  PRICE_ASC: "Price: Low to High",
  PRICE_DESC: "Price: High to Low",
  ID_DESC: "Newest First",
};
function Breadcrumbs({ sort, filters }) {
  const items = [];

  // Filters
  if (
    filters?.authors?.length > 0 ||
    filters?.publishers?.length > 0 ||
    filters?.ebookOnly ||
    filters?.inStockOnly
  ) {
    items.push("Filter");

    if (filters?.authors?.length > 0) {
      items.push(`Author: ${filters.authors.join(", ")}`);
    }
    if (filters?.publishers?.length > 0) {
      items.push(`Publisher: ${filters.publishers.join(", ")}`);
    }
    if (filters?.ebookOnly) {
      items.push("eBook Only");
    }
    if (filters?.inStockOnly) {
      items.push("In Stock");
    }
  }

  // Sort
  if (sort && sort !== "ALL_BOOKS") {
    items.push("Sort");
    items.push(sortLabels[sort] || sort);
  }

  if (items.length === 0) return null;

  return (
    <nav className="text-sm text-gray-700 mb-4">
      {items.map((item, idx) => (
        <span key={idx}>
          {item}
          {idx < items.length - 1 && (
            <span className="mx-2 text-gray-400">›</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
