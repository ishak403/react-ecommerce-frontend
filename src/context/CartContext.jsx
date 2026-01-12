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

  // Load cart from localStorage for non-logged-in users
  const loadLocalCart = () => {
    try {
      const localCart = localStorage.getItem("guest_cart");
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Error loading local cart:", error);
      return [];
    }
  };

  // Save cart to localStorage for non-logged-in users
  const saveLocalCart = (cartItems) => {
    try {
      localStorage.setItem("guest_cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving local cart:", error);
    }
  };

  const fetchCart = async () => {
    if (!user) {
      // Load from localStorage for guest users
      setCart(loadLocalCart());
      return;
    }

    try {
      setLoading(true);
      const response = await getCart();
      console.log("Cart response:", response.data); // Debug log
      const cartData =
        response.data.data || response.data.items || response.data || [];
      console.log("Cart data:", cartData); // Debug log
      const serverCart = Array.isArray(cartData) ? cartData : [];

      // Merge local cart with server cart if user just logged in
      const localCart = loadLocalCart();
      if (localCart.length > 0 && serverCart.length === 0) {
        // If server cart is empty but local cart has items, we could sync them
        // For now, just use server cart and clear local
        localStorage.removeItem("guest_cart");
      }

      setCart(serverCart);
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
    if (!user) {
      // Handle guest cart
      const currentCart = loadLocalCart();
      const existingItem = currentCart.find(
        (item) => item.productId === product.id || item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        currentCart.push({
          id: Date.now(), // temporary ID for local storage
          productId: product.id,
          product: product,
          quantity: 1,
          price: product.price,
        });
      }

      saveLocalCart(currentCart);
      setCart(currentCart);
      return;
    }

    try {
      await apiAddToCart(product.id, 1);
      await fetchCart(); // Refresh cart after adding
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (id) => {
    if (!user) {
      // Handle guest cart
      const currentCart = loadLocalCart();
      const updatedCart = currentCart.filter(
        (item) => item.id !== id && item.productId !== id
      );
      saveLocalCart(updatedCart);
      setCart(updatedCart);
      return;
    }

    try {
      await removeCartItem(id);
      await fetchCart(); // Refresh cart after removing
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (!user) {
      // Handle guest cart
      const currentCart = loadLocalCart();
      const item = currentCart.find(
        (item) => item.id === id || item.productId === id
      );

      if (item) {
        if (quantity <= 0) {
          const updatedCart = currentCart.filter(
            (cartItem) => cartItem.id !== id && cartItem.productId !== id
          );
          saveLocalCart(updatedCart);
          setCart(updatedCart);
        } else {
          item.quantity = quantity;
          saveLocalCart(currentCart);
          setCart(currentCart);
        }
      }
      return;
    }

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
    if (!user) {
      localStorage.removeItem("guest_cart");
    }
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
