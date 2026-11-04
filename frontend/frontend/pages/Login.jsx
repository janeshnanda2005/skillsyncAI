import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./../context/AuthContext";
import { Button } from "./../components/ui/Button";
import { Input } from "./../components/ui/Input";
import { Zap } from "lucide-react";

export default function Login() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-fg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-black">
            <Zap className="h-4 w-4 text-fg" />
          </div>
          <span className="text-lg font-bold uppercase tracking-widest text-fg">SkillSyncAI</span>
        </div>

        <h2 className="text-3xl font-bold uppercase tracking-widest text-fg">Sign in to your account</h2>
        <p className="text-sm text-fg-muted mt-1 mb-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-fg hover:text-fg underline underline-offset-4">
            Create one
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            >
              {error}
            </div>
          )}
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[10px]">
              <input type="checkbox" className="rounded border-border" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-[10px] text-fg hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" variant="solid" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full mt-2 text-xs"
            onClick={demoLogin}
            disabled={loading}
          >
            Demo Login (no backend)
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="bg-black px-2 text-fg-muted">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="w-full">
              Google
            </Button>
            <Button variant="outline" type="button" className="w-full">
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}