import { useState } from "react";
import { useCart } from "../context/CartContext";

function AddToCartButton({ product }) {
  const { addToCart, isBusy, getQuantity } = useCart();
  const [error, setError] = useState("");

  const busy = isBusy(product._id);
  const inCart = getQuantity(product._id);
  const outOfStock = product.stock === 0;
  const maxed = inCart > 0 && inCart >= product.stock;

  const handleClick = async () => {
    setError("");
    try {
      await addToCart(product._id);
    } catch (err) {
      setError(err.message);
    }
  };

  let label = "Add to Cart";
  if (outOfStock) label = "Out of Stock";
  else if (busy) label = "Adding...";
  else if (maxed) label = "Max in Cart";
  else if (inCart > 0) label = "Add Another";

  return (
    <div className="mb-2">
      <button
        onClick={handleClick}
        disabled={busy || outOfStock || maxed}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {label}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default AddToCartButton;