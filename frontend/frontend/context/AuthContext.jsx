import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser, verifyToken, logoutUser, getCurrentUser } from "../api/index";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("skill-sync-token");
    if (token) {
      verifyToken()
        .then(() => {
          if (!mounted) return;
          return getCurrentUser();
        })
        .then((data) => {
          if (!mounted) return;
          setUser(data.user || data);
          setError(null);
        })
        .catch((err) => {
          if (!mounted) return;
          localStorage.removeItem("skill-sync-token");
          setUser(null);
          setError(err.response?.data?.detail || "Session expired. Please log in again.");
        })
        .finally(() => {
          if (!mounted) return;
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => { mounted = false; };
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("skill-sync-token", data.access_token);
      setUser(data);
      navigate("/dashboard");
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed. Please check your credentials.";
      setError(msg);
      throw err;
    }
  };

  const demoLogin = () => {
    setError(null);
    const demoUser = {
      sub: "demo@example.com",
      email: "demo@example.com",
      name: "Demo Student",
    };
    localStorage.setItem("skill-sync-token", "demo-token-local");
    setUser(demoUser);
    navigate("/dashboard");
  };

  const signup = async (name, email, password, correct_password) => {
    setError(null);
    try {
      await signupUser(name, email, password, correct_password);
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.detail || "Signup failed. Please try again.";
      setError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {}
    localStorage.removeItem("skill-sync-token");
    setUser(null);
    setError(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, demoLogin, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);
  return user;
}