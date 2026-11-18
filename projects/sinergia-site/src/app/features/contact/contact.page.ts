import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, isDevMode, signal, viewChild } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { KxButtonDirective, KxI18nService, KxIconComponent, KxRevealDirective, KxTranslatePipe } from 'kalixto-ui';
import { ContactChannelsComponent } from '../../shared/contact-channels.component';
import { PageHeroComponent } from '../../shared/page-hero.component';
import { ContactNotConfiguredError, ContactService } from '../../core/services/contact.service';

type Field = 'name' | 'email' | 'phone' | 'company' | 'subject' | 'message' | 'consent';
type Status = 'idle' | 'sending' | 'success' | 'error' | 'unconfigured';

/** Telefone opcional: se preenchido, precisa ter de 10 a 13 dígitos. */
function phoneValidator(c: AbstractControl): ValidationErrors | null {
  const v = String(c.value ?? '').trim();
  if (!v) return null;
  const digits = v.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13 ? null : { phone: true };
}

/**
 * Contato (mapa: formulário, endereços, telefone, e-mail; prompt: WhatsApp,
 * validação, feedback de envio, mensagens de erro, confirmação de sucesso).
 */
@Component({
  selector: 'sn-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, KxButtonDirective, KxIconComponent, KxRevealDirective, KxTranslatePipe, ContactChannelsComponent, PageHeroComponent],
  templateUrl: './contact.page.html',
  styleUrl: './contact.page.scss',
})
export class ContactPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly contact = inject(ContactService);
  protected readonly i18n = inject(KxI18nService);
  protected readonly dev = isDevMode();
  protected readonly configured = this.contact.configured;

  protected readonly status = signal<Status>('idle');
  protected readonly submitted = signal(false);
  private readonly summary = viewChild<ElementRef<HTMLElement>>('summary');
  private readonly result = viewChild<ElementRef<HTMLElement>>('result');

  /** Valores estáveis do assunto (independentes do idioma), na ordem de contact.form.subjects. */
  private readonly subjectKeys = ['cinema', 'cati', 'focus-group', 'participante', 'outro'];
  protected readonly subjects = computed(() =>
    this.i18n.get<string[]>('contact.form.subjects').map((label, i) => ({ value: this.subjectKeys[i], label })),
  );

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [phoneValidator]],
    company: [''],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    consent: [false, [Validators.requiredTrue]],
  });

  /** Ordem e rótulos dos campos para o resumo de erros. */
  private readonly fieldOrder: { key: Field; label: string }[] = [
    { key: 'name', label: 'contact.form.name' },
    { key: 'email', label: 'contact.form.email' },
    { key: 'phone', label: 'contact.form.phone' },
    { key: 'subject', label: 'contact.form.subject' },
    { key: 'message', label: 'contact.form.message' },
    { key: 'consent', label: 'contact.form.consent' },
  ];

  protected invalid(key: Field): boolean {
    const c = this.form.controls[key];
    return c.invalid && (c.touched || this.submitted());
  }

  protected errorFor(key: Field): string {
    const e = this.form.controls[key].errors;
    if (!e) return '';
    if (key === 'consent') return this.i18n.t('contact.form.errors.consent');
    if (e['required']) return this.i18n.t('contact.form.errors.required');
    if (e['email']) return this.i18n.t('contact.form.errors.email');
    if (e['phone']) return this.i18n.t('contact.form.errors.phone');
    if (e['minlength']) return this.i18n.t('contact.form.errors.minlength', { n: e['minlength'].requiredLength });
    return '';
  }

  protected readonly errorList = computed(() => {
    this.i18n.lang();
    this.status();
    return this.submitted()
      ? this.fieldOrder.filter((f) => this.form.controls[f.key].invalid).map((f) => ({ id: 'f-' + f.key, label: this.i18n.t(f.label), msg: this.errorFor(f.key) }))
      : [];
  });

  protected focusField(event: Event, id: string): void {
    event.preventDefault();
    document.getElementById(id)?.focus();
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.status.set('idle'); // força recálculo do resumo
      setTimeout(() => this.summary()?.nativeElement.focus(), 30);
      return;
    }
    this.status.set('sending');
    const v = this.form.getRawValue();
    this.contact.send({ ...v, lang: this.i18n.lang() }).subscribe({
      next: () => {
        this.status.set('success');
        this.form.reset();
        this.submitted.set(false);
        setTimeout(() => this.result()?.nativeElement.focus(), 30);
      },
      error: (err) => {
        this.status.set(err instanceof ContactNotConfiguredError ? 'unconfigured' : 'error');
        setTimeout(() => this.result()?.nativeElement.focus(), 30);
      },
    });
  }

  constructor() {
    // ?assunto=participante (vindo dos botões de cadastro) pré-seleciona o assunto
    const pre = inject(ActivatedRoute).snapshot.queryParamMap.get('assunto');
    if (pre && this.subjectKeys.includes(pre)) this.form.controls.subject.setValue(pre);
  }

  protected restart(): void {
    this.status.set('idle');
  }
}
