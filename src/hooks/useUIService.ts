/**
 * useUIService Hook
 * React хуки для работы с UI-сервисом.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  themeService,
  toastService,
  animationService,
  modalService,
  type ThemeMode,
  type Toast,
  type ToastOptions,
  type ModalOptions,
} from '../services/ui';

/**
 * Хук для работы с темой
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(themeService.getTheme());
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(
    themeService.getResolvedTheme()
  );

  useEffect(() => {
    const unsubscribe = themeService.subscribe((newTheme, newResolved) => {
      setTheme(newTheme);
      setResolvedTheme(newResolved);
    });
    return unsubscribe;
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    themeService.setTheme(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    themeService.toggle();
  }, []);

  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    setTheme: setThemeMode,
    toggle: toggleTheme,
  };
}

/**
 * Хук для работы с тостами
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(toastService.getToasts());

  useEffect(() => {
    const unsubscribe = toastService.subscribe((newToasts) => {
      setToasts(newToasts);
    });
    return unsubscribe;
  }, []);

  const show = useCallback((message: string, options?: ToastOptions) => {
    return toastService.show(message, options);
  }, []);

  const success = useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return toastService.success(message, options);
  }, []);

  const warning = useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return toastService.warning(message, options);
  }, []);

  const error = useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return toastService.error(message, options);
  }, []);

  const info = useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return toastService.info(message, options);
  }, []);

  const dismiss = useCallback((id: string) => {
    return toastService.dismiss(id);
  }, []);

  const dismissAll = useCallback(() => {
    toastService.dismissAll();
  }, []);

  return {
    toasts,
    show,
    success,
    warning,
    error,
    info,
    dismiss,
    dismissAll,
  };
}

/**
 * Хук для работы с анимациями
 */
export function useAnimation() {
  const shouldAnimate = animationService.shouldAnimate();

  const animate = useCallback(
    (
      element: Element | null,
      keyframes: Keyframe[],
      config?: Parameters<typeof animationService.animate>[2]
    ) => {
      if (!element) {
        return null;
      }
      return animationService.animate(element, keyframes, config);
    },
    []
  );

  const preset = useCallback(
    (
      element: Element | null,
      name: Parameters<typeof animationService.preset>[1]
    ) => {
      if (!element) {
        return null;
      }
      return animationService.preset(element, name);
    },
    []
  );

  const cancel = useCallback((element: Element | null) => {
    if (element) {
      animationService.cancelAnimation(element);
    }
  }, []);

  return {
    shouldAnimate,
    animate,
    preset,
    cancel,
    stagger: animationService.stagger.bind(animationService),
    sequence: animationService.sequence.bind(animationService),
    createTransition: animationService.createTransition.bind(animationService),
  };
}

/**
 * Хук для работы с модальными окнами
 */
export function useModal() {
  const open = useCallback((options: ModalOptions) => {
    return modalService.open(options);
  }, []);

  const close = useCallback((id: string) => {
    return modalService.close(id);
  }, []);

  const closeAll = useCallback(() => {
    modalService.closeAll();
  }, []);

  const confirm = useCallback(
    (options: Parameters<typeof modalService.confirm>[0]) => {
      return modalService.confirm(options);
    },
    []
  );

  const isOpen = useCallback((id: string) => {
    return modalService.isOpen(id);
  }, []);

  return {
    open,
    close,
    closeAll,
    confirm,
    isOpen,
  };
}

/**
 * Комбинированный хук для всего UI-сервиса
 */
export function useUI() {
  const theme = useTheme();
  const toast = useToast();
  const animation = useAnimation();
  const modal = useModal();

  return {
    theme,
    toast,
    animation,
    modal,
  };
}

export default useUI;
