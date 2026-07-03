import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { PRODUCT_CATEGORIES } from '../../core/mock-data';

@Component({
  selector: 'app-product-filters-drawer',
  imports: [HlmDrawerImports, HlmToggleGroupImports, HlmLabelImports, HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-drawer direction="bottom">
      <button hlmDrawerTrigger type="button" hlmBtn variant="outline" class="relative md:hidden">
        Filters
        @if (activeFilterCount() > 0) {
          <span
            class="bg-primary text-primary-foreground absolute -end-2 -top-2 flex size-5 items-center justify-center rounded-full text-xs"
          >
            {{ activeFilterCount() }}
          </span>
        }
      </button>
      <hlm-drawer-content *hlmDrawerPortal="let ctx">
        <hlm-drawer-header>
          <h3 hlmDrawerTitle>Filters</h3>
        </hlm-drawer-header>
        <div class="flex flex-col gap-4 px-4 pb-4">
          <div class="flex flex-col gap-2">
            <label hlmLabel>Category</label>
            <hlm-toggle-group type="single" [(value)]="category" orientation="vertical" class="w-full items-stretch">
              <button hlmToggleGroupItem value="all" class="justify-start">All categories</button>
              @for (cat of categories; track cat) {
                <button hlmToggleGroupItem [value]="cat" class="justify-start">{{ cat }}</button>
              }
            </hlm-toggle-group>
          </div>
          <div class="flex flex-col gap-2">
            <label hlmLabel>Status</label>
            <hlm-toggle-group type="single" [(value)]="status" orientation="vertical" class="w-full items-stretch">
              <button hlmToggleGroupItem value="all" class="justify-start">All statuses</button>
              <button hlmToggleGroupItem value="active" class="justify-start">Active</button>
              <button hlmToggleGroupItem value="draft" class="justify-start">Draft</button>
              <button hlmToggleGroupItem value="archived" class="justify-start">Archived</button>
            </hlm-toggle-group>
          </div>
        </div>
        <hlm-drawer-footer>
          <button hlmBtn variant="outline" (click)="reset()">Clear filters</button>
          <button hlmDrawerClose hlmBtn>Done</button>
        </hlm-drawer-footer>
      </hlm-drawer-content>
    </hlm-drawer>
  `,
})
export class ProductFiltersDrawer {
  public readonly category = model.required<string>();
  public readonly status = model.required<string>();

  protected readonly categories = PRODUCT_CATEGORIES;

  protected activeFilterCount(): number {
    return (this.category() !== 'all' ? 1 : 0) + (this.status() !== 'all' ? 1 : 0);
  }

  protected reset(): void {
    this.category.set('all');
    this.status.set('all');
  }
}
