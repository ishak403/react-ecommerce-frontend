import { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem,
  removeCartItem,
} from "../api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await getCart();
      console.log("Cart response:", response.data); // Debug log
      const cartData =
        response.data.data || response.data.items || response.data || [];
      console.log("Cart data:", cartData); // Debug log
      setCart(Array.isArray(cartData) ? cartData : []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product) => {
    try {
      await apiAddToCart(product.id, 1);
      await fetchCart(); // Refresh cart after adding
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (id) => {
    try {
      await removeCartItem(id);
      await fetchCart(); // Refresh cart after removing
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }
    try {
      await updateCartItem(id, quantity);
      await fetchCart(); // Refresh cart after updating
    } catch (error) {
      console.error("Failed to update cart item:", error);
      throw error;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product?.price || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        refetchCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
