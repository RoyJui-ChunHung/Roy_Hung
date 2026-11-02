import { StatsPanel } from "../StatsPanel/StatsPanel";
import { RecentActivity } from "../RecentActivity/RecentActivity";
import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner/LoadingSpinner";
import type { Ticket } from "../../../tickets/types/ticket.types";
import type { DashboardStats } from "../../types/dashboard.types";
import type { ApiResponse } from "../../../../shared/types/api.types";

const API_URL = "http://localhost:4000/api";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsResponse, recentResponse] = await Promise.all([
          axios.get<ApiResponse<DashboardStats>>(`${API_URL}/stats`),
          axios.get<ApiResponse<Ticket[]>>(`${API_URL}/stats/recent`),
        ]);

        setStats(statsResponse.data.data);
        setRecentTickets(recentResponse.data.data);
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.response?.data?.message || "Failed to fetch data" : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
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
