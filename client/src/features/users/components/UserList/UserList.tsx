import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner/LoadingSpinner";
import type { ApiResponse } from "../../../../shared/types/api.types";
import type { User, UserRole } from "../../types/user.types";
import styles from "./UserList.module.css";

const API_URL = "http://localhost:4000/api";

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<ApiResponse<User[]>>(`${API_URL}/users`);
        setUsers(response.data.data);
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.response?.data?.message || "Failed to fetch users" : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // already written: filter by role and sort by display name
  const filteredAndSorted = useMemo(() => {
    const filtered = roleFilter ? users.filter((u) => u.role === roleFilter) : users;
    return [...filtered].sort((a, b) =>
      sortOrder === "asc"
        ? a.displayName.localeCompare(b.displayName)
        : b.displayName.localeCompare(a.displayName),
    );
  }, [users, roleFilter, sortOrder]);

  // don't change, helper function to get the CSS class for the role badge
  const getRoleBadgeClass = (role: UserRole) => {
    if (role === "admin") return `${styles.roleBadge} ${styles.roleAdmin}`;
    if (role === "agent") return `${styles.roleBadge} ${styles.roleAgent}`;
    return `${styles.roleBadge} ${styles.roleViewer}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Users</h1>
      </div>

      <div className={styles.controls}>
        <label>
          Role
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>

        <label>
          Sort by Name
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </label>

        <span className={styles.resultCount}>
          {filteredAndSorted.length} {filteredAndSorted.length === 1 ? "user" : "users"}
        </span>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        filteredAndSorted.length === 0 ? (
          <p className={styles.noUsers}>No users found</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Display Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((user) => (
                <tr key={user.id}>
                  <td>{user.displayName}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
