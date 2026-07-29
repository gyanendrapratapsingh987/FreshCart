
import { useEffect, useState } from "react";
import { useAppContext } from "../context/Appcontext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCart from "../component/ProductCart";

const ProductDetails = () => {
  const {
    Products,
    navigate,
    currency,
    addToCart,
  } = useAppContext();

  const { id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  // Image Zoom
  const [showZoom, setShowZoom] = useState(false);

  // Find product
  const product = Products.find((item) => item._id === id);

  // Related Products
  useEffect(() => {
    if (Products.length > 0 && product) {
      const productsCopy = Products.filter(
        (item) =>
          item.category === product.category &&
          item._id !== product._id
      );

      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [Products, product]);

  // Thumbnail
  useEffect(() => {
    setThumbnail(product?.image?.[0] || null);
  }, [product]);

  // Product not found
  if (!product) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-2xl font-medium text-primary">
          Product not found
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12">

      {/* Breadcrumb */}
      <p className="text-sm">
        <Link to="/">Home</Link>
        {" / "}
        <Link to="/products">Products</Link>
        {" / "}
        <Link to={`/products/${product.category.toLowerCase()}`}>
          {product.category}
        </Link>
        {" / "}
        <span className="text-primary">
          {product.name}
        </span>
      </p>

      {/* Product Details */}
      <div className="flex flex-col md:flex-row gap-16 mt-4">

        {/* Images */}
        <div className="flex gap-3">

          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {product.image?.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div
            onClick={() => thumbnail && setShowZoom(true)}
            className="border border-gray-500/30 max-w-100 rounded overflow-hidden cursor-zoom-in"
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={product.name}
                className="w-full object-contain"
              />
            ) : (
              <div className="w-80 h-80 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="text-sm w-full md:w-1/2">

          <h1 className="text-3xl font-medium">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={
                    i < 4
                      ? assets.star_icon
                      : assets.star_dull_icon
                  }
                  alt="star"
                  className="md:w-4 w-3.5"
                />
              ))}

            <p className="text-base ml-2">(4)</p>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-gray-500/70 line-through">
              MRP: {currency}
              {product.price}
            </p>

            <p className="text-2xl font-medium">
              {currency}
              {product.offerPrice}
            </p>

            <span className="text-gray-500/70">
              (inclusive of all taxes)
            </span>
          </div>

          {/* About Product */}
          <p className="text-base font-medium mt-6">
            About Product
          </p>

          <div className="text-gray-500">
            {product.description}
          </div>

          {/* Buttons */}
          <div className="flex items-center mt-10 gap-4 text-base">

            {/* Add To Cart */}
            <button
              onClick={() => {
                addToCart(product._id);
              }}
              className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>

            {/* Buy Now */}
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition"
            >
              Buy now
            </button>

          </div>
        </div>
      </div>

      {/* Image Zoom Popup */}
      {showZoom && thumbnail && (
        <div
          onClick={() => setShowZoom(false)}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-xl p-4 max-w-3xl max-h-[90vh]"
          >

            {/* Close Button */}
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-2 right-3 text-3xl font-bold text-gray-600 hover:text-black cursor-pointer"
            >
              ×
            </button>

            {/* Large Image */}
            <img
              src={thumbnail}
              alt={product.name}
              className="max-h-[80vh] max-w-full object-contain"
            />

          </div>
        </div>
      )}

      {/* Related Products */}
      <div className="flex flex-col items-center mt-20">

        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">
            Related Products
          </p>

          <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">

          {relatedProducts
            .filter((product) => product.inStock)
            .map((product) => (
              <ProductCart
                key={product._id}
                product={product}
              />
            ))}

        </div>

        <button
          onClick={() => {
            navigate("/products");
            window.scrollTo(0, 0);
          }}
          className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
        >
          See more
        </button>

      </div>
    </div>
  );
};

export default ProductDetails;

