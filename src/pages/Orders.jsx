import { useEffect, useState } from "react";
import { getUserOrders } from "../api/orders";
import { useAuth } from "../context/AuthContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      loadOrders();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  const loadOrders = async () => {
    try {
      const response = await getUserOrders();
      console.log("Orders response:", response.data);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="max-w-7xl mx-auto p-6">Loading orders...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <p className="text-gray-600">Please log in to view your orders.</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                <p className="text-gray-600">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Status</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "shipped"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Items:</h4>
              <div className="space-y-2">
                {order.Products?.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {product.name} (x{product.OrderItem?.quantity || 1})
                    </span>
                    <span>₹{product.OrderItem?.price || product.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
