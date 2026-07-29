
import { useEffect, useState } from "react";
import { useAppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    Products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItems,
    API_URL,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  // ===============================
  // GET CART PRODUCTS
  // ===============================
  const getCart = () => {
    const tempArray = [];

    for (const id in cartItems) {
      const product = Products.find(
        (item) => item._id === id
      );

      if (product) {
        tempArray.push({
          ...product,
          quantity: cartItems[id],
        });
      }
    }

    setCartArray(tempArray);
  };

  // ===============================
  // GET USER ADDRESSES
  // ===============================
  const getUserAddress = async () => {
    if (!user?._id) {
      return;
    }

    try {
      const { data } = await axios.get(
        `${API_URL}/api/address/get?userId=${user._id}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setAddresses(data.addresses || []);
        setSelectedAddress(
          data.addresses?.[0] || null
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Address Error:", error);
      console.log(
        "Backend Error:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch address"
      );
    }
  };

  // ===============================
  // PLACE ORDER
  // ===============================
  const placeOrder = async () => {
    if (!user?._id) {
      toast.error("Please login first");
      return;
    }

    if (cartArray.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please add an address");
      return;
    }

    const orderData = {
      userId: user._id,
      items: cartArray.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      address: selectedAddress._id,
    };

    try {
      const url =
        paymentOption === "COD"
          ? `${API_URL}/api/order/cod`
          : `${API_URL}/api/order/stripe`;

      const { data } = await axios.post(
        url,
        orderData,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        if (paymentOption === "COD") {
          toast.success(data.message);

          setCartItems({});

          navigate("/my-orders");
        } else {
          window.location.replace(data.url);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Order Error:", error);
      console.log(
        "Backend Error:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to place order"
      );
    }
  };

  // ===============================
  // LOAD CART
  // ===============================
  useEffect(() => {
    if (Products.length > 0) {
      getCart();
    } else {
      setCartArray([]);
    }
  }, [Products, cartItems]);

  // ===============================
  // LOAD ADDRESSES
  // ===============================
  useEffect(() => {
    if (user?._id) {
      getUserAddress();
    } else {
      setAddresses([]);
      setSelectedAddress(null);
    }
  }, [user]);

  // ===============================
  // EMPTY CART
  // ===============================
  if (
    Products.length > 0 &&
    cartArray.length === 0
  ) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-medium text-gray-700">
          Your Cart is Empty
        </h1>

        <button
          onClick={() => navigate("/products")}
          className="mt-6 px-8 py-3 bg-primary text-white rounded-md"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row mt-16 gap-10">
      {/* ===============================
          CART
      =============================== */}

      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">
            {getCartCount()} Items
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 font-medium pb-3">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[2fr_1fr_1fr] items-center text-gray-500 py-3"
          >
            <div className="flex items-center gap-4">
              <div
                onClick={() => {
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  );

                  window.scrollTo(0, 0);
                }}
                className="w-24 h-24 border rounded flex items-center justify-center cursor-pointer"
              >
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div>
                <p className="font-semibold">
                  {product.name}
                </p>

                <div className="text-sm text-gray-500">
                  <p>
                    Weight:{" "}
                    {product.weight || "N/A"}
                  </p>

                  <div className="flex items-center">
                    <span>Qty:</span>

                    <select
                      value={
                        cartItems[product._id]
                      }
                      onChange={(e) =>
                        updateCartItem(
                          product._id,
                          Number(e.target.value)
                        )
                      }
                      className="outline-none ml-1"
                    >
                      {Array.from(
                        { length: 9 },
                        (_, i) => (
                          <option
                            key={i}
                            value={i + 1}
                          >
                            {i + 1}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center">
              {currency}
              {product.offerPrice *
                product.quantity}
            </p>

            <button
              onClick={() =>
                removeFromCart(product._id)
              }
              className="mx-auto"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="w-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate("/products")}
          className="mt-8 text-primary font-medium"
        >
          ← Continue Shopping
        </button>
      </div>

      {/* ===============================
          ORDER SUMMARY
      =============================== */}

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 border border-gray-300">
        <h2 className="text-xl font-medium">
          Order Summary
        </h2>

        <hr className="my-5" />

        {/* ADDRESS */}

        <p className="text-sm font-medium uppercase">
          Delivery Address
        </p>

        <div className="relative flex justify-between mt-2">
          <p className="text-gray-500 text-sm">
            {selectedAddress
              ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
              : "No address found"}
          </p>

          <button
            onClick={() =>
              setShowAddress(!showAddress)
            }
            className="text-primary ml-2"
          >
            Change
          </button>

          {showAddress && (
            <div className="absolute top-8 left-0 bg-white border w-full z-20">
              {addresses.map((address) => (
                <p
                  key={address._id}
                  onClick={() => {
                    setSelectedAddress(address);
                    setShowAddress(false);
                  }}
                  className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                >
                  {address.street},{" "}
                  {address.city},{" "}
                  {address.state}
                </p>
              ))}

              <p
                onClick={() =>
                  navigate("/add-address")
                }
                className="p-2 text-primary text-center cursor-pointer"
              >
                + Add address
              </p>
            </div>
          )}
        </div>

        {/* PAYMENT */}

        <p className="text-sm font-medium uppercase mt-6">
          Payment Method
        </p>

        <select
          value={paymentOption}
          onChange={(e) =>
            setPaymentOption(e.target.value)
          }
          className="w-full border bg-white px-3 py-2 mt-2"
        >
          <option value="COD">
            Cash On Delivery
          </option>

          <option value="Online">
            Online Payment
          </option>
        </select>

        <hr className="my-5" />

        {/* AMOUNT */}

        <div className="space-y-2 text-gray-500">
          <p className="flex justify-between">
            <span>Price</span>

            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>

          <p className="flex justify-between">
            <span>Shipping Fee</span>

            <span className="text-green-600">
              Free
            </span>
          </p>

          <p className="flex justify-between">
            <span>Tax (2%)</span>

            <span>
              {currency}
              {(getCartAmount() * 2) / 100}
            </span>
          </p>

          <p className="flex justify-between text-lg font-medium">
            <span>Total</span>

            <span>
              {currency}
              {getCartAmount() +
                (getCartAmount() * 2) / 100}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 bg-primary text-white font-medium"
        >
          {paymentOption === "COD"
            ? "Place Order"
            : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;

