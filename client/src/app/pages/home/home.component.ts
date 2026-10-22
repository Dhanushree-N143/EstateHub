import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { SiteHeaderComponent } from '../../shared/site-header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SiteHeaderComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private readonly propertyService = inject(PropertyService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  allProperties: Property[] = [];
  filteredProperties: Property[] = [];
  activeCategory: Property['category'] = 'sale';
  category = '';
  city = '';
  beds = '';
  price = '';
  mobileMenuOpen = false;
  loading = true;
  errorMessage = '';
  userName = '';

  readonly favouriteKey = 'estatehub_favourites';

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.userName = this.auth.getDisplayName();

    this.propertyService.getProperties().subscribe({
      next: properties => {
        this.allProperties = properties;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load properties from the Node.js API.';
        this.loading = false;
      }
    });
  }

  setCategory(category: Property['category']): void {
    this.activeCategory = category;
    this.applyFilters();
  }

  applyFilters(): void {
    let list = this.allProperties.filter(p => p.category === this.activeCategory);

    if (this.category) {
      list = list.filter(p => p.type === this.category);
    }
    if (this.city.trim()) {
      list = list.filter(p => p.city.toLowerCase().includes(this.city.trim().toLowerCase()));
    }
    if (this.beds) {
      list = list.filter(p => p.beds >= Number(this.beds));
    }
    if (this.price === 'low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (this.price === 'high') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    this.filteredProperties = list;
  }

  formatPrice(value: number): string {
    if (this.activeCategory === 'rent') {
      return `₹${value.toLocaleString('en-IN')}/mo`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  }

  toggleFavourite(id: string): void {
    const favourites = this.getFavourites();
    const index = favourites.indexOf(id);
    if (index >= 0) {
      favourites.splice(index, 1);
    } else {
      favourites.push(id);
    }
    localStorage.setItem(this.favouriteKey, JSON.stringify(favourites));
  }

  isFavourite(id: string): boolean {
    return this.getFavourites().includes(id);
  }

  getFavourites(): string[] {
    try {
      return JSON.parse(localStorage.getItem(this.favouriteKey) ?? '[]') as string[];
    } catch {
      return [];
    }
  }

  resetFilters(): void {
    this.category = '';
    this.city = '';
    this.beds = '';
    this.price = '';
    this.applyFilters();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  trackById(_: number, property: Property): string {
    return property.id;
  }
}
