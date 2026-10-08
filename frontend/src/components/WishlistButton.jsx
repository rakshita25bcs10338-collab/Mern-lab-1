import { useEffect, useState } from "react";
import { addToWishlist } from "../services/wishlistService";

function WishlistButton({ productId, initiallyWishlisted = false }) {
  const [saved, setSaved] = useState(initiallyWishlisted);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // the wishlist loads after the cards render, so sync when the prop changes
  useEffect(() => {
    setSaved(initiallyWishlisted);
  }, [initiallyWishlisted]);

  const handleAdd = async () => {
    if (busy || saved) return; // prevents duplicate clicks
    setBusy(true);
    setError("");
    try {
      await addToWishlist(productId);
      setSaved(true);
    } catch (err) {
      if (err.response?.status === 409) setSaved(true);
      else if (err.response?.status === 401) setError("Please log in to use your wishlist.");
      else setError("Unable to save product. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  let label = "♡ Add to Wishlist";
  if (busy) label = "⏳ Saving...";
  else if (saved) label = "♥ Added to Wishlist";

  return (
    <div className="mb-2">
      <button
        onClick={handleAdd}
        disabled={busy || saved}
        className="w-full py-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {label}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default WishlistButton;