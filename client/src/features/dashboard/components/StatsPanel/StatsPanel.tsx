import styles from "./StatsPanel.module.css";
import type { DashboardStats } from "../../types/dashboard.types";
import { formatDuration } from "../../../../shared/utils/formatters";

export function StatsPanel({ stats }: { stats: DashboardStats }) {
  return (
    <div className={styles.grid}>
      <StatCard title="Total Tickets" value={stats.totalTickets} color="#3498db" />
      <StatCard title="Open Tickets" value={stats.openTickets} color="#e67e22" />
      <StatCard
        title="Avg Resolution Time"
        value={formatDuration(stats.avgResolutionTimeSeconds)}
        color="#2ecc71"
      />
      <StatCard title="SLA Breaches" value={stats.slaBreachCount} color="#e74c3c" />
    </div>
  );
}

// Do not modify
function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={styles.card} style={{ borderLeft: `4px solid ${color}` }}>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardValue}>{value}</div>
    </div>
  );
}
