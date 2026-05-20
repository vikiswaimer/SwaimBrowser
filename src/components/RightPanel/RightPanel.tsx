import { useMetricsStore } from '@store';
import type { MetricTrend, ApiStatus } from '@shared';
import styles from './RightPanel.module.css';

const TREND_ICONS: Record<MetricTrend, string> = {
  up: '↑',
  down: '↓',
  stable: '→',
};

const STATUS_COLORS: Record<ApiStatus['status'], string> = {
  connected: 'var(--validated)',
  disconnected: 'var(--text-muted)',
  error: 'var(--error)',
};

export function RightPanel() {
  const { metricGroups, apiStatuses, lastUpdated } = useMetricsStore();
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <aside className={styles.panel}>
      <header className={styles.header}>
        <span className={styles.headerLabel}>MEASURE</span>
        <span className={styles.headerTime}>
          <span className={styles.liveDot} />
          {formatTime(lastUpdated)}
        </span>
      </header>

      <div className={styles.metricsContainer}>
        {metricGroups.map((group) => (
          <section key={group.id} className={styles.metricGroup}>
            <div className={styles.groupHeader}>
              <span className={styles.groupName}>{group.name}</span>
            </div>
            
            <div className={styles.metricsGrid}>
              {group.metrics.map((metric) => (
                <div key={metric.id} className={styles.metricCard}>
                  <span className={styles.metricName}>{metric.name}</span>
                  <div className={styles.metricValue}>
                    <span className={styles.value}>
                      {metric.value}
                      {metric.unit && <span className={styles.unit}>{metric.unit}</span>}
                    </span>
                    {metric.trend && (
                      <span className={`${styles.trend} ${styles[metric.trend]}`}>
                        {TREND_ICONS[metric.trend]}
                        {metric.change !== undefined && Math.abs(metric.change) > 0 && (
                          <span className={styles.change}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className={styles.apiSection}>
        <div className={styles.apiHeader}>
          <span className={styles.apiLabel}>API STATUS</span>
        </div>
        <div className={styles.apiList}>
          {apiStatuses.map((api) => (
            <div key={api.name} className={styles.apiItem}>
              <span 
                className={styles.apiDot} 
                style={{ background: STATUS_COLORS[api.status] }}
              />
              <span className={styles.apiName}>{api.name}</span>
              {api.latency !== undefined && (
                <span className={styles.apiLatency}>{api.latency}ms</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.footerText}>Real-time Analytics</span>
      </footer>
    </aside>
  );
}
