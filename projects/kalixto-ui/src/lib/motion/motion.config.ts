import { InjectionToken } from '@angular/core';

/**
 * Sistema de motion centralizado.
 * Cada efeito declara duração, atraso, easing, gatilho, estado inicial e final.
 * Os estados visuais ficam em styles/_motion.scss (classe .kx-reveal--<efeito>);
 * aqui ficam os números, que a diretiva escreve como variáveis CSS.
 * Para mudar o ritmo do site inteiro, altere apenas este objeto (ou sobrescreva
 * via provideKalixtoUi({ motion: {...} })).
 */
export type KxRevealEffect =
  | 'fade-in'
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'image'
  | 'section';

export interface KxMotionPreset {
  /** ms */
  duration: number;
  /** ms */
  delay: number;
  /** curva CSS */
  easing: string;
  /** Quando dispara (documentação; o gatilho real é o IntersectionObserver). */
  trigger: string;
  /** Estado inicial (documentação). */
  from: string;
  /** Estado final (documentação). */
  to: string;
}

export interface KxMotionConfig {
  effects: Record<KxRevealEffect, KxMotionPreset>;
  /** Intervalo entre filhos de um grupo [kxStagger] (ms). */
  stagger: number;
  /** Parte do elemento que precisa estar visível para disparar (0-1). */
  threshold: number;
  /** Margem do viewport para disparar antes (CSS rootMargin). */
  rootMargin: string;
  /** Repetir a animação quando o elemento sai e volta (padrão: não). */
  once: boolean;
  /** Intensidade máxima do parallax, em px. */
  parallaxMax: number;
  /** Duração da contagem dos indicadores (ms). */
  counterDuration: number;
}

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const KX_MOTION_DEFAULTS: KxMotionConfig = {
  effects: {
    'fade-in': { duration: 700, delay: 0, easing: EASE_OUT, trigger: 'entra no viewport (12%)', from: 'opacity 0', to: 'opacity 1' },
    'fade-up': { duration: 800, delay: 0, easing: EASE_OUT, trigger: 'entra no viewport (12%)', from: 'opacity 0, +32px Y', to: 'opacity 1, 0' },
    'fade-down': { duration: 800, delay: 0, easing: EASE_OUT, trigger: 'entra no viewport (12%)', from: 'opacity 0, −32px Y', to: 'opacity 1, 0' },
    'slide-left': { duration: 900, delay: 0, easing: EASE_OUT, trigger: 'entra no viewport (12%)', from: 'opacity 0, +48px X', to: 'opacity 1, 0' },
    'slide-right': { duration: 900, delay: 0, easing: EASE_OUT, trigger: 'entra no viewport (12%)', from: 'opacity 0, −48px X', to: 'opacity 1, 0' },
    'scale-in': { duration: 700, delay: 0, easing: EASE_OUT, trigger: 'entra no viewport (12%)', from: 'opacity 0, scale .94', to: 'opacity 1, scale 1' },
    image: { duration: 1100, delay: 0, easing: EASE_OUT, trigger: 'entra no viewport (12%)', from: 'recorte 12%/6%, scale 1.06', to: 'sem recorte, scale 1' },
    section: { duration: 900, delay: 0, easing: EASE_OUT, trigger: 'entra no viewport (12%)', from: 'opacity 0, +64px Y', to: 'opacity 1, 0' },
  },
  stagger: 90,
  threshold: 0.12,
  rootMargin: '0px 0px -8% 0px',
  once: true,
  parallaxMax: 48,
  counterDuration: 1600,
};

export const KX_MOTION = new InjectionToken<KxMotionConfig>('KX_MOTION', {
  providedIn: 'root',
  factory: () => KX_MOTION_DEFAULTS,
});
