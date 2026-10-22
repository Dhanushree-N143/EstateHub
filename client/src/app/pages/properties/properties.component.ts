import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { SiteHeaderComponent } from '../../shared/site-header.component';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SiteHeaderComponent],
  templateUrl: './properties.component.html'
})
export class PropertiesComponent implements OnInit {
  private readonly service = inject(PropertyService);
  private readonly route = inject(ActivatedRoute);
  properties: Property[] = [];
  filtered: Property[] = [];
  search = '';
  type = '';
  category = '';
  city = '';
  sort = '';
  showFavourites = false;
  loading = true;
  readonly favouriteKey = 'estatehub_favourites';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.city = params['city'] ?? '';
      this.category = params['category'] ?? '';
      this.loadProperties();
    });
  }

  private loadProperties(): void {
    this.service.getProperties().subscribe({
      next: data => { this.properties = data; this.applyFilters(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilters(): void {
    let list = [...this.properties];
    const q = this.search.trim().toLowerCase();
    if (q) list = list.filter(p => `${p.title} ${p.city} ${p.community}`.toLowerCase().includes(q));
    if (this.type) list = list.filter(p => p.type === this.type);
    if (this.category) list = list.filter(p => p.category === this.category);
    if (this.city) list = list.filter(p => p.city === this.city);
    if (this.sort === 'low') list.sort((a,b) => a.price-b.price);
    if (this.sort === 'high') list.sort((a,b) => b.price-a.price);
    if (this.showFavourites) list = list.filter(p => this.getFavouriteIds().includes(p.id));
    this.filtered = list;
  }

  reset(): void {
    this.search = this.type = this.category = this.city = this.sort = '';
    this.showFavourites = false;
    this.applyFilters();
  }

  formatPrice(p: Property): string {
    return p.category === 'rent' ? `₹${p.price.toLocaleString('en-IN')}/mo` : `₹${p.price.toLocaleString('en-IN')}`;
  }

  toggleFavourite(id: string): void {
    const ids = this.getFavouriteIds();
    const next = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id];
    localStorage.setItem(this.favouriteKey, JSON.stringify(next));
    this.applyFilters();
  }

  isFavourite(id: string): boolean { return this.getFavouriteIds().includes(id); }

  getFavouriteIds(): string[] {
    try { return JSON.parse(localStorage.getItem(this.favouriteKey) ?? '[]') as string[]; } catch { return []; }
  }

  getMatchScore(p: Property): number {
    let score = 55;
    if (this.city && p.city === this.city) score += 15;
    if (this.category && p.category === this.category) score += 10;
    if (this.type && p.type === this.type) score += 10;
    if (this.sort === 'low' && p.price <= this.medianPrice()) score += 5;
    if (this.sort === 'high' && p.price >= this.medianPrice()) score += 5;
    if (!this.city && !this.category && !this.type && !this.sort) score = 85;
    return Math.min(99, score);
  }

  private medianPrice(): number {
    if (!this.properties.length) return 0;
    const prices = this.properties.map(p => p.price).sort((a,b) => a-b);
    return prices[Math.floor(prices.length / 2)];
  }

  trackById(_: number, p: Property): string { return p.id; }
}
