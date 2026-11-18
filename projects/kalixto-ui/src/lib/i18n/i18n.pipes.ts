import { Pipe, PipeTransform, inject } from '@angular/core';
import { KxI18nService } from './i18n.service';

/**
 * {{ 'home.hero.title' | kxT }}   ·   {{ 'form.min' | kxT: { n: 3 } }}
 * Impuro de propósito: lê o signal de idioma, então a tela inteira acompanha a troca.
 */
@Pipe({ name: 'kxT', pure: false })
export class KxTranslatePipe implements PipeTransform {
  private readonly i18n = inject(KxI18nService);
  transform(key: string, params?: Record<string, string | number>): string {
    return this.i18n.t(key, params);
  }
}

/** Listas e objetos do dicionário: @for (item of ('home.areas' | kxGet); track $index) */
@Pipe({ name: 'kxGet', pure: false })
export class KxGetPipe implements PipeTransform {
  private readonly i18n = inject(KxI18nService);
  transform<T = unknown>(key: string): T {
    return this.i18n.get<T>(key);
  }
}

/** URL localizada de uma página: [routerLink]="'contact' | kxPath" */
@Pipe({ name: 'kxPath', pure: false })
export class KxPathPipe implements PipeTransform {
  private readonly i18n = inject(KxI18nService);
  transform(pageId: string): string {
    return this.i18n.path(pageId);
  }
}
