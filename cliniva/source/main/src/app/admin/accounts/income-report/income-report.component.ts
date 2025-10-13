
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
  ApexLegend,
  ApexResponsive,
  ApexPlotOptions,
  ApexFill,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';

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

export interface DepartmentRevenue {
  department: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  yearly: number;
}

interface DepartmentData {
  year: number;
  data: DepartmentRevenue[];
}

@Component({
    selector: 'app-income-report',
    imports: [
        BreadcrumbComponent,
        MatCardModule,
        MatSelectModule,
        NgApexchartsModule,
        MatTableModule
    ],
    templateUrl: './income-report.component.html',
    styleUrl: './income-report.component.scss'
})
export class IncomeReportComponent implements OnInit {
  public areaChartOptions!: Partial<ChartOptions>;
  selectedTimePeriod: string = 'Monthly'; // Default value
  selectedYear: number = 2024; // Default year
  availableYears: number[] = [2020, 2021, 2022, 2023, 2024];
  departmentData: DepartmentData[] = [];

  displayedColumns: string[] = [
    'department',
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
    'yearly',
  ];
  dataSource!: MatTableDataSource<DepartmentRevenue>;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private http: HttpClient) {
    this.chart1();
  }

  ngOnInit() {
    this.loadDepartmentData();
  }

  loadDepartmentData() {
    this.http
      .get<{ departments: DepartmentData[] }>('assets/data/income-report.json')
      .subscribe((data) => {
        this.departmentData = data.departments;
        this.availableYears = this.departmentData.map((item) => item.year);
        this.updateTableData();
      });
  }

  updateTableData() {
    const yearData = this.departmentData.find(
      (item) => item.year === this.selectedYear
    );
    if (yearData) {
      this.dataSource = new MatTableDataSource(yearData.data);
      this.dataSource.sort = this.sort;
    }
  }

  onYearChange(event: any) {
    this.selectedYear = event.value;
    this.updateTableData();
    this.chart1(); // Update chart if needed
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  onTimePeriodChange(event: any): void {
    this.chart1();
  }

  private chart1() {
    let categories: string[] = [];
    let incomeData: number[] = [];

    switch (this.selectedTimePeriod) {
      case 'Daily':
        categories = [
          '2024-11-01',
          '2024-11-02',
          '2024-11-03',
          '2024-11-04',
          '2024-11-05',
          '2024-11-06',
          '2024-11-07',
        ];
        incomeData = [5, 8, 6, 4, 7, 9, 10];
        break;

      case 'Monthly':
        categories = [
          '2024-01',
          '2024-02',
          '2024-03',
          '2024-04',
          '2024-05',
          '2024-06',
          '2024-07',
        ];
        incomeData = [31, 40, 28, 51, 42, 85, 77];
        break;

      case 'Yearly':
        categories = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
        incomeData = [200, 250, 300, 450, 600, 700, 800];
        break;
    }

    this.areaChartOptions = {
      series: [
        {
          name: 'Income',
          data: incomeData,
        },
      ],
      chart: {
        height: 250,
        type: 'area',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#407fe4'],
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        categories: categories,
        labels: {
          show: true,
          offsetX: 20,
          offsetY: 0,
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
}
