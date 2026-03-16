import { create } from 'zustand';
import { generateId, TREE_CONFIG } from '@shared';
import type { TreeNode, TreeNodeType, ImportedBookmark } from '@shared';

interface ProjectsState {
  nodes: TreeNode[];
  selectedNodeId: string | null;
  expandedIds: Set<string>;

  addNode: (parentId: string | null, type: TreeNodeType, name: string, url?: string) => TreeNode;
  removeNode: (id: string) => void;
  updateNode: (id: string, updates: Partial<TreeNode>) => void;
  moveNode: (nodeId: string, newParentId: string | null, newIndex: number) => void;
  toggleExpand: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setSelectedNode: (id: string | null) => void;
  loadNodes: (nodes: TreeNode[]) => void;
  importBookmarks: (bookmarks: ImportedBookmark[], parentId?: string | null) => void;
  getNode: (id: string) => TreeNode | undefined;
  getChildren: (parentId: string | null) => TreeNode[];
  getFlattenedNodes: () => TreeNode[];
}

function findNodeById(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

function removeNodeById(nodes: TreeNode[], id: string): TreeNode[] {
  return nodes.filter(node => {
    if (node.id === id) return false;
    if (node.children) {
      node.children = removeNodeById(node.children, id);
    }
    return true;
  });
}

function updateNodeById(nodes: TreeNode[], id: string, updates: Partial<TreeNode>): TreeNode[] {
  return nodes.map(node => {
    if (node.id === id) {
      return { ...node, ...updates, updatedAt: new Date().toISOString() };
    }
    if (node.children) {
      return { ...node, children: updateNodeById(node.children, id, updates) };
    }
    return node;
  });
}

function addNodeToParent(nodes: TreeNode[], parentId: string | null, newNode: TreeNode): TreeNode[] {
  if (parentId === null) {
    return [...nodes, newNode];
  }
  return nodes.map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
        updatedAt: new Date().toISOString(),
      };
    }
    if (node.children) {
      return { ...node, children: addNodeToParent(node.children, parentId, newNode) };
    }
    return node;
  });
}

function insertNodeAtIndex(nodes: TreeNode[], parentId: string | null, node: TreeNode, index: number): TreeNode[] {
  if (parentId === null) {
    const newNodes = [...nodes];
    newNodes.splice(index, 0, node);
    return newNodes;
  }
  return nodes.map(n => {
    if (n.id === parentId) {
      const children = [...(n.children || [])];
      children.splice(index, 0, node);
      return { ...n, children, updatedAt: new Date().toISOString() };
    }
    if (n.children) {
      return { ...n, children: insertNodeAtIndex(n.children, parentId, node, index) };
    }
    return n;
  });
}

function flattenNodes(nodes: TreeNode[], expandedIds: Set<string>, depth: number = 0): TreeNode[] {
  const result: TreeNode[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.children && expandedIds.has(node.id)) {
      result.push(...flattenNodes(node.children, expandedIds, depth + 1));
    }
  }
  return result;
}

function collectAllIds(nodes: TreeNode[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    ids.push(node.id);
    if (node.children) {
      ids.push(...collectAllIds(node.children));
    }
  }
  return ids;
}

function getNodeDepth(nodes: TreeNode[], nodeId: string, currentDepth: number = 0): number {
  for (const node of nodes) {
    if (node.id === nodeId) return currentDepth;
    if (node.children) {
      const depth = getNodeDepth(node.children, nodeId, currentDepth + 1);
      if (depth !== -1) return depth;
    }
  }
  return -1;
}

