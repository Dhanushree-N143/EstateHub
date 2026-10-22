import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/site-header.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [SiteHeaderComponent, RouterLink],
  templateUrl: './about.component.html'
})
export class AboutComponent {}
