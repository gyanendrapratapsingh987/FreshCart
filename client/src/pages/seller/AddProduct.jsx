import React, { useState } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/Appcontext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios, navigate, API_URL } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (files.length === 0) {
      toast.error("Please select at least one product image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);

      files.forEach((file) => {
        if (file) {
          formData.append("images", file);
        }
      });

      const { data } = await axios.post(
  `${API_URL}/api/product/add`,
  formData,
  {
    withCredentials: true,
  }
);

      if (data.success) {
        toast.success("Product Added Successfully");

        // Form clear
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);

        navigate("/seller/product-list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Add Product Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong while adding product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >

        {/* Product Images */}
        <div>
          <p className="text-base font-medium">
            Product Images
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label
                  key={index}
                  htmlFor={`image${index}`}
                  className="cursor-pointer"
                >
                  <input
                    type="file"
                    id={`image${index}`}
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      const updatedFiles = [...files];
                      updatedFiles[index] = file;

                      setFiles(updatedFiles);
                    }}
                  />

                  <img
                    className="max-w-24 w-24 h-24 object-contain border rounded"
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : assets.upload_area
                    }
                    alt="Upload product"
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">
            Product Name
          </label>

          <input
            type="text"
            placeholder="Type here"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">
            Product Description
          </label>

          <textarea
            rows={4}
            placeholder="Type here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="outline-none py-2 px-3 rounded border border-gray-500/40 resize-none"
            required
          />
        </div>

        {/* Category */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
            required
          >
            <option value="">
              Select Category
            </option>

            {categories.map((item, index) => (
              <option
                key={index}
                value={item.path}
              >
                {item.path}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="flex items-center gap-5">

          <div className="flex-1 flex flex-col gap-1">
            <label className="text-base font-medium">
              Product Price
            </label>

            <input
              type="number"
              placeholder="0"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="outline-none py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>

          {/* Offer Price */}
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-base font-medium">
              Offer Price
            </label>

            <input
              type="number"
              placeholder="0"
              min="0"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="outline-none py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>

        </div>

        {/* Add Button */}
        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-2.5 bg-primary text-white font-medium rounded ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          {loading ? "ADDING..." : "ADD"}
        </button>

      </form>
    </div>
  );
};

export default AddProduct;