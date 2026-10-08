import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import WishlistCard from "../components/WishlistCard";
import { getWishlist } from "../services/wishlistService";

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadWishlist = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getWishlist();
      setProducts(res.data.wishlist);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemoved = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        {!loading && !error && (
          <p className="text-gray-600 mb-4">
            {products.length} {products.length === 1 ? "product" : "products"} saved
          </p>
        )}

        {loading && <p className="text-gray-600 mt-4">Loading your wishlist...</p>}

        {!loading && error && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold">Something went wrong.</p>
            <p className="text-gray-600 mb-4">We couldn't load your wishlist.</p>
            <button onClick={loadWishlist} className="bg-black text-white px-4 py-2 rounded">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="mt-10 text-center">
            <div className="text-5xl mb-3">❤️</div>
            <p className="text-lg font-semibold">Your wishlist is empty</p>
            <p className="text-gray-600 mb-4">Save products you love and find them here later.</p>
            <Link to="/products" className="inline-block bg-black text-white px-4 py-2 rounded">
              Browse Products
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <WishlistCard key={p._id} product={p} onRemoved={handleRemoved} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;