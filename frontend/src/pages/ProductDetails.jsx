import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { getWishlist } from "../services/wishlistService";
import Navbar from "../components/Navbar";
import WishlistButton from "../components/WishlistButton";
import AddToCartButton from "../components/AddToCartButton";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getProductById(id);
        setProduct(res.data.product);
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 400) {
          setError("Product not found.");
        } else {
          setError("Something went wrong while loading the product.");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // check whether this product is already saved
  useEffect(() => {
    getWishlist()
      .then((res) => setWishlisted(res.data.wishlist.some((p) => p._id === id)))
      .catch(() => setWishlisted(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <Link to="/products" className="text-gray-600 hover:text-black">← Back to products</Link>

        {loading && <p className="mt-6 text-gray-600">Loading product...</p>}
        {!loading && error && <p className="mt-6 text-red-500">{error}</p>}

        {!loading && !error && product && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 grid md:grid-cols-2 gap-8">
            <img
              src={product.image} alt={product.name}
              className="w-full max-h-96 object-cover rounded-lg"
            />
            <div className="space-y-3">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-gray-500">{product.category}</p>
              <p className="text-gray-700">{product.description}</p>
              <p className="text-2xl font-bold">₹{product.price.toLocaleString("en-IN")}</p>
              <p className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
              <WishlistButton productId={product._id} initiallyWishlisted={wishlisted} />
              <AddToCartButton product={product} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;