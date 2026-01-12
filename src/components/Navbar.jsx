import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          ShopEase
        </Link>

        <div className="space-x-6 flex items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          {user && (
            <Link
              to="/cart"
              className="text-gray-700 hover:text-blue-600 relative"
            >
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {user && (
            <Link to="/orders" className="text-gray-700 hover:text-blue-600">
              Orders
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/adminorders"
              className="text-gray-700 hover:text-blue-600"
            >
              Admin Orders
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-gray-700">
                  Hi, {user?.name || user?.email || "User"}
                </span>
              </div>

              <button onClick={logout} className="text-red-600 hover:underline">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
