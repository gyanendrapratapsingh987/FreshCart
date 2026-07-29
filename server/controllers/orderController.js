
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";

// ==========================================
// PLACE COD ORDER
// ==========================================
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!userId || !items || items.length === 0 || !address) {
      return res.json({
        success: false,
        message: "Missing order details",
      });
    }

    const userAddress = await Address.findOne({
      _id: address,
      userId,
    });

    if (!userAddress) {
      return res.json({
        success: false,
        message: "Address not found",
      });
    }

    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.json({
          success: false,
          message: "Product not found",
        });
      }

      if (!product.inStock) {
        return res.json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      amount += product.offerPrice * item.quantity;
    }

    // 2% tax
    const tax = (amount * 2) / 100;
    const totalAmount = amount + tax;

    const order = await Order.create({
      userId,
      items,
      address,
      amount: totalAmount,
      paymentType: "COD",
      isPaid: false,
      status: "Order Placed",
    });

    // Empty cart after order
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } }
    );

    return res.json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log("Place COD Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET USER ORDERS
// ==========================================
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is required",
      });
    }

    const orders = await Order.find({ userId })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Get User Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL ORDERS FOR SELLER
// ==========================================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE ORDER STATUS
// ==========================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    const allowedStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.log("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// SELLER DASHBOARD
// ==========================================
export const getDashboardData = async (req, res) => {
  try {
    // Total Products
    const totalProducts = await Product.countDocuments();

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Pending Orders
    const pendingOrders = await Order.countDocuments({
      status: {
        $in: [
          "Order Placed",
          "Processing",
          "Shipped",
          "Out for Delivery",
        ],
      },
    });

    // Total Revenue
    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // Recent 5 Orders
    const recentOrders = await Order.find({})
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      success: true,
      dashboard: {
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    console.log("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

