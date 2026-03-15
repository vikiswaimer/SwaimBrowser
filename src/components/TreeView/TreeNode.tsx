import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TreeNode as TreeNodeType } from '@shared';
import { TREE_CONFIG } from '@shared';
import styles from './TreeView.module.css';

interface TreeNodeProps {
  node: TreeNodeType;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: (id: string) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onOpenUrl?: (url: string) => void;
}

const NODE_ICONS: Record<string, JSX.Element> = {
  folder: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 4.5C2 3.67157 2.67157 3 3.5 3H6.5L8 5H12.5C13.3284 5 14 5.67157 14 6.5V11.5C14 12.3284 13.3284 13 12.5 13H3.5C2.67157 13 2 12.3284 2 11.5V4.5Z"
        fill="var(--accent-primary)"
        fillOpacity="0.15"
        stroke="var(--accent-primary)"
        strokeWidth="1.2"
      />
    </svg>
  ),
  project: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="3" stroke="var(--text-secondary)" strokeWidth="1.2" />
      <path d="M5 8L7 10L11 6" stroke="var(--success)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bookmark: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 3C4 2.44772 4.44772 2 5 2H11C11.5523 2 12 2.44772 12 3V13.5L8 11L4 13.5V3Z"
        fill="var(--warning)"
        fillOpacity="0.15"
        stroke="var(--warning)"
        strokeWidth="1.2"
      />
    </svg>
  ),
  note: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 3.5C3 2.67157 3.67157 2 4.5 2H9.5L13 5.5V12.5C13 13.3284 12.3284 14 11.5 14H4.5C3.67157 14 3 13.3284 3 12.5V3.5Z"
        fill="var(--info)"
        fillOpacity="0.15"
        stroke="var(--info)"
        strokeWidth="1.2"
      />
      <path d="M5 8H11M5 10H9" stroke="var(--info)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
};

const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 12 12" 
    className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}
  >
    <path
      d="M4.5 3L7.5 6L4.5 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export function TreeNodeItem({
  node,
  depth,
  isExpanded,
  isSelected,
  onToggleExpand,
  onSelect,
  onDelete,
  onEdit,
  onOpenUrl,
}: TreeNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: node.id,
    data: {
      type: node.type,
      node,
      depth,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${depth * TREE_CONFIG.INDENT_SIZE}px`,
  };

  const hasChildren = node.children && node.children.length > 0;
  const canExpand = node.type === 'folder' || hasChildren;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect(node.id);
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (node.url && onOpenUrl) {
      onOpenUrl(node.url);
    } else if (canExpand) {
      onToggleExpand(node.id);
    }
  };

  const handleToggleExpand = (event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleExpand(node.id);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    onSelect(node.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.node} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      {...attributes}
      {...listeners}
    >
      <div className={styles.nodeContent}>
        {canExpand ? (
          <button
            className={styles.expandButton}
            onClick={handleToggleExpand}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <ChevronIcon isExpanded={isExpanded} />
          </button>
        ) : (
          <span className={styles.expandPlaceholder} />
        )}

        <span className={styles.nodeIcon}>
          {NODE_ICONS[node.type] || NODE_ICONS.bookmark}
        </span>

        <span className={styles.nodeName} title={node.name}>
          {node.name}
        </span>

        {node.url && (
          <span className={styles.nodeUrl} title={node.url}>
            {new URL(node.url).hostname}
          </span>
        )}
      </div>

      <div className={styles.nodeActions}>
        <button
          className={styles.actionBtn}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(node.id);
          }}
          title="Edit"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M8.5 1.5L10.5 3.5M1 11L1.5 8.5L9 1L11 3L3.5 10.5L1 11Z"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          title="Delete"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 3L9 9M9 3L3 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
