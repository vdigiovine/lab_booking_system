import React from 'react';

const Navbar = ({ user, onLogout, onLoginClick }) => {
    return (
        <nav className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Lab Booking</h1>
            <div>
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Welcome, {user.sub}</span>
                        <button
                            onClick={onLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
