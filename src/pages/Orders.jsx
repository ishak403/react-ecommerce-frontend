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
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, user]);

  const loadOrders = async () => {
    try {
      const res = await getUserOrders();
      setOrders(res.data.orders || []);
    } catch {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto bg-white p-8 rounded shadow">
          Loading orders...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto bg-white p-8 rounded shadow">
          Please login to view orders.
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto bg-white p-8 rounded shadow text-center">
          <h1 className="text-2xl font-bold">No Orders Yet</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                {order.status}
              </span>
            </div>

            <div className="border-t pt-4 space-y-2">
              {order.Products?.map((p) => (
                <div key={p.id} className="flex justify-between text-sm">
                  <span>
                    {p.name} x {p.OrderItem?.quantity}
                  </span>
                  <span>₹{p.OrderItem?.price || p.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
