import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBox, lucidePlus, lucideSearch, lucideTrash2 } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { PRODUCT_CATEGORIES } from '../../core/mock-data';
import { ProductsService } from '../../core/products.service';
import type { ProductStatus } from '../../core/models';
import { StatusBadge } from '../../shared/status-badge';
import { ProductFiltersDrawer } from './product-filters-drawer';

const CURRENCY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

@Component({
  selector: 'app-products-page',
  imports: [
    RouterLink,
    NgIcon,
    HlmButtonImports,
    HlmInputGroupImports,
    HlmSelectImports,
    HlmToggleGroupImports,
    HlmCheckboxImports,
    HlmEmptyImports,
    HlmAlertDialogImports,
    StatusBadge,
    ProductFiltersDrawer,
  ],
  providers: [provideIcons({ lucideSearch, lucidePlus, lucideTrash2, lucideBox })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold">Products</h1>
          <p class="text-muted-foreground text-sm">{{ filtered().length }} of {{ products().length }} products</p>
        </div>
        <a routerLink="/products/new" hlmBtn>
          <ng-icon name="lucidePlus" />
          Add product
        </a>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <hlm-input-group class="max-w-sm">
          <hlm-input-group-addon>
            <ng-icon name="lucideSearch" />
          </hlm-input-group-addon>
          <input
            hlmInputGroupInput
            placeholder="Search by name or SKU…"
            [value]="search()"
            (input)="search.set($any($event.target).value)"
          />
        </hlm-input-group>

        <hlm-select [(value)]="category" [itemToString]="categoryLabel" class="hidden w-44 md:block">
          <hlm-select-trigger>
            <hlm-select-value />
          </hlm-select-trigger>
          <hlm-select-content *hlmSelectPortal>
            <hlm-select-item value="all">All categories</hlm-select-item>
            @for (cat of categories; track cat) {
              <hlm-select-item [value]="cat">{{ cat }}</hlm-select-item>
            }
          </hlm-select-content>
        </hlm-select>

        <hlm-toggle-group type="single" [(value)]="status" class="hidden md:flex">
          <button hlmToggleGroupItem value="all">All</button>
          <button hlmToggleGroupItem value="active">Active</button>
          <button hlmToggleGroupItem value="draft">Draft</button>
          <button hlmToggleGroupItem value="archived">Archived</button>
        </hlm-toggle-group>

        <app-product-filters-drawer [(category)]="category" [(status)]="status" />
      </div>

      @if (!filtered().length) {
        <div hlmEmpty>
          <div hlmEmptyHeader>
            <div hlmEmptyMedia variant="icon">
              <ng-icon name="lucideBox" />
            </div>
            <h2 hlmEmptyTitle>No products match</h2>
            <p hlmEmptyDescription>Try adjusting your search or filters.</p>
          </div>
          <button hlmBtn variant="outline" (click)="clearFilters()">Clear filters</button>
        </div>
      } @else {
        <div class="rounded-xl border">
          <div class="flex flex-col gap-2 border-b px-4 py-2 md:flex-row md:items-center md:gap-3">
            <hlm-checkbox
              [checked]="allSelected()"
              [indeterminate]="partiallySelected()"
              (checkedChange)="toggleSelectAll($event)"
              aria-label="Select all filtered products"
            />
            <span class="text-muted-foreground text-sm">Select all</span>
          </div>
          <ul class="divide-y">
            @for (product of filtered(); track product.id) {
              <li class="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:gap-3">
                <div class="flex items-center gap-3">
                  <hlm-checkbox
                    [checked]="selected().has(product.id)"
                    (checkedChange)="toggleOne(product.id, $event)"
                    [aria-label]="'Select ' + product.name"
                  />
                  <span
                    class="size-10 shrink-0 rounded-lg"
                    [style.background]="
                      'linear-gradient(135deg, oklch(0.7 0.15 ' + product.hue + '), oklch(0.55 0.2 ' + product.hue + '))'
                    "
                  ></span>
                  <div class="min-w-0 flex-1">
                    <div class="truncate font-medium">{{ product.name }}</div>
                    <div class="text-muted-foreground text-sm">{{ product.sku }}</div>
                  </div>
                </div>
                <div class="flex items-center justify-between gap-3 md:contents">
                  <span class="text-muted-foreground truncate text-sm md:w-24">{{ product.category }}</span>
                  <span class="text-end text-sm md:w-16">{{ currency(product.price) }}</span>
                  <span
                    class="text-end text-sm md:w-20"
                    [class.text-warning]="product.stock > 0 && product.stock <= 10"
                    [class.text-destructive]="product.stock === 0"
                  >
                    {{ product.stock }} in stock
                  </span>
                  <app-status-badge [status]="product.status" class="shrink-0 md:w-20" />
                </div>
              </li>
            }
          </ul>
        </div>
      }
    </div>

    @if (selected().size > 0) {
      <div
        class="bg-card fixed inset-x-4 bottom-20 z-20 flex flex-wrap items-center gap-3 rounded-xl border p-3 shadow-lg md:inset-x-auto md:end-4 md:bottom-4"
      >
        <span class="text-sm font-medium">{{ selected().size }} selected</span>
        <button hlmBtn variant="outline" size="sm" (click)="setStatus('active')">Set active</button>
        <button hlmBtn variant="outline" size="sm" (click)="setStatus('archived')">Archive</button>

        <hlm-alert-dialog>
          <button hlmAlertDialogTrigger hlmBtn variant="destructive" size="sm">
            <ng-icon name="lucideTrash2" />
            Delete
          </button>
          <hlm-alert-dialog-content *hlmAlertDialogPortal>
            <hlm-alert-dialog-header>
              <h3 hlmAlertDialogTitle>Delete {{ selected().size }} product(s)?</h3>
              <p hlmAlertDialogDescription>This action cannot be undone.</p>
            </hlm-alert-dialog-header>
            <hlm-alert-dialog-footer>
              <button hlmAlertDialogCancel>Cancel</button>
              <button hlmAlertDialogAction (click)="deleteSelected()">Delete</button>
            </hlm-alert-dialog-footer>
          </hlm-alert-dialog-content>
        </hlm-alert-dialog>
      </div>
    }
  `,
})
export class ProductsPage {
  private readonly productsService = inject(ProductsService);

  protected readonly categories = PRODUCT_CATEGORIES;
  protected readonly products = this.productsService.products;

  protected readonly search = signal('');
  protected readonly category = signal('all');
  protected readonly status = signal('all');
  protected readonly selected = signal<ReadonlySet<string>>(new Set());

  protected readonly filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    const category = this.category();
    const status = this.status();
    return this.products().filter((p) => {
      const matchesQuery = !query || p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || p.category === category;
      const matchesStatus = status === 'all' || p.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  });

  protected readonly categoryLabel = (value: string): string =>
    value === 'all' ? 'All categories' : value;

  protected readonly allSelected = computed(() => {
    const ids = this.filtered().map((p) => p.id);
    return ids.length > 0 && ids.every((id) => this.selected().has(id));
  });

  protected readonly partiallySelected = computed(() => {
    const ids = this.filtered().map((p) => p.id);
    const selectedCount = ids.filter((id) => this.selected().has(id)).length;
    return selectedCount > 0 && selectedCount < ids.length;
  });

  protected currency(value: number): string {
    return CURRENCY.format(value);
  }

  protected clearFilters(): void {
    this.search.set('');
    this.category.set('all');
    this.status.set('all');
  }

  protected toggleOne(id: string, checked: boolean): void {
    const next = new Set(this.selected());
    if (checked) next.add(id);
    else next.delete(id);
    this.selected.set(next);
  }

  protected toggleSelectAll(checked: boolean): void {
    if (!checked) {
      this.selected.set(new Set());
      return;
    }
    this.selected.set(new Set(this.filtered().map((p) => p.id)));
  }

  protected setStatus(status: ProductStatus): void {
    this.productsService.setStatus(this.selected(), status);
    toast.success(`Updated ${this.selected().size} product(s)`);
    this.selected.set(new Set());
  }

  protected deleteSelected(): void {
    const count = this.selected().size;
    this.productsService.remove(this.selected());
    toast.success(`Deleted ${count} product(s)`);
    this.selected.set(new Set());
  }
}
