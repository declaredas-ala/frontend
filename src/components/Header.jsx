/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

const Header = ({ title, subtitle }) => {
  // Define basic colors
  const colors = {
    gray: {
      100: "#808080", // gray
    },
    greenAccent: {
      400: "#28a745", // green
    },
  };

  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        fontWeight="bold"
        color={colors.gray[100]}
        mb="5px"
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
