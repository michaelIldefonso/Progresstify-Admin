import React from 'react';

// Login page for admin dashboard
function Login() {
    // Handler for Google OAuth login
    const handleOAuthLogin = () => {
        // Redirect to the OAuth login URL
        const oauth2LoginUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/admin/google`;
        window.open(oauth2LoginUrl, "_self"); // Open the OAuth login in the same tab
    };

    return (
        <div className="h-screen bg-gray-900 text-white">
            {/* Navbar */}
            <div className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
                <h1 className="text-lg font-bold text-white">
                    Progresstify Admin Dashboard
                </h1>
                <button
                    onClick={handleOAuthLogin}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center"
                >
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google G Logo"
                        className="w-5 h-5 mr-2"
                    />
                    Login with Google
                </button>
            </div>
            {/* Main Content */}
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-300 text-lg mb-4">
                    Welcome to the Progresstify Admin Dashboard. Please log in to continue.
                </p>
                <p className="text-sm text-red-400">
                    This is an admin-only page. If you want to visit our website, click{' '}
                    <a
                        href={import.meta.env.VITE_FRONTEND_BASE_URL}
                        className="text-blue-400 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        here
                    </a>.
                </p>
            </div>
        </div>
    );
}

export default Login;
