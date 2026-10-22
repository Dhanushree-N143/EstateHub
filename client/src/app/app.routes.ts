import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { PropertiesComponent } from './pages/properties/properties.component';
import { PropertyDetailComponent } from './pages/property-detail/property-detail.component';
import { CommunitiesComponent } from './pages/communities/communities.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { IdealHomeComponent } from './pages/ideal-home/ideal-home.component';
import { CompareComponent } from './pages/compare/compare.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent, canActivate: [authGuard] },
  { path: 'properties', component: PropertiesComponent, canActivate: [authGuard] },
  { path: 'properties/:id', component: PropertyDetailComponent, canActivate: [authGuard] },
  { path: 'communities', component: CommunitiesComponent, canActivate: [authGuard] },
  { path: 'bookings', component: BookingsComponent, canActivate: [authGuard] },
  { path: 'match', component: IdealHomeComponent, canActivate: [authGuard] },
  { path: 'compare', component: CompareComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
