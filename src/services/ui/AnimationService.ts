/**
 * Animation Service
 * Утилиты для управления анимациями и переходами UI.
 * Вдохновлено Linear и Framer Motion.
 */

import { TRANSITIONS } from './tokens';

type EasingFunction = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | string;

interface AnimationConfig {
  duration: number;
  easing: EasingFunction;
  delay?: number;
  fill?: FillMode;
}

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

const DEFAULT_SPRING: SpringConfig = {
  stiffness: 400,
  damping: 30,
  mass: 1,
};

const PRESET_ANIMATIONS = Object.freeze({
  fadeIn: {
    keyframes: [
      { opacity: 0 },
      { opacity: 1 },
    ],
    config: { duration: 200, easing: 'ease-out' },
  },
  fadeOut: {
    keyframes: [
      { opacity: 1 },
      { opacity: 0 },
    ],
    config: { duration: 200, easing: 'ease-in' },
  },
  slideInRight: {
    keyframes: [
      { transform: 'translateX(100%)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ],
    config: { duration: 300, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  },
  slideOutRight: {
    keyframes: [
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(100%)', opacity: 0 },
    ],
    config: { duration: 200, easing: 'ease-in' },
  },
  slideInLeft: {
    keyframes: [
      { transform: 'translateX(-100%)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ],
    config: { duration: 300, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  },
  slideInUp: {
    keyframes: [
      { transform: 'translateY(20px)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 },
    ],
    config: { duration: 250, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  },
  slideInDown: {
    keyframes: [
      { transform: 'translateY(-20px)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 },
    ],
    config: { duration: 250, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  },
  scaleIn: {
    keyframes: [
      { transform: 'scale(0.95)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 },
    ],
    config: { duration: 200, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  },
  scaleOut: {
    keyframes: [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.95)', opacity: 0 },
    ],
    config: { duration: 150, easing: 'ease-in' },
  },
  pulse: {
    keyframes: [
      { transform: 'scale(1)' },
      { transform: 'scale(1.05)' },
      { transform: 'scale(1)' },
    ],
    config: { duration: 300, easing: 'ease-in-out' },
  },
  shake: {
    keyframes: [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(0)' },
    ],
    config: { duration: 400, easing: 'ease-in-out' },
  },
});

type PresetAnimationName = keyof typeof PRESET_ANIMATIONS;

class AnimationService {
  private prefersReducedMotion: boolean = false;
  private activeAnimations: Map<Element, Animation> = new Map();

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', (event) => {
      this.prefersReducedMotion = event.matches;
    });
  }

  shouldAnimate(): boolean {
    return !this.prefersReducedMotion;
  }

  animate(
    element: Element,
    keyframes: Keyframe[],
    config: Partial<AnimationConfig> = {}
  ): Animation | null {
    if (!this.shouldAnimate()) {
      return null;
    }

    this.cancelAnimation(element);

    const fullConfig: KeyframeAnimationOptions = {
      duration: config.duration ?? 200,
      easing: config.easing ?? 'ease',
      delay: config.delay ?? 0,
      fill: config.fill ?? 'forwards',
    };

    const animation = element.animate(keyframes, fullConfig);
    this.activeAnimations.set(element, animation);

    animation.finished.then(() => {
      this.activeAnimations.delete(element);
    }).catch(() => {
      this.activeAnimations.delete(element);
    });

    return animation;
  }

  preset(element: Element, name: PresetAnimationName): Animation | null {
    const preset = PRESET_ANIMATIONS[name];
    if (!preset) {
      console.warn(`Animation preset "${name}" not found`);
      return null;
    }

    return this.animate(element, preset.keyframes, preset.config);
  }

  cancelAnimation(element: Element): void {
    const existing = this.activeAnimations.get(element);
    if (existing) {
      existing.cancel();
      this.activeAnimations.delete(element);
    }
  }

  cancelAll(): void {
    this.activeAnimations.forEach((animation) => {
      animation.cancel();
    });
    this.activeAnimations.clear();
  }

  springToCubicBezier(config: Partial<SpringConfig> = {}): string {
    const { stiffness, damping, mass } = { ...DEFAULT_SPRING, ...config };
    const omega = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));

    if (zeta < 1) {
      return 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
    return 'cubic-bezier(0.4, 0, 0.2, 1)';
  }

  createTransition(
    properties: string | string[],
    duration: keyof typeof TRANSITIONS | number = 'base'
  ): string {
    const props = Array.isArray(properties) ? properties : [properties];
    const durationValue = typeof duration === 'number'
      ? `${duration}ms`
      : TRANSITIONS[duration];

    return props.map((prop) => `${prop} ${durationValue}`).join(', ');
  }

  async sequence(
    element: Element,
    animations: Array<{ keyframes: Keyframe[]; config?: Partial<AnimationConfig> }>
  ): Promise<void> {
    for (const anim of animations) {
      const animation = this.animate(element, anim.keyframes, anim.config);
      if (animation) {
        await animation.finished;
      }
    }
  }

  stagger(
    elements: Element[],
    keyframes: Keyframe[],
    config: Partial<AnimationConfig & { staggerDelay: number }> = {}
  ): Animation[] {
    const staggerDelay = config.staggerDelay ?? 50;
    const animations: Animation[] = [];

    elements.forEach((element, index) => {
      const delay = (config.delay ?? 0) + index * staggerDelay;
      const animation = this.animate(element, keyframes, { ...config, delay });
      if (animation) {
        animations.push(animation);
      }
    });

    return animations;
  }

  getPresetNames(): PresetAnimationName[] {
    return Object.keys(PRESET_ANIMATIONS) as PresetAnimationName[];
  }
}

export const animationService = new AnimationService();
export { PRESET_ANIMATIONS };
export type { AnimationConfig, SpringConfig, PresetAnimationName };
