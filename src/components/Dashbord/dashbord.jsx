import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
} from "@mui/material";
import { Header, StatBox } from "../../components";
import { Person, CheckCircle, Cancel, ErrorOutline } from "@mui/icons-material";
import { tokens } from "../../theme";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode || "light");

  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");

  const [usersCount, setUsersCount] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [inactiveUsersCount, setInactiveUsersCount] = useState(0);
  const [apiCalls, setApiCalls] = useState([]);
  const [successfulCallsCount, setSuccessfulCallsCount] = useState(0);
  const [failedCallsCount, setFailedCallsCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (userInfo && !userInfo.isActive) {
      setOpenModal(true);
    }

    const fetchUsersData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:5000/users/");
        const users = usersResponse.data;

        setUsersCount(users.length);
        setActiveUsersCount(users.filter((user) => user.is_active).length);
        setInactiveUsersCount(users.filter((user) => !user.is_active).length);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    const fetchApiCalls = async () => {
      try {
        const apiCallsResponse = await axios.get(
          "http://127.0.0.1:5000/api-calls/"
        );
        const apiCallsData = apiCallsResponse.data;

        setApiCalls(apiCallsData);
        setSuccessfulCallsCount(
          apiCallsData.filter((call) => call.response_code === 200).length
        );
        setFailedCallsCount(
          apiCallsData.filter((call) => call.response_code !== 200).length
        );
      } catch (error) {
        console.error("Error fetching API calls data:", error);
      }
    };

    fetchUsersData();
    fetchApiCalls();
  }, [userInfo]);

  const userData = [
    {
      name: "Active",
      count: activeUsersCount,
    },
    {
      name: "Inactive",
      count: inactiveUsersCount,
    },
  ];

  const apiData = [
    {
      name: "Successful",
      count: successfulCallsCount,
    },
    {
      name: "Failed",
      count: failedCallsCount,
    },
  ];

  return (
    <Box m="20px">
      <Modal
        open={openModal}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Account Inactive
          </Typography>
          <Typography id="modal-modal-description" variant="h5" sx={{ mt: 2 }}>
            Please contact the admin to activate your account.
          </Typography>
        </Box>
      </Modal>

      <Box display="flex" justifyContent="space-between" mb="20px">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={
          isXlDevices
            ? "repeat(12, 1fr)"
            : isMdDevices
            ? "repeat(6, 1fr)"
            : "repeat(3, 1fr)"
        }
        gridAutoRows="120px"
        gap="20px"
      >
        <Box
          gridColumn="span 4"
          backgroundColor={"#fff"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px"
          boxShadow="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
        >
          <StatBox
            title={`${usersCount}`}
            subtitle="Total Users"
            icon={
              <Person
                sx={{ color: colors.blueAccent[400], fontSize: "30px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 4"
          backgroundColor={"#fff"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px"
          boxShadow="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
        >
          <StatBox
            title={`${activeUsersCount}`}
            subtitle="Active Users"
            icon={
              <CheckCircle
                sx={{ color: colors.greenAccent[400], fontSize: "30px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 4"
          backgroundColor={"#fff"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px"
          boxShadow="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
        >
          <StatBox
            title={`${inactiveUsersCount}`}
            subtitle="Inactive Users"
            icon={
              <Cancel sx={{ color: colors.redAccent[400], fontSize: "30px" }} />
            }
          />
        </Box>

        <Box
          gridColumn="span 4"
          backgroundColor={"#fff"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px"
          boxShadow="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
        >
          <StatBox
            title={`${apiCalls.length}`}
            subtitle="Total API Calls"
            icon={
              <ErrorOutline
                sx={{ color: colors.redAccent[200], fontSize: "30px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 4"
          backgroundColor={"#fff"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px"
          boxShadow="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
        >
          <StatBox
            title={`${successfulCallsCount}`}
            subtitle="Successful API Calls"
            icon={
              <CheckCircle
                sx={{ color: colors.greenAccent[200], fontSize: "30px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 4"
          backgroundColor={"#fff"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px"
          boxShadow="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
        >
          <StatBox
            title={`${failedCallsCount}`}
            subtitle="Failed API Calls"
            icon={
              <Cancel sx={{ color: colors.redAccent[200], fontSize: "30px" }} />
            }
          />
        </Box>
      </Box>

      <Box
        mt="20px"
        p="20px"
        backgroundColor={"#fff"}
        borderRadius="8px"
        boxShadow="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
      >
        <Typography variant="h6" gutterBottom>
          User Status Overview
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={userData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill={colors.blueAccent[400]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box
        mt="20px"
        p="20px"
        backgroundColor={"#fff"}
        borderRadius="8px"
        boxShadow="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
      >
        <Typography variant="h6" gutterBottom>
          API Calls Overview
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={apiData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill={colors.primary[400]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box
        mt="20px"
        p="20px"
        backgroundColor={"#fff"}
        borderRadius="8px"
        boxShadow="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
      >
        <Typography variant="h6" gutterBottom>
          Detailed API Calls
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Endpoint</TableCell>
                <TableCell>Response Code</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>User ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiCalls.map((apiCall) => (
                <TableRow key={apiCall.id}>
                  <TableCell>{apiCall.api_endpoint}</TableCell>
                  <TableCell>{apiCall.response_code}</TableCell>
                  <TableCell>{apiCall.type}</TableCell>
                  <TableCell>{apiCall.user_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Dashboard;
