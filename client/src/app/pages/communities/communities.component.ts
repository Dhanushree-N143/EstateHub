import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/site-header.component';
import { Community } from '../../models/community.model';

@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteHeaderComponent],
  templateUrl: './communities.component.html'
})
export class CommunitiesComponent {
  communities: Community[] = [
  {
    "id": "c1",
    "name": "Anna Nagar",
    "city": "Madurai",
    "properties": 4,
    "description": "A well-established Madurai residential area with broad access to everyday retail, schools, dining and city roads.",
    "accent": "#3E7CB1",
    "highlights": [
      "Established area",
      "Family friendly",
      "City access"
    ],
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c2",
    "name": "KK Nagar",
    "city": "Madurai",
    "properties": 3,
    "description": "A popular residential locality suited to buyers looking for established homes, local amenities and convenient urban access.",
    "accent": "#E3A857",
    "highlights": [
      "Residential",
      "Local amenities",
      "Well connected"
    ],
    "image": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c3",
    "name": "S S Colony",
    "city": "Madurai",
    "properties": 3,
    "description": "A centrally located Madurai neighbourhood with convenient access to rail, roads, markets and everyday services.",
    "accent": "#1D4569",
    "highlights": [
      "Central location",
      "Transit access",
      "Urban living"
    ],
    "image": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c4",
    "name": "Adyar",
    "city": "Chennai",
    "properties": 2,
    "description": "An established south Chennai neighbourhood known for residential streets, institutions, green spaces and access across the city.",
    "accent": "#4B8F8C",
    "highlights": [
      "Established",
      "Green spaces",
      "Premium living"
    ],
    "image": "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c5",
    "name": "Anna Nagar",
    "city": "Chennai",
    "properties": 2,
    "description": "A planned and sought-after Chennai residential neighbourhood with wide roads, greenery, metro access and strong social infrastructure.",
    "accent": "#7B6AA8",
    "highlights": [
      "Planned area",
      "Metro access",
      "Family friendly"
    ],
    "image": "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c6",
    "name": "OMR",
    "city": "Chennai",
    "properties": 2,
    "description": "Chennai's major technology corridor, combining newer apartment communities with access to IT parks and employment centres.",
    "accent": "#D07B4C",
    "highlights": [
      "IT corridor",
      "Newer homes",
      "Investment"
    ],
    "image": "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c7",
    "name": "Besant Nagar",
    "city": "Chennai",
    "properties": 2,
    "description": "A premium coastal Chennai neighbourhood associated with beachside living, cafés, restaurants and established residences.",
    "accent": "#2F7D8C",
    "highlights": [
      "Coastal living",
      "Premium",
      "Lifestyle"
    ],
    "image": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c8",
    "name": "Whitefield",
    "city": "Bengaluru",
    "properties": 2,
    "description": "A major east Bengaluru residential and technology corridor with large apartment communities and strong workplace connectivity.",
    "accent": "#5D8B6A",
    "highlights": [
      "Tech corridor",
      "Apartments",
      "Connectivity"
    ],
    "image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c9",
    "name": "Indiranagar",
    "city": "Bengaluru",
    "properties": 2,
    "description": "A well-known east Bengaluru neighbourhood combining established residential streets with dining, retail and metro connectivity.",
    "accent": "#9B6A4F",
    "highlights": [
      "Metro access",
      "Lifestyle",
      "Established"
    ],
    "image": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c10",
    "name": "Koramangala",
    "city": "Bengaluru",
    "properties": 2,
    "description": "A central Bengaluru neighbourhood recognised for its startup ecosystem, cafés, restaurants and strong rental demand.",
    "accent": "#6A7FA8",
    "highlights": [
      "Startup hub",
      "Rental demand",
      "Urban lifestyle"
    ],
    "image": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c11",
    "name": "HSR Layout",
    "city": "Bengaluru",
    "properties": 1,
    "description": "A planned south-east Bengaluru neighbourhood with a grid layout, parks, cafés and access to major IT corridors.",
    "accent": "#4E8C78",
    "highlights": [
      "Planned layout",
      "Parks",
      "IT access"
    ],
    "image": "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c12",
    "name": "R.S. Puram",
    "city": "Coimbatore",
    "properties": 2,
    "description": "A premium central Coimbatore residential locality with established homes, retail, dining and strong city connectivity.",
    "accent": "#8A684A",
    "highlights": [
      "Premium locality",
      "Central",
      "Retail nearby"
    ],
    "image": "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c13",
    "name": "Saibaba Colony",
    "city": "Coimbatore",
    "properties": 2,
    "description": "A settled residential neighbourhood known for family living, everyday amenities and convenient access to central Coimbatore.",
    "accent": "#5D8A77",
    "highlights": [
      "Family friendly",
      "Established",
      "Quiet streets"
    ],
    "image": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85"
  },
  {
    "id": "c14",
    "name": "Peelamedu",
    "city": "Coimbatore",
    "properties": 1,
    "description": "An east Coimbatore locality close to the Avinashi Road corridor, airport-side employment, education and technology activity.",
    "accent": "#5D789B",
    "highlights": [
      "Airport access",
      "Work hubs",
      "Growing area"
    ],
    "image": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
  }
];
}
