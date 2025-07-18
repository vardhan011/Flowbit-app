// src/pages/MyTickets.jsx
import React, { useEffect, useState } from "react";

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch("http://localhost:5000/api/tickets/mine", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setTickets(data.tickets || []);
            })
            .catch((err) => console.error("Failed to fetch my tickets:", err));
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">My Assigned Tickets</h2>
            {tickets.length === 0 ? (
                <p>No tickets assigned to you yet.</p>
            ) : (
                <ul className="space-y-4">
                    {tickets.map((ticket) => (
                        <li
                            key={ticket._id}
                            className="p-4 bg-white rounded shadow border-l-4 border-blue-500"
                        >
                            <h3 className="text-lg font-semibold">{ticket.title}</h3>
                            <p>{ticket.description}</p>
                            <p className="text-sm text-gray-500">Status: {ticket.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyTickets;
