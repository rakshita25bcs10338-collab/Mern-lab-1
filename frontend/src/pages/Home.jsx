import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Home() {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/customers/me");
        setCustomer(res.data.customer || res.data); // adjust to your API's response shape
      } catch (err) {
        navigate("/login");
      }
    };
    fetchMe();
  }, [navigate]);

  if (!customer) return null; // or a loading spinner

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome, {customer.fullName}!</h2>
        <p className="text-gray-600">Email: {customer.email}</p>
        <p className="text-gray-600">Phone: {customer.phone}</p>
      </div>
    </div>
  );
}

export default Home;