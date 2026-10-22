import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { SiteHeaderComponent } from '../../shared/site-header.component';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteHeaderComponent],
  templateUrl: './property-detail.component.html'
})
export class PropertyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(PropertyService);

  property?: Property;
  loading = true;
  error = '';
  readonly favouriteKey = 'estatehub_favourites';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.service.getProperties().subscribe({
      next: properties => {
        this.property = properties.find(p => p.id === id);
        this.error = this.property ? '' : 'Property not found.';
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load property details.';
        this.loading = false;
      }
    });
  }

  formatPrice(property: Property): string {
    return property.category === 'rent'
      ? `₹${property.price.toLocaleString('en-IN')}/mo`
      : `₹${property.price.toLocaleString('en-IN')}`;
  }

  toggleFavourite(): void {
    if (!this.property) return;
    const ids = this.getFavouriteIds();
    const next = ids.includes(this.property.id)
      ? ids.filter(id => id !== this.property!.id)
      : [...ids, this.property.id];
    localStorage.setItem(this.favouriteKey, JSON.stringify(next));
  }

  isFavourite(): boolean {
    return !!this.property && this.getFavouriteIds().includes(this.property.id);
  }

  private getFavouriteIds(): string[] {
    try {
      return JSON.parse(localStorage.getItem(this.favouriteKey) ?? '[]') as string[];
    } catch {
      return [];
    }
  }
}
