import axios from "axios";

export const refreshToken = async (navigate: ReturnType<typeof import("react-router-dom").useNavigate>) => {
    const storedRefreshToken = localStorage.getItem("RefreshToken");
    console.log("Stored Refresh Token:", storedRefreshToken); // Log the refresh token for debugging

    if (!storedRefreshToken) {
        console.error("No refresh token found, redirecting...");
        localStorage.removeItem("Token");
        localStorage.removeItem("RefreshToken");
        navigate("/"); // Redirect to login
        throw new Error("No refresh token available");
    }

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/token/refresh-token`,
            { refreshToken: storedRefreshToken }, // Corrected key to match backend expectation
            { withCredentials: true }
        );
        const newToken = response.data.accessToken; // Updated to match backend response key
        console.log("New Access Token:", newToken); // Log the new token for debugging
        localStorage.setItem("Token", newToken); // Store the new token
        console.log("Token stored in localStorage:", localStorage.getItem("Token")); // Verify token storage
        return newToken;
    } catch (error) {
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
        console.log("Request Headers:", config.headers); // Log headers for debugging
        return config;
    });

    let isRefreshing = false; // Track if a token refresh is in progress
    let failedQueue: any[] = []; // Queue to hold failed requests during token refresh

    const processQueue = (error: any, token: string | null = null) => {
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

            if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
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
