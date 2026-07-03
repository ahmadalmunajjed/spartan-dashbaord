import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { type BadgeVariants, HlmBadgeImports } from '@spartan-ng/helm/badge';
import { type ButtonVariants, HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';

@Component({
  selector: 'app-root',
  imports: [
    HlmCardImports,
    HlmButtonImports,
    HlmBadgeImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSwitchImports,
    HlmSeparatorImports,
    HlmAvatarImports,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('my-project');

  protected readonly subscribe = signal(false);
  protected readonly subscribeHint = computed(() =>
    this.subscribe()
      ? 'You will receive occasional product updates.'
      : 'You will not receive marketing emails.',
  );

  protected readonly buttonVariants: NonNullable<ButtonVariants['variant']>[] = [
    'default',
    'secondary',
    'outline',
    'ghost',
    'destructive',
    'link',
  ];

  protected readonly badgeVariants: NonNullable<BadgeVariants['variant']>[] = [
    'default',
    'secondary',
    'outline',
    'destructive',
  ];

  protected readonly team = [{ initials: 'AL' }, { initials: 'GH' }, { initials: 'KP' }];
}
