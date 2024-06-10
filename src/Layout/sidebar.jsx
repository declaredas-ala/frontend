import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Apps as AppsIcon,
} from "@mui/icons-material";
import logo from "./api.jpg";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const userRole = useSelector((state) => state.auth.userInfo.role);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      PaperProps={{
        sx: {
          width: open ? 240 : 56,
          transition: "width 0.3s",
          overflowX: "hidden",
          backgroundColor: "#2d6a9c",
          color: "#fff",
        },
      }}
    >
      {/* Logo */}
      <div
        style={{ display: "flex", justifyContent: "center", padding: "10px" }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "70%",
            borderRadius: "50%",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>

      <List>
        <ListItem button onClick={() => navigate("/")} sx={{ mb: 2 }}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Home"
            sx={{ display: open ? "block" : "none" }}
          />
        </ListItem>

        {userRole !== "User" && (
          <ListItem button onClick={() => navigate("/users")} sx={{ mb: 2 }}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Users"
              sx={{ display: open ? "block" : "none" }}
            />
          </ListItem>
        )}
        <ListItem button onClick={() => navigate("/api")} sx={{ mb: 2 }}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText
            primary="API"
            sx={{ display: open ? "block" : "none" }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
