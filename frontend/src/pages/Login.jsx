import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/customers/login", form);
      await refreshCart(); // load this user's cart right after logging in
      navigate("/home");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid Credentials");
      } else if (!err.response) {
        setError("Cannot reach the server. Is the backend running?");
      } else {
        setError(err.response.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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

        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;