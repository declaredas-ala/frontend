import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";

function Pie() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Fetch user data from the API
    fetch("http://localhost:8080/api/admin/users")
      .then((response) => response.json())
      .then((data) => {
        // Extract roles from user data
        const roles = data.map((user) => user.role);
        console.log(roles);
        // Count occurrences of each role
        const roleCounts = roles.reduce((acc, role) => {
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});
        // Convert role counts to pie chart data format
        const pieData = Object.entries(roleCounts).map(([role, count]) => ({
          id: role,
          label: role,
          value: count,
        }));
        setUserData(pieData);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <Box>
      <div style={{ height: 200 }}>
        <ResponsivePie
          data={userData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5} // Adjust inner radius for doughnut effect
          padAngle={0.7}
          colors={{ scheme: "category10" }} // Change color scheme here
        />
      </div>
    </Box>
  );
}

export default Pie;
