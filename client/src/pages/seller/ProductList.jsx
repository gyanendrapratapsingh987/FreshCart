import React, { useState } from "react";
import { useAppContext } from "../../context/Appcontext";
import toast from "react-hot-toast";

const ProductList = () => {
  const {
  Products,
  currency,
  toggleStock,
  axios,
  fetchProducts,
  API_URL,
} = useAppContext();

  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    category: "",
    images: [],
  });

  // ==========================================
  // EDIT PRODUCT
  // ==========================================
  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      offerPrice: product.offerPrice || "",
      category: product.category || "",
      images: [],
    });
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // IMAGE CHANGE
  // ==========================================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  // ==========================================
  // UPDATE PRODUCT
  // ==========================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingProduct?._id) {
      toast.error("Product not selected");
      return;
    }

    try {
      setLoading(true);

      const dataToSend = new FormData();

      dataToSend.append(
        "id",
        editingProduct._id
      );

      dataToSend.append(
        "name",
        formData.name
      );

      dataToSend.append(
        "description",
        formData.description
      );

      dataToSend.append(
        "price",
        formData.price
      );

      dataToSend.append(
        "offerPrice",
        formData.offerPrice
      );

      dataToSend.append(
        "category",
        formData.category
      );

      // ======================================
      // NEW IMAGES
      // ======================================
      formData.images.forEach((image) => {
  dataToSend.append("images", image);
});

const { data } = await axios.put(
  `${API_URL}/api/product/update`,
  dataToSend,
  {
    withCredentials: true,
  }
);

if (data.success) {
  toast.success(
    "Product updated successfully"
  );

        // Refresh product list
        await fetchProducts();

        // Close edit form
        setEditingProduct(null);

        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          offerPrice: "",
          category: "",
          images: [],
        });
      } else {
        toast.error(
          data.message ||
            "Failed to update product"
        );
      }
    } catch (error) {
      console.log(
        "Update Product Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================
  const handleCancel = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      offerPrice: "",
      category: "",
      images: [],
    });
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">

      <div className="w-full md:p-10 p-4">

        <h2 className="pb-4 text-lg font-medium">
          All Products
        </h2>

        {/* ======================================
            PRODUCT TABLE
        ====================================== */}

        <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">

          <table className="md:table-auto table-fixed w-full overflow-hidden">

            <thead className="text-gray-900 text-sm text-left">

              <tr>

                <th className="px-4 py-3 font-semibold">
                  Product
                </th>

                <th className="px-4 py-3 font-semibold">
                  Category
                </th>

                <th className="px-4 py-3 font-semibold hidden md:table-cell">
                  Selling Price
                </th>

                <th className="px-4 py-3 font-semibold">
                  In Stock
                </th>

                <th className="px-4 py-3 font-semibold">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="text-sm text-gray-500">

              {Products.map((product) => (

                <tr
                  key={product._id}
                  className="border-t border-gray-500/20"
                >

                  {/* PRODUCT */}
                  <td className="md:px-4 pl-2 md:pl-4 py-3">

                    <div className="flex items-center space-x-3">

                      <div className="border border-gray-300 rounded p-2">

                        {product.image?.[0] ? (
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}

                      </div>

                      <span className="truncate max-sm:hidden">
                        {product.name}
                      </span>

                    </div>

                  </td>

                  {/* CATEGORY */}
                  <td className="px-4 py-3">
                    {product.category}
                  </td>

                  {/* PRICE */}
                  <td className="px-4 py-3 max-sm:hidden">

                    {currency}
                    {product.offerPrice}

                  </td>

                  {/* STOCK */}
                  <td className="px-4 py-3">

                    <label className="relative inline-flex items-center cursor-pointer">

                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={product.inStock}
                        onChange={() =>
                          toggleStock(
                            product._id,
                            !product.inStock
                          )
                        }
                      />

                      <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-primary transition-colors duration-200">
                      </div>

                      <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5">
                      </span>

                    </label>

                  </td>

                  {/* EDIT */}
                  <td className="px-4 py-3">

                    <button
                      onClick={() =>
                        handleEdit(product)
                      }
                      className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 cursor-pointer"
                    >
                      Edit
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* ======================================
            EDIT PRODUCT FORM
        ====================================== */}

        {editingProduct && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-6">

              {/* HEADER */}

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-semibold">
                  Edit Product
                </h2>

                <button
                  onClick={handleCancel}
                  className="text-gray-500 text-2xl cursor-pointer"
                >
                  ×
                </button>

              </div>


              <form
                onSubmit={handleUpdate}
                className="space-y-5"
              >

                {/* ==================================
                    CURRENT PRODUCT IMAGES
                ================================== */}

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Current Product Images
                  </label>

                  <div className="flex flex-wrap gap-3">

                    {editingProduct.image?.length > 0 ? (

                      editingProduct.image.map(
                        (image, index) => (

                          <div
                            key={index}
                            className="w-24 h-24 border border-gray-300 rounded-lg p-2"
                          >

                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-contain"
                            />

                          </div>

                        )
                      )

                    ) : (

                      <p className="text-sm text-gray-400">
                        No image available
                      </p>

                    )}

                  </div>

                </div>


                {/* ==================================
                    NEW IMAGE UPLOAD
                ================================== */}

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Upload New Images
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    Maximum 4 images. New images select karne par
                    purani images replace ho jayengi.
                  </p>

                </div>


                {/* ==================================
                    PRODUCT NAME
                ================================== */}

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
                    required
                  />

                </div>


                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Product Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
                    required
                  />

                </div>


                {/* ==================================
                    PRICE
                ================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Product Price
                    </label>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
                      required
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Offer Price
                    </label>

                    <input
                      type="number"
                      name="offerPrice"
                      value={formData.offerPrice}
                      onChange={handleChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
                      required
                    />

                  </div>

                </div>


                {/* ==================================
                    CATEGORY
                ================================== */}

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
                    required
                  />

                </div>


                {/* ==================================
                    BUTTONS
                ================================== */}

                <div className="flex justify-end gap-3 pt-3">

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2 border border-gray-300 rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-primary text-white rounded-md cursor-pointer disabled:opacity-50"
                  >
                    {loading
                      ? "Updating..."
                      : "Update Product"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default ProductList;