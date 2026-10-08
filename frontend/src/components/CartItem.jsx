import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const { product, quantity } = item;
  const { updateQuantity, removeFromCart, isBusy } = useCart();
  const [error, setError] = useState("");
  const busy = isBusy(product._id);

  const change = async (action) => {
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex gap-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-28 h-28 object-cover rounded-lg"
      />

      <div className="flex-1">
        <Link to={`/products/${product._id}`} className="font-semibold text-lg hover:underline">
          {product.name}
        </Link>
        <p className="text-gray-500 text-sm">{product.category}</p>
        <p className="font-bold">₹{product.price.toLocaleString("en-IN")}</p>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => change(() => updateQuantity(product._id, quantity - 1))}
            disabled={busy || quantity <= 1}
            className="w-8 h-8 border rounded disabled:opacity-40"
          >
            -
          </button>
          <span className="w-6 text-center">{quantity}</span>
          <button
            onClick={() => change(() => updateQuantity(product._id, quantity + 1))}
            disabled={busy || quantity >= product.stock}
            className="w-8 h-8 border rounded disabled:opacity-40"
          >
            +
          </button>
          <button
            onClick={() => change(() => removeFromCart(product._id))}
            disabled={busy}
            className="ml-4 text-red-500 hover:underline disabled:opacity-40"
          >
            {busy ? "Updating..." : "Remove"}
          </button>
        </div>

        {quantity >= product.stock && (
          <p className="text-gray-500 text-xs mt-1">Maximum available quantity reached</p>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div className="font-bold">
        ₹{(product.price * quantity).toLocaleString("en-IN")}
      </div>
    </div>
  );
}

export default CartItem;