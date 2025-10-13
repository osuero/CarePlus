import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexFill,
  NgApexchartsModule,
  ApexPlotOptions,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';
import { NgScrollbar } from 'ngx-scrollbar';
import { BaseChartDirective } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ReportCardWidgetComponent } from '@shared/components/report-card-widget/report-card-widget.component';
import { MatCardModule } from '@angular/material/card';
import { PatientGroupListComponent } from '@shared/components/patient-group-list/patient-group-list.component';
import { RecentCommentsComponent } from '@shared/components/recent-comments/recent-comments.component';
import { RecentActivityComponent } from '@shared/components/recent-activity/recent-activity.component';
import { ChartCard1Component } from '@shared/components/chart-card1/chart-card1.component';
import { ChartCard2Component } from '@shared/components/chart-card2/chart-card2.component';
import { ChartCard3Component } from '@shared/components/chart-card3/chart-card3.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  series2?: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  responsive?: ApexResponsive[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  fill: ApexFill;
  labels?: string[];
  plotOptions: ApexPlotOptions;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss'],
  imports: [
    BreadcrumbComponent,
    NgApexchartsModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    BaseChartDirective,
    NgScrollbar,
    ReportCardWidgetComponent,
    PatientGroupListComponent,
    RecentCommentsComponent,
    RecentActivityComponent,
    ChartCard1Component,
    ChartCard2Component,
    ChartCard3Component,
  ],
})
export class Dashboard2Component implements OnInit {
  public lineChartOptions!: Partial<ChartOptions>;

  title = 'Room Status';
  subtitle = 'Room status for patients in the hospital';

  title2 = 'Patient chart';
  subtitle2 = 'Number of patients visited the last 5 years in the hospital';

  title3 = 'Diseases Chart';
  subtitle3 = 'Number of patients in one day';
  // Doughnut chart start

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };
  public doughnutChartLabels: string[] = ['India', 'USA', 'Itely'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [350, 450, 100],
        backgroundColor: ['#60A3F6', '#7C59E7', '#DD6811'],
      },
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';

  // Doughnut chart end

  constructor() {}
  ngOnInit() {
    this.chart1();
  }

  patientGroups = [
    {
      label: 'C',
      title: 'Cholesterol',
      patientCount: 5,
      colorClass: 'bg-orange',
    },
    {
      label: 'D',
      title: 'Diabetic',
      patientCount: 14,
      colorClass: 'bg-purple',
    },
    {
      label: 'L',
      title: 'Low Blood Pressure',
      patientCount: 10,
      colorClass: 'bg-green',
    },
    {
      label: 'H',
      title: 'Hypertension',
      patientCount: 21,
      colorClass: 'bg-cyan',
    },
    { label: 'M', title: 'Malaria', patientCount: 11, colorClass: 'bg-indigo' },
    {
      label: 'D',
      title: 'Dental Problem',
      patientCount: 17,
      colorClass: 'bg-brown',
    },
    {
      label: 'A',
      title: 'Asthma',
      patientCount: 8,
      colorClass: 'bg-yellow',
    },
    {
      label: 'R',
      title: 'Rheumatoid Arthritis',
      patientCount: 9,
      colorClass: 'bg-red',
    },
    {
      label: 'S',
      title: 'Stroke',
      patientCount: 6,
      colorClass: 'bg-blue',
    },
  ];

  comments = [
    {
      name: 'Dr. Airi Satou',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: '7 hours ago',
      imgSrc: 'assets/images/user/user1.jpg',
      colorClass: 'col-green',
    },
    {
      name: 'Dr. Sarah Smith',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: '1 hour ago',
      imgSrc: 'assets/images/user/user4.jpg',
      colorClass: 'color-primary col-indigo',
    },
    {
      name: 'Cara Stevens',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: 'Yesterday',
      imgSrc: 'assets/images/user/user13.jpg',
      colorClass: 'color-danger col-cyan',
    },
    {
      name: 'Ashton Cox',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: 'Yesterday',
      imgSrc: 'assets/images/user/user17.jpg',
      colorClass: 'color-info col-orange',
      noBorder: true,
    },
    {
      name: 'Dr. Mark Hay',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: '1 hour ago',
      imgSrc: 'assets/images/user/user9.jpg',
      colorClass: 'color-primary col-red',
    },
  ];

  activities = [
    {
      timestamp: '5 mins ago',
      message:
        'Lorem ipsum dolor sit amet conse ctetur which ascing elit users.',
      statusClass: 'sl-primary',
    },
    {
      timestamp: '8 mins ago',
      message:
        'Lorem ipsum dolor sit ametcon the sectetur that ascing elit users.',
      statusClass: 'sl-danger',
    },
    {
      timestamp: '10 mins ago',
      message:
        'Lorem ipsum dolor sit amet cons the ecte tur and adip ascing elit users.',
      statusClass: 'sl-success',
    },
    {
      timestamp: '20 mins ago',
      message:
        'Lorem ipsum dolor sit amet cons the ecte tur and adip ascing elit users.',
      statusClass: 'sl-primary',
    },
    {
      timestamp: '5 mins ago',
      message:
        'Lorem ipsum dolor sit amet conse ctetur which ascing elit users.',
      statusClass: 'sl-success',
    },
  ];

  private chart1() {
    this.lineChartOptions = {
      series: [
        {
          name: 'Doctor 1',
          data: [70, 200, 80, 180, 170, 105, 210],
        },
        {
          name: 'Doctor 2',
          data: [80, 250, 30, 120, 260, 100, 180],
        },
        {
          name: 'Doctor 3',
          data: [85, 130, 85, 225, 80, 190, 120],
        },
      ],
      chart: {
        height: 265,
        type: 'line',
        foreColor: '#9aa0ac',
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
      },
      colors: ['#A5A5A5', '#875692', '#4CB5AC'],
      stroke: {
        curve: 'smooth',
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },

      markers: {
        size: 3,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        title: {
          text: 'Month',
        },
      },
      yaxis: {
        // opposite: true,
        title: {
          text: 'Patients',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
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
}
