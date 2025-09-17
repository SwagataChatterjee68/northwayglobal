"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Using sonner for modern notifications
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Send credentials securely in a POST request body
      const res = await fetch("https://nortway.mrshakil.com/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // 2. Check if the login was successful
      if (res.ok) {
        toast.success(`Welcome back, ${data.username}!`);

        // 3. Store the authentication token in localStorage
        localStorage.setItem("authToken", data.token);

        // 4. Redirect using Next.js router for a smoother experience
        router.push("/dashboard");

      } else {
        // Handle potential errors from the API
        setError(data.detail || "Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username" className="input-label">
              Email
            </label>
            <input
              type="text"
              id="username"
              className="input-field"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading} // Disable input when loading
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading} // Disable input when loading
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}