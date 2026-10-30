import { Link } from "react-router-dom";
import { StatusBadge } from "../../../../shared/components/Badges/Badges";
import { formatDate } from "../../../../shared/utils/formatters";
import styles from "./RecentActivity.module.css";
import type { Ticket } from "../../../tickets/types/ticket.types";

export function RecentActivity({ tickets }: { tickets: Ticket[] }) {

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Recent Activity</h2>
      <div className={styles.list}>
        {tickets.map((ticket) => (
          <Link key={ticket.id} to={`/tickets/${ticket.id}`} className={styles.item}>
            <div className={styles.itemRow}>
              <div>
                <div className={styles.itemTitle}>{ticket.title}</div>
                <div className={styles.itemDate}>
                  Updated {formatDate(ticket.updatedAt)}
                </div>
              </div>
              <StatusBadge status={ticket.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
