import { Component, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexOptions,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { TodaysAppointmentComponent } from '@shared/components/todays-appointment/todays-appointment.component';
import { DocWelcomeCardComponent } from '@shared/components/doc-welcome-card/doc-welcome-card.component';
import { MiniCalendarComponent } from '@shared/components/mini-calendar/mini-calendar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core';
import { PatientsService } from '../../patients/patients.service';
import { AppointmentsService } from '../../appointments/appointments.service';
import { Appointment } from '../../appointments/appointments.model';
export type areaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
};

export type linechartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  colors: string[];
};

export type donutChartOptions = {
  series: number[];
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    BreadcrumbComponent,
    NgApexchartsModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    TodaysAppointmentComponent,
    DocWelcomeCardComponent,
    MiniCalendarComponent,
  ],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart')
  chart!: ChartComponent;
  public areaChartOptions!: Partial<areaChartOptions>;
  public linechartOptions!: Partial<linechartOptions>;
  public performanceChartOptions!: Partial<linechartOptions>;
  public revenueChartOptions!: Partial<ApexOptions>;
  public appointmentsChartOptions!: Partial<donutChartOptions>;
  confirmedAppointmentsCount = 0;
  appointmentStatusBreakdown: Array<{ status: string; count: number }> = [];
  todayInsuranceTotal = 0;
  todayCashTotal = 0;
  todayRevenueTotal = 0;
  doctorName = '';
  doctorSpecialty = '';
  patientCount = 0;
  calendarAppointments: Appointment[] = [];
  todayAppointments: Appointment[] = [];

  private readonly appointmentsService = inject(AppointmentsService);
  private revenueEntries: Array<{
    amount: number;
    date: string;
    hasInsurance: boolean;
  }> = [
    {
      amount: 1250,
      date: new Date().toISOString(),
      hasInsurance: true,
    },
    {
      amount: 600,
      date: new Date().toISOString(),
      hasInsurance: false,
    },
    {
      amount: 900,
      date: new Date().toISOString(),
      hasInsurance: true,
    },
    {
      amount: 400,
      date: new Date().toISOString(),
      hasInsurance: false,
    },
    // Older entry to ensure only today's items are counted
    {
      amount: 700,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      hasInsurance: true,
    },
  ];
  private readonly auth = inject(AuthService);
  private readonly patientsService = inject(PatientsService);

  constructor() {}

  ngOnInit() {
    this.chart1();
    this.chart3();
    this.doctorName = this.auth.currentUserValue?.name ?? 'Doctor';
    this.doctorSpecialty =
      this.auth.currentUserValue?.roles?.[0]?.name ?? 'Medical Specialist';
    this.computeAppointmentStatusCounts();
    this.initAppointmentsChart();
    this.computeTodayRevenueTotals();
    this.initPerformanceChart();
    this.initRevenueChart();
    this.fetchPatientCount();
    this.fetchCalendarAppointments();
  }

  // TODO start

  onTodoToggled(todo: any) {
    console.log('Todo toggled:', todo);
  }

  onTodosUpdated(updatedTodos: any[]) {
    console.log('Todos updated:', updatedTodos);
  }
  // TODO end

  private chart1() {
    this.areaChartOptions = {
      series: [
        {
          name: 'New Patients',
          data: [31, 40, 28, 51, 42, 85, 77],
        },
        {
          name: 'Old Patients',
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#7D4988', '#66BB6A'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z',
        ],
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 0,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
  }
  private chart3() {
    this.linechartOptions = {
      series: [
        {
          name: 'Male',
          data: [44, 55, 57, 56, 61, 58],
        },
        {
          name: 'Female',
          data: [76, 85, 101, 98, 87, 105],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#786BED', '#AEAEAE'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
      yaxis: {},
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private initAppointmentsChart() {
    const breakdown = this.appointmentStatusBreakdown.length
      ? this.appointmentStatusBreakdown
      : [{ status: 'Scheduled', count: 0 }];

    this.appointmentsChartOptions = {
      series: breakdown.map((item) => item.count),
      chart: {
        type: 'donut',
        height: 130,
      },
      labels: breakdown.map((item) => item.status),
      colors: breakdown.map((item) => this.getStatusColor(item.status)),
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
    };
  }

  private initPerformanceChart() {
    this.performanceChartOptions = {
      series: [
        {
          name: 'Patients',
          data: [22, 28, 24, 19, 26, 24, 20],
        },
      ],
      chart: {
        height: 130,
        type: 'bar',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#4CAF50'],
      plotOptions: {
        bar: {
          columnWidth: '50%',
          borderRadius: 2,
        },
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
    };
  }

  private initRevenueChart() {
    this.revenueChartOptions = {
      series: [
        {
          name: 'Con seguro',
          data: [this.todayInsuranceTotal],
        },
        {
          name: 'Sin seguro',
          data: [this.todayCashTotal],
        },
      ],
      chart: {
        height: 140,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          borderRadius: 3,
        },
      },
      colors: ['#4CAF50', '#2196F3'],
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `$${Math.round(val)}`,
        style: {
          colors: ['#fff'],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: ['Hoy'],
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
    };
  }

  private computeTodayRevenueTotals(): void {
    const now = new Date();
    const isSameDay = (date: Date) =>
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    const todaysEntries = this.revenueEntries.filter((entry) =>
      isSameDay(new Date(entry.date))
    );

    this.todayInsuranceTotal = todaysEntries
      .filter((entry) => entry.hasInsurance)
      .reduce((sum, entry) => sum + entry.amount, 0);

    this.todayCashTotal = todaysEntries
      .filter((entry) => !entry.hasInsurance)
      .reduce((sum, entry) => sum + entry.amount, 0);

    this.todayRevenueTotal = this.todayInsuranceTotal + this.todayCashTotal;
  }

  private fetchPatientCount(): void {
    this.patientsService
      .getPatients(1, 1)
      .subscribe({
        next: (collection) => {
          this.patientCount = collection.totalCount ?? 0;
        },
        error: () => {
          this.patientCount = 0;
        },
      });
  }

  private fetchCalendarAppointments(): void {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)).toISOString();
    const endOfMonth = new Date(
      Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    ).toISOString();

    this.appointmentsService.getAppointmentsForRange(startOfMonth, endOfMonth).subscribe({
      next: (appointments) => {
        this.calendarAppointments = appointments ?? [];
        this.computeAppointmentStatusCounts();
        this.confirmedAppointmentsCount = this.calendarAppointments.filter(
          (appointment) => appointment.status?.toString().toLowerCase() === 'confirmed'
        ).length;
        this.initAppointmentsChart();
        this.todayAppointments = (appointments ?? []).filter((appt) => {
          const date = new Date(appt.startsAtUtc);
          const today = new Date();
          return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
          );
        });
      },
      error: () => {
        this.calendarAppointments = [];
        this.todayAppointments = [];
        this.appointmentStatusBreakdown = [];
        this.confirmedAppointmentsCount = 0;
        this.initAppointmentsChart();
      },
    });
  }

  private computeAppointmentStatusCounts(): void {
    const statusOrder = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'NoShow'];
    const counts = new Map<string, number>();

    this.calendarAppointments.forEach((appointment) => {
      const status = appointment.status?.toString() ?? 'Scheduled';
      counts.set(status, (counts.get(status) ?? 0) + 1);
    });

    this.appointmentStatusBreakdown = statusOrder
      .map((status) => ({
        status,
        count: counts.get(status) ?? 0,
      }))
      .filter((item) => item.count > 0);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Scheduled':
        return '#42A5F5';
      case 'Confirmed':
        return '#9C27B0';
      case 'Completed':
        return '#66BB6A';
      case 'Cancelled':
        return '#EF5350';
      case 'NoShow':
        return '#FFA726';
      default:
        return '#78909C';
    }
  }

}
