import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState(null);

  const register = async () => {
    await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });
    alert("User Registered Successfully");
  };

  const login = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail })
    });
    const data = await res.json();
    setToken(data.token);
    alert("Login Successful");
  };

  const getProfile = async () => {
    const res = await fetch("http://localhost:5000/profile", {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();
    setProfile(data);
  };

  const getStatus = async () => {
    const res = await fetch("http://localhost:5000/system-status");
    const data = await res.json();
    setStatus(data);
  };

  return (
    <div className="container">
      <h1>EduScale Scalable Backend Prototype</h1>

      <div className="card">
        <h2>Register</h2>
        <div className="row">
          <input placeholder="Name" onChange={e => setName(e.target.value)} />
          <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <button onClick={register}>Register</button>
        </div>
      </div>

      <div className="card">
        <h2>Login</h2>
        <div className="row">
          <input placeholder="Email" onChange={e => setLoginEmail(e.target.value)} />
          <button onClick={login}>Login</button>
        </div>
      </div>

      <div className="card">
        <h2>Protected Profile</h2>
        <button onClick={getProfile}>Fetch Profile</button>
        <pre>{profile ? JSON.stringify(profile, null, 2) : "No Data Yet"}</pre>
      </div>

      <div className="card">
        <h2>System Status</h2>
        <button onClick={getStatus}>Get Status</button>
        <pre>{status ? JSON.stringify(status, null, 2) : "No Data Yet"}</pre>
      </div>
    </div>
  );
}

export default App;