function isDescendant(nodes: TreeNode[], parentId: string, childId: string): boolean {
  const parent = findNodeById(nodes, parentId);
  if (!parent || !parent.children) return false;
  
  for (const child of parent.children) {
    if (child.id === childId) return true;
    if (isDescendant([child], child.id, childId)) return true;
  }
  return false;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  nodes: [],
  selectedNodeId: null,
  expandedIds: new Set<string>(),

  addNode: (parentId, type, name, url) => {
    const newNode: TreeNode = {
      id: generateId(),
      parentId,
      type,
      name,
      url,
      isExpanded: TREE_CONFIG.DEFAULT_EXPANDED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      children: type === 'folder' ? [] : undefined,
    };

    set(state => ({
      nodes: addNodeToParent(state.nodes, parentId, newNode),
      expandedIds: type === 'folder' 
        ? new Set([...state.expandedIds, newNode.id])
        : state.expandedIds,
    }));

    return newNode;
  },

  removeNode: (id) => {
    set(state => {
      const newExpandedIds = new Set(state.expandedIds);
      newExpandedIds.delete(id);
      return {
        nodes: removeNodeById(state.nodes, id),
        expandedIds: newExpandedIds,
        selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
      };
    });
  },

  updateNode: (id, updates) => {
    set(state => ({
      nodes: updateNodeById(state.nodes, id, updates),
    }));
  },

  moveNode: (nodeId, newParentId, newIndex) => {
    const state = get();
    const node = findNodeById(state.nodes, nodeId);
    if (!node) return;

    if (newParentId && isDescendant(state.nodes, nodeId, newParentId)) {
      console.warn('Cannot move a node into its own descendant');
      return;
    }

    if (newParentId) {
      const newDepth = getNodeDepth(state.nodes, newParentId);
      if (newDepth >= TREE_CONFIG.MAX_DEPTH) {
        console.warn('Maximum tree depth reached');
        return;
      }
    }

    const nodesWithoutNode = removeNodeById([...state.nodes], nodeId);
    const updatedNode = { ...node, parentId: newParentId };
    const newNodes = insertNodeAtIndex(nodesWithoutNode, newParentId, updatedNode, newIndex);

    set({ nodes: newNodes });
  },

  toggleExpand: (id) => {
    set(state => {
      const newExpandedIds = new Set(state.expandedIds);
      if (newExpandedIds.has(id)) {
        newExpandedIds.delete(id);
      } else {
        newExpandedIds.add(id);
      }
      return { expandedIds: newExpandedIds };
    });
  },

  expandAll: () => {
    set(state => ({
      expandedIds: new Set(collectAllIds(state.nodes)),
    }));
  },

  collapseAll: () => {
    set({ expandedIds: new Set() });
  },

  setSelectedNode: (id) => {
    set({ selectedNodeId: id });
  },

  loadNodes: (nodes) => {
    const allIds = collectAllIds(nodes);
    set({
      nodes,
      expandedIds: new Set(allIds),
    });
  },

  importBookmarks: (bookmarks, parentId = null) => {
    const state = get();
    let currentNodes = [...state.nodes];

    function processBookmarks(items: ImportedBookmark[], parent: string | null): void {
      for (const bookmark of items) {
        const hasChildren = bookmark.children && bookmark.children.length > 0;
        const type: TreeNodeType = hasChildren ? 'folder' : 'bookmark';
        
        const newNode: TreeNode = {
          id: generateId(),
          parentId: parent,
          type,
          name: bookmark.title,
          url: bookmark.url,
          isExpanded: TREE_CONFIG.DEFAULT_EXPANDED,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          children: hasChildren ? [] : undefined,
        };

        currentNodes = addNodeToParent(currentNodes, parent, newNode);

        if (hasChildren && bookmark.children) {
          processBookmarks(bookmark.children, newNode.id);
        }
      }
    }

    processBookmarks(bookmarks, parentId);

    set({
      nodes: currentNodes,
      expandedIds: new Set(collectAllIds(currentNodes)),
    });
  },

  getNode: (id) => {
    return findNodeById(get().nodes, id);
  },

  getChildren: (parentId) => {
    if (parentId === null) {
      return get().nodes;
    }
    const parent = findNodeById(get().nodes, parentId);
    return parent?.children || [];
  },

  getFlattenedNodes: () => {
    const state = get();
    return flattenNodes(state.nodes, state.expandedIds);
  },
}));
