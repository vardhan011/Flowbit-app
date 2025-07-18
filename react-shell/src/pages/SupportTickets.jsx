import React, { useState } from "react";

const SupportTickets = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("Ticket created successfully!");
            setTitle("");
            setDescription("");
        } else {
            setMessage(data.message || "Failed to create ticket");
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Create Support Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="border p-2 w-full"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    className="border p-2 w-full"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
                    Submit
                </button>
            </form>
            {message && <p className="mt-2 text-green-600">{message}</p>}
        </div>
    );
};

export default SupportTickets;
