import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { getWishlist } from "../services/wishlistService";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // wait until the user stops typing before calling the API
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // load which products are already in the wishlist (once)
  useEffect(() => {
    getWishlist()
      .then((res) => setWishlistIds(res.data.wishlist.map((p) => p._id)))
      .catch(() => setWishlistIds([]));
  }, []);

  useEffect(() => {
    let ignore = false; // prevents an old response from overwriting a newer one
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await getProducts({ search: debouncedSearch, category, sort });
        if (!ignore) setProducts(res.data.products);
      } catch (err) {
        if (!ignore) setError(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [debouncedSearch, category, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Products</h1>

        <SearchBar
          search={search} setSearch={setSearch}
          category={category} setCategory={setCategory}
          sort={sort} setSort={setSort}
        />

        {loading && <p className="text-gray-600">Loading products...</p>}
        {!loading && error && (
          <p className="text-red-500">Something went wrong while loading products.</p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="text-gray-600">No products found.</p>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                isWishlisted={wishlistIds.includes(p._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;