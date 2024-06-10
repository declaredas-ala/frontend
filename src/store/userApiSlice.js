import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
const AUTH_URL = "http://127.0.0.1:5000";

// Action Types
export const SIGN_IN = "/login";
export const SIGN_UP = "user/signUp";
export const LOGOUT = "user/logout";

// Helper function to handle errors
const handleError = (error) => {
  const errorMessage = error.response?.data?.error || "An error occurred";
  if (errorMessage === "Invalid email or password") {
    toast.error("Adresse e-mail ou mot de passe incorrect");
  } else if (errorMessage === "User not found") {
    toast.error("Utilisateur non trouvé");
  } else if (errorMessage === "User already exists") {
    toast.error("L'utilisateur existe déjà");
  } else if (errorMessage === "Unauthorized") {
    toast.error("Non autorisé");
  } else {
    toast.error(errorMessage);
  }
  throw new Error(errorMessage);
};

// Async Thunks
export const signInAsync = createAsyncThunk(SIGN_IN, async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, userData, {
      withCredentials: true,
      // Include credentials in the request
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
});

export const signUpAsync = createAsyncThunk(SIGN_UP, async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
});

export const logoutAsync = createAsyncThunk(LOGOUT, async () => {
  try {
    const csrfToken = Cookies.get("csrf_access_token");
    console.log(csrfToken);

    if (!csrfToken) {
      throw new Error("CSRF token not found in cookies");
    }

    const response = await axios.post(`${AUTH_URL}/logout`, null, {
      withCredentials: true,
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
    });

    console.log("Logout request sent successfully:", response.data);
  } catch (error) {
    console.error("Error during logout request:", error);
    if (error.response) {
      console.error("Server responded with:", error.response.data);
    } else if (error.request) {
      console.error(
        "No response received from server. Error request details:",
        error.request
      );
    } else {
      console.error("Error setting up logout request:", error.message);
    }
    // Handle the error here as per your application's logic
  }
});

const userApiSlice = createSlice({
  name: "userApi",
  initialState: {
    loading: false,
    error: null,
    user: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // SignIn cases
      .addCase(signInAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success("Connexion réussie");
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Échec de la connexion";
      })
      // SignUp cases
      .addCase(signUpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success("Inscription réussie");
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Échec de l'inscription";
      })
      // Logout cases
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        toast.success("Déconnexion réussie");
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Échec de la déconnexion";
      });
  },
});

export default userApiSlice.reducer;
