
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/Appcontext";
import toast from "react-hot-toast";

const OrderTracking = () => {
  const { id } = useParams();

  const { user, axios, currency, API_URL } = useAppContext();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statuses = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  // =====================================
  // FETCH ORDER
  // =====================================
  const fetchOrder = async () => {
    try {
      // User abhi load nahi hua hai
      if (!user?._id || !id) {
        return;
      }

      setLoading(true);

      const { data } = await axios.get(
  `${API_URL}/api/order/user?userId=${user._id}`,
  {
    withCredentials: true,
  }
);

      console.log("Tracking API Response:", data);
      console.log("Tracking Order ID:", id);
      console.log("User ID:", user._id);

      if (!data.success) {
        toast.error(data.message || "Failed to fetch order");
        setOrder(null);
        return;
      }

      // ObjectId ko string me convert karke compare karenge
      const foundOrder = (data.orders || []).find(
        (item) => String(item._id) === String(id)
      );

      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setOrder(null);
      }

    } catch (error) {
      console.log("Order Tracking Error:", error);

      setOrder(null);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch order"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOAD ORDER
  // =====================================
  useEffect(() => {
    if (user?._id && id) {
      fetchOrder();
    }
  }, [user?._id, id]);

  // =====================================
  // LOADING
  // =====================================
  if (loading || !user?._id) {
    return (
      <div className="mt-16 pb-16 flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500 text-lg">
          Loading order...
        </p>
      </div>
    );
  }

  // =====================================
  // ORDER NOT FOUND
  // =====================================
  if (!order) {
    return (
      <div className="mt-16 pb-16 flex flex-col items-center justify-center min-h-[40vh]">

        <p className="text-xl text-gray-500 mb-5">
          Order not found
        </p>

        <button
          onClick={fetchOrder}
          className="px-5 py-2 bg-primary text-white rounded-md hover:opacity-90"
        >
          Try Again
        </button>

      </div>
    );
  }

  // =====================================
  // CURRENT STATUS
  // =====================================
  const currentStatus = statuses.indexOf(order.status);

  return (
    <div className="mt-16 pb-16">

      {/* Heading */}
      <h1 className="text-2xl font-medium mb-8">
        Order Tracking
      </h1>

      {/* Order Box */}
      <div className="border border-gray-300 rounded-lg p-5 max-w-4xl">

        {/* =================================
            ORDER INFORMATION
        ================================= */}

        <div className="flex flex-col md:flex-row md:justify-between gap-5 mb-8">

          <div>
            <p className="text-gray-500 text-sm">
              Order ID
            </p>

            <p className="font-medium break-all">
              {order._id}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Payment
            </p>

            <p className="font-medium">
              {order.paymentType || "COD"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Amount
            </p>

            <p className="font-medium">
              {currency}
              {Number(order.amount || 0).toFixed(2)}
            </p>
          </div>

        </div>

        {/* =================================
            ORDER STATUS
        ================================= */}

        <div className="mb-8">

          <h2 className="text-lg font-medium mb-5">
            Order Status
          </h2>

          {statuses.map((status, index) => {

            const completed =
              currentStatus >= 0 &&
              index <= currentStatus;

            return (
              <div
                key={status}
                className="flex items-start gap-4 mb-6"
              >

                {/* Circle */}
                <div
                  className={`w-5 h-5 rounded-full mt-1 shrink-0 ${
                    completed
                      ? "bg-primary"
                      : "bg-gray-300"
                  }`}
                ></div>

                {/* Status Text */}
                <div>

                  <p
                    className={`font-medium ${
                      completed
                        ? "text-primary"
                        : "text-gray-400"
                    }`}
                  >
                    {status}
                  </p>

                  {index === currentStatus && (
                    <p className="text-sm text-gray-500 mt-1">
                      Current Order Status
                    </p>
                  )}

                </div>

              </div>
            );
          })}

          {/* Cancelled */}
          {order.status === "Cancelled" && (
            <div className="mt-4">
              <p className="font-medium text-red-500">
                Order Cancelled
              </p>
            </div>
          )}

        </div>

        {/* =================================
            PRODUCTS
        ================================= */}

        <div className="border-t pt-5">

          <h2 className="font-medium mb-5">
            Ordered Products
          </h2>

          {order.items?.map((item, index) => (

            <div
              key={item._id || index}
              className="flex items-center gap-4 mb-5"
            >

              {/* Image */}
              <div className="w-16 h-16 border rounded-lg flex items-center justify-center overflow-hidden">

                {item.product?.image?.[0] ? (
                  <img
                    src={item.product.image[0]}
                    alt={item.product?.name || "Product"}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <p className="text-xs text-gray-400">
                    No Image
                  </p>
                )}

              </div>

              {/* Product Details */}
              <div>

                <p className="font-medium">
                  {item.product?.name || "Product"}
                </p>

                <p className="text-gray-500">
                  Quantity: {item.quantity}
                </p>

                <p className="text-gray-500">
                  Price: {currency}
                  {Number(
                    item.product?.offerPrice || 0
                  ).toFixed(2)}
                </p>

              </div>

            </div>

          ))}

        </div>

        {/* =================================
            DELIVERY ADDRESS
        ================================= */}

        {order.address && (
          <div className="border-t mt-5 pt-5">

            <h2 className="font-medium mb-2">
              Delivery Address
            </h2>

            <p className="text-gray-500">
              {order.address.firstName}{" "}
              {order.address.lastName}
            </p>

            <p className="text-gray-500">
              {order.address.street},{" "}
              {order.address.city},{" "}
              {order.address.state},{" "}
              {order.address.zipcode}
            </p>

            <p className="text-gray-500">
              {order.address.country}
            </p>

            <p className="text-gray-500">
              Phone: {order.address.phone}
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default OrderTracking;

