import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { SiteHeaderComponent } from '../../shared/site-header.component';

interface ComparisonMetric {
  label: string;
  values: string[];
  winner: number;
}

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SiteHeaderComponent],
  templateUrl: './compare.component.html'
})
export class CompareComponent implements OnInit {
  private readonly service = inject(PropertyService);

  properties: Property[] = [];
  selected: Property[] = [];
  loading = true;
  filterCategory = '';
  filterCity = '';
  notice = '';

  ngOnInit(): void {
    this.service.getProperties().subscribe({
      next: data => { this.properties = data; this.loading = false; },
      error: () => { this.loading = false; this.notice = 'Unable to load properties for comparison.'; }
    });
  }

  get availableProperties(): Property[] {
    return this.properties.filter(p => {
      const categoryOk = !this.filterCategory || p.category === this.filterCategory;
      const cityOk = !this.filterCity || p.city === this.filterCity;
      const selectedCategory = this.selected[0]?.category;
      return categoryOk && cityOk && (!selectedCategory || p.category === selectedCategory);
    });
  }

  toggle(property: Property): void {
    this.notice = '';
    const existing = this.selected.findIndex(p => p.id === property.id);
    if (existing >= 0) {
      this.selected.splice(existing, 1);
      this.selected = [...this.selected];
      return;
    }
    if (this.selected.length >= 3) {
      this.notice = 'You can compare up to 3 properties at a time.';
      return;
    }
    if (this.selected.length && this.selected[0].category !== property.category) {
      this.notice = 'For a meaningful price comparison, select properties from the same category.';
      return;
    }
    this.selected = [...this.selected, property];
  }

  isSelected(id: string): boolean { return this.selected.some(p => p.id === id); }

  clear(): void { this.selected = []; this.notice = ''; }

  formatPrice(p: Property): string {
    return p.category === 'rent' ? `₹${p.price.toLocaleString('en-IN')}/mo` : `₹${p.price.toLocaleString('en-IN')}`;
  }

  get metrics(): ComparisonMetric[] {
    if (!this.selected.length) return [];
    return [
      { label: 'Price', values: this.selected.map(p => this.formatPrice(p)), winner: this.lowestIndex(this.selected.map(p => p.price)) },
      { label: 'Property type', values: this.selected.map(p => this.title(p.type)), winner: -1 },
      { label: 'City', values: this.selected.map(p => p.city), winner: -1 },
      { label: 'Community', values: this.selected.map(p => p.community), winner: -1 },
      { label: 'Bedrooms', values: this.selected.map(p => `${p.beds}`), winner: this.highestIndex(this.selected.map(p => p.beds)) },
      { label: 'Bathrooms', values: this.selected.map(p => `${p.baths}`), winner: this.highestIndex(this.selected.map(p => p.baths)) },
      { label: 'Area', values: this.selected.map(p => `${p.sqft.toLocaleString('en-IN')} sq ft`), winner: this.highestIndex(this.selected.map(p => p.sqft)) }
    ];
  }

  get decisionScores(): number[] {
    if (!this.selected.length) return [];
    const prices = this.selected.map(p => p.price);
    const areas = this.selected.map(p => p.sqft);
    const beds = this.selected.map(p => p.beds);
    const baths = this.selected.map(p => p.baths);
    const minPrice = Math.min(...prices), maxPrice = Math.max(...prices);
    const maxArea = Math.max(...areas), maxBeds = Math.max(...beds), maxBaths = Math.max(...baths);
    return this.selected.map((p, i) => {
      const priceScore = maxPrice === minPrice ? 100 : ((maxPrice - p.price) / (maxPrice - minPrice)) * 100;
      const spaceScore = maxArea ? (p.sqft / maxArea) * 100 : 0;
      const bedScore = maxBeds ? (p.beds / maxBeds) * 100 : 0;
      const bathScore = maxBaths ? (p.baths / maxBaths) * 100 : 0;
      return Math.round(priceScore * .35 + spaceScore * .30 + bedScore * .20 + bathScore * .15);
    });
  }

  get winnerIndex(): number {
    const scores = this.decisionScores;
    if (!scores.length) return -1;
    return scores.indexOf(Math.max(...scores));
  }

  private lowestIndex(values: number[]): number { return values.indexOf(Math.min(...values)); }
  private highestIndex(values: number[]): number { return values.indexOf(Math.max(...values)); }
  private title(value: string): string { return value.charAt(0).toUpperCase() + value.slice(1); }
}
