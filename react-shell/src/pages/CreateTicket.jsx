// src/pages/CreateTicket.jsx
import React, { useState } from "react";

const CreateTicket = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState(""); // ✅ new field
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:5000/api/tickets/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, assignedTo }) // ✅ include it
            });

            const text = await res.text();
            let data;

            try {
                data = JSON.parse(text);
            } catch (err) {
                console.log("❌ Not JSON:", text);
                setMessage("❌ Server did not return JSON.");
                return;
            }

            if (res.ok) {
                setMessage("✅ Ticket created!");
                setTitle("");
                setDescription("");
                setAssignedTo("");
            } else {
                setMessage(`❌ ${data.message || "Something went wrong"}`);
            }
        } catch (error) {
            console.error("❌ Error:", error);
            setMessage("❌ Something went wrong");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Create Support Ticket</h2>
            {message && <p className="mb-2 text-sm text-blue-600">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Ticket Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded"
                ></textarea>

                {/* ✅ Assigned To Input */}
                <input
                    type="email"
                    placeholder="Assign to (User Email)"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded"
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Ticket
                </button>
            </form>
        </div>
    );
};

export default CreateTicket;
