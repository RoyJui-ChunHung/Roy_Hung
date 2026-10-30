import { StatsPanel } from "../StatsPanel/StatsPanel";
import { RecentActivity } from "../RecentActivity/RecentActivity";
import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import type { Ticket } from "../../../tickets/types/ticket.types";
import type { DashboardStats } from "../../types/dashboard.types";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const statsResponse = await fetch("http://localhost:4000/api/stats");
        const recentResponse = await fetch("http://localhost:4000/api/stats/recent");

        if (!statsResponse.ok || !recentResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const statsJson = await statsResponse.json();
        const recentJson = await recentResponse.json();

        setStats(statsJson.data ?? statsJson);
        setRecentTickets(recentJson.data ?? recentJson);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }   

  if (!stats) {
    return <div>No stats available</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <StatsPanel stats={stats} />
      <RecentActivity tickets={recentTickets} />
    </div>
  );
}
