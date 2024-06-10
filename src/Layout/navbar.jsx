import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ExitToAppOutlined,
  MenuOutlined,
  PersonOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { logoutAsync } from "../store/userApiSlice";

const Navbar = () => {
  const theme = useTheme();
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const isXsDevices = useMediaQuery("(max-width:466px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.auth.userInfo);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    dispatch(logoutAsync());
    dispatch(logout());
    navigate("/");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <AppBar position="static" sx={{ boxShadow: "none", bgcolor: "#ffffff" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuOutlined />
          </IconButton>
          <Box
            display="flex"
            alignItems="center"
            borderRadius="3px"
            bgcolor="background.default"
            sx={{ display: `${isXsDevices ? "none" : "flex"}`, px: 2, py: 0.5 }}
          >
            <InputBase
              placeholder="Search here..."
              sx={{
                flex: 1,
                color: "text.primary",
                fontSize: "0.9rem",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchOutlined />
            </IconButton>
          </Box>
        </Box>

        {userInfo ? (
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleMenuOpen}>
              {userInfo.avatar ? (
                <Avatar src={userInfo.avatar} alt={userInfo.fullName} />
              ) : (
                <Avatar>
                  <Typography variant="body1">
                    {userInfo.fullName.charAt(0).toUpperCase()}
                  </Typography>
                </Avatar>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginLeft: 1,
                }}
              >
                <Typography variant="subtitle1">{userInfo.fullName}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.75rem",
                    color: "text.secondary",
                  }}
                >
                  {userInfo.role}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.75rem",
                    color: "text.secondary",
                  }}
                >
                  {userInfo.exact_role}
                </Typography>
              </Box>
              <ArrowDropDownIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleProfile}>
                Profile
                <PersonOutlined />
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
                <ExitToAppOutlined />
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button variant="outlined" color="inherit" onClick={handleSignIn}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
