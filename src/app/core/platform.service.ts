import { Injectable, computed, effect, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';

export type Platform = 'ios' | 'android' | 'web';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private readonly _platform = signal<Platform>(this._detectPlatform());

  public readonly platform = this._platform.asReadonly();
  public readonly isNative = computed(() => this._platform() !== 'web');

  constructor() {
    effect(() => {
      const platform = this._platform();
      document.documentElement.classList.remove(
        'platform-ios',
        'platform-android',
        'platform-web',
      );
      document.documentElement.classList.add(`platform-${platform}`);
    });
  }

  private _detectPlatform(): Platform {
    const platform = Capacitor.getPlatform();
    return platform === 'ios' || platform === 'android' ? platform : 'web';
  }
}
