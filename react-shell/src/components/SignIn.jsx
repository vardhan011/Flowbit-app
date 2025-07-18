import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok && data.token) {
                // ✅ Save token
                localStorage.setItem("token", data.token);

                // ✅ Optionally log decoded payload (only for debugging, remove in prod)
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                console.log("Decoded Token:", payload);

                alert("Signed in successfully!");
                navigate("/"); // Go to dashboard
            } else {
                alert(data.message || "Invalid Credentials");
            }
        } catch (error) {
            alert("Something went wrong!");
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
                    Sign In
                </h2>

                {["email", "password"].map((field) => (
                    <input
                        key={field}
                        type={field === "password" ? "password" : "text"}
                        name={field}
                        placeholder={field}
                        value={form[field]}
                        onChange={handleChange}
                        required
                        className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                ))}

                <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                    Login
                </button>

                <p className="text-sm mt-4 text-center text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link to="/auth/signup" className="text-blue-500 hover:underline">
                        Sign up here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignIn;
