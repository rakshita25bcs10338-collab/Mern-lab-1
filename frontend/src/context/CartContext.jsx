import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as cartService from "../services/cartService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyIds, setBusyIds] = useState([]); // product ids with a request in progress

  const refreshCart = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await cartService.getCart();
      setCartItems(res.data.cart);
    } catch (err) {
      if (err.response?.status === 401) setCartItems([]); // not logged in yet
      else setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // runs one API call for one product, then replaces the shared state with the server's cart
  const runMutation = async (productId, request) => {
    setBusyIds((prev) => [...prev, productId]);
    try {
      const res = await request();
      setCartItems(res.data.cart);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setBusyIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const addToCart = (productId) =>
    runMutation(productId, () => cartService.addToCart(productId));
  const updateQuantity = (productId, quantity) =>
    runMutation(productId, () => cartService.updateCartQuantity(productId, quantity));
  const removeFromCart = (productId) =>
    runMutation(productId, () => cartService.removeFromCart(productId));

  const clearCart = () => setCartItems([]);
  const isBusy = (productId) => busyIds.includes(productId);
  const getQuantity = (productId) =>
    cartItems.find((item) => item.product._id === productId)?.quantity || 0;

  // derived values: calculated from cartItems, never stored
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems, loading, error, cartCount, subtotal,
        refreshCart, addToCart, updateQuantity, removeFromCart,
        clearCart, isBusy, getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);