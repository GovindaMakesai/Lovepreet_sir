import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AuthPage({ setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? "/auth/signup" : "/auth/login";
    const payload = isRegister ? form : { email: form.email, password: form.password };
    setErrorText("");
    try {
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/products");
    } catch (error) {
      setErrorText(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <section className="authCard">
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <p className="mutedText">
        {isRegister ? "Create your account to start shopping." : "Login to access cart and AI tools."}
      </p>
      <form onSubmit={submit} className="form stacked">
        {isRegister && (
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errorText && <p className="errorText">{errorText}</p>}
        <button className="btn btnPrimary" type="submit">
          {isRegister ? "Create account" : "Login"}
        </button>
      </form>
      <button className="btn btnGhost" onClick={() => setIsRegister((prev) => !prev)}>
        {isRegister ? "Have an account? Login" : "No account? Register"}
      </button>
    </section>
  );
}

export default AuthPage;
