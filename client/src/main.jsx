

// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";

// createRoot(document.getElementById("root")).render(
//   <App />
// );
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppcontexProvider } from "./context/Appcontext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppcontexProvider>
      <App />
    </AppcontexProvider>
  </BrowserRouter>
);