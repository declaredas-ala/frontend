import React, { useEffect, useState } from "react";
import { Box, IconButton, Button, ButtonGroup } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

function HoursBarChart() {
  const [allData, setAllData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [dataType, setDataType] = useState("yearly");
  const usersPerPage = 4;

  const fetchData = (type) => {
    const url =
      type === "yearly"
        ? "http://localhost:8080/api/admin/hours-yearly"
        : "http://localhost:8080/api/admin/hours-monthly";

    axios
      .get(url, { withCredentials: true })
      .then((response) => {
        console.log("Fetched data:", response.data); // Debug: Log fetched data
        const formattedData = response.data.totalSupplementaryHours.map(
          (user) => ({
            name: user.Fullname ? user.Fullname.split(" ")[0] : "Unknown",
            hours: parseFloat(user.totalSupplementaryHours),
          })
        );
        console.log("Formatted data:", formattedData); // Debug: Log formatted data
        setAllData(formattedData);
        setDisplayedData(formattedData.slice(0, usersPerPage));
      })
      .catch((error) => {
        console.error("Error fetching hours data:", error);
      });
  };

  useEffect(() => {
    fetchData(dataType);
  }, [dataType]);

  useEffect(() => {
    setDisplayedData(allData.slice(startIndex, startIndex + usersPerPage));
  }, [allData, startIndex]);

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

  const handleDataTypeChange = (type) => {
    setDataType(type);
    setStartIndex(0); // Reset start index when changing data type
  };

  return (
    <Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <ButtonGroup variant="contained" color="primary">
          <Button
            onClick={() => handleDataTypeChange("yearly")}
            disabled={dataType === "yearly"}
          >
            Yearly
          </Button>
          <Button
            onClick={() => handleDataTypeChange("monthly")}
            disabled={dataType === "monthly"}
          >
            Monthly
          </Button>
        </ButtonGroup>
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
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
      <div style={{ height: 400 }}>
        {" "}
        {/* Adjusted height */}
        {displayedData.length > 0 ? (
          <ResponsiveBar
            data={displayedData}
            keys={["hours"]}
            indexBy="name"
            margin={{ top: 50, right: 50, bottom: 100, left: 60 }} // Adjusted margins
            padding={0.9} // Adjusted padding
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
              legend: "Hours",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            tooltip={({ id, value, color }) => (
              <strong style={{ color: "black" }}>
                {id}: {value} hours
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
                itemWidth: 20,
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
        ) : (
          <p>No data available</p>
        )}
      </div>
    </Box>
  );
}

export default HoursBarChart;
