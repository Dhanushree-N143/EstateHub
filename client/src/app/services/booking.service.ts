import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);
  getBookings(): Observable<Booking[]> { return this.http.get<Booking[]>('/api/bookings'); }
  createBooking(payload: Omit<Booking, 'id'>): Observable<Booking> { return this.http.post<Booking>('/api/bookings', payload); }
  cancelBooking(id: string): Observable<{message:string}> { return this.http.delete<{message:string}>(`/api/bookings/${id}`); }
}
