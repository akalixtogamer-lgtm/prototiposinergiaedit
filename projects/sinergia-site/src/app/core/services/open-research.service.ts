import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { SITE } from '../config/site.config';
import { OpenResearch } from '../models/open-research.model';

type State = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Lista de pesquisas abertas. A fonte é um JSON publicado junto do site
 * (SITE.integrations.openResearchSource) e pode virar uma API sem mudar a tela.
 * Filtro de segurança: só itens públicos e abertos/em breve chegam à interface.
 */
@Injectable({ providedIn: 'root' })
export class OpenResearchService {
  private readonly http = inject(HttpClient);
  readonly state = signal<State>('idle');
  readonly items = signal<OpenResearch[]>([]);

  load(): void {
    this.state.set('loading');
    this.http.get<OpenResearch[]>(SITE.integrations.openResearchSource).subscribe({
      next: (list) => {
        const safe = (Array.isArray(list) ? list : []).filter(
          (r) => r.visibility === 'public' && (r.status === 'open' || r.status === 'soon') && !!r.url,
        );
        this.items.set(safe);
        this.state.set('ready');
      },
      error: () => this.state.set('error'),
    });
  }
}
