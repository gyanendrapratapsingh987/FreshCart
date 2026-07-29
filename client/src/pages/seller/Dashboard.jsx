
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/Appcontext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, currency, API_URL } = useAppContext();

  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
  `${API_URL}/api/order/dashboard`,
  {
    withCredentials: true,
  }
);

      console.log("Dashboard Response:", data);

      if (data.success) {
        setDashboard(
          data.dashboard || {
            totalProducts: 0,
            totalOrders: 0,
            pendingOrders: 0,
            totalRevenue: 0,
            recentOrders: [],
          }
        );
      } else {
        toast.error(
          data.message || "Failed to fetch dashboard"
        );
      }
    } catch (error) {
      console.log("Dashboard Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================
  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="w-full p-4 md:p-10">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================
  return (
    <div className="w-full p-4 md:p-10">

      {/* =====================================
          HEADER
      ===================================== */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-2xl font-medium text-gray-800">
            Seller Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Overview of your grocery store
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="px-5 py-2 bg-primary text-white rounded-md hover:opacity-90 transition"
        >
          Refresh
        </button>

      </div>


      {/* =====================================
          STAT CARDS
      ===================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Total Products */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <h2 className="text-3xl font-semibold text-gray-800 mt-2">
            {dashboard.totalProducts}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Products in store
          </p>

        </div>


        {/* Total Orders */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <h2 className="text-3xl font-semibold text-gray-800 mt-2">
            {dashboard.totalOrders}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            All customer orders
          </p>

        </div>


        {/* Pending Orders */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Pending Orders
          </p>

          <h2 className="text-3xl font-semibold text-orange-500 mt-2">
            {dashboard.pendingOrders}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Orders not delivered
          </p>

        </div>


        {/* Revenue */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Revenue
          </p>

          <h2 className="text-3xl font-semibold text-primary mt-2">
            {currency}
            {Number(
              dashboard.totalRevenue || 0
            ).toFixed(2)}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Excluding cancelled orders
          </p>

        </div>

      </div>


      {/* =====================================
          RECENT ORDERS
      ===================================== */}
      <div className="mt-10">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-xl font-medium text-gray-800">
              Recent Orders
            </h2>

            <p className="text-sm text-gray-500">
              Latest customer orders
            </p>
          </div>

        </div>


        {dashboard.recentOrders?.length > 0 ? (

          <div className="space-y-4">

            {dashboard.recentOrders.map(
              (order, index) => (

                <div
                  key={
                    order._id || index
                  }
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                >

                  {/* Top */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* Order ID */}
                    <div>

                      <p className="text-xs text-gray-400">
                        Order ID
                      </p>

                      <p className="text-sm font-medium text-gray-800 break-all">
                        {order._id}
                      </p>

                    </div>


                    {/* Amount */}
                    <div>

                      <p className="text-xs text-gray-400">
                        Amount
                      </p>

                      <p className="font-medium text-primary">
                        {currency}
                        {Number(
                          order.amount || 0
                        ).toFixed(2)}
                      </p>

                    </div>


                    {/* Status */}
                    <div>

                      <p className="text-xs text-gray-400">
                        Status
                      </p>

                      <span
                        className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                          order.status ===
                          "Delivered"
                            ? "bg-green-100 text-green-600"
                            : order.status ===
                              "Cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {order.status ||
                          "Order Placed"}
                      </span>

                    </div>


                    {/* Date */}
                    <div>

                      <p className="text-xs text-gray-400">
                        Date
                      </p>

                      <p className="text-sm text-gray-600">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-US"
                            )
                          : "N/A"}
                      </p>

                    </div>

                  </div>


                  {/* Products */}
                  <div className="mt-4 pt-4 border-t border-gray-100">

                    <p className="text-sm text-gray-500 mb-2">
                      Products
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {order.items?.map(
                        (item, itemIndex) => (

                          <span
                            key={
                              item._id ||
                              itemIndex
                            }
                            className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                          >
                            {item.product?.name ||
                              "Product"}{" "}
                            × {item.quantity}
                          </span>

                        )
                      )}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

            <p className="text-gray-500">
              No recent orders found.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default Dashboard;

