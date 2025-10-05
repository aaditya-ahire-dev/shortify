import React, { useState, useEffect } from 'react';
import { LinkIcon,LogoutIcon,MenuIcon,UserProfileIcon,XIcon} from './Icons'
// --- SVG Icons (Corrected for better rendering) ---

// --- The Navbar Component ---
function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const path = window.location.pathname;
        let userDataString;

        // Check if the current path is for the admin section
        if (path.startsWith('/admin')) {
            userDataString = localStorage.getItem('Admin');
        } else {
            userDataString = localStorage.getItem('user');
        }

        if (userDataString) {
            try {
                const user = JSON.parse(userDataString);
                setUserName(user.name || 'User');
            } catch (error) {
                console.error("Failed to parse user data from localStorage:", error);
                setUserName('User'); // Fallback on parsing error
            }
        }
    }, []);

    const handleLogout = () => {
        const path = window.location.pathname;

        // Remove the correct item from localStorage based on the path
        if (path.startsWith('/admin')) {
            localStorage.removeItem('Admin');
        } else {
            localStorage.removeItem('user');
        }
        
        // Reload the page to reset the app's state and redirect
        window.location.reload();
    };

    return (
        <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" className="flex items-center space-x-2">
                        <LinkIcon />
                        <span className="text-xl font-bold text-white tracking-wider">Shortify</span>
                    </a>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <a href="/profile" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                            <UserProfileIcon />
                            {userName}
                        </a>
                        <button onClick={handleLogout} className="flex items-center bg-red-600 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-red-700 transition-colors">
                            <LogoutIcon />
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? <XIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute w-full bg-gray-800 border-t border-gray-700">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         <a href="/profile" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">
                            <UserProfileIcon />
                            {userName}
                        </a>
                        <button onClick={handleLogout} className="w-full text-left flex items-center text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">
                            <LogoutIcon />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;

