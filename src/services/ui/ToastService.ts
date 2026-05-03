/**
 * Toast Service
 * Система уведомлений в стиле Linear.
 * Управление тостами без зависимости от React.
 */

import { StatusType, Z_INDEX } from './tokens';

interface Toast {
  id: string;
  message: string;
  type: StatusType;
  duration: number;
  createdAt: number;
  action?: ToastAction;
}

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastOptions {
  type?: StatusType;
  duration?: number;
  action?: ToastAction;
}

type ToastListener = (toasts: Toast[]) => void;

const DEFAULT_DURATION_MS = 4000;
const MAX_TOASTS = 5;

const TOAST_ICONS: Record<StatusType, string> = {
  success: '✓',
  warning: '⚠',
  error: '✕',
  info: 'ℹ',
};

const TOAST_COLORS: Record<StatusType, { bg: string; text: string; border: string }> = {
  success: {
    bg: 'rgba(16, 185, 129, 0.15)',
    text: '#10b981',
    border: 'rgba(16, 185, 129, 0.3)',
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.15)',
    text: '#f59e0b',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  error: {
    bg: 'rgba(239, 68, 68, 0.15)',
    text: '#ef4444',
    border: 'rgba(239, 68, 68, 0.3)',
  },
  info: {
    bg: 'rgba(59, 130, 246, 0.15)',
    text: '#3b82f6',
    border: 'rgba(59, 130, 246, 0.3)',
  },
};

class ToastService {
  private toasts: Toast[] = [];
  private listeners: Set<ToastListener> = new Set();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private container: HTMLElement | null = null;
  private toastElements: Map<string, HTMLElement> = new Map();

  constructor() {
    if (typeof document !== 'undefined') {
      this.createContainer();
    }
  }

  private createContainer(): void {
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      display: flex;
      flex-direction: column-reverse;
      gap: 8px;
      z-index: ${Z_INDEX.toast};
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private createToastElement(toast: Toast): HTMLElement {
    const colors = TOAST_COLORS[toast.type];
    const icon = TOAST_ICONS[toast.type];

    const element = document.createElement('div');
    element.className = 'toast';
    element.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--bg-secondary, #11151f);
      border: 1px solid ${colors.border};
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      pointer-events: auto;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      min-width: 280px;
      max-width: 400px;
    `;

    const iconSpan = document.createElement('span');
    iconSpan.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: ${colors.bg};
      color: ${colors.text};
      font-size: 12px;
      flex-shrink: 0;
    `;
    iconSpan.textContent = icon;

    const messageSpan = document.createElement('span');
    messageSpan.style.cssText = `
      flex: 1;
      font-size: 13px;
      color: var(--text-primary, #f5f7fa);
      line-height: 1.4;
    `;
    messageSpan.textContent = toast.message;

    element.appendChild(iconSpan);
    element.appendChild(messageSpan);

    if (toast.action) {
      const actionBtn = document.createElement('button');
      actionBtn.style.cssText = `
        background: none;
        border: none;
        color: ${colors.text};
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background 0.1s ease;
      `;
      actionBtn.textContent = toast.action.label;
      actionBtn.addEventListener('click', () => {
        toast.action?.onClick();
        this.dismiss(toast.id);
      });
      actionBtn.addEventListener('mouseenter', () => {
        actionBtn.style.background = colors.bg;
      });
      actionBtn.addEventListener('mouseleave', () => {
        actionBtn.style.background = 'none';
      });
      element.appendChild(actionBtn);
    }

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: var(--text-muted, #6b7280);
      font-size: 14px;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.1s ease;
      flex-shrink: 0;
    `;
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', () => this.dismiss(toast.id));
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.color = 'var(--text-primary, #f5f7fa)';
      closeBtn.style.background = 'var(--bg-hover, rgba(255, 255, 255, 0.06))';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.color = 'var(--text-muted, #6b7280)';
      closeBtn.style.background = 'none';
    });
    element.appendChild(closeBtn);

    return element;
  }

  private animateIn(element: HTMLElement): void {
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateX(0)';
    });
  }

  private animateOut(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      element.style.opacity = '0';
      element.style.transform = 'translateX(100%)';
      setTimeout(resolve, 300);
    });
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener([...this.toasts]);
    });
  }

  show(message: string, options: ToastOptions = {}): string {
    const id = this.generateId();
    const toast: Toast = {
      id,
      message,
      type: options.type ?? 'info',
      duration: options.duration ?? DEFAULT_DURATION_MS,
      createdAt: Date.now(),
      action: options.action,
    };

    while (this.toasts.length >= MAX_TOASTS) {
      const oldest = this.toasts[0];
      this.dismiss(oldest.id);
    }

    this.toasts.push(toast);

    if (this.container) {
      const element = this.createToastElement(toast);
      this.toastElements.set(id, element);
      this.container.appendChild(element);
      this.animateIn(element);
    }

    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        this.dismiss(id);
      }, toast.duration);
      this.timers.set(id, timer);
    }

    this.notifyListeners();
    return id;
  }

  success(message: string, options?: Omit<ToastOptions, 'type'>): string {
    return this.show(message, { ...options, type: 'success' });
  }

  warning(message: string, options?: Omit<ToastOptions, 'type'>): string {
    return this.show(message, { ...options, type: 'warning' });
  }

  error(message: string, options?: Omit<ToastOptions, 'type'>): string {
    return this.show(message, { ...options, type: 'error' });
  }

  info(message: string, options?: Omit<ToastOptions, 'type'>): string {
    return this.show(message, { ...options, type: 'info' });
  }

  async dismiss(id: string): Promise<void> {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    const element = this.toastElements.get(id);
    if (element) {
      await this.animateOut(element);
      element.remove();
      this.toastElements.delete(id);
    }

    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.notifyListeners();
  }

  dismissAll(): void {
    const ids = [...this.toasts.map((t) => t.id)];
    ids.forEach((id) => this.dismiss(id));
  }

  getToasts(): Toast[] {
    return [...this.toasts];
  }

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  destroy(): void {
    this.dismissAll();
    this.container?.remove();
    this.listeners.clear();
  }
}

export const toastService = new ToastService();
export type { Toast, ToastAction, ToastOptions, ToastListener };
