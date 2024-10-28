import { Booking } from "./booking";

export interface BookingResponse extends Booking {
  bookingid: number;
  booking: Booking;
}
