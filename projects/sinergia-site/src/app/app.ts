import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  KxButtonDirective,
  KxFooterComponent,
  KxHeaderComponent,
  KxI18nService,
  KxIconComponent,
  KxPathPipe,
  KxScrollProgressComponent,
  KxTranslatePipe,
  KxWhatsAppFabComponent,
} from 'kalixto-ui';
import { ContactChannelsComponent } from './shared/contact-channels.component';

/**
 * Shell do site: link "pular para o conteúdo", barra de progresso, header,
 * conteúdo da rota, footer (com acesso administrativo discreto) e WhatsApp.
 */
@Component({
  selector: 'sn-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    KxHeaderComponent,
    KxFooterComponent,
    KxWhatsAppFabComponent,
    KxScrollProgressComponent,
    KxButtonDirective,
    KxIconComponent,
    KxTranslatePipe,
    KxPathPipe,
    ContactChannelsComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly i18n = inject(KxI18nService);
  protected readonly year = new Date().getFullYear();

  protected focusMain(event: Event): void {
    event.preventDefault();
    const main = document.getElementById('conteudo');
    main?.focus();
    main?.scrollIntoView();
  }

  protected toTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    document.getElementById('conteudo')?.focus({ preventScroll: true });
  }
}
