import { useState, useCallback } from 'react';
import { useHypothesesStore } from '@store';
import type { HypothesisStatus } from '@shared';
import styles from './LeftPanel.module.css';

const STATUS_ICONS: Record<HypothesisStatus, string> = {
  pending: '○',
  testing: '◐',
  validated: '✓',
  invalid: '✗',
};

const STATUS_LABELS: Record<HypothesisStatus, string> = {
  pending: 'Pending',
  testing: 'Testing',
  validated: 'Validated',
  invalid: 'Invalid',
};

export function LeftPanel() {
  const {
    hypotheses,
    sprints,
    tasks,
    addHypothesis,
    updateHypothesisStatus,
    toggleTask,
  } = useHypothesesStore();
  
  const [newHypothesis, setNewHypothesis] = useState('');
  const activeSprint = sprints.find((s) => s.isActive);
  const sprintTasks = tasks.filter((t) => t.sprintId === activeSprint?.id);
  const completedTasks = sprintTasks.filter((t) => t.completed).length;
  
  const handleAddHypothesis = useCallback(() => {
    if (newHypothesis.trim()) {
      addHypothesis(newHypothesis.trim());
      setNewHypothesis('');
    }
  }, [newHypothesis, addHypothesis]);
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddHypothesis();
    }
  }, [handleAddHypothesis]);
  
  const cycleStatus = useCallback((id: string, currentStatus: HypothesisStatus) => {
    const statusOrder: HypothesisStatus[] = ['pending', 'testing', 'validated', 'invalid'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    updateHypothesisStatus(id, nextStatus);
  }, [updateHypothesisStatus]);

  return (
    <aside className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span className={styles.logoText}>Swaim</span>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>BUILD</span>
        </div>
        
        {activeSprint && (
          <div className={styles.sprintCard}>
            <div className={styles.sprintTitle}>
              Sprint #{activeSprint.number}
              <span className={styles.sprintBadge}>Active</span>
            </div>
            <div className={styles.sprintName}>{activeSprint.name}</div>
            <div className={styles.sprintProgress}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${sprintTasks.length > 0 ? (completedTasks / sprintTasks.length) * 100 : 0}%` }}
                />
              </div>
              <span className={styles.progressText}>
                {completedTasks}/{sprintTasks.length} tasks
              </span>
            </div>
          </div>
        )}
        
        <div className={styles.taskList}>
          {sprintTasks.map((task) => (
            <div 
              key={task.id} 
              className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              <span className={styles.taskCheckbox}>
                {task.completed ? '✓' : '○'}
              </span>
              <span className={styles.taskText}>{task.text}</span>
              <span className={`${styles.taskPriority} ${styles[task.priority]}`}>
                {task.priority === 'high' ? '!' : task.priority === 'low' ? '↓' : ''}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>HYPOTHESES</span>
          <span className={styles.sectionCount}>{hypotheses.length}</span>
        </div>
        
        <div className={styles.hypothesesList}>
          {hypotheses.map((hypothesis) => (
            <div 
              key={hypothesis.id} 
              className={`${styles.hypothesisItem} ${styles[hypothesis.status]}`}
              onClick={() => cycleStatus(hypothesis.id, hypothesis.status)}
            >
              <span className={styles.hypothesisStatus}>
                {STATUS_ICONS[hypothesis.status]}
              </span>
              <span className={styles.hypothesisText}>{hypothesis.text}</span>
              <span className={styles.hypothesisLabel}>
                {STATUS_LABELS[hypothesis.status]}
              </span>
            </div>
          ))}
        </div>
        
        <div className={styles.addHypothesis}>
          <input
            type="text"
            className={styles.input}
            placeholder="Add hypothesis..."
            value={newHypothesis}
            onChange={(e) => setNewHypothesis(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            className={styles.addBtn}
            onClick={handleAddHypothesis}
            disabled={!newHypothesis.trim()}
          >
            +
          </button>
        </div>
      </section>
      
      <footer className={styles.footer}>
        <span className={styles.footerText}>Lean Startup Cycle</span>
        <span className={styles.footerCycle}>Build → Measure → Learn</span>
      </footer>
    </aside>
  );
}
