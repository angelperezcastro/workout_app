import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth";
import { useI18n } from "../i18n/I18nProvider";

function Login() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await login({ email, password });
      localStorage.setItem("token", token);
      navigate(from, { replace: true });
    } catch (err) {
      // Si err.message viene del backend, se mostrará tal cual.
      setError(t(err.message) || err.message || t("errors.loginFailed"));

    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="login-bg min-h-screen flex items-center justify-center">
    <div className="w-full max-w-md bg-slate-900/70 backdrop-blur rounded-2xl border border-slate-800 p-6 shadow-lg">
      <h1 className="text-2xl font-semibold mb-2">{t("auth.loginTitle")}</h1>
      <p className="text-sm text-slate-300 mb-6">{t("auth.loginSubtitle")}</p>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">{t("auth.email")}</label>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">{t("auth.password")}</label>
          <input
            type="password"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 rounded-lg bg-primary hover:bg-primary-dark text-white py-2 text-sm font-medium disabled:opacity-60"
        >
          {loading ? t("auth.loggingIn") : t("auth.loginBtn")}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-400">
        {t("auth.noAccount")}{" "}
        <Link to="/register" className="text-primary-light hover:underline">
          {t("auth.signupHere")}
        </Link>
      </p>
    </div>
  </div>
);

}

export default Login;
