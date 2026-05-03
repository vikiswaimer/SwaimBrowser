/**
 * Modal Service
 * Управление модальными окнами без зависимости от React.
 * Поддержка стека модалок и keyboard navigation.
 */

import { Z_INDEX, TRANSITIONS } from './tokens';
import { animationService } from './AnimationService';

interface ModalOptions {
  id?: string;
  title?: string;
  content: string | HTMLElement;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  footer?: HTMLElement | null;
}

interface Modal {
  id: string;
  element: HTMLElement;
  overlay: HTMLElement;
  options: ModalOptions;
}

const MODAL_SIZES = {
  sm: '360px',
  md: '480px',
  lg: '640px',
  xl: '800px',
  full: '100%',
};

class ModalService {
  private stack: Modal[] = [];
  private overlay: HTMLElement | null = null;

  constructor() {
    if (typeof document !== 'undefined') {
      this.setupKeyboardHandler();
    }
  }

  private generateId(): string {
    return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupKeyboardHandler(): void {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.stack.length > 0) {
        const topModal = this.stack[this.stack.length - 1];
        if (topModal.options.closeOnEscape !== false) {
          this.close(topModal.id);
        }
      }
    });
  }

  private createOverlay(): HTMLElement {
    if (this.overlay) {
      return this.overlay;
    }

    this.overlay = document.createElement('div');
    this.overlay.id = 'modal-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: ${Z_INDEX.overlay};
      opacity: 0;
      transition: opacity ${TRANSITIONS.base};
    `;
    document.body.appendChild(this.overlay);

    requestAnimationFrame(() => {
      if (this.overlay) {
        this.overlay.style.opacity = '1';
      }
    });

    return this.overlay;
  }

  private createModalElement(options: ModalOptions): HTMLElement {
    const size = options.size ?? 'md';
    const maxWidth = MODAL_SIZES[size];

    const container = document.createElement('div');
    container.className = 'modal-container';
    container.style.cssText = `
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: ${Z_INDEX.modal};
      padding: 24px;
      pointer-events: none;
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
      background: var(--bg-secondary, #11151f);
      border: 1px solid var(--border-primary, rgba(255, 255, 255, 0.08));
      border-radius: 12px;
      box-shadow: 0 20px 25px rgba(0, 0, 0, 0.4);
      width: 100%;
      max-width: ${maxWidth};
      max-height: calc(100vh - 48px);
      display: flex;
      flex-direction: column;
      pointer-events: auto;
      opacity: 0;
      transform: scale(0.95) translateY(10px);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    if (options.title || options.closable !== false) {
      const header = document.createElement('div');
      header.className = 'modal-header';
      header.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-primary, rgba(255, 255, 255, 0.08));
      `;

      if (options.title) {
        const title = document.createElement('h2');
        title.style.cssText = `
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary, #f5f7fa);
          margin: 0;
        `;
        title.textContent = options.title;
        header.appendChild(title);
      }

      if (options.closable !== false) {
        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = `
          background: none;
          border: none;
          color: var(--text-muted, #6b7280);
          font-size: 20px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s ease;
          margin-left: auto;
        `;
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', () => {
          this.close(options.id!);
        });
        closeBtn.addEventListener('mouseenter', () => {
          closeBtn.style.color = 'var(--text-primary, #f5f7fa)';
          closeBtn.style.background = 'var(--bg-hover, rgba(255, 255, 255, 0.06))';
        });
        closeBtn.addEventListener('mouseleave', () => {
          closeBtn.style.color = 'var(--text-muted, #6b7280)';
          closeBtn.style.background = 'none';
        });
        header.appendChild(closeBtn);
      }

      modal.appendChild(header);
    }

    const body = document.createElement('div');
    body.className = 'modal-body';
    body.style.cssText = `
      padding: 20px;
      overflow-y: auto;
      flex: 1;
      color: var(--text-secondary, #a1a8b8);
      font-size: 14px;
      line-height: 1.6;
    `;

    if (typeof options.content === 'string') {
      body.innerHTML = options.content;
    } else {
      body.appendChild(options.content);
    }
    modal.appendChild(body);

    if (options.footer) {
      const footer = document.createElement('div');
      footer.className = 'modal-footer';
      footer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        padding: 16px 20px;
        border-top: 1px solid var(--border-primary, rgba(255, 255, 255, 0.08));
      `;
      footer.appendChild(options.footer);
      modal.appendChild(footer);
    }

    container.appendChild(modal);

    if (options.closeOnOverlay !== false) {
      container.addEventListener('click', (event) => {
        if (event.target === container) {
          this.close(options.id!);
        }
      });
    }

    return container;
  }

  open(options: ModalOptions): string {
    const id = options.id ?? this.generateId();
    options.id = id;

    if (this.stack.length === 0) {
      document.body.style.overflow = 'hidden';
    }

    const overlay = this.createOverlay();
    const element = this.createModalElement(options);
    document.body.appendChild(element);

    const modal: Modal = {
      id,
      element,
      overlay,
      options,
    };
    this.stack.push(modal);

    requestAnimationFrame(() => {
      const modalContent = element.querySelector('.modal') as HTMLElement;
      if (modalContent) {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'scale(1) translateY(0)';
      }
    });

    options.onOpen?.();
    return id;
  }

  async close(id: string): Promise<void> {
    const index = this.stack.findIndex((m) => m.id === id);
    if (index === -1) {
      return;
    }

    const modal = this.stack[index];
    const modalContent = modal.element.querySelector('.modal') as HTMLElement;

    if (modalContent) {
      modalContent.style.opacity = '0';
      modalContent.style.transform = 'scale(0.95) translateY(10px)';
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    modal.element.remove();
    this.stack.splice(index, 1);
    modal.options.onClose?.();

    if (this.stack.length === 0) {
      document.body.style.overflow = '';
      if (this.overlay) {
        this.overlay.style.opacity = '0';
        setTimeout(() => {
          this.overlay?.remove();
          this.overlay = null;
        }, 200);
      }
    }
  }

  closeAll(): void {
    const ids = [...this.stack.map((m) => m.id)];
    ids.forEach((id) => this.close(id));
  }

  isOpen(id: string): boolean {
    return this.stack.some((m) => m.id === id);
  }

  getActiveModal(): Modal | null {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }

  confirm(options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'primary' | 'danger';
  }): Promise<boolean> {
    return new Promise((resolve) => {
      const footer = document.createElement('div');
      footer.style.cssText = 'display: flex; gap: 8px;';

      const cancelBtn = document.createElement('button');
      cancelBtn.style.cssText = `
        padding: 8px 16px;
        background: var(--bg-elevated, rgba(255, 255, 255, 0.03));
        border: 1px solid var(--border-primary, rgba(255, 255, 255, 0.08));
        border-radius: 6px;
        color: var(--text-secondary, #a1a8b8);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.1s ease;
      `;
      cancelBtn.textContent = options.cancelText ?? 'Cancel';
      cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.background = 'var(--bg-hover, rgba(255, 255, 255, 0.06))';
      });
      cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.background = 'var(--bg-elevated, rgba(255, 255, 255, 0.03))';
      });

      const confirmBtn = document.createElement('button');
      const isDanger = options.confirmVariant === 'danger';
      confirmBtn.style.cssText = `
        padding: 8px 16px;
        background: ${isDanger ? '#ef4444' : 'var(--accent-primary, #4f8cff)'};
        border: none;
        border-radius: 6px;
        color: white;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.1s ease;
      `;
      confirmBtn.textContent = options.confirmText ?? 'Confirm';
      confirmBtn.addEventListener('mouseenter', () => {
        confirmBtn.style.filter = 'brightness(1.1)';
      });
      confirmBtn.addEventListener('mouseleave', () => {
        confirmBtn.style.filter = 'brightness(1)';
      });

      footer.appendChild(cancelBtn);
      footer.appendChild(confirmBtn);

      const id = this.open({
        title: options.title,
        content: `<p style="margin: 0;">${options.message}</p>`,
        size: 'sm',
        closeOnEscape: true,
        closeOnOverlay: false,
        footer,
        onClose: () => resolve(false),
      });

      cancelBtn.addEventListener('click', () => {
        this.close(id);
        resolve(false);
      });

      confirmBtn.addEventListener('click', () => {
        this.close(id);
        resolve(true);
      });
    });
  }
}

export const modalService = new ModalService();
export type { Modal, ModalOptions };
