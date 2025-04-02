import React from 'react';

function Login() {
    const handleOAuthLogin = () => {
        // Use the environment variable for the base URL and append the path
        const oauth2LoginUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/admin/google`;
        window.location.href = oauth2LoginUrl;
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
                <button
                    onClick={handleOAuthLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login with OAuth2
                </button>
            </div>
        </div>
    );
}

export default Login;
