import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../api/products";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    page: 1,
    limit: 9,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await searchProducts({
        ...filters,
        minPrice: filters.minPrice || 0,
        maxPrice: filters.maxPrice || 0,
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [filters.page]);

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            Welcome to ShopEase
          </h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8">
            Discover amazing products at unbeatable prices
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-xl overflow-hidden border-2 border-white">
              <svg
                className="w-5 h-5 text-gray-400 ml-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>

              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={filters.search}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters({ ...filters, search: value, page: 1 });

                  if (value.length > 2 || value.length === 0) {
                    setTimeout(() => {
                      loadProducts();
                    }, 300);
                  }
                }}
                className="flex-1 px-4 py-4 text-gray-800 outline-none text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN BACKGROUND */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* FILTER CARD */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-10 flex flex-wrap gap-4 items-center">
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="border px-4 py-2 rounded-lg"
            >
              <option value="">All Categories</option>
              <option>Electronics</option>
              <option>Beauty</option>
              <option>Furniture</option>
              <option>Fashion</option>
              <option>Mobiles</option>
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
              className="border px-4 py-2 rounded-lg"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
              className="border px-4 py-2 rounded-lg"
            />

            <button
              onClick={() => {
                setFilters({ ...filters, page: 1 });
                loadProducts();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Apply
            </button>
          </div>

          {/* PRODUCTS GRID */}
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-lg">{p.name}</h3>
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {p.category}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {p.description || "No description"}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">₹{p.price}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/product/${p.id}`)}
                          className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            addToCart(p);
                            window.scrollTo(0, 0);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          <div className="flex justify-center gap-4 mt-12">
            <button
              disabled={filters.page === 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              className="border px-4 py-2 rounded"
            >
              Prev
            </button>

            <span className="px-4 py-2">Page {filters.page}</span>

            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              className="border px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
