import { Injectable, computed, effect, signal } from '@angular/core';

export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

@Injectable({ providedIn: 'root' })
export class DirectionService {
  private readonly _locale = signal<Locale>(this._initialLocale());

  public readonly locale = this._locale.asReadonly();
  public readonly dir = computed<Direction>(() => (this._locale() === 'ar' ? 'rtl' : 'ltr'));

  constructor() {
    effect(() => {
      const locale = this._locale();
      document.documentElement.dir = this.dir();
      document.documentElement.lang = locale;
      localStorage.setItem('locale', locale);
    });
  }

  public toggle(): void {
    this._locale.update((locale) => (locale === 'ar' ? 'en' : 'ar'));
  }

  private _initialLocale(): Locale {
    return localStorage.getItem('locale') === 'ar' ? 'ar' : 'en';
  }
}
