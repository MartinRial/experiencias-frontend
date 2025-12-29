import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Rutas from "./routes/Routes";
import { Provider } from "react-redux";
import store from "./redux/store"; // 👈 Sin llaves
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // 👈 Importar estilos de toastify
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastContainer
      position="top-right"
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
    <Rutas />
  </Provider>
);