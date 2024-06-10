import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "./store/store";
import SignInForm from "./pages/Login";
import RegisterPage from "./pages/register";
import Dashboard from "./components/Dashbord/dashbord";
import ApiCalls from "./components/Dashbord/ApiCalls";
import UserManagement from "./components/Dashbord/UserManagement";
import App from "./App";
import Profile from "./components/Profile";
// PrivateRoute component to handle protected routes
const PrivateRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? children : <Navigate to="/login" />;
};

// Defining the routes structure
const AppRoutes = () => {
  return (
    // <Routes>
    //   <Route path="/" element={<Dashboard />} />
    //   <Route path="/login" element={<SignInForm />} />
    //   <Route path="/register" element={<RegisterPage />} />
    //   <Route path="/api" element={<ApiCalls />} />
    //   <Route path="/users" element={<UserManagement />} />
    // </Routes>
    <Routes>
      <Route path="/login" element={<SignInForm />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />{" "}
        {/* Default child route for "/" */}
        <Route path="/api" element={<ApiCalls />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ToastContainer />
    <Router>
      <AppRoutes />
    </Router>
  </Provider>
);
