import { Component, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
})
export class DoctorProfileComponent implements OnInit {
  doctorProfile: DoctorProfile | undefined;
  performanceMetrics: PerformanceMetric[] = [];
  patientFeedbacks: PatientFeedback[] = [];

  // Column definitions for tables
  appointmentColumns: string[] = [
    'patient',
    'date',
    'purpose',
    'status',
    'actions',
  ];
  feedbackColumns: string[] = ['patient', 'date', 'rating', 'comment'];

  constructor() {
    // constructor code
  }

  ngOnInit() {
    this.loadDoctorProfile();
    this.loadPerformanceMetrics();
    this.loadPatientFeedbacks();
  }

  loadDoctorProfile() {
    // In a real app, this would come from a service
    this.doctorProfile = {
      id: 1,
      name: 'Dr. John Smith',
      title: 'MD',
      specialty: 'Cardiologist',
      image: 'assets/images/user/user3.jpg',
      email: 'john.smith@example.com',
      phone: '+1 (123) 456-7890',
      address: '123 Medical Center Dr, New York, NY 10001',
      about:
        'Dr. Smith is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. He specializes in interventional cardiology and has performed over 1,000 cardiac catheterizations and stent placements. Dr. Smith is dedicated to providing compassionate care and the latest evidence-based treatments to his patients.',
      socialStats: {
        following: 564,
        followers: 18000,
        posts: 565,
      },
      skills: [
        {
          name: 'Cardiac Catheterization',
          percentage: 95,
          colorClass: 'l-bg-green',
        },
        { name: 'Echocardiography', percentage: 85, colorClass: 'l-bg-orange' },
        { name: 'Patient Care', percentage: 90, colorClass: 'l-bg-cyan' },
        { name: 'Research', percentage: 70, colorClass: 'l-bg-purple' },
      ],
      education: [
        { degree: 'M.D.', institution: 'Harvard Medical School', year: '2005' },
        {
          degree: 'Residency in Internal Medicine',
          institution: 'Massachusetts General Hospital',
          year: '2008',
        },
        {
          degree: 'Fellowship in Cardiovascular Disease',
          institution: 'Cleveland Clinic',
          year: '2011',
        },
        {
          degree: 'Fellowship in Interventional Cardiology',
          institution: 'Johns Hopkins Hospital',
          year: '2012',
        },
      ],
      experience: [
        {
          position: 'Chief of Cardiology',
          hospital: 'New York Medical Center',
          duration: '2018 - Present',
          description:
            'Leading the cardiology department and overseeing a team of 15 cardiologists.',
        },
        {
          position: 'Senior Cardiologist',
          hospital: 'Mount Sinai Hospital',
          duration: '2012 - 2018',
          description:
            'Specialized in complex coronary interventions and structural heart disease.',
        },
        {
          position: 'Cardiology Fellow',
          hospital: 'Cleveland Clinic',
          duration: '2009 - 2012',
          description:
            'Completed advanced training in cardiovascular medicine and interventional procedures.',
        },
      ],
      certifications: [
        {
          name: 'Board Certification in Cardiovascular Disease',
          issuer: 'American Board of Internal Medicine',
          year: '2011',
          expiryDate: '2031',
        },
        {
          name: 'Board Certification in Interventional Cardiology',
          issuer: 'American Board of Internal Medicine',
          year: '2012',
          expiryDate: '2032',
        },
        {
          name: 'Advanced Cardiac Life Support (ACLS)',
          issuer: 'American Heart Association',
          year: '2020',
          expiryDate: '2022',
        },
        {
          name: 'Fellow of the American College of Cardiology (FACC)',
          issuer: 'American College of Cardiology',
          year: '2015',
        },
      ],
    };
  }

  loadPerformanceMetrics() {
    this.performanceMetrics = [
      {
        name: 'Patients',
        value: '1,286',
        target: '1,500',
        trend: 'up',
        trendValue: 12,
        icon: 'people',
        colorClass: 'bg-green',
      },
      {
        name: 'Surgeries',
        value: '96',
        target: '100',
        trend: 'up',
        trendValue: 8,
        icon: 'medical_services',
        colorClass: 'bg-orange',
      },
      {
        name: 'Success Rate',
        value: '95%',
        target: '90%',
        trend: 'up',
        trendValue: 5,
        icon: 'trending_up',
        colorClass: 'bg-cyan',
      },
      {
        name: 'Avg. Wait Time',
        value: '15 min',
        target: '20 min',
        trend: 'down',
        trendValue: 25,
        icon: 'schedule',
        colorClass: 'bg-purple',
      },
    ];
  }

  loadPatientFeedbacks() {
    this.patientFeedbacks = [
      {
        id: 1,
        patientName: 'Jennifer Adams',
        patientImage: 'assets/images/user/user6.jpg',
        date: '2023-05-28',
        rating: 5,
        comment:
          'Dr. Smith is an excellent cardiologist. He took the time to explain my condition and treatment options in detail. Highly recommended!',
      },
      {
        id: 2,
        patientName: 'Thomas Moore',
        patientImage: 'assets/images/user/user7.jpg',
        date: '2023-05-20',
        rating: 4,
        comment:
          'Very professional and knowledgeable. The wait time was a bit long, but the care was worth it.',
      },
      {
        id: 3,
        patientName: 'Lisa Garcia',
        patientImage: 'assets/images/user/user8.jpg',
        date: '2023-05-15',
        rating: 5,
        comment:
          'Dr. Smith performed my cardiac catheterization with great skill. I felt comfortable and well-cared for throughout the procedure.',
      },
      {
        id: 4,
        patientName: 'David Martinez',
        patientImage: 'assets/images/user/user9.jpg',
        date: '2023-05-10',
        rating: 3,
        comment:
          'Good doctor, but the office staff could be more organized. Had to wait over 30 minutes past my appointment time.',
      },
    ];
  }

  // Track by functions for ngFor performance optimization
  trackByMetricId(index: number, item: PerformanceMetric): string {
    return item.name;
  }

  trackByFeedbackId(index: number, item: PatientFeedback): number {
    return item.id;
  }

  trackBySkillName(index: number, item: Skill): string {
    return item.name;
  }

  trackByEducation(index: number, item: Education): string {
    return `${item.degree}-${item.institution}-${item.year}`;
  }

  trackByExperience(index: number, item: Experience): string {
    return `${item.position}-${item.hospital}`;
  }

  trackByCertification(index: number, item: Certification): string {
    return `${item.name}-${item.issuer}-${item.year}`;
  }

  trackByStar(index: number, star: number): number {
    return star;
  }
}

// Interfaces
interface DoctorProfile {
  id: number;
  name: string;
  title: string;
  specialty: string;
  image: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  socialStats: SocialStats;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Experience {
  position: string;
  hospital: string;
  duration: string;
  description?: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
  expiryDate?: string;
}

interface SocialStats {
  following: number;
  followers: number;
  posts: number;
}

interface Skill {
  name: string;
  percentage: number;
  colorClass: string;
}

interface PatientFeedback {
  id: number;
  patientName: string;
  patientImage: string;
  date: string;
  rating: number;
  comment: string;
}

interface PerformanceMetric {
  name: string;
  value: string;
  target: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  icon: string;
  colorClass: string;
}
