import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ screens, user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth/signin");
    };

    return (
        <div className="w-64 bg-white p-4 shadow-md">
            <h2 className="text-xl font-bold mb-4">Tenant Screens</h2>
            <ul className="space-y-2">
                {screens.map((screen, idx) => (
                    <li key={idx}>
                        <Link to={screen.url} className="block p-2 rounded hover:bg-gray-200">
                            {screen.name}
                        </Link>
                    </li>
                ))}

                {/* Only Admin can see Create Ticket */}
                {user?.role === "Admin" && (
                    <li>
                        <Link
                            to="/tickets/create"
                            className="block p-2 rounded bg-blue-100 hover:bg-blue-200"
                        >
                            + Create Ticket
                        </Link>
                    </li>
                )}
            </ul>

            <button
                onClick={handleLogout}
                className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
