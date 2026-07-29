// import React from "react";
// import { Routes, Route, useLocation } from "react-router-dom";

// import Navbar from "./component/Navbar";
// import Footer from "./component/Footer";
// import Login from "./component/Login";

// import Home from "./pages/Home";
// import AllProducts from "./pages/AllProducts";
// import ProductCategory from "./pages/ProductCategory";
// import ProductDetails from "./pages/ProductDetails";
// import Cart from "./pages/Cart";
// import AddAddress from "./pages/AddAddress";
// import MyOrders from "./pages/MyOrders";

// import SellerLogin from "./component/seller/SellerLogin";
// import SellerLayout from "./pages/seller/SellerLayout";
// import AddProduct from "./pages/seller/AddProduct";
// import ProductList from "./pages/seller/ProductList";
// import Orders from "./pages/seller/Orders";
// import OrderTracking from "./pages/OrderTracking";

// import { Toaster } from "react-hot-toast";
// import { useAppContext } from "./context/Appcontext";

// const App = () => {
//   const location = useLocation();

//   const isSellerPath = location.pathname.toLowerCase().includes("seller");

//   const { showUserLogin, isSeller } = useAppContext();

//   return (
//     <div className="text-default min-h-screen text-gray-700 bg-white">

//       {/* Normal Navbar */}
//       {!isSellerPath && <Navbar />}

//       {/* Login Popup */}
//       {showUserLogin && <Login />}

//       {/* Toast */}
//       <Toaster />

//       {/* Pages */}
//       <div
//         className={
//           isSellerPath
//             ? ""
//             : "px-6 md:px-16 lg:px-24 xl:px-32"
//         }
//       >
//         <Routes>

//           {/* User Routes */}
//           <Route path="/" element={<Home />} />

//           <Route path="/products" element={<AllProducts />} />

//           <Route
//             path="/products/:category"
//             element={<ProductCategory />}
//           />

//           <Route
//             path="/products/:category/:id"
//             element={<ProductDetails />}
//           />

//           <Route path="/cart" element={<Cart />} />

//           <Route
//             path="/add-address"
//             element={<AddAddress />}
//           />

//           <Route
//             path="/my-orders"
//             element={<MyOrders />}
//           />

//            <Route
//           path="/order-tracking/:id"
//           element={<OrderTracking />}
//             />

//           {/* Seller Routes */}
//           <Route
//             path="/seller"
//             element={
//               isSeller ? <SellerLayout /> : <SellerLogin />
//             }
//           >
//             {/* /seller */}
//             <Route index element={<AddProduct />} />

//             {/* /seller/product-list */}
//             <Route
//               path="product-list"
//               element={<ProductList />}
//             />

//             {/* /seller/orders */}
//             <Route
//               path="orders"
//               element={<Orders />}
//             />

//             {/* <Route
//             path="/my-orders"
//             element={<MyOrders />}
//             /> */}

//           </Route>

//         </Routes>
//       </div>

//       {/* Footer */}
//       {!isSellerPath && <Footer />}

//     </div>
//   );
// };

// export default App;


import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Login from "./component/Login";

import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";

import SellerLogin from "./component/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import Dashboard from "./pages/seller/Dashboard";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";

import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/Appcontext";

const App = () => {
  const location = useLocation();

  const isSellerPath = location.pathname
    .toLowerCase()
    .includes("seller");

  const { showUserLogin, isSeller } = useAppContext();

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">

      {/* Normal Navbar */}
      {!isSellerPath && <Navbar />}

      {/* Login Popup */}
      {showUserLogin && <Login />}

      {/* Toast */}
      <Toaster />

      {/* Pages */}
      <div
        className={
          isSellerPath
            ? ""
            : "px-6 md:px-16 lg:px-24 xl:px-32"
        }
      >

        <Routes>

          {/* =========================
              USER ROUTES
          ========================= */}

          <Route path="/" element={<Home />} />

          <Route
            path="/products"
            element={<AllProducts />}
          />

          <Route
            path="/products/:category"
            element={<ProductCategory />}
          />

          <Route
            path="/products/:category/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/add-address"
            element={<AddAddress />}
          />

          <Route
            path="/my-orders"
            element={<MyOrders />}
          />

          <Route
            path="/order-tracking/:id"
            element={<OrderTracking />}
          />


          {/* =========================
              SELLER ROUTES
          ========================= */}

          <Route
            path="/seller"
            element={
              isSeller ? (
                <SellerLayout />
              ) : (
                <SellerLogin />
              )
            }
          >

            {/* /seller */}
            <Route
              index
              element={<Dashboard />}
            />

            {/* /seller/add-product */}
            <Route
              path="add-product"
              element={<AddProduct />}
            />

            {/* /seller/product-list */}
            <Route
              path="product-list"
              element={<ProductList />}
            />

            {/* /seller/orders */}
            <Route
              path="orders"
              element={<Orders />}
            />

          </Route>

        </Routes>

      </div>

      {/* Footer */}
      {!isSellerPath && <Footer />}

    </div>
  );
};

export default App;

