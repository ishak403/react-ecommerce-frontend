import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/orders";

export default function Cart() {
  const {
    cart,
    loading,
    removeFromCart,
    updateQuantity,
    getTotal,
    refetchCart,
  } = useCart();
  const { user } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Check if user is logged in
    if (!user) {
      navigate("/login");
      return;
    }

    setCheckoutLoading(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.productId || item.product?.id || item.id,
          quantity: item.quantity,
        })),
      };

      await createOrder(orderData);
      await refetchCart();
      navigate("/orders");
    } catch (error) {
      alert(
        "Failed to place order: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
          Loading cart...
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
          <p className="text-gray-600 mb-6">Your cart is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          Your Cart
        </h1>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cart.map((item) => {
                const price = item.product?.price || item.price;
                return (
                  <tr key={item.id || item.productId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.product?.name || item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.productId || item.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-16 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{price * item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          removeFromCart(item.productId || item.id)
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 mb-8">
          {cart.map((item) => {
            const price = item.product?.price || item.price;
            return (
              <div
                key={item.id || item.productId}
                className="bg-white rounded-lg shadow p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900 flex-1">
                    {item.product?.name || item.name}
                  </h3>
                  <button
                    onClick={() => removeFromCart(item.productId || item.id)}
                    className="text-red-600 hover:text-red-900 ml-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{price}
                  </span>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.productId || item.id,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-16 px-2 py-1 border rounded text-center"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{price * item.quantity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold">
              Total: ₹{getTotal()}
            </h2>
            {!user && cart.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Please login to place your order
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors order-2 sm:order-1"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors order-1 sm:order-2"
            >
              {checkoutLoading
                ? "Placing..."
                : user
                ? "Place Order"
                : "Login to Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
