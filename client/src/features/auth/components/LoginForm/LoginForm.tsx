import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./LoginForm.module.css";

export function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError("Wrong username or password");
    } finally {
      setLoading(false);
    }
  }
  // 🔴 Todo: implement login logic.
  // 1. handle the form submission and validation logic. 
  //    - username: admin, alice, bob, carol, or dave
  //    - password: 123
  // 2. call the login API with axios and handle the response. api: POST http://localhost:4000/api/users/login
  // 3. display error message if login fails.
  // 4. on successful login, update the auth context with the user information
  //    (the dropdown closes by itself, because UserBadge re-renders once there is a user).

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Username</label>
          <input type="text" className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input type="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.submit} disabled={loading}>
          Login
        </button>
      </form>
      <div className={styles.hint}>
        <p>Try: admin, alice, bob, carol, or dave</p>
        <p>Password: 123</p>
      </div>
    </>
  );
}