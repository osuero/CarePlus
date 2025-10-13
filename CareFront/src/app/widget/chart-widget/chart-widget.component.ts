import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  ApexStroke,
  ApexLegend,
  ApexPlotOptions,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexGrid,
  ApexMarkers,
} from 'ng-apexcharts';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { StatisticCard1Component } from '@shared/components/statistic-card1/statistic-card1.component';
import { OrderInfoBoxComponent } from '@shared/components/order-info-box/order-info-box.component';
import { IncomeInfoBoxComponent } from '@shared/components/income-info-box/income-info-box.component';
import { ChartCard4Component } from '@shared/components/chart-card4/chart-card4.component';
import { AttendanceChartComponent } from '@shared/components/attendance-chart/attendance-chart.component';
import { InfoBox1Component } from '@shared/components/info-box1/info-box1.component';
import { InflowOutflowWidgetComponent } from '@shared/components/inflow-outflow-widget/inflow-outflow-widget.component';
import { AppointmentTrendsWidgetComponent } from '@shared/components/appointment-trends-widget/appointment-trends-widget.component';
import { BedOccupancyComponent } from '@shared/components/bed-occupancy/bed-occupancy.component';
import {
  MonthlyScheduleComponent,
  ScheduleActivity,
} from '@shared/components/monthly-schedule/monthly-schedule.component';
import { ChartCard5Component } from '@shared/components/chart-card5/chart-card5.component';
import { ChartCard6Component } from '@shared/components/chart-card6/chart-card6.component';
import { ChartCard1Component } from '@shared/components/chart-card1/chart-card1.component';
import { ChartCard2Component } from '@shared/components/chart-card2/chart-card2.component';
import {
  FeedbackData,
  FeedbackWidgetComponent,
} from '@shared/components/feedback-widget/feedback-widget.component';
import {
  ScheduleItem,
  ScheduleWidgetComponent,
} from '@shared/components/schedule-widget/schedule-widget.component';
import { NgScrollbar } from 'ngx-scrollbar';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  grid: ApexGrid;
  colors: string[];
};

export type circleChartOptions = {
  series?: ApexNonAxisChartSeries;
  chart?: ApexChart;
  labels?: string[];
  colors?: string[];
  legend?: ApexLegend;
  plotOptions?: ApexPlotOptions;
  responsive: ApexResponsive[];
};
export type radarChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  title?: ApexTitleSubtitle;
  stroke?: ApexStroke;
  fill?: ApexFill;
  markers?: ApexMarkers;
  xaxis?: ApexXAxis;
};
export type areaChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  stroke?: ApexStroke;
  grid?: ApexGrid;
  tooltip?: ApexTooltip;
  legend?: ApexLegend;
  dataLabels?: ApexDataLabels;
};
export type pieChartOptions = {
  series?: ApexNonAxisChartSeries;
  chart?: ApexChart;
  legend?: ApexLegend;
  dataLabels?: ApexDataLabels;
  responsive?: ApexResponsive[];
  labels?: string[];
};
export type avgPetChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  markers?: ApexMarkers;
  colors?: string[];
  yaxis?: ApexYAxis;
  grid?: ApexGrid;
  tooltip?: ApexTooltip;
  legend?: ApexLegend;
  fill?: ApexFill;
  title?: ApexTitleSubtitle;
};
@Component({
  selector: 'app-chart-widget',
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.scss'],
  imports: [
    BreadcrumbComponent,
    NgApexchartsModule,
    MatCardModule,
    NgScrollbar,
    StatisticCard1Component,
    OrderInfoBoxComponent,
    IncomeInfoBoxComponent,
    AttendanceChartComponent,
    ChartCard4Component,
    InfoBox1Component,
    InflowOutflowWidgetComponent,
    AppointmentTrendsWidgetComponent,
    BedOccupancyComponent,
    MonthlyScheduleComponent,
    ChartCard5Component,
    ChartCard6Component,
    ChartCard1Component,
    ChartCard2Component,
    FeedbackWidgetComponent,
    ScheduleWidgetComponent,
  ],
})
export class ChartWidgetComponent implements OnInit {
  public radarChartOptions: Partial<radarChartOptions>;
  public circleChartOptions: Partial<circleChartOptions>;
  public areaChartOptions: Partial<areaChartOptions>;
  public pieChartOptions: Partial<pieChartOptions>;
  public avgPetChartOptions: Partial<avgPetChartOptions>;
  public smallChart1Options!: Partial<ChartOptions>;
  public smallChart2Options!: Partial<ChartOptions>;
  public smallChart3Options!: Partial<ChartOptions>;
  public smallChart4Options!: Partial<ChartOptions>;

