import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "../scenes/dashboard/index2";
import { Dashboard as DashbordAdmin } from "../scenes/dashboard/index";

const DashbordRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo.role ? <Dashboard /> : <DashbordAdmin replace />;
};
export default DashbordRoute;
