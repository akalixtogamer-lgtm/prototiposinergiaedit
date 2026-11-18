import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Ícones de traço (24×24, stroke 1.8), desenhados para a biblioteca.
 * Decorativos por padrão (aria-hidden). Passe [label] quando o ícone for o único conteúdo.
 */
const PATHS: Record<string, string> = {
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-up-right': 'M7 17L17 7M8 7h9v9',
  'chevron-down': 'M6 9l6 6 6-6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  'map-pin': 'M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21zM12 12.5a3 3 0 100-6 3 3 0 000 6z',
  film: 'M4 4h16v16H4zM8 4v16M16 4v16M4 8h4M4 12h4M4 16h4M16 8h4M16 12h4M16 16h4',
  headset: 'M4 14v-2a8 8 0 0116 0v2M4 14h3v6H5a1 1 0 01-1-1zM20 14h-3v6h2a1 1 0 001-1zM17 20c0 1-2 2-5 2',
  users: 'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c.8-3.6 3.6-6 7-6s6.2 2.4 7 6M16 3.3a4 4 0 010 7.4M18 15c2 .8 3.4 2.9 4 6',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  lock: 'M5 11h14v10H5zM8 11V8a4 4 0 018 0v3',
  chart: 'M4 20h16M7 16v-5M12 16V7M17 16v-8',
  clipboard: 'M8 4h8v3H8zM6 5H5v16h14V5h-1M9 13l2 2 4-4',
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z',
  target: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 12h.01',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  message: 'M4 5h16v11H9l-5 4z',
  check: 'M5 12.5l4.5 4.5L19 7',
  alert: 'M12 8v5M12 16.5h.01M10.3 3.9L2.5 18a2 2 0 001.7 3h15.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v5M16 3v5',
  building: 'M4 21V4h11v17M15 9h5v12M8 8h3M8 12h3M8 16h3M3 21h18',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  play: 'M12 21a9 9 0 100-18 9 9 0 000 18zM10 8.5l5 3.5-5 3.5z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  briefcase: 'M4 8h16v12H4zM9 8V5h6v3M4 13h16',
  compass: 'M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z',
  monitor: 'M3 4h18v12H3zM8 20h8M12 16v4',
  'user-plus': 'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c.8-3.6 3.6-6 7-6 1.4 0 2.7.4 3.8 1.1M19 14v6M16 17h6',
  'log-in': 'M14 4h5v16h-5M10 8l4 4-4 4M14 12H3',
  'file-text': 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7',
  megaphone: 'M3 10v4h3l7 4V6L6 10zM16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11',
  podium: 'M3 21v-6h6v6M9 21V11h6v10M15 21v-4h6v4M12 3l1 2.2 2.3.3-1.7 1.6.4 2.3L12 8.3l-2 1.1.4-2.3-1.7-1.6 2.3-.3z',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  rings: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 21a6 6 0 100-12 6 6 0 000 12zM12 21a3 3 0 100-6 3 3 0 000 6z',
  pause: 'M9 5v14M15 5v14',
  'play-tri': 'M8 5.5v13l11-6.5z',
  whatsapp:
    'M4.5 19.5l1.2-4A8 8 0 1110 19.4zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 01-2.8-2.8l.9-1-1-2z',
};

@Component({
  selector: 'kx-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="stroke()"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.aria-hidden]="label() ? null : 'true'"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() || null"
      focusable="false"
    >
      <path [attr.d]="d()" />
    </svg>
  `,
  styles: `:host { display: inline-flex; flex: none; line-height: 0; } svg { display: block; }`,
})
export class KxIconComponent {
  readonly name = input.required<string>();
  readonly size = input<number | string>(24);
  readonly stroke = input(1.8);
  readonly label = input<string>('');
  protected readonly d = computed(() => PATHS[this.name()] ?? PATHS['sparkle']);
}

export const KX_ICON_NAMES = Object.keys(PATHS);
