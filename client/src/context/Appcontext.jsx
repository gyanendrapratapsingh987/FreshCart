import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

export const Appcontext = createContext();

export const AppcontexProvider = ({ children }) => {
  const navigate = useNavigate();

  // ===============================
  // API URL
  // ===============================
  const API_URL =
    import.meta.env.https://freshcart-backend-three.vercel.app || "http://localhost:4000";

  // ===============================
  // Currency
  // ===============================
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  // ===============================
  // USER
  // ===============================
  const [user, setUserState] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.log("User restore error:", error);
      return null;
    }
  });

  const setUser = (userData) => {
    setUserState(userData);

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  // ===============================
  // SELLER
  // ===============================
  const [isSeller, setIsSeller] = useState(false);

  // ===============================
  // LOGIN POPUP
  // ===============================
  const [showUserLogin, setShowUserLogin] = useState(false);

  // ===============================
  // SEARCH
  // ===============================
  const [searchQuery, setSearchQuery] = useState("");

  // ===============================
  // CART
  // ===============================
  const [cartItems, setCartItems] = useState({});

  // ===============================
  // PRODUCTS
  // ===============================
  const [Products, setProducts] = useState([]);

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/product/list`
      );

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Fetch Products Error:", error);
      toast.error("Failed to fetch products");
    }
  };

  // ===============================
  // ADD TO CART
  // ===============================
  const addToCart = async (itemId) => {
    try {
      if (!user?._id) {
        setShowUserLogin(true);
        return;
      }

      const { data } = await axios.post(
        `${API_URL}/api/cart/add`,
        {
          userId: user._id,
          productId: itemId,
        }
      );

      if (data.success) {
        toast.success("Added To Cart");

        const cartData = {};

        data.cart?.items?.forEach((item) => {
          const productId =
            item.product?._id || item.product;

          if (productId) {
            cartData[productId] = item.quantity;
          }
        });

        setCartItems(cartData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Add To Cart Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    }
  };

  // ===============================
  // GET CART
  // ===============================
  const getCart = async () => {
    try {
      if (!user?._id) {
        setCartItems({});
        return;
      }

      const { data } = await axios.get(
        `${API_URL}/api/cart/get?userId=${user._id}`
      );

      if (data.success) {
        const cartData = {};

        data.cart?.items?.forEach((item) => {
          const productId =
            item.product?._id || item.product;

          if (productId) {
            cartData[productId] = item.quantity;
          }
        });

        setCartItems(cartData);
      } else {
        setCartItems({});
      }
    } catch (error) {
      console.log("Get Cart Error:", error);
      setCartItems({});
    }
  };

  // ===============================
  // UPDATE CART
  // ===============================
  const updateCartItem = async (itemId, quantity) => {
    try {
      if (!user?._id) {
        setShowUserLogin(true);
        return;
      }

      const { data } = await axios.put(
        `${API_URL}/api/cart/update`,
        {
          userId: user._id,
          productId: itemId,
          quantity,
        }
      );

      if (data.success) {
        const cartData = {};

        data.cart?.items?.forEach((item) => {
          const productId =
            item.product?._id || item.product;

          if (productId) {
            cartData[productId] = item.quantity;
          }
        });

        setCartItems(cartData);

        toast.success("Cart updated");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Update Cart Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update cart"
      );
    }
  };

  // ===============================
  // REMOVE FROM CART
  // ===============================
  const removeFromCart = async (itemId) => {
    try {
      if (!user?._id) {
        setShowUserLogin(true);
        return;
      }

      const { data } = await axios.delete(
        `${API_URL}/api/cart/remove`,
        {
          data: {
            userId: user._id,
            productId: itemId,
          },
        }
      );

      if (data.success) {
        const cartData = {};

        data.cart?.items?.forEach((item) => {
          const productId =
            item.product?._id || item.product;

          if (productId) {
            cartData[productId] = item.quantity;
          }
        });

        setCartItems(cartData);

        toast.success("Removed from Cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Remove Cart Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    }
  };

  // ===============================
  // CART COUNT
  // ===============================
  const getCartCount = () => {
    let totalCount = 0;

    for (const item in cartItems) {
      totalCount += cartItems[item];
    }

    return totalCount;
  };

  // ===============================
  // CART AMOUNT
  // ===============================
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const itemInfo = Products.find(
        (product) => product._id === itemId
      );

      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount +=
          itemInfo.offerPrice * cartItems[itemId];
      }
    }

    return Math.floor(totalAmount * 100) / 100;
  };

  // ===============================
  // TOGGLE STOCK
  // ===============================
  const toggleStock = async (itemId, inStock) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/product/stock`,
        {
          id: itemId,
          inStock,
        }
      );

      if (data.success) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === itemId
              ? {
                  ...product,
                  inStock,
                }
              : product
          )
        );

        toast.success(
          inStock
            ? "Product is now in stock"
            : "Product is now out of stock"
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Stock Update Error:", error);
      toast.error("Failed to update stock");
    }
  };

  // ===============================
  // LOAD PRODUCTS
  // ===============================
  useEffect(() => {
    fetchProducts();
  }, []);

  // ===============================
  // LOAD CART AFTER LOGIN
  // ===============================
  useEffect(() => {
    if (user?._id) {
      getCart();
    } else {
      setCartItems({});
    }
  }, [user]);

  // ===============================
  // CONTEXT VALUE
  // ===============================
  const value = {
    navigate,

    user,
    setUser,

    isSeller,
    setIsSeller,

    showUserLogin,
    setShowUserLogin,

    searchQuery,
    setSearchQuery,

    cartItems,
    setCartItems,
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    getCartCount,
    getCartAmount,

    Products,
    setProducts,
    fetchProducts,
    toggleStock,

    currency,

    axios,

    // IMPORTANT
    API_URL,
  };

  return (
    <Appcontext.Provider value={value}>
      {children}
    </Appcontext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(Appcontext);
};