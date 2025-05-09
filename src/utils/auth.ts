import axios from "axios";

export const refreshToken = async (navigate: ReturnType<typeof import("react-router-dom").useNavigate>) => {
  const storedRefreshToken = localStorage.getItem("RefreshToken");
  if (!storedRefreshToken) {
    console.error("No refresh token found, redirecting...");
    localStorage.removeItem("Token");
    navigate("/");
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/token`,
      { refresh_token: storedRefreshToken },
      { withCredentials: true }
    );
    localStorage.setItem("Token", response.data.token);
    return response.data.token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("Token");
    localStorage.removeItem("RefreshToken");
    navigate("/");
    throw error;
  }
};
