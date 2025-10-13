import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/core';

@Injectable({
  providedIn: 'root',
})
export class AppointmentCalendarService {
  private readonly API_URL = 'assets/data/appointment.json';

  constructor() {}

  async loadEvents(): Promise<EventInput[]> {
    const response = await fetch(this.API_URL);
    const events = await response.json();

    return events.map((event: any) => {
      // Parse the date string to ensure it has a valid Date object
      const startDate = new Date(event.date);
      const startTimeParts = event.startTime.split(':'); // Extract time parts from the "time" field
      startDate.setHours(
        parseInt(startTimeParts[0]),
        parseInt(startTimeParts[1])
      );

      const endDate = new Date(event.date);
      const endTimeParts = event.endTime.split(':'); // Extract time parts from the "endTime" field
      endDate.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));

      return {
        id: event.id,
        title: event.name,
        image: event.img,
        start: startDate,
        end: endDate,
        className: event.className,
        injury: event.injury,
        doctor: event.doctor,
        details: event.details,
        note: event.notes || '',
        allDay: event.allDay || false,
        extendedProps: {
          details: event.notes,
          status: event.appointmentStatus || 'default',
          img: event.img,
        },
      };
    });
  }
}
