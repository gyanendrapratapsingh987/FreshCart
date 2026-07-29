import Cart from "../models/Cart.js";

// ===============================
// Add Product To Cart
// ===============================
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [
          {
            product: productId,
            quantity: 1,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({
          product: productId,
          quantity: 1,
        });
      }

      await cart.save();
    }

    cart = await Cart.findOne({ userId }).populate("items.product");

    return res.json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.log("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// Get User Cart
// ===============================
export const getCart = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is required",
      });
    }

    const cart = await Cart.findOne({ userId }).populate(
      "items.product"
    );

    if (!cart) {
      return res.json({
        success: true,
        cart: {
          userId,
          items: [],
        },
      });
    }

    return res.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Get Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// Update Cart Quantity
// ===============================
export const updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity === undefined) {
      return res.json({
        success: false,
        message: "User ID, Product ID and quantity are required",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.json({
        success: false,
        message: "Product not found in cart",
      });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate(
      "items.product"
    );

    return res.json({
      success: true,
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.log("Update Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// Remove Product From Cart
// ===============================
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate(
      "items.product"
    );

    return res.json({
      success: true,
      message: "Product removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.log("Remove Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};