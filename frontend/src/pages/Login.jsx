import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/api/customers/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Could not connect to server");
      console.log(error);
    }
  }

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  function changePassword(e) {
    setPassword(e.target.value);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar showMenu={false} />

      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>

              <input
                type="email"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={changeEmail}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>

              <input
                type="password"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={changePassword}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </button>

            <Link
              to="/register"
              className="text-blue-500 hover:underline text-sm"
            >
              Don't have an account? Register here
            </Link>
          </form>

          {message !== "" && (
            <p className="mt-4 text-center text-sm text-red-500">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;