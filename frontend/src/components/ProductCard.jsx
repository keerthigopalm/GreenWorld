import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // get addToCart function from context

  return (
    <div className="border p-4 rounded-lg shadow-md hover:shadow-xl transition bg-white">
      <img
        src={product.image || "/placeholder.png"}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-green-700 font-bold mt-1">LKR {product.price}</p>

      <div className="flex justify-between mt-3">
        <Link
          to={`/product/${product.productID}`}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          View Details
        </Link>
        <button
          onClick={() => addToCart(product)}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;