import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import feastoLogo from "../image/feastoLogo.png"; // Import logo
import "../styles/Login.css"; // Import external CSS

const baseURL = "https://food-appi-b.vercel.app/api"; // Replace with actual backend URL

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    if (!captchaValue) {
      setError("Please complete the CAPTCHA.");
      return;
    }

    try {
      const loginData = { email, password, recaptchaToken: captchaValue };
      const response = await axios.post(`${baseURL}/auth/login`, loginData);
      
      localStorage.setItem("token", response.data.token);
      navigate("/"); // Redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={feastoLogo} alt="Feasto Logo" className="login-logo" /> 
        <h2 className="login-title">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <div className="login-recaptcha">
            <ReCAPTCHA
              sitekey="6LdFTNAqAAAAAD10fnUv69HXEme3RAn0aU7RzlwZ"
              onChange={setCaptchaValue}
            />
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
