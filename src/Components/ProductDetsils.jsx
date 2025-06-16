import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get product image URL
  const getProductImageUrl = (product) => {
    const imageField = product.image_url || product.image || product.thumbnail;
    if (imageField) {
      if (imageField.startsWith("/uploads/")) {
        return `http://localhost:5000${imageField}`;
      }
      return imageField;
    }
    return "https://via.placeholder.com/500x500/f5e6d3/5e3023?text=No+Image";
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("LKR", "Rs.");
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        const productData = data.product || data;
        setProduct(productData);
        console.log("Image URL:", getProductImageUrl(productData));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = () => {
    const item = { ...product, quantity, product_id: product.product_id };
    console.log("Added to Cart:", item);
    alert(`${quantity} ${product.name}(s) added to cart!`);
  };

  const handleProceedToPayment = () => {
    const order = { ...product, quantity, product_id: product.product_id };
    console.log("Navigating to Payment with:", order);
    navigate("/payment", { state: { order } });
  };

  const handleQuantityChange = (value) => {
    setQuantity(Math.max(1, value));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff9f5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d3756b] mx-auto mb-4"></div>
          <p className="text-[#8c5f53] text-lg">Loading delicious product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff9f5]">
        <div className="text-center bg-white rounded-xl shadow-md border border-[#e7dcca] p-6 max-w-md">
          <h3 className="text-xl font-semibold text-[#5e3023] mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-[#8c5f53] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#d3756b] hover:bg-[#c25d52] text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff9f5]">
        <div className="text-center bg-white rounded-xl shadow-md border border-[#e7dcca] p-6 max-w-md">
          <svg
            className="mx-auto h-16 w-16 text-[#e7dcca] mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-xl font-semibold text-[#5e3023] mb-2">
            Product not found
          </h3>
          <p className="text-[#8c5f53]">
            The product you're looking for is not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-[#e7dcca]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
          {/* Product Image */}
          <div className="relative">
            <img
              src={getProductImageUrl(product)}
              alt={product.name}
              className="w-full h-[450px] object-cover rounded-xl bg-[#f5f5f5] transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                console.error("Image failed to load:", e.target.src);
                e.target.src =
                  "https://via.placeholder.com/500x500/f5e6d3/5e3023?text=No+Image";
              }}
            />
            <span className="absolute top-4 left-4 bg-[#d3756b] text-white text-xs font-semibold px-3 py-1 rounded-full">
              {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
            {product.is_featured && (
              <span className="absolute top-4 right-4 bg-[#f5e6d3] text-[#5e3023] text-xs font-semibold px-3 py-1 rounded-full">
                ★ Featured
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-6">
            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-[#5e3023]">
              {product.name}
            </h1>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-[#5e3023] mb-3">
                Description
              </h2>
              <p className="text-[#8c5f53] leading-relaxed">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            {/* Additional Info */}
            <div className="border-t border-[#e7dcca] pt-6">
              <h2 className="text-xl font-semibold text-[#5e3023] mb-3">
                Product Details
              </h2>
              <ul className="list-disc list-inside text-[#8c5f53] space-y-1 text-sm">
                <li>Product ID: {product.product_id || productId}</li>
                <li>Category: {product.category_name || "General"}</li>
                <li>
                  Availability:{" "}
                  {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                </li>
                <li>Store: {product.store_name || "Sweet Delights"}</li>
                <li>
                  Shipping:{" "}
                  {product.shippingInfo ||
                    "Free shipping on orders over Rs. 50"}
                </li>
              </ul>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              {product.sale_price ? (
                <>
                  <span className="text-2xl font-bold text-[#d3756b]">
                    {formatPrice(product.sale_price)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#5e3023]">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock Indicator */}
            {product.stock_quantity !== undefined && (
              <div>
                {product.stock_quantity > 0 ? (
                  <span className="text-sm text-green-600">
                    {product.stock_quantity} in stock
                  </span>
                ) : (
                  <span className="text-sm text-red-500">Out of stock</span>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-[#5e3023]">
                Quantity:
              </label>
              <div className="flex items-center border border-[#e7dcca] rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-4 py-2 text-[#5e3023] hover:bg-[#f5e6d3] transition-colors"
                  disabled={quantity <= 1 || product.stock_quantity <= 0}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      Math.min(
                        parseInt(e.target.value) || 1,
                        product.stock_quantity || Infinity
                      )
                    )
                  }
                  className="w-16 text-center border-none focus:ring-0 py-2 text-[#5e3023]"
                  min="1"
                  max={product.stock_quantity || undefined}
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-4 py-2 text-[#5e3023] hover:bg-[#f5e6d3] transition-colors"
                  disabled={product.stock_quantity <= quantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#d3756b] text-white py-3 rounded-lg hover:bg-[#c25d52] transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stock_quantity <= 0}
              >
                Add to Cart
              </button>
              <button
                onClick={handleProceedToPayment}
                className="flex-1 bg-[#5e3023] text-white py-3 rounded-lg hover:bg-[#4a241b] transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stock_quantity <= 0}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
