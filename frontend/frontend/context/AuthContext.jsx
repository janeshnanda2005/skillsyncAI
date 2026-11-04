import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser, verifyToken, logoutUser, getCurrentUser } from "../api/index";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
        })
        .catch(() => {
          if (!mounted) return;
          localStorage.removeItem("skill-sync-token");
          setUser(null);
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
    const data = await loginUser(email, password);
    localStorage.setItem("skill-sync-token", data.access_token);
    setUser(data);
    navigate("/dashboard");
  };

  const signup = async (name, email, password, correct_password) => {
    await signupUser(name, email, password, correct_password);
    navigate("/login");
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {}
    localStorage.removeItem("skill-sync-token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
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