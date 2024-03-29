import React from "react";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import Footer from "./components/Shared/Footer";
import LoginPage from "./auth/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { Provider } from "react-redux";
import store from "./util/redux/store";
import SmartPage from "./pages/HomePage/SmartPage";

function App() {
  return (
    <Provider store={store}>
      {" "}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
                <Footer />
              </PrivateRoute>
            }
          />
          <Route
            path="/smart_page"
            element={
              <PrivateRoute>
                <SmartPage />
                <Footer />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
