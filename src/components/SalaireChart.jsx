import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, IconButton } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function SalariesBarChart() {
  const [allData, setAllData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const usersPerPage = 4;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/employe_salaires", {
        withCredentials: true, // Include credentials
      })
      .then((response) => {
        setAllData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching salary data:", error);
      });
  }, []);

  const handleNextPage = () => {
    if (startIndex + usersPerPage < allData.length) {
      setStartIndex(startIndex + usersPerPage);
    }
  };

  const handlePrevPage = () => {
    if (startIndex - usersPerPage >= 0) {
      setStartIndex(startIndex - usersPerPage);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="center" mt={0}>
        <IconButton
          onClick={handlePrevPage}
          disabled={startIndex === 0}
          sx={{ color: "blue" }}
        >
          <ArrowBackIcon sx={{ fontSize: 36 }} />
        </IconButton>
        <IconButton
          onClick={handleNextPage}
          disabled={startIndex + usersPerPage >= allData.length}
          sx={{ color: "blue" }}
        >
          <ArrowForwardIcon sx={{ fontSize: 36 }} />
        </IconButton>
      </Box>
      <div style={{ height: 260 }}>
        <ResponsiveBar
          data={allData.slice(startIndex, startIndex + usersPerPage)}
          keys={["SalaireNetMensuel"]}
          indexBy="NomEmploye"
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          padding={0.9}
          colors={{ scheme: "category10" }}
          enableLabel={false}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "SalaireNetMensuel",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          tooltip={({ id, value }) => (
            <strong style={{ color: "black" }}>
              {id}: {value} dollars
            </strong>
          )}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemTextColor: "#000",
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "#000",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </Box>
  );
}

export default SalariesBarChart;
