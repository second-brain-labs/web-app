import React from "react";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import Footer from "./components/Shared/Footer";
import LoginPage from "./auth/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { Provider } from "react-redux";
import store from "./util/redux/store";

function App() {
  return (
    <Provider store={store}>
      {" "}
      {/* Wrap with Redux Provider */}
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
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
