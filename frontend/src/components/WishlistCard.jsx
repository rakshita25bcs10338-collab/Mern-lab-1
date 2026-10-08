import { useState } from "react";
import { Link } from "react-router-dom";
import { removeFromWishlist } from "../services/wishlistService";

function WishlistCard({ product, onRemoved }) {
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  const handleRemove = async () => {
    setRemoving(true);
    setError("");
    try {
      await removeFromWishlist(product._id);
      onRemoved(product._id);
    } catch {
      setError("Unable to remove product. Please try again.");
      setRemoving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded-xl mb-3"
        />
      ) : (
        <div className="w-full h-40 rounded-xl mb-3 bg-gray-300 flex items-center justify-center text-white font-semibold">
          {product.name}
        </div>
      )}

      <h2 className="font-semibold text-lg">{product.name}</h2>
      <p className="text-gray-500 text-sm">{product.category}</p>
      <p className="font-bold mt-1">₹{product.price.toLocaleString("en-IN")}</p>

      {product.stock === 0 ? (
        <p className="text-red-500 text-sm mb-3">Out of stock</p>
      ) : (
        <p className="text-green-600 text-sm mb-3">{product.stock} units left</p>
      )}

      <div className="mt-auto space-y-2">
        <Link
          to={`/products/${product._id}`}
          className="block text-center bg-black text-white py-2 rounded"
        >
          View Details
        </Link>
        <button
          onClick={handleRemove}
          disabled={removing}
          className="w-full border border-red-500 text-red-500 py-2 rounded hover:bg-red-50 disabled:opacity-60"
        >
          {removing ? "Removing..." : "Remove ♥"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}

export default WishlistCard;