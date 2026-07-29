
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/Appcontext";
import toast from "react-hot-toast";

const MyOrders = () => {
  const {
  currency,
  user,
  axios,
  navigate,
  API_URL,
} = useAppContext();

  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH USER ORDERS
  // ===============================
  const fetchMyOrders = async () => {
    try {
      if (!user?._id) {
        setMyOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data } = await axios.get(
  `${API_URL}/api/order/user?userId=${user._id}`,
  {
    withCredentials: true,
  }
);

      console.log("My Orders API Response:", data);

      if (data.success) {
        setMyOrders(data.orders || []);
      } else {
        setMyOrders([]);
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.log("Fetch My Orders Error:", error);

      setMyOrders([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD ORDERS
  // ===============================
  useEffect(() => {
    fetchMyOrders();
  }, [user]);

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className="mt-16 pb-16">
        <div className="flex items-center justify-center h-[40vh]">
          <p className="text-gray-500 text-lg">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  // ===============================
  // PAGE
  // ===============================
  return (
    <div className="mt-16 pb-16">

      {/* Heading */}
      <div className="flex flex-col items-end w-max mb-6">
        <p className="text-2xl font-medium uppercase">
          My Orders
        </p>

        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {/* Refresh */}
      <button
        onClick={fetchMyOrders}
        className="mb-8 px-5 py-2.5 bg-primary text-white rounded-md cursor-pointer hover:opacity-90 transition"
      >
        Refresh Orders
      </button>

      {/* ===============================
          ORDERS LIST
      =============================== */}
      {myOrders.length > 0 ? (
        myOrders.map((order, index) => (
          <div
            key={order._id || index}
            className="border border-gray-300 rounded-lg mb-8 p-4 md:p-5 max-w-5xl"
          >

            {/* Order Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-gray-200">

              <div>
                <p className="text-sm text-gray-500">
                  Order ID
                </p>

                <p className="text-sm font-medium text-gray-800 break-all">
                  {order._id}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Payment
                </p>

                <p className="font-medium text-gray-800">
                  {order.paymentType || "COD"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Total
                </p>

                <p className="font-medium text-primary">
                  {currency}
                  {Number(order.amount || 0).toFixed(2)}
                </p>
              </div>

            </div>

            {/* Order Date */}
            <div className="py-3 text-sm text-gray-500">
              Ordered on:{" "}
              <span className="font-medium text-gray-700">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>

            {/* ===============================
                PRODUCTS
            =============================== */}
            <div>
              {order.items?.map((item, itemIndex) => {
                const product = item.product;

                return (
                  <div
                    key={item._id || itemIndex}
                    className={`flex flex-col md:flex-row md:items-center justify-between gap-5 py-5 ${
                      order.items.length !== itemIndex + 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >

                    {/* Product */}
                    <div className="flex items-center gap-4">

                      {/* Image */}
                      <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                        {product?.image?.[0] ? (
                          <img
                            src={product.image[0]}
                            alt={product.name || "Product"}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <p className="text-xs text-gray-400">
                            No Image
                          </p>
                        )}
                      </div>

                      {/* Product Info */}
                      <div>
                        <h2 className="text-lg font-medium text-gray-800">
                          {product?.name || "Product"}
                        </h2>

                        <p className="text-sm text-gray-500">
                          Category:{" "}
                          {product?.category || "N/A"}
                        </p>

                        <p className="text-sm text-gray-500">
                          Quantity:{" "}
                          <span className="font-medium text-gray-700">
                            {item.quantity || 1}
                          </span>
                        </p>
                      </div>

                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Status
                      </p>

                      <p className="font-medium text-primary">
                        {order.status || "Order Placed"}
                      </p>
                    </div>

                    {/* Product Amount */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Amount
                      </p>

                      <p className="text-lg font-medium text-gray-800">
                        {currency}
                        {(
                          (product?.offerPrice || 0) *
                          (item.quantity || 1)
                        ).toFixed(2)}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Address */}
            {order.address && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </p>

                <p className="text-sm text-gray-500">
                  {order.address.street},{" "}
                  {order.address.city},{" "}
                  {order.address.state},{" "}
                  {order.address.country}
                </p>
              </div>
            )}

            {/* ===============================
                TRACK ORDER BUTTON
            =============================== */}
            <div className="mt-5 pt-5 border-t border-gray-200">
              <button
                onClick={() =>
                  navigate(`/order-tracking/${order._id}`)
                }
                className="px-6 py-2.5 bg-primary text-white rounded-md hover:opacity-90 transition cursor-pointer"
              >
                Track Order
              </button>
            </div>

          </div>
        ))
      ) : (
        // ===============================
        // NO ORDERS
        // ===============================
        <div className="flex flex-col items-center justify-center h-[40vh]">

          <p className="text-xl text-gray-500">
            No orders found.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-5 px-7 py-2.5 bg-primary text-white rounded-md"
          >
            Start Shopping
          </button>

        </div>
      )}

    </div>
  );
};

export default MyOrders;

