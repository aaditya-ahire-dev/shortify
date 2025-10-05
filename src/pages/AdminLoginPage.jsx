import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {MailIcon,LockIcon} from '../components/Icons'
import {adminLoginUser} from "../services/Api"

// --- Login Page Component ---
function AdminLoginPage() {
    const navigate = useNavigate();
    // State for form inputs
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // State for loading, error, and success messages
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle input changes and update state
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Both email and password are required.');
            setLoading(false);
            return;
        }

        try {
            // API call to the backend login endpoint
            const adminData = {
                email: formData.email,
                password: formData.password,
            }
            const response = await adminLoginUser(adminData);

            localStorage.setItem('Admin', JSON.stringify(response.data.Admin));
            setSuccess('Login successful!');
            navigate("/admin/dashboard")
            setFormData({ email: '', password: '' });
            // navigate("")
        } catch (err) {
            // Handle errors from the API
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Main container to center the form on the page
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-900 p-4 font-sans text-gray-200">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-gray-800 p-8 shadow-2xl">
                {/* Header Section */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back Admin!</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to continue to your dashboard.
                    </p>
                </div>

                {/* Display Error/Success Messages */}
                {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400" role="alert">{error}</div>}
                {success && <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center text-sm text-green-400" role="alert">{success}</div>}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Input */}
                    <div className="relative">
                        <label htmlFor="email" className="sr-only">Email</label>
                        <MailIcon />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            autoComplete="email"
                            placeholder="Email address"
                            required
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 py-3 pl-10 pr-4 text-white placeholder-gray-500 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <LockIcon />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            autoComplete="current-password"
                            placeholder="Password"
                            required
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 py-3 pl-10 pr-4 text-white placeholder-gray-500 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-transform duration-200 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-blue-800 disabled:opacity-70"
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>
                    </div>
                </form>

                {/* Footer Link to Signup */}
                <p className="text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <a href="/admin/signup" className="font-medium text-blue-400 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}

export default AdminLoginPage;

