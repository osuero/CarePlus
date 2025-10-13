import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { AppointmentCalendarService } from './appointment-calendar.service';
import { EventInput } from '@fullcalendar/core';
import { MatCardModule } from '@angular/material/card';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import timeGridPlugin from '@fullcalendar/timegrid';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-appointment-calendar',
  imports: [
    BreadcrumbComponent,
    MatCardModule,
    FullCalendarModule,
    MatTooltipModule,
  ],
  standalone: true,
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss'],
})
export class AppointmentCalendarComponent implements OnInit {
  calendarEvents?: EventInput[];
  @ViewChild('calendar', { static: false })
  calendarComponent: FullCalendarComponent | null = null;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [], // Events will be populated dynamically from the service
    editable: true, // Allow editing events
    selectable: true, // Enable selection for creating events
    dateClick: this.handleDateClick.bind(this), // Handle date click event
    eventClick: this.handleEventClick.bind(this), // Add eventClick handler
    eventContent: this.eventContent.bind(this), // Event content customization
    eventDidMount: this.eventDidMount.bind(this), // Add eventDidMount handler for tooltips
    eventDrop: this.handleEventDrop.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    views: {
      dayGridMonth: { buttonText: 'Month' },
      timeGridWeek: { buttonText: 'Week' },
      timeGridDay: { buttonText: 'Day' },
    },
  };

  constructor(
    private appointmentCalendarService: AppointmentCalendarService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentCalendarService.loadEvents().then((events) => {
      this.calendarEvents = events;
      this.calendarOptions.events = this.calendarEvents;

      if (this.calendarComponent) {
        this.calendarComponent.getApi().refetchEvents(); // Calls FullCalendar's refetchEvents method
      }
    });
  }

  handleDateClick(info: any) {}
  handleEventClick(info: any) {
    // Get the clicked event's details
    const eventData = info.event;
    const eventDetails = {
      title: eventData.title,
      start: eventData.start.toISOString(), // Convert to ISO string for passing
      end: eventData.end?.toISOString(), // Ensure the event has an end date
      description: eventData.extendedProps.description,
    };

    // Navigate to the view-appointment page and pass event data as query parameters
    this.router.navigate(['/admin/appointment/viewAppointment'], {
      queryParams: eventDetails,
    });
  }

  eventContent(info: any) {
    const { event } = info;
    const status = event.extendedProps.status || 'default'; // Get status or default to 'default'
    // Return HTML content with dynamic class for color coding
    return {
      html: `
        <div class="fc-event-title status-${status}">
          <img src="${event.extendedProps.img}" alt="Avatar" class="event-avatar">
          ${event.title}
        </div>
      `,
    };
  }

  eventDidMount(info: any) {
    const { event, el } = info;
    const tooltipText = `
      Doctor name: ${event.extendedProps.doctor}\n
      Start: ${event.start ? event.start.toLocaleString() : 'N/A'}\n
      End: ${event.end ? event.end.toLocaleString() : 'N/A'}\n
      Description: ${event.extendedProps.note || 'N/A'}\n
      Status: ${event.extendedProps.status || 'N/A'}
    `;

    el.setAttribute('title', tooltipText);
  }

  handleEventDrop(info: any) {
    const updatedEvent = info.event;
    console.log('Event dropped:', updatedEvent);

    // Show the snackbar message after the event is dropped
    this.snackBar.open('Your appointment is rescheduled!', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    // Example: Call a service method to persist changes
    // this.appointmentCalendarService.updateEvent(updatedEvent);
  }
}
