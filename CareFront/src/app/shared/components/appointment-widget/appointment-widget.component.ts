import { Component, input } from '@angular/core';

interface Appointment {
  name: string;
  diseases: string;
  date: string;
  time: string;
  imageUrl: string;
  status?: string;
}

@Component({
  selector: 'app-appointment-widget',
  imports: [],
  templateUrl: './appointment-widget.component.html',
  styleUrl: './appointment-widget.component.scss',
})
export class AppointmentWidgetComponent {
  readonly appointments = input<Appointment[]>([]);
  readonly confirmedCount = input<number | null>(null);

  get totalConfirmed(): number {
    const provided = this.confirmedCount();
    if (provided !== null && provided !== undefined) {
      return provided;
    }

    const fromStatuses = this.appointments().filter((a) =>
      a.status?.toLowerCase() === 'confirmed'
    ).length;

    return fromStatuses > 0 ? fromStatuses : this.appointments().length;
  }
}
