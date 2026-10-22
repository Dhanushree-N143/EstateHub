import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Property } from '../../models/property.model';
import { Booking } from '../../models/booking.model';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { SiteHeaderComponent } from '../../shared/site-header.component';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SiteHeaderComponent],
  templateUrl: './bookings.component.html'
})
export class BookingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly properties = inject(PropertyService);
  private readonly auth = inject(AuthService);
  private readonly bookings = inject(BookingService);
  private readonly route = inject(ActivatedRoute);

  propertyList: Property[] = [];
  bookingList: Booking[] = [];
  submitted = false;
  error = '';
  readonly today = new Date().toISOString().split('T')[0];

  readonly form = this.fb.nonNullable.group({
    propertyId: ['', Validators.required],
    date: ['', Validators.required],
    time: ['10:00', Validators.required],
    purpose: ['Viewing' as 'Viewing' | 'Consultation', Validators.required]
  });

  ngOnInit(): void {
    this.properties.getProperties().subscribe(data => {
      this.propertyList = data;
      const selected = this.route.snapshot.queryParamMap.get('property');
      if (selected && this.propertyList.some(p => p.id === selected)) {
        this.form.patchValue({ propertyId: selected });
      }
    });
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookings.getBookings().subscribe({
      next: data => this.bookingList = data,
      error: err => this.error = err?.error?.message ?? 'Could not load bookings.'
    });
  }

  submit(): void {
    this.submitted = true;
    this.error = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const value = this.form.getRawValue();
    if (value.date < this.today) {
      this.error = 'Please select a future date.';
      return;
    }

    const property = this.propertyList.find(p => p.id === value.propertyId);
    if (!property) { this.error = 'Select a valid property.'; return; }

    const duplicate = this.bookingList.some(b =>
      b.propertyId === property.id && b.date === value.date && b.time === value.time && b.status !== 'Confirmed'
    );
    if (duplicate) {
      this.error = 'You already have a booking for this property at the selected date and time.';
      return;
    }

    this.bookings.createBooking({
      propertyId: property.id,
      propertyTitle: property.title,
      date: value.date,
      time: value.time,
      purpose: value.purpose,
      status: 'Pending',
      customer: this.auth.getDisplayName()
    }).subscribe({
      next: () => {
        this.loadBookings();
        this.form.reset({propertyId:'', date:'', time:'10:00', purpose:'Viewing'});
        this.submitted = false;
      },
      error: err => this.error = err?.error?.message ?? 'Could not create booking.'
    });
  }

  cancel(id: string): void {
    this.bookings.cancelBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: err => this.error = err?.error?.message ?? 'Unable to cancel booking.'
    });
  }
}
