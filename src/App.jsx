// src/App.js
import React from "react";
import { Box } from "@mui/material";
import Navbar from "./Layout/navbar";
import Sidebar from "./Layout/sidebar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxWidth: "100%",
          marginLeft: 7, // Adjust margin as needed
        }}
      >
        <Navbar />
        <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
