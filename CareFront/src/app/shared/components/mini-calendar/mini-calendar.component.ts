import {
  AfterViewInit,
  Component,
  ChangeDetectorRef,
  ViewChild,
  ViewEncapsulation,
  AfterViewChecked,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { Appointment } from '../../../appointments/appointments.model';

@Component({
  selector: 'app-mini-calendar',
  templateUrl: './mini-calendar.component.html',
  styleUrls: ['./mini-calendar.component.scss'],
  imports: [MatDatepickerModule, MatNativeDateModule, MatCardModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class MiniCalendarComponent
  implements AfterViewInit, AfterViewChecked, OnChanges
{
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
  @Input() appointments: Appointment[] = [];
  selectedDate: Date | null = null;

  // Event data - using current date format
  eventMap = new Map<string, { type: string; label: string }[]>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.injectDots();

      if (this.calendar) {
        this.calendar.monthSelected.subscribe(() => {
          setTimeout(() => this.injectDots(), 100);
        });
        this.calendar.yearSelected.subscribe(() => {
          setTimeout(() => this.injectDots(), 100);
        });
        this.calendar.stateChanges.subscribe(() => {
          setTimeout(() => this.injectDots(), 50);
        });
      }
    }, 200);
  }

  ngAfterViewChecked(): void {
    const existingDots = document.querySelectorAll('.dot-container');
    if (existingDots.length === 0) {
      this.injectDots();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointments']) {
      this.buildEventMap();
      setTimeout(() => this.injectDots(), 50);
    }
  }

  private buildEventMap(): void {
    this.eventMap.clear();
    this.appointments.forEach((appointment) => {
      const key = this.formatDate(new Date(appointment.startsAtUtc));
      const status =
        (typeof appointment.status === 'string'
          ? appointment.status
          : appointment.status?.toString()) ?? 'Scheduled';
      const label =
        appointment.title ||
        `${appointment.patientName ?? 'Appointment'} with ${appointment.doctorName ?? ''}`.trim();

      const existing = this.eventMap.get(key) ?? [];
      existing.push({
        type: status.toLowerCase(),
        label: label.length > 0 ? label : 'Appointment',
      });
      this.eventMap.set(key, existing);
    });
  }

  injectDots() {
    // Remove existing dots first
    const existingDots = document.querySelectorAll('.dot-container');
    existingDots.forEach((dot) => dot.remove());

    const cells = document.querySelectorAll(
      '.mat-calendar-body-cell:not(.mat-calendar-body-disabled)'
    ) as NodeListOf<HTMLElement>;

    cells.forEach((cell: HTMLElement) => {
      cell.style.position = 'relative';
      cell.style.overflow = 'visible';

      const cellContent = cell.querySelector(
        '.mat-calendar-body-cell-content'
      ) as HTMLElement;
      if (!cellContent) return;

      const day = cellContent.textContent?.trim();
      if (!day) return;

      const currentViewDate = this.calendar?.activeDate || new Date();
      const year = currentViewDate.getFullYear();
      const month = (currentViewDate.getMonth() + 1)
        .toString()
        .padStart(2, '0');
      const dayPadded = day.padStart(2, '0');
      const key = `${year}-${month}-${dayPadded}`;

      const events = this.eventMap.get(key);
      if (!events || events.length === 0) return;

      cell.classList.add('has-events');
      if (events.length > 1) {
        cell.classList.add('has-multiple-events');
      }

      const dotContainer = document.createElement('div') as HTMLElement;
      dotContainer.classList.add('dot-container');
      dotContainer.style.cssText = `
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      height: 6px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 2px;
      z-index: 10;
      pointer-events: auto;
      min-width: 20px;
    `;

      events.forEach((event) => {
        const span = document.createElement('span') as HTMLElement;
        span.classList.add('dot', `dot-${event.type}`);
        span.style.cssText = `
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: block;
        cursor: pointer;
        flex-shrink: 0;
        margin: 0;
        position: relative;
        pointer-events: auto;
      `;

        // Set background color
        const type = event.type.toLowerCase();
        span.style.backgroundColor = this.getStatusColor(type);

        // Create custom tooltip
        const tooltip = document.createElement('div') as HTMLElement;
        tooltip.textContent = event.label;
        tooltip.classList.add('custom-tooltip');

        span.appendChild(tooltip);

        // Tooltip hover events
        span.addEventListener('mouseenter', () => {
          tooltip.style.display = 'block';
          span.style.transform = 'scale(1.2)';
          span.style.transition = 'transform 0.1s ease';
        });

        span.addEventListener('mouseleave', () => {
          tooltip.style.display = 'none';
          span.style.transform = 'scale(1)';
        });

        // Click alert (unchanged)
        span.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.info(`${event.label} on ${key} (Day ${day})`);
        });

        dotContainer.appendChild(span);
      });

      cell.appendChild(dotContainer);
    });
  }

  // Used for [dateClass] binding - this adds CSS classes to dates with events
  customDateClass = (d: Date): string => {
    const key = this.formatDate(d);
    const hasEvents = this.eventMap.has(key);
    return hasEvents ? 'has-events' : '';
  };

  formatDate(date: Date): string {
    // Use UTC to avoid timezone issues
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled':
        return '#42A5F5';
      case 'confirmed':
        return '#9C27B0';
      case 'completed':
        return '#66BB6A';
      case 'cancelled':
        return '#EF5350';
      case 'noshow':
        return '#FFA726';
      default:
        return '#cccccc';
    }
  }
}
