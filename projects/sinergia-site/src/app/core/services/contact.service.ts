import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, throwError, timeout } from 'rxjs';
import { SITE } from '../config/site.config';

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  consent: boolean;
  lang: string;
}

export class ContactNotConfiguredError extends Error {
  constructor() {
    super('contact-endpoint-not-configured');
  }
}

/**
 * Envio do formulário de contato.
 * Faz POST JSON para SITE.integrations.contactEndpoint. Sem endpoint configurado,
 * falha de forma explícita (ContactNotConfiguredError), o site nunca finge que
 * enviou uma mensagem.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  get configured(): boolean {
    return !!SITE.integrations.contactEndpoint;
  }

  send(msg: ContactMessage): Observable<void> {
    const url = SITE.integrations.contactEndpoint;
    if (!url) return throwError(() => new ContactNotConfiguredError());
    return this.http
      .post(url, { ...msg, sentAt: new Date().toISOString(), source: 'site' }, { headers: { Accept: 'application/json' } })
      .pipe(
        timeout(15000),
        map(() => undefined),
      );
  }
}
