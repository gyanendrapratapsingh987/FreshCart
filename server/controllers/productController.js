import Product from "../models/Product.js";
import cloudinary from "../configs/cloudinary.js";

// ==========================================
// ADD PRODUCT
// ==========================================
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      offerPrice,
      category,
    } = req.body;

    if (!name || !description || !price || !offerPrice || !category) {
      return res.json({
        success: false,
        message: "Missing product details",
      });
    }

    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "freshcart/products",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            )
            .end(file.buffer);
        });

        images.push(result.secure_url);
      }
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      offerPrice: Number(offerPrice),
      category,
      image: images,
      inStock: true,
    });

    return res.json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.log("Add Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET PRODUCTS
// ==========================================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    return res.json({
      success: true,
      products,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// CHANGE STOCK
// ==========================================
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    await Product.findByIdAndUpdate(id, {
      inStock,
    });

    return res.json({
      success: true,
      message: "Stock updated",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE PRODUCT + IMAGE
// ==========================================
export const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      offerPrice,
      category,
    } = req.body;

    if (
      !id ||
      !name ||
      !description ||
      !price ||
      !offerPrice ||
      !category
    ) {
      return res.json({
        success: false,
        message: "Missing product details",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    // ======================================
    // BASIC PRODUCT DETAILS UPDATE
    // ======================================
    product.name = name;
    product.description = description;
    product.price = Number(price);
    product.offerPrice = Number(offerPrice);
    product.category = category;

    // ======================================
    // NEW IMAGE UPLOAD
    // ======================================
    if (req.files && req.files.length > 0) {
      const newImages = [];

      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "freshcart/products",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            )
            .end(file.buffer);
        });

        newImages.push(result.secure_url);
      }

      // New image se purani images replace hongi
      product.image = newImages;
    }

    await product.save();

    return res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};