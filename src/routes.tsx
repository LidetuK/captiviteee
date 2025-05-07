import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/auth/LoginPage";
import { PrivateRoute } from "./lib/store/auth";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard/*" element={<div>Dashboard (Protected)</div>} />
      </Route>
      {/* Add other routes as needed */}
    </Routes>
  );
};

export default AppRoutes;
