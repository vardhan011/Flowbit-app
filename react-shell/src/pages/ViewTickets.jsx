import React, { useEffect, useState } from "react";

const ViewTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:5000/api/tickets", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.tickets) {
                    setTickets(data.tickets);
                } else {
                    setError(data.message || "Error fetching tickets");
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setError("Server error");
            });
    }, []);

    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">All Support Tickets</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Created By</th>
                            <th className="px-4 py-2">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket._id} className="border-t">
                                <td className="px-4 py-2">{ticket.title}</td>
                                <td className="px-4 py-2">{ticket.description}</td>
                                <td className="px-4 py-2">{ticket.status}</td>
                                <td className="px-4 py-2">{ticket.createdBy}</td>
                                <td className="px-4 py-2">
                                    {new Date(ticket.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewTickets;
