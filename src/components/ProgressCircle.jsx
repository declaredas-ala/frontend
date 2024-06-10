/* eslint-disable react/prop-types */
import { Box } from "@mui/material";

const ProgressCircle = ({ progress = "0.75", size = "40" }) => {
  // Define some basic colors
  const colors = {
    primary: {
      400: "#FFFFFF", // blue
    },
    blueAccent: {
      500: "#43E0FF", // darker blue
    },
    greenAccent: {
      500: "#1D296C", // green
    },
  };

  const angle = progress * 360;
  return (
    <Box
      sx={{
        background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[500]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;
