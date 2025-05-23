import axios from "axios";

// Function to refresh the access token using the stored refresh token
export const refreshToken = async (navigate: ReturnType<typeof import("react-router-dom").useNavigate>) => {
    // Retrieve the refresh token from localStorage
    const storedRefreshToken = localStorage.getItem("RefreshToken");

    // If no refresh token is found, clear tokens and redirect to login
    if (!storedRefreshToken) {
        localStorage.removeItem("Token");
        localStorage.removeItem("RefreshToken");
        navigate("/"); // Redirect to login
        throw new Error("No refresh token available");
    }

    try {
        // Attempt to get a new access token from the backend using the refresh token
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/token/refresh-token`,
            { refreshToken: storedRefreshToken }, // Send the refresh token in the request body
            { withCredentials: true }
        );
        // Extract the new access token from the response
        const newToken = response.data.accessToken; // Updated to match backend response key
        // Store the new access token in localStorage
        localStorage.setItem("Token", newToken); // Store the new token
        return newToken;
    } catch (error) {
        // If refreshing fails, clear tokens and redirect to login
        console.error("Error refreshing token:", error);
        localStorage.removeItem("Token");
        localStorage.removeItem("RefreshToken");
        navigate("/"); // Redirect to login
        throw error;
    }
};

// Create an Axios instance with an interceptor
export const apiClient = (navigate: ReturnType<typeof import("react-router-dom").useNavigate>) => {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true,
    });

    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem("Token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    let isRefreshing = false; // Track if a token refresh is in progress
    let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = []; // Replace `any[]` with a specific type

    const processQueue = (error: unknown, token: string | null = null) => {
        failedQueue.forEach((prom) => {
            if (token) {
                prom.resolve(token);
            } else {
                prom.reject(error);
            }
        });
        failedQueue = [];
    };

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if ((error.response?.status === 401) && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return instance(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const newToken = await refreshToken(navigate);
                    processQueue(null, newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return instance(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    navigate("/"); // Redirect to login
                    throw refreshError;
                } finally {
                    isRefreshing = false;
                }
            }

            throw error;
        }
    );

    return instance;
};
