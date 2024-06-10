/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  // Define basic colors
  const colors = {
    gray: {
      100: "#4D4D4D", // gray
    },
    greenAccent: {
      500: "#28a745", // green
      600: "#FFFFFF", // darker green
    },
  };

  return (
    <Box width="100%" mx="30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography variant="h4" fontWeight="bold" color={"##FFFFFF"}>
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progress} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" color={"##FFFFFF"}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          color={colors.greenAccent[600]}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
