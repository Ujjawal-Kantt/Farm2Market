import React, { useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  farmer: string;
  image: string;
  rating: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    description: "Freshly harvested organic tomatoes from local farms.",
    price: 50,
    unit: "kg",
    stock: 20,
    farmer: "John Doe",
    image: "data:image/webp;base64,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",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Organic Potatoes",
    description: "High-quality organic potatoes grown with care.",
    price: 30,
    unit: "kg",
    stock: 50,
    farmer: "Jane Smith",
    image: "data:image/webp;base64,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",
    rating: 4.2,
  },
];

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (productId: number) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {/* Product Card */}
      <div
        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-medium text-lg">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.farmer}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-semibold">₹{product.price}/{product.unit}</p>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.73L6.82 21z" />
              </svg>
              <span className="ml-1 text-sm">{product.rating}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-between items-center">
            <button
              className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product.id);
              }}
            >
              Add to Cart
            </button>
            <button
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                alert(`Contact Farmer: ${product.farmer}`);
              }}
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowDetails(false)}
            >
              ✕
            </button>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-lg font-bold mb-2">{product.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
            <p className="text-sm">
              <strong>Farmer:</strong> {product.farmer}
            </p>
            <p className="text-sm">
              <strong>Price:</strong> ₹{product.price}/{product.unit}
            </p>
            <p className="text-sm">
              <strong>Stock:</strong> {product.stock} {product.unit}
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={() => {
                  onAddToCart(product.id);
                  setShowDetails(false);
                }}
              >
                Add to Cart
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  const handleAddToCart = (productId: number) => {
    alert(`Product with ID ${productId} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
