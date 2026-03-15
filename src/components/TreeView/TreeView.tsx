import { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useProjectsStore } from '@store';
import type { TreeNode, TreeNodeType } from '@shared';
import { TREE_CONFIG } from '@shared';
import { TreeNodeItem } from './TreeNode';
import styles from './TreeView.module.css';

interface TreeViewProps {
  onOpenUrl?: (url: string) => void;
}

export function TreeView({ onOpenUrl }: TreeViewProps) {
  const {
    nodes,
    selectedNodeId,
    expandedIds,
    addNode,
    removeNode,
    updateNode,
    moveNode,
    toggleExpand,
    expandAll,
    collapseAll,
    setSelectedNode,
  } = useProjectsStore();

  const [activeNode, setActiveNode] = useState<TreeNode | null>(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState<TreeNodeType>('folder');
  const [newNodeUrl, setNewNodeUrl] = useState('');
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const flattenedNodes = useMemo(() => {
    const result: Array<{ node: TreeNode; depth: number }> = [];

    function flatten(nodeList: TreeNode[], depth: number = 0) {
      for (const node of nodeList) {
        result.push({ node, depth });
        if (node.children && expandedIds.has(node.id)) {
          flatten(node.children, depth + 1);
        }
      }
    }

    flatten(nodes);
    return result;
  }, [nodes, expandedIds]);

  const nodeIds = useMemo(() => flattenedNodes.map(({ node }) => node.id), [flattenedNodes]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const activeItem = flattenedNodes.find(({ node }) => node.id === active.id);
    if (activeItem) {
      setActiveNode(activeItem.node);
    }
  }, [flattenedNodes]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id?.toString() || null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveNode(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const activeItem = flattenedNodes.find(({ node }) => node.id === active.id);
    const overItem = flattenedNodes.find(({ node }) => node.id === over.id);

    if (!activeItem || !overItem) return;

    const overNode = overItem.node;
    const isOverFolder = overNode.type === 'folder';

    if (isOverFolder && expandedIds.has(overNode.id)) {
      moveNode(active.id.toString(), overNode.id, 0);
    } else {
      const parentId = overNode.parentId;
      const siblings = parentId === null
        ? nodes
        : flattenedNodes
            .filter(({ node }) => node.parentId === parentId)
            .map(({ node }) => node);
      
      const overIndex = siblings.findIndex(n => n.id === over.id);
      moveNode(active.id.toString(), parentId, overIndex);
    }
  }, [flattenedNodes, expandedIds, nodes, moveNode]);

  const handleAddNode = useCallback(() => {
    if (!newNodeName.trim()) return;

    const parentId = selectedNodeId && 
      flattenedNodes.find(({ node }) => node.id === selectedNodeId)?.node.type === 'folder'
        ? selectedNodeId
        : null;

    const url = newNodeType === 'bookmark' ? newNodeUrl : undefined;
    addNode(parentId, newNodeType, newNodeName.trim(), url);

    setNewNodeName('');
    setNewNodeUrl('');
    setIsAddingNode(false);
  }, [newNodeName, newNodeType, newNodeUrl, selectedNodeId, flattenedNodes, addNode]);

  const handleStartEdit = useCallback((id: string) => {
    const node = flattenedNodes.find(({ node }) => node.id === id)?.node;
    if (node) {
      setEditingNodeId(id);
      setEditingName(node.name);
    }
  }, [flattenedNodes]);

  const handleSaveEdit = useCallback(() => {
    if (editingNodeId && editingName.trim()) {
      updateNode(editingNodeId, { name: editingName.trim() });
    }
    setEditingNodeId(null);
    setEditingName('');
  }, [editingNodeId, editingName, updateNode]);

  const handleCancelEdit = useCallback(() => {
    setEditingNodeId(null);
    setEditingName('');
  }, []);

  const handleDelete = useCallback((id: string) => {
    const node = flattenedNodes.find(({ node }) => node.id === id)?.node;
    if (!node) return;

    const hasChildren = node.children && node.children.length > 0;
    const confirmMessage = hasChildren
      ? `Delete "${node.name}" and all its contents?`
      : `Delete "${node.name}"?`;

    if (confirm(confirmMessage)) {
      removeNode(id);
    }
  }, [flattenedNodes, removeNode]);

  const activeNodeDepth = useMemo(() => {
    if (!activeNode) return 0;
    return flattenedNodes.find(({ node }) => node.id === activeNode.id)?.depth || 0;
  }, [activeNode, flattenedNodes]);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button
          className={styles.toolbarBtn}
          onClick={() => setIsAddingNode(!isAddingNode)}
          title="Add new item"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button className={styles.toolbarBtn} onClick={expandAll} title="Expand all">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className={styles.toolbarBtn} onClick={collapseAll} title="Collapse all">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 9L7 4L12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {isAddingNode && (
        <div className={styles.addForm}>
          <select
            className={styles.select}
            value={newNodeType}
            onChange={(e) => setNewNodeType(e.target.value as TreeNodeType)}
          >
            <option value="folder">Folder</option>
            <option value="project">Project</option>
            <option value="bookmark">Bookmark</option>
            <option value="note">Note</option>
          </select>
          <input
            type="text"
            className={styles.input}
            placeholder="Name..."
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddNode();
              if (e.key === 'Escape') setIsAddingNode(false);
            }}
            autoFocus
          />
          {newNodeType === 'bookmark' && (
            <input
              type="url"
              className={styles.input}
              placeholder="URL..."
              value={newNodeUrl}
              onChange={(e) => setNewNodeUrl(e.target.value)}
            />
          )}
          <div className={styles.addFormActions}>
            <button className={styles.addBtn} onClick={handleAddNode}>Add</button>
            <button className={styles.cancelBtn} onClick={() => setIsAddingNode(false)}>Cancel</button>
          </div>
        </div>
      )}

      {editingNodeId && (
        <div className={styles.editOverlay}>
          <div className={styles.editForm}>
            <input
              type="text"
              className={styles.input}
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              autoFocus
            />
            <div className={styles.editFormActions}>
              <button className={styles.addBtn} onClick={handleSaveEdit}>Save</button>
              <button className={styles.cancelBtn} onClick={handleCancelEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={nodeIds} strategy={verticalListSortingStrategy}>
          <div className={styles.tree}>
            {flattenedNodes.length === 0 ? (
              <div className={styles.empty}>
                <p>No items yet</p>
                <button className={styles.emptyBtn} onClick={() => setIsAddingNode(true)}>
                  Create your first folder
                </button>
              </div>
            ) : (
              flattenedNodes.map(({ node, depth }) => (
                <TreeNodeItem
                  key={node.id}
                  node={node}
                  depth={depth}
                  isExpanded={expandedIds.has(node.id)}
                  isSelected={selectedNodeId === node.id}
                  onToggleExpand={toggleExpand}
                  onSelect={setSelectedNode}
                  onDelete={handleDelete}
                  onEdit={handleStartEdit}
                  onOpenUrl={onOpenUrl}
                />
              ))
            )}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeNode && (
            <div 
              className={styles.dragOverlay}
              style={{ paddingLeft: `${activeNodeDepth * TREE_CONFIG.INDENT_SIZE}px` }}
            >
              <span className={styles.dragOverlayName}>{activeNode.name}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
