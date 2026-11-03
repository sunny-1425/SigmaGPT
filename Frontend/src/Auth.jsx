import { useState, useContext } from "react";
import { MyContext } from "./MyContext.jsx";
import "./Auth.css";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { setToken, setUser } = useContext(MyContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        const endpoint = isLogin
            ? "/api/auth/login"
            : "/api/auth/signup";

        const requestData = isLogin
            ? {
                email: formData.email,
                password: formData.password
            }
            : formData;

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || data.error || "Authentication failed"
                );
            }

            if (!data.token || !data.username) {
                throw new Error("Invalid response from server");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);

            setToken(data.token);
            setUser(data.username);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleAuth = () => {
        setIsLogin(!isLogin);
        setError("");

        setFormData({
            username: "",
            email: "",
            password: ""
        });
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-header">
                    <div className="auth-logo">SigmaGPT</div>

                    <h1>
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h1>

                    <p>
                        {isLogin
                            ? "Log in to continue using SigmaGPT"
                            : "Create an account to get started with SigmaGPT"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">

                    {!isLogin && (
                        <div className="auth-form-group">
                            <label htmlFor="username">Username</label>

                            <input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                minLength={3}
                                maxLength={30}
                                required
                            />
                        </div>
                    )}

                    <div className="auth-form-group">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="password">Password</label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </div>

                    {error && (
                        <p className="auth-error">{error}</p>
                    )}

                    <button
                        type="submit"
                        className={isLogin
                            ? "auth-submit auth-login-submit"
                            : "auth-submit"}
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Log In"
                                : "Sign Up"}
                    </button>

                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"}

                        <span onClick={toggleAuth}>
                            {isLogin ? " Sign Up" : " Log In"}
                        </span>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Auth;
