import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/customers/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text" name="fullName" placeholder="Full Name"
          value={form.fullName} onChange={handleChange} required
          className="w-full border p-2 rounded"
        />
        <input
          type="email" name="email" placeholder="Email"
          value={form.email} onChange={handleChange} required
          className="w-full border p-2 rounded"
        />
        <input
          type="password" name="password" placeholder="Password"
          value={form.password} onChange={handleChange} required
          className="w-full border p-2 rounded"
        />
        <input
          type="text" name="phone" placeholder="Phone Number"
          value={form.phone} onChange={handleChange} required
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Register;