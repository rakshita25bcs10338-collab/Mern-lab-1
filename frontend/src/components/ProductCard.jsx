import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";
import AddToCartButton from "./AddToCartButton";

function ProductCard({ product, isWishlisted }) {
  const outOfStock = product.stock === 0;

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

      {outOfStock ? (
        <p className="text-red-500 text-sm mb-3">Out of stock</p>
      ) : (
        <p className="text-green-600 text-sm mb-3">{product.stock} units left</p>
      )}

      <div className="mt-auto">
        <WishlistButton productId={product._id} initiallyWishlisted={isWishlisted} />
        <AddToCartButton product={product} />
        <Link
          to={`/products/${product._id}`}
          className="block text-center bg-black text-white py-2 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;