/**
 * UI Service
 * Централизованный сервис для управления UI/UX.
 * Экспортирует все подсервисы и утилиты.
 */

export * from './tokens';
export { themeService } from './ThemeService';
export type { ThemeConfig, ThemeChangeListener } from './ThemeService';
export { animationService, PRESET_ANIMATIONS } from './AnimationService';
export type { AnimationConfig, SpringConfig, PresetAnimationName } from './AnimationService';
export { toastService } from './ToastService';
export type { Toast, ToastAction, ToastOptions, ToastListener } from './ToastService';
export { modalService } from './ModalService';
export type { Modal, ModalOptions } from './ModalService';

import { themeService } from './ThemeService';
import { animationService } from './AnimationService';
import { toastService } from './ToastService';
import { modalService } from './ModalService';

/**
 * Центральный объект UI-сервиса для удобного доступа
 */
export const UIService = {
  theme: themeService,
  animation: animationService,
  toast: toastService,
  modal: modalService,

  init(): void {
    console.log('[UIService] Initialized');
  },

  destroy(): void {
    themeService.destroy();
    animationService.cancelAll();
    toastService.destroy();
    modalService.closeAll();
    console.log('[UIService] Destroyed');
  },
};

export default UIService;
