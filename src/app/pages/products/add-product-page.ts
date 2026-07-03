import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { PRODUCT_CATEGORIES } from '../../core/mock-data';
import type { ProductStatus } from '../../core/models';
import { ProductsService } from '../../core/products.service';

@Component({
  selector: 'app-add-product-page',
  imports: [
    ReactiveFormsModule,
    HlmCardImports,
    HlmFieldImports,
    HlmInputImports,
    HlmTextareaImports,
    HlmSelectImports,
    HlmRadioGroupImports,
    HlmSwitchImports,
    HlmButtonImports,
    HlmAlertDialogImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto flex max-w-3xl flex-col gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Add product</h1>
        <p class="text-muted-foreground text-sm">Create a new product for your store.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4 lg:grid-cols-3">
        <div hlmCard class="flex flex-col gap-4 p-4 lg:col-span-2">
          <h2 hlmCardTitle>Details</h2>

          <div hlmField>
            <label hlmFieldLabel for="name">Product name</label>
            <input hlmInput id="name" formControlName="name" placeholder="Aurora Wool Sweater" />
            <hlm-field-error validator="required">Product name is required.</hlm-field-error>
            <hlm-field-error validator="minlength">Name must be at least 3 characters.</hlm-field-error>
          </div>

          <div hlmField>
            <label hlmFieldLabel for="description">Description</label>
            <textarea hlmTextarea id="description" formControlName="description" rows="4" placeholder="Optional details shown on the product page…"></textarea>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div hlmField>
              <label hlmFieldLabel for="sku">SKU</label>
              <input hlmInput id="sku" formControlName="sku" placeholder="APR-1001" />
              <hlm-field-error validator="required">SKU is required.</hlm-field-error>
            </div>

            <div hlmField>
              <label hlmFieldLabel for="price">Price</label>
              <input hlmInput id="price" type="number" step="0.01" min="0" formControlName="price" />
              <hlm-field-error validator="required">Price is required.</hlm-field-error>
              <hlm-field-error validator="min">Price must be greater than 0.</hlm-field-error>
            </div>
          </div>

          <div hlmField>
            <label hlmFieldLabel for="category">Category</label>
            <hlm-select formControlName="category">
              <hlm-select-trigger buttonId="category">
                <hlm-select-value placeholder="Select a category" />
              </hlm-select-trigger>
              <hlm-select-content *hlmSelectPortal>
                @for (cat of categories; track cat) {
                  <hlm-select-item [value]="cat">{{ cat }}</hlm-select-item>
                }
              </hlm-select-content>
            </hlm-select>
            <hlm-field-error validator="required">Choose a category.</hlm-field-error>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div hlmCard class="flex flex-col gap-4 p-4">
            <h2 hlmCardTitle>Status</h2>
            <hlm-radio-group formControlName="status">
              <label class="flex items-center gap-2">
                <hlm-radio value="active"><hlm-radio-indicator /></hlm-radio>
                Active — visible in your store
              </label>
              <label class="flex items-center gap-2">
                <hlm-radio value="draft"><hlm-radio-indicator /></hlm-radio>
                Draft — hidden from customers
              </label>
            </hlm-radio-group>
          </div>

          <div hlmCard class="flex flex-col gap-4 p-4">
            <h2 hlmCardTitle>Inventory</h2>
            <label class="flex items-center justify-between gap-2">
              <span class="text-sm">Track quantity</span>
              <hlm-switch formControlName="trackInventory" />
            </label>
            @if (form.controls.trackInventory.value) {
              <div hlmField>
                <label hlmFieldLabel for="quantity">Quantity</label>
                <input hlmInput id="quantity" type="number" min="0" formControlName="quantity" />
                <hlm-field-error validator="required">Quantity is required.</hlm-field-error>
                <hlm-field-error validator="min">Quantity can't be negative.</hlm-field-error>
              </div>
            }
          </div>

          <div class="flex items-center justify-end gap-2">
            @if (form.dirty) {
              <hlm-alert-dialog>
                <button hlmAlertDialogTrigger hlmBtn type="button" variant="outline">Cancel</button>
                <hlm-alert-dialog-content *hlmAlertDialogPortal>
                  <hlm-alert-dialog-header>
                    <h3 hlmAlertDialogTitle>Discard unsaved changes?</h3>
                    <p hlmAlertDialogDescription>You'll lose the product details you entered.</p>
                  </hlm-alert-dialog-header>
                  <hlm-alert-dialog-footer>
                    <button hlmAlertDialogCancel>Keep editing</button>
                    <button hlmAlertDialogAction (click)="cancel()">Discard</button>
                  </hlm-alert-dialog-footer>
                </hlm-alert-dialog-content>
              </hlm-alert-dialog>
            } @else {
              <button hlmBtn type="button" variant="outline" (click)="cancel()">Cancel</button>
            }
            <button hlmBtn type="submit">Save product</button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class AddProductPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);

  protected readonly categories = PRODUCT_CATEGORIES;

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    sku: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    category: this.fb.control<string | null>(null, Validators.required),
    status: ['draft' as ProductStatus],
    trackInventory: [true],
    quantity: [0, Validators.min(0)],
  });

  private readonly trackInventory = toSignal(this.form.controls.trackInventory.valueChanges, {
    initialValue: this.form.controls.trackInventory.value,
  });

  constructor() {
    effect(() => {
      const quantity = this.form.controls.quantity;
      if (this.trackInventory()) {
        quantity.addValidators(Validators.required);
      } else {
        quantity.removeValidators(Validators.required);
      }
      quantity.updateValueAndValidity({ emitEvent: false });
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.productsService.add({
      name: value.name,
      sku: value.sku,
      category: value.category!,
      description: value.description || undefined,
      price: value.price,
      stock: value.trackInventory ? value.quantity : 0,
      status: value.status,
      hue: Math.round(Math.random() * 360),
    });
    toast.success('Product created');
    this.router.navigate(['/products']);
  }

  protected cancel(): void {
    this.router.navigate(['/products']);
  }
}
