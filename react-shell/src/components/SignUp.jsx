import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "",
        customerId: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanedForm = {
            email: form.email.trim().toLowerCase(),
            password: form.password,
            role: form.role,
            customerId: form.customerId.trim().toLowerCase()
        };

        const res = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cleanedForm),
        });

        const data = await res.json();
        console.log("Response:", data);

        if (res.ok) {
            alert("Signup successful!");
            navigate("/auth/signin");
        } else {
            alert(data.message || "Signup failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border border-gray-300 rounded"
                />

                {/* Password */}
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border border-gray-300 rounded"
                />

                {/* Role Dropdown */}
                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border border-gray-300 rounded"
                >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                </select>

                {/* CustomerId */}
                <input
                    type="text"
                    name="customerId"
                    placeholder="Customer ID (e.g. logisticsco)"
                    value={form.customerId}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border border-gray-300 rounded"
                />

                {/* Submit */}
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Register
                </button>

                <p className="text-sm mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link to="/auth/signin" className="text-blue-500 hover:underline">
                        Sign in here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignUp;
