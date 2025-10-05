import React, { useState } from 'react';
import {useNavigate}  from "react-router-dom"
import { UserIcon,MailIcon,LockIcon} from '../components/Icons'
import {signUpUser} from "../services/Api"
// --- Main Signup Component ---
const SignupPage = () => {
      const navigate = useNavigate();
  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // State for loading, error, and success messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes and update state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      // API call to backend signup endpoint
      const userData={
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }
      const response = await signUpUser(userData);
      setSuccess('Signup successful! You can now log in.');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate("/")
      setFormData({ name: '', email: '', password: '' });

    } catch (err) {
      // Handle errors from the API
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Signup failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-900 font-sans text-gray-200 p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-gray-800 p-8 shadow-2xl">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Create an Account</h1>
          <p className="mt-2 text-sm text-gray-400">
            Get started with your URL Shortener for free.
          </p>
        </div>

        {/* Display Error/Success Messages */}
        {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">{error}</div>}
        {success && <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center text-sm text-green-400">{success}</div>}
        
        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Name Input */}
          <div className="relative">
            <label htmlFor="name" className="sr-only">Name</label>
            <UserIcon />
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-900 py-3 pl-10 pr-4 text-white placeholder-gray-500 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Footer Link to Login */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
};

// Main App component to render the SignupPage
// In a real app, you would have routing here.
function App() {
  return <SignupPage />
}

export default App;
