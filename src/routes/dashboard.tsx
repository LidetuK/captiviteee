import { Routes, Route } from "react-router-dom";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
    </Routes>
  );
};

export default DashboardRoutes;