  demoActivityData: { [date: string]: ScheduleActivity[] } = {};

  title = 'Room Status';
  subtitle = 'Room status for patients in the hospital';

  title2 = 'Patient chart';
  subtitle2 = 'Number of patients visited the last 5 years in the hospital';

  @ViewChild('chart', { static: true }) chart!: ChartComponent;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
    //radar Chart
    this.radarChartOptions = {
      series: [
        {
          name: 'Blue',
          data: [80, 50, 30, 40, 100, 20],
        },
        {
          name: 'Green',
          data: [20, 30, 40, 80, 20, 80],
        },
        {
          name: 'Orange',
          data: [44, 76, 78, 13, 43, 10],
        },
      ],
      chart: {
        height: 240,
        type: 'radar',
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1,
        },
      },
      stroke: {
        width: 0,
      },
      fill: {
        opacity: 0.4,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        categories: ['2011', '2012', '2013', '2014', '2015', '2016'],
      },
    };

    // pie chart

    this.circleChartOptions = {
      series: [76, 67, 61, 90],
      chart: {
        height: 300,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      colors: ['#FF4560', '#775DD0', '#00E396', '#FEB019'],
      labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
      legend: {
        show: true,
        floating: true,
        fontSize: '12px',
        position: 'left',
        offsetX: 10,
        offsetY: 10,
        labels: {
          useSeriesColors: true,
        },
        itemMargin: {
          horizontal: 3,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    };

    // area chart

    this.areaChartOptions = {
      chart: {
        height: 240,
        type: 'area',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      series: [
        {
          name: 'series1',
          data: [31, 40, 28, 51, 42],
        },
        {
          name: 'series2',
          data: [11, 32, 45, 32, 34],
        },
      ],
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        type: 'datetime',
        categories: ['1990', '1991', '1992', '1993', '1994'],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };

    // pie chart

    this.pieChartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: 'donut',
        width: 300,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['Science', 'Mathes', 'Economics', 'History', 'Music'],
      responsive: [
        {
          breakpoint: 480,
          options: {},
        },
      ],
    };

    //avgPetChartOptions

    this.avgPetChartOptions = {
      series: [
        {
          name: 'Avg. Patient',
          data: [65, 72, 62, 73, 66, 74, 63, 67],
        },
      ],
      chart: {
        height: 340,
        type: 'line',
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
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'July', 'Aug'],
        title: {
          text: 'Weekday',
        },
      },
      yaxis: {
        title: {
          text: 'Avg. Lecture',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#35fdd8'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      markers: {
        size: 4,
        colors: ['#FFA41B'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        },
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

  ngOnInit() {
    const today = new Date();
    this.generateDemoData(today.getFullYear(), today.getMonth());

    this.smallChart1();
    this.smallChart2();
    this.smallChart3();
    this.smallChart4();
  }

  initialDate: Date = new Date();
  currentYear: number = this.initialDate.getFullYear();
  currentMonth: number = this.initialDate.getMonth();

  handleDateChange(date: Date) {
    // Handle the date change event from the monthly schedule component
    console.log('Selected date:', date);
    // You can add logic here to fetch or update activities for the selected date
  }

  generateDemoData(year: number, month: number) {
    const totalDays = new Date(year, month + 1, 0).getDate();

    const samplePatients = [
      'John Doe',
      'Jane Smith',
      'Alice Brown',
      'Bob Johnson',
      'Eva Green',
      'Tom White',
    ];
    const sampleDoctors = ['Dr. Patel', 'Dr. Mehta', 'Dr. Sharma', 'Dr. Verma'];
    const sampleTypes = [
      'Routine Check-Up',
      'Follow-Up Visit',
      'Consultation',
      'Meeting',
      'Task',
    ];
    const sampleColors = [
      '#00bcd4',
      '#ffb4b4',
      '#b2f2e5',
      '#ffd54f',
      '#81c784',
    ];

    for (let day = 1; day <= totalDays; day++) {
      const dateKey = new Date(year, month, day).toISOString().slice(0, 10);
      const activityCount = Math.floor(Math.random() * 4) + 3; // Always 3 to 6

      const activities: ScheduleActivity[] = [];

      for (let i = 0; i < activityCount; i++) {
        const patientName =
          samplePatients[Math.floor(Math.random() * samplePatients.length)];
        const doctorName =
          sampleDoctors[Math.floor(Math.random() * sampleDoctors.length)];
        const type =
          sampleTypes[Math.floor(Math.random() * sampleTypes.length)];
        const timeHour = 9 + i;
        const time = `${timeHour < 10 ? '0' : ''}${timeHour}:00 AM`;
        const color =
          sampleColors[Math.floor(Math.random() * sampleColors.length)];

        activities.push({
          id: `${day}-${i}`,
          title: patientName,
          type,
          time,
          color,
          patientName,
          doctorName,
        });
      }

      this.demoActivityData[dateKey] = activities;
    }
  }

  private smallChart1() {
    this.smallChart1Options = {
      series: [
        {
          name: 'Appointments',
          data: [
            50, 61, 80, 50, 72, 52, 60, 41, 30, 45, 70, 40, 93, 63, 50, 62,
          ],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#6F42C1'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
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

  private smallChart2() {
    this.smallChart2Options = {
      series: [
        {
          name: 'Operations',
          data: [5, 6, 8, 5, 7, 5, 6, 4, 3, 4, 7, 4, 9, 6, 5, 6],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#FD7E14'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
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

  private smallChart3() {
    this.smallChart3Options = {
      series: [
        {
          name: 'New Patients',
          data: [
            50, 61, 80, 50, 72, 52, 60, 41, 30, 45, 70, 40, 93, 63, 50, 62,
          ],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#4CAF50'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
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

  private smallChart4() {
    this.smallChart4Options = {
      series: [
        {
          name: 'Earning',
          data: [
            150, 161, 180, 150, 172, 152, 160, 141, 130, 145, 170, 140, 193,
            163, 150, 162,
          ],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#2196F3'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
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

  patientFeedback: FeedbackData = {
    score: 4.8,
    series: [68, 24, 8],
    labels: ['Excellent', 'Good', 'Poor'],
    colors: ['#4CAF50', '#FFC107', '#F44336'],
  };

  todaySchedule: ScheduleItem[] = [
    {
      id: '1',
      startTime: '08:00',
      endTime: '10:30',
      title: 'Morning Rounds',
      subtitle: 'Patient check-ups and consultations',
      type: 'working',
      location: 'Ward 3, Floor 2',
      description: 'Regular morning rounds with nursing staff',
      icon: 'medical_services',
    },
    {
      id: '2',
      startTime: '10:30',
      endTime: '11:00',
      title: 'Coffee Break',
      type: 'break',
      location: "Doctor's Lounge",
    },
    {
      id: '3',
      startTime: '11:00',
      endTime: '13:00',
      title: 'Patient Consultations',
      subtitle: 'Scheduled appointments',
      type: 'working',
      location: 'Room 205',
      description: 'Individual patient consultations and follow-ups',
    },
    {
      id: '4',
      startTime: '13:00',
      endTime: '14:00',
      title: 'Lunch Break',
      type: 'break',
      location: 'Cafeteria',
    },
    {
      id: '5',
      startTime: '14:00',
      endTime: '17:30',
      title: 'Surgical Procedures',
      subtitle: 'Scheduled surgeries',
      type: 'urgent',
      location: 'OR 3',
      description: 'Two scheduled surgical procedures',
      icon: 'vaccines',
    },
    {
      id: '6',
      startTime: '18:00',
      endTime: '19:00',
      title: 'Team Meeting',
      subtitle: 'Weekly department meeting',
      type: 'meeting',
      location: 'Conference Room A',
      description: 'Discuss patient cases and department updates',
    },
  ];
}
