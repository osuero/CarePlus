import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, DatesSetArg, EventClickArg } from '@fullcalendar/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointments.model';
import { AppointmentsDetailDialogComponent } from './appointments.detail-dialog.component';
import {
  AppointmentsCreateDialogComponent,
  AppointmentsCreateDialogData,
  AppointmentsCreateDialogResult,
} from './appointments.create-dialog.component';

@Component({
  selector: 'app-appointments-calendar',
  standalone: true,
  templateUrl: './appointments-calendar.component.html',
  styleUrls: ['./appointments-calendar.component.scss'],
  imports: [
    CommonModule,
    BreadcrumbComponent,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FullCalendarModule,
  ],
})
export class AppointmentsCalendarComponent implements OnInit, OnDestroy {
  @ViewChild('calendar', { static: true })
  calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    selectable: false,
    editable: false,
    events: [],
    eventDisplay: 'block',
    eventColor: '#e0ecff',
    eventTextColor: '#1d2433',
    eventBorderColor: 'transparent',
    dayMaxEvents: 4,
    eventClick: this.handleEventClick.bind(this),
    datesSet: this.handleDatesSet.bind(this),
    locale: this.translate.currentLang,
  };

  private readonly destroy$ = new Subject<void>();
  private readonly defaultTenant = environment.tenantId ?? 'default';

  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly dialog: MatDialog,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (this.calendarComponent) {
        this.calendarComponent.getApi().setOption('locale', event.lang);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AppointmentsCreateDialogComponent, {
      width: '620px',
      maxWidth: '95vw',
      data: {
        tenantId: this.defaultTenant,
      } satisfies AppointmentsCreateDialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result?: AppointmentsCreateDialogResult) => {
        if (result?.appointment) {
          this.refreshCalendar();
        }
      });
  }

  private handleDatesSet(arg: DatesSetArg): void {
    const start = arg.start;
    const end = arg.end;

    this.appointmentsService
      .getAppointmentsForRange(start.toISOString(), end.toISOString(), this.defaultTenant)
      .pipe(takeUntil(this.destroy$))
      .subscribe((appointments) => {
        const events = appointments.map((appointment) => ({
          id: appointment.id,
          title: appointment.title,
          start: appointment.startsAtUtc,
          end: appointment.endsAtUtc,
          extendedProps: appointment,
        }));
        this.calendarOptions = {
          ...this.calendarOptions,
          events,
        };
      });
  }

  private handleEventClick(arg: EventClickArg): void {
    const appointment = arg.event.extendedProps as Appointment | undefined;
    if (!appointment) {
      return;
    }

    this.dialog.open(AppointmentsDetailDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        appointment,
      },
    });
  }

  private refreshCalendar(): void {
    if (this.calendarComponent) {
      const api = this.calendarComponent.getApi();
      const currentStart = api.view.currentStart;
      const currentEnd = api.view.currentEnd;
      this.handleDatesSet({
        start: currentStart,
        end: currentEnd,
        startStr: currentStart.toISOString(),
        endStr: currentEnd.toISOString(),
        timeZone: api.getOption('timeZone')?.toString() ?? 'local',
        view: api.view,
      });
    }
  }
}
