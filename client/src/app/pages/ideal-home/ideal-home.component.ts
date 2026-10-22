import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { SiteHeaderComponent } from '../../shared/site-header.component';

interface MatchResult {
  property: Property;
  score: number;
  reasons: string[];
}

@Component({
  selector: 'app-ideal-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SiteHeaderComponent],
  templateUrl: './ideal-home.component.html'
})
export class IdealHomeComponent implements OnInit {
  private readonly service = inject(PropertyService);

  properties: Property[] = [];
  results: MatchResult[] = [];
  loading = true;
  searched = false;
  error = '';

  intent: 'sale' | 'rent' | 'invest' = 'sale';
  city = '';
  type = '';
  minBeds = 0;
  maxBudget: number | null = null;
  priority: 'budget' | 'space' | 'location' | 'bedrooms' = 'budget';

  readonly cities = ['Madurai', 'Chennai', 'Bengaluru', 'Coimbatore'];
  readonly types = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' },
    { value: 'penthouse', label: 'Penthouse' }
  ];

  ngOnInit(): void {
    this.service.getProperties().subscribe({
      next: data => { this.properties = data; this.loading = false; },
      error: () => { this.error = 'Unable to load the property catalogue.'; this.loading = false; }
    });
  }

  findMatches(): void {
    this.error = '';
    this.searched = true;
    const category = this.intent;
    let candidates = this.properties.filter(p => p.category === category);

    if (this.city) candidates = candidates.filter(p => p.city === this.city);
    if (this.type) candidates = candidates.filter(p => p.type === this.type);
    if (this.minBeds > 0) candidates = candidates.filter(p => p.beds >= this.minBeds);
    if (this.maxBudget && this.maxBudget > 0) candidates = candidates.filter(p => p.price <= this.maxBudget!);

    if (!candidates.length) {
      this.results = [];
      return;
    }

    const maxCandidatePrice = Math.max(...candidates.map(p => p.price));
    const minCandidatePrice = Math.min(...candidates.map(p => p.price));
    const maxSqft = Math.max(...candidates.map(p => p.sqft));
    const maxBeds = Math.max(...candidates.map(p => p.beds));
    const maxBaths = Math.max(...candidates.map(p => p.baths));

    this.results = candidates.map(property => {
      const reasons: string[] = [];
      let score = 20; // category is already a required match
      reasons.push(this.categoryLabel(property.category) + ' listing');

      if (this.city) {
        if (property.city === this.city) { score += 20; reasons.push(`Located in ${property.city}`); }
      } else {
        score += 10;
      }

      if (this.type) {
        if (property.type === this.type) { score += 15; reasons.push(`${this.typeLabel(property.type)} matches`); }
      } else {
        score += 8;
      }

      if (this.minBeds > 0) {
        if (property.beds >= this.minBeds) { score += 15; reasons.push(`${property.beds} bedrooms meets your minimum`); }
      } else {
        score += Math.round((property.beds / maxBeds) * 8);
      }

      if (this.maxBudget && this.maxBudget > 0) {
        const budgetFit = Math.max(0, Math.min(1, (this.maxBudget - property.price) / Math.max(1, this.maxBudget)));
        score += Math.round(12 + budgetFit * 8);
        reasons.push(`Within your ₹${this.maxBudget.toLocaleString('en-IN')} budget`);
      } else {
        const affordability = maxCandidatePrice === minCandidatePrice ? 1 : (maxCandidatePrice - property.price) / (maxCandidatePrice - minCandidatePrice);
        score += Math.round(10 + affordability * 10);
      }

      const priorityBonus = this.priorityBonus(property, candidates, maxSqft, maxBeds, maxBaths, minCandidatePrice, maxCandidatePrice);
      score += priorityBonus.points;
      if (priorityBonus.reason) reasons.push(priorityBonus.reason);

      return { property, score: Math.min(99, score), reasons: reasons.slice(0, 4) };
    }).sort((a, b) => b.score - a.score).slice(0, 6);
  }

  reset(): void {
    this.intent = 'sale';
    this.city = '';
    this.type = '';
    this.minBeds = 0;
    this.maxBudget = null;
    this.priority = 'budget';
    this.results = [];
    this.searched = false;
    this.error = '';
  }

  formatPrice(p: Property): string {
    return p.category === 'rent' ? `₹${p.price.toLocaleString('en-IN')}/mo` : `₹${p.price.toLocaleString('en-IN')}`;
  }

  private priorityBonus(property: Property, candidates: Property[], maxSqft: number, maxBeds: number, maxBaths: number, minPrice: number, maxPrice: number): { points: number; reason: string } {
    if (this.priority === 'space') {
      const ratio = maxSqft ? property.sqft / maxSqft : 0;
      return { points: Math.round(ratio * 10), reason: ratio >= .85 ? 'One of the most spacious matches' : '' };
    }
    if (this.priority === 'bedrooms') {
      const ratio = maxBeds ? property.beds / maxBeds : 0;
      return { points: Math.round(ratio * 10), reason: property.beds === maxBeds ? 'Maximum bedroom count among matches' : '' };
    }
    if (this.priority === 'location') {
      const cityMatch = this.city && property.city === this.city;
      return { points: cityMatch ? 10 : 4, reason: cityMatch ? 'Location is your selected priority' : 'Strong catalogue match' };
    }
    const ratio = maxPrice === minPrice ? 1 : (maxPrice - property.price) / (maxPrice - minPrice);
    return { points: Math.round(ratio * 10), reason: ratio >= .8 ? 'Strong value within the matching set' : '' };
  }

  private categoryLabel(value: string): string {
    return value === 'rent' ? 'Rental' : value === 'invest' ? 'Investment' : 'Sale';
  }

  private typeLabel(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
