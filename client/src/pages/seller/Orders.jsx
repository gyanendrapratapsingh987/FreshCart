
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/Appcontext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH ALL SELLER ORDERS
  // ==========================================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
  `${API_URL}/api/order/seller`
);

      console.log("Seller Orders:", data);

      if (data.success) {
        const sortedOrders = [...(data.orders || [])].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setOrders(sortedOrders);
      } else {
        setOrders([]);
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.log("Fetch Seller Orders Error:", error);

      setOrders([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================
  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);

      const { data } = await axios.put(
  `${API_URL}/api/order/status`,
  {
    orderId,
    status,
  }
);

      console.log("Update Status Response:", data);

      if (data.success) {
        toast.success("Order status updated");

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: data.order?.status || status,
                }
              : order
          )
        );
      } else {
        toast.error(
          data.message || "Failed to update status"
        );
      }
    } catch (error) {
      console.log("Update Status Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ==========================================
  // LOAD ORDERS
  // ==========================================
  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="w-full">
        <div className="p-4 md:p-10">
          <p className="text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div className="w-full">

      <div className="p-4 md:p-10 space-y-5">

        {/* =====================================
            HEADING
        ===================================== */}
        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-medium">
              Orders List
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage customer orders and update status
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="px-5 py-2 bg-primary text-white rounded-md hover:opacity-90"
          >
            Refresh
          </button>

        </div>


        {/* =====================================
            NO ORDERS
        ===================================== */}
        {orders.length === 0 ? (

          <div className="py-20 text-center">

            <p className="text-gray-500">
              No orders found.
            </p>

          </div>

        ) : (

          orders.map((order, index) => (

            <div
              key={order._id || index}
              className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between p-5 max-w-6xl rounded-md border border-gray-300 bg-white"
            >

              {/* =================================
                  PRODUCTS
              ================================= */}
              <div className="flex gap-5 max-w-80">

                <img
                  className="w-12 h-12 object-cover"
                  src={assets.box_icon}
                  alt="boxIcon"
                />

                <div className="space-y-2">

                  {order.items?.map(
                    (item, itemIndex) => (

                      <div
                        key={
                          item._id ||
                          itemIndex
                        }
                      >

                        <p className="font-medium">

                          {item.product?.name ||
                            "Product"}

                          <span className="text-primary ml-1">
                            x {item.quantity}
                          </span>

                        </p>

                        <p className="text-sm text-gray-500">
                          Category:{" "}
                          {item.product?.category ||
                            "N/A"}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* =================================
                  ADDRESS
              ================================= */}
              <div className="text-sm text-black/60">

                <p className="text-black/80 font-medium">
                  {order.address?.firstName}{" "}
                  {order.address?.lastName}
                </p>

                <p>
                  {order.address?.street},{" "}
                  {order.address?.city}
                </p>

                <p>
                  {order.address?.state},{" "}
                  {order.address?.zipcode},{" "}
                  {order.address?.country}
                </p>

                <p>
                  {order.address?.phone}
                </p>

              </div>


              {/* =================================
                  AMOUNT
              ================================= */}
              <div>

                <p className="font-medium text-lg">
                  {currency}
                  {Number(
                    order.amount || 0
                  ).toFixed(2)}
                </p>

                <p className="text-sm text-gray-500">
                  Total Amount
                </p>

              </div>


              {/* =================================
                  ORDER DETAILS
              ================================= */}
              <div className="flex flex-col gap-2 text-sm">

                <p className="text-black/60">
                  Method:{" "}
                  <span className="text-black">
                    {order.paymentType ||
                      "COD"}
                  </span>
                </p>

                <p className="text-black/60">
                  Date:{" "}
                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-US"
                      )
                    : "N/A"}
                </p>

                <p className="text-black/60">
                  Time:{" "}
                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleTimeString(
                        "en-US"
                      )
                    : "N/A"}
                </p>

                {/* Payment */}
                <p className="text-black/60">
                  Payment:{" "}
                  <span
                    className={
                      order.isPaid
                        ? "text-green-600"
                        : "text-orange-500"
                    }
                  >
                    {order.isPaid
                      ? "Paid"
                      : "Pending"}
                  </span>
                </p>


                {/* =================================
                    STATUS
                ================================= */}
                <div className="flex items-center gap-2">

                  <label className="text-black/60">
                    Status:
                  </label>

                  <select
                    value={
                      order.status ||
                      "Order Placed"
                    }
                    disabled={
                      updatingOrder ===
                      order._id
                    }
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded-md px-2 py-1 outline-none cursor-pointer bg-white"
                  >

                    <option value="Order Placed">
                      Order Placed
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Out for Delivery">
                      Out for Delivery
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>

                {/* Updating */}
                {updatingOrder ===
                  order._id && (
                  <p className="text-xs text-gray-400">
                    Updating status...
                  </p>
                )}

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default Orders;

