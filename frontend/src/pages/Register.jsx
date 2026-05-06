import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/customers/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            surname: formData.surname,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");

        setTimeout(function () {
          navigate("/");
        }, 1500);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Could not connect to server");
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar showMenu={false} />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Create Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Surname</label>

              <input
                type="text"
                name="surname"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>

              <input
                type="email"
                name="email"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>

              <input
                type="password"
                name="password"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Register
            </button>
          </form>

          {message !== "" && (
            <p className="mt-4 text-center text-sm text-red-500">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;