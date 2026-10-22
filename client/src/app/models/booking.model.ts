export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  date: string;
  time: string;
  purpose: 'Viewing' | 'Consultation';
  status: 'Confirmed' | 'Pending';
  customer: string;
}
