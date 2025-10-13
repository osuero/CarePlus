import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
  ProgressTableComponent,
  SubjectProgress,
} from '@shared/components/progress-table/progress-table.component';
import { MatCardModule } from '@angular/material/card';
import { DocumentListComponent } from '@shared/components/document-list/document-list.component';
import { AppointmentWidgetComponent } from '@shared/components/appointment-widget/appointment-widget.component';
import { ReviewWidgetComponent } from '@shared/components/review-widget/review-widget.component';
import { EarningSourceComponent } from '@shared/components/earning-source/earning-source.component';
import { ActivityListComponent } from '@shared/components/activity-list/activity-list.component';
import { AssignTaskComponent } from '@shared/components/assign-task/assign-task.component';
import { NewOrderListComponent } from '@shared/components/new-order-list/new-order-list.component';
import { EmpTaskTabComponent } from '@shared/components/emp-task-tab/emp-task-tab.component';
import { RecentActivityComponent } from '@shared/components/recent-activity/recent-activity.component';
import {
  ChatWidgetComponent,
  Message,
} from '@shared/components/chat-widget/chat-widget.component';
import {
  LatestPostComponent,
  Post,
} from '@shared/components/latest-post/latest-post.component';
import { RecentCommentsComponent } from '@shared/components/recent-comments/recent-comments.component';
import {
  TimelineItem,
  TimelineListComponent,
} from '@shared/components/timeline-list/timeline-list.component';
import { TodoWidgetComponent } from '@shared/components/todo-widget/todo-widget.component';
import { MedicineListComponent } from '@shared/components/medicine-list/medicine-list.component';
import { ReportCardWidgetComponent } from '@shared/components/report-card-widget/report-card-widget.component';
import { DocWelcomeCardComponent } from '@shared/components/doc-welcome-card/doc-welcome-card.component';
import { EventCardComponent } from '@shared/components/event-card/event-card.component';
import { ScheduleCardComponent } from '@shared/components/schedule-card/schedule-card.component';
import { EmpStatusComponent } from '@shared/components/emp-status/emp-status.component';
import { NoticeboardComponent } from '@shared/components/noticeboard/noticeboard.component';
import { ProjectHoursComponent } from '@shared/components/project-hours/project-hours.component';
import { AppointmentCardComponent } from '@shared/components/appointment-card/appointment-card.component';
import { SmallCardChartComponent } from '@shared/components/small-card-chart/small-card-chart.component';
import {
  CriticalAlert,
  CriticalAlertsComponent,
} from '@shared/components/critical-alerts/critical-alerts.component';
import {
  HandoffNote,
  HandoffNotesComponent,
} from '@shared/components/handoff-notes/handoff-notes.component';

interface Task {
  userImage: string;
  userName: string;
  taskDetails: string;
  status: string;
  statusClass: string;
  manager: string;
  progress: number;
  progressClass: string;
}

interface Todo {
  title: string;
  done: boolean;
  priority: 'Low' | 'Normal' | 'High';
}

export interface Medicine {
  name: string;
  icon: string;
  dosage: string;
}

@Component({
  selector: 'app-data-widget',
  templateUrl: './data-widget.component.html',
  styleUrls: ['./data-widget.component.scss'],
  imports: [
    BreadcrumbComponent,
    MatProgressBarModule,
    NgScrollbar,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    ProgressTableComponent,
    DocumentListComponent,
    AppointmentWidgetComponent,
    ReviewWidgetComponent,
    EarningSourceComponent,
    ActivityListComponent,
    AssignTaskComponent,
    NewOrderListComponent,
    EmpTaskTabComponent,
    RecentActivityComponent,
    ChatWidgetComponent,
    LatestPostComponent,
    RecentCommentsComponent,
    TimelineListComponent,
    TodoWidgetComponent,
    MedicineListComponent,
    ReportCardWidgetComponent,
    DocWelcomeCardComponent,
    EventCardComponent,
    ScheduleCardComponent,
    EmpStatusComponent,
    NoticeboardComponent,
    ProjectHoursComponent,
    AppointmentCardComponent,
    SmallCardChartComponent,
    CriticalAlertsComponent,
    HandoffNotesComponent,
  ],
})
export class DataWidgetComponent {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  // TODO start
  tasks: Todo[] = [
    { title: 'Buy groceries', done: false, priority: 'Normal' },
    { title: 'Finish project report', done: false, priority: 'High' },
    { title: 'Clean the house', done: true, priority: 'Low' },
    { title: 'Call the bank', done: false, priority: 'Normal' },
    { title: 'Read a book', done: false, priority: 'Low' },
    { title: 'Schedule doctor appointment', done: false, priority: 'High' },
    { title: 'Prepare for presentation', done: false, priority: 'Normal' },
    { title: 'Exercise for 30 minutes', done: false, priority: 'Normal' },
    { title: 'Finish laundry', done: true, priority: 'Low' },
    { title: 'Write blog post', done: false, priority: 'High' },
    { title: 'Organize workspace', done: false, priority: 'Normal' },
    { title: 'Plan weekend trip', done: false, priority: 'High' },
    { title: 'Buy gifts for friends', done: false, priority: 'Low' },
  ];

  onTodoToggled(todo: any) {
    console.log('Todo toggled:', todo);
  }

  onTodosUpdated(updatedTodos: any[]) {
    console.log('Todos updated:', updatedTodos);
  }
  // TODO end

  // Progress table data

  subjects: SubjectProgress[] = [
    { subject: 'Chemistry', progress: 30, duration: '2 Months' },
    { subject: 'Mathematics', progress: 55, duration: '3 Months' },
    { subject: 'Painting', progress: 67, duration: '1 Month' },
    { subject: 'Business Studies', progress: 70, duration: '2 Months' },
    { subject: 'Biology', progress: 24, duration: '3 Months' },
    { subject: 'Computer Studies', progress: 77, duration: '4 Months' },
    { subject: 'Geography', progress: 41, duration: '2 Months' },
  ];

  // document list

  documentList = [
    {
      title: 'Java Programming',
      type: '.doc',
      size: 4.3,
      icon: 'far fa-file-word',
      iconClass: 'primary-rgba text-primary',
      textClass: '',
    },
    {
      title: 'Angular Theory',
      type: '.xls',
      size: 2.5,
      icon: 'far fa-file-excel',
      iconClass: 'success-rgba text-success',
      textClass: '',
    },
    {
      title: 'Maths Sums Solution',
      type: '.pdf',
      size: 10.5,
      icon: 'far fa-file-pdf',
      iconClass: 'danger-rgba text-danger',
      textClass: '',
    },
    {
      title: 'Submit Science Journal',
      type: '.zip',
      size: 53.2,
      icon: 'far fa-file-archive',
      iconClass: 'info-rgba text-info',
      textClass: '',
    },
    {
      title: 'Marketing Instructions',
      type: '.doc',
      size: 5.3,
      icon: 'far fa-file-word',
      iconClass: 'primary-rgba text-primary',
      textClass: '',
    },
  ];

  // appointment list
  appointmentList = [
    {
      name: 'Cara Stevens',
      diseases: 'Fever',
      date: "12 June '20",
      time: '09:00-10:00',
      imageUrl: 'assets/images/user/user21.jpg',
    },
    {
      name: 'Airi Satou',
      diseases: 'Cholera',
      date: "13 June '20",
      time: '11:00-12:00',
      imageUrl: 'assets/images/user/user12.jpg',
    },
    {
      name: 'Jens Brincker',
      diseases: 'Jaundice',
      date: "15 June '20",
      time: '09:30-10:30',
      imageUrl: 'assets/images/user/user13.jpg',
    },
    {
      name: 'Angelica Ramos',
      diseases: 'Typhoid',
      date: "16 June '20",
      time: '14:00-15:00',
      imageUrl: 'assets/images/user/user14.jpg',
    },
    {
      name: 'Cara Stevens',
      diseases: 'Malaria',
      date: "18 June '20",
      time: '11:00-12:30',
      imageUrl: 'assets/images/user/user15.jpg',
    },
    {
      name: 'Jacob Ryan',
      diseases: 'Infection',
      date: "22 June '20",
      time: '13:00-14:15',
      imageUrl: 'assets/images/user/user16.jpg',
    },
  ];

  // review list

  reviewList = [
    {
      name: 'Alis Smith',
      timeAgo: 'a week ago',
      rating: 3.5,
      comment:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel rutrum ex, at ornare mi. In quis scelerisque dui, eget rhoncus orci. Fusce et sodales ipsum. Nam id nunc euismod, aliquet arcu quis, mattis nisi.',
      imageUrl: 'assets/images/user/user1.jpg',
    },
    {
      name: 'John Dio',
      timeAgo: 'a week ago',
      rating: 2.5,
      comment:
        'Nam quis ligula est. Nunc sed risus non turpis tristique tempor. Ut sollicitudin faucibus magna nec gravida. Suspendisse ullamcorper justo vel porta imperdiet. Nunc nec ipsum vel augue placerat faucibus.',
      imageUrl: 'assets/images/user/user2.jpg',
    },
  ];

  // earning source

  sources = [
    {
      label: 'envato.com',
      percentage: 17,
      class: 'bg-green',
      labelClass: 'bg-green text-white',
    },
    {
      label: 'google.com',
      percentage: 27,
      class: 'bg-red',
      labelClass: 'bg-red text-white',
    },
    {
      label: 'yahoo.com',
      percentage: 25,
      class: 'bg-indigo',
      labelClass: 'bg-indigo text-white',
    },
    {
      label: 'store',
      percentage: 18,
      class: 'bg-orange',
      labelClass: 'bg-orange text-white',
    },
    {
      label: 'Others',
      percentage: 13,
      class: 'bg-dark',
      labelClass: 'bg-dark text-white',
    },
  ];

  // activities

  activities = [
    {
      userImage: 'assets/images/user/user1.jpg',
      userName: 'Sarah Smith',
      label: 'File',
      labelStyle: 'lblFileStyle',
      time: '6 hours ago',
      message: 'hii John, I have upload doc related to task.',
      isActive: true,
    },
    {
      userImage: 'assets/images/user/user2.jpg',
      userName: 'Jalpa Joshi',
      label: 'Task',
      labelStyle: 'lblTaskStyle',
      time: '5 hours ago',
      message: 'Please do as specify. Let me know if you have any query.',
      isActive: false,
    },
    {
      userImage: 'assets/images/user/user3.jpg',
      userName: 'Lina Smith',
      label: 'Comment',
      labelStyle: 'lblCommentStyle',
      time: '6 hours ago',
      message: 'Hey, How are you??',
      isActive: false,
    },
    {
      userImage: 'assets/images/user/user4.jpg',
      userName: 'Jacob Ryan',
      label: 'Reply',
      labelStyle: 'lblReplyStyle',
      time: '7 hours ago',
      message: 'I am fine. You??',
      isActive: true,
    },
    {
      userImage: 'assets/images/user/user5.jpg',
      userName: 'Sarah Smith',
      label: 'File',
      labelStyle: 'lblFileStyle',
      time: '6 hours ago',
      message: 'hii John, I have upload doc related to task.',
      isActive: true,
    },
    {
      userImage: 'assets/images/user/user6.jpg',
      userName: 'Jalpa Joshi',
      label: 'Task',
      labelStyle: 'lblTaskStyle',
      time: '5 hours ago',
      message: 'Please do as specify. Let me know if you have any query.',
      isActive: false,
    },
  ];

  // task

  assignTasks: Task[] = [
    {
      userImage: 'assets/images/user/user1.jpg',
      userName: 'John Deo',
      taskDetails: 'Task A',
      status: 'Doing',
      statusClass: 'bg-green',
      manager: 'John Doe',
      progress: 62,
      progressClass: 'bg-green',
    },
    {
      userImage: 'assets/images/user/user2.jpg',
      userName: 'John Deo',
      taskDetails: 'Task B',
      status: 'To Do',
      statusClass: 'bg-purple',
      manager: 'John Doe',
      progress: 40,
      progressClass: 'bg-purple',
    },
    {
      userImage: 'assets/images/user/user3.jpg',
      userName: 'John Deo',
      taskDetails: 'Task C',
      status: 'On Hold',
      statusClass: 'bg-orange',
      manager: 'John Doe',
      progress: 72,
      progressClass: 'bg-orange',
    },
    {
      userImage: 'assets/images/user/user4.jpg',
      userName: 'John Deo',
      taskDetails: 'Task D',
      status: 'Waiting',
      statusClass: 'bg-cyan',
      manager: 'John Doe',
      progress: 95,
      progressClass: 'bg-cyan',
    },
    {
      userImage: 'assets/images/user/user5.jpg',
      userName: 'John Deo',
      taskDetails: 'Task E',
      status: 'Suspended',
      statusClass: 'bg-green',
      manager: 'John Doe',
      progress: 87,
      progressClass: 'bg-green',
    },
    {
      userImage: 'assets/images/user/user6.jpg',
      userName: 'Jane Smith',
      taskDetails: 'Task F',
      status: 'Doing',
      statusClass: 'bg-green',
      manager: 'John Doe',
      progress: 55,
      progressClass: 'bg-green',
    },
    {
      userImage: 'assets/images/user/user7.jpg',
      userName: 'Emily Johnson',
      taskDetails: 'Task G',
      status: 'To Do',
      statusClass: 'bg-purple',
      manager: 'John Doe',
      progress: 20,
      progressClass: 'bg-purple',
    },
    {
      userImage: 'assets/images/user/user8.jpg',
      userName: 'Michael Brown',
      taskDetails: 'Task H',
      status: 'On Hold',
      statusClass: 'bg-orange',
      manager: 'John Doe',
      progress: 10,
      progressClass: 'bg-orange',
    },
    {
      userImage: 'assets/images/user/user9.jpg',
      userName: 'Sarah Davis',
      taskDetails: 'Task I',
      status: 'Completed',
      statusClass: 'bg-blue',
      manager: 'John Doe',
      progress: 100,
      progressClass: 'bg-blue',
    },
  ];

  // Employee task data

  employeeData = [
    {
      name: 'Sarah Smith',
      imgUrl: 'assets/images/user/user1.jpg',
      tasks: [
        {
          name: 'Task C',
          status: 'Completed',
          statusClass: 'col-green',
          manager: 'John Doe',
          progress: 72,
          progressBarClass: 'l-bg-green',
        },
        {
          name: 'Task A',
          status: 'On Process',
          statusClass: 'col-red',
          manager: 'John Doe',
          progress: 62,
          progressBarClass: 'l-bg-red',
        },
        {
          name: 'Task B',
          status: 'On Hold',
          statusClass: 'col-purple',
          manager: 'John Doe',
          progress: 40,
          progressBarClass: 'l-bg-purple',
        },
        {
          name: 'Task D',
          status: 'Completed',
          statusClass: 'col-green',
          manager: 'John Doe',
          progress: 72,
          progressBarClass: 'l-bg-green',
        },
        {
          name: 'Task E',
          status: 'On Hold',
          statusClass: 'col-purple',
          manager: 'John Doe',
          progress: 40,
          progressBarClass: 'l-bg-purple',
        },
        {
          name: 'Task P',
          status: 'On Hold',
          statusClass: 'col-purple',
          manager: 'John Doe',
          progress: 40,
          progressBarClass: 'l-bg-purple',
        },
        {
          name: 'Task O',
          status: 'On Process',
          statusClass: 'col-red',
          manager: 'John Doe',
          progress: 62,
          progressBarClass: 'l-bg-red',
        },
      ],
    },
    {
      name: 'Jalpa Joshi',
      imgUrl: 'assets/images/user/user2.jpg',
      tasks: [
        {
          name: 'Task D',
          status: 'On Process',
          statusClass: 'col-red',
          manager: 'John Doe',
          progress: 62,
          progressBarClass: 'l-bg-red',
        },
        {
          name: 'Task E',
          status: 'On Hold',
          statusClass: 'col-purple',
          manager: 'John Doe',
          progress: 40,
          progressBarClass: 'l-bg-purple',
        },
        {
          name: 'Task F',
          status: 'Completed',
          statusClass: 'col-green',
          manager: 'John Doe',
          progress: 72,
          progressBarClass: 'l-bg-green',
        },
        {
          name: 'Task G',
          status: 'On Process',
          statusClass: 'col-red',
          manager: 'John Doe',
          progress: 62,
          progressBarClass: 'l-bg-red',
        },
      ],
    },
    {
      name: 'Mark Peter',
      imgUrl: 'assets/images/user/user3.jpg',
      tasks: [
        {
          name: 'Task E',
          status: 'On Hold',
          statusClass: 'col-purple',
          manager: 'John Doe',
          progress: 40,
          progressBarClass: 'l-bg-purple',
        },
        {
          name: 'Task D',
          status: 'On Process',
          statusClass: 'col-red',
          manager: 'John Doe',
          progress: 62,
          progressBarClass: 'l-bg-red',
        },
        {
          name: 'Task F',
          status: 'Completed',
          statusClass: 'col-green',
          manager: 'John Doe',
          progress: 72,
          progressBarClass: 'l-bg-green',
        },
      ],
    },
  ];

  // recent activities

  recentActivities = [
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

  // chat widget

  messages: Message[] = [
    {
      sender: 'Michael',
      text: 'Hi Aiden, how are you? How is the project coming along?',
      time: '10:10 AM',
    },
    {
      sender: 'Aiden',
      text: 'Are we meeting today? Project has been already finished and I have results to show you.',
      time: '10:12 AM',
    },
  ];

  onMessageSent(messageText: string) {
    console.log('Message Sent:', messageText);
  }

  // latest post

  postList: Post[] = [
    {
      image: 'assets/images/posts/post1.jpg',
      title: 'About Something',
      timeAgo: '10 minutes ago',
      description: 'Lorem Ipsum is simply dummy text of the.',
    },
    {
      image: 'assets/images/posts/post2.jpg',
      title: 'Relationship',
      timeAgo: '24 minutes ago',
      description: 'Lorem Ipsum is simply dummy text of the.',
    },
    {
      image: 'assets/images/posts/post3.jpg',
      title: 'Human body',
      timeAgo: '53 minutes ago',
      description: 'Lorem Ipsum is simply dummy text of the.',
    },
  ];

  //recent comments

  comments = [
    {
      name: 'Dr. Airi Satou',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: '7 hours ago',
      imgSrc: 'assets/images/user/user6.jpg',
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
      name: 'Dr. Cara Stevens',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: 'Yesterday',
      imgSrc: 'assets/images/user/user3.jpg',
      colorClass: 'color-danger col-cyan',
    },
    {
      name: 'Dr. Ashton Cox',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: 'Yesterday',
      imgSrc: 'assets/images/user/user7.jpg',
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

  // timeline list

  timelineData: TimelineItem[] = [
    {
      image: 'assets/images/user/user1.jpg',
      title: 'Lorem ipsum dolor sit amet, id quo eruditi.',
      timeAgo: '5 minutes ago',
    },
    {
      image: 'assets/images/user/user2.jpg',
      title: 'Lorem ipsum dolor sit amet, id quo eruditi.',
      timeAgo: '10 minutes ago',
    },
    {
      image: 'assets/images/user/user8.jpg',
      title: 'Lorem ipsum dolor sit amet, id quo eruditi.',
      timeAgo: '20 minutes ago',
    },
    {
      image: 'assets/images/user/user4.jpg',
      title: 'Lorem ipsum dolor sit amet, id quo eruditi.',
      timeAgo: '35 minutes ago',
    },
    {
      image: 'assets/images/user/user5.jpg',
      title: 'Lorem ipsum dolor sit amet, id quo eruditi.',
      timeAgo: '45 minutes ago',
    },
    {
      image: 'assets/images/user/user7.jpg',
      title: 'Lorem ipsum dolor sit amet, id quo eruditi.',
      timeAgo: '1 hour ago',
    },
    {
      image: 'assets/images/user/user3.jpg',
      title: 'Lorem ipsum dolor sit amet, id quo eruditi.',
      timeAgo: '2 hours ago',
    },
    {
      image: 'assets/images/user/user6.jpg',
      title: 'Lorem ipsum dolor sit amet, id quo eruditi.',
      timeAgo: '3 hours ago',
    },
  ];

  // medicine list

  medicineDataSource: Medicine[] = [
    {
      name: 'Econochlor (chloramphenicol-oral)',
      icon: 'fas fa-tablets col-green',
      dosage: '1 - 0 - 1',
    },
    {
      name: 'Desmopressin tabs',
      icon: 'fas fa-capsules col-red',
      dosage: '1 - 1 - 1',
    },
    {
      name: 'Abciximab-injection',
      icon: 'fas fa-syringe col-blue',
      dosage: '1 Daily',
    },
    {
      name: 'Kevzara sarilumab',
      icon: 'fas fa-pills col-orange',
      dosage: '0 - 0 - 1',
    },
    {
      name: 'Gentamicin-topical',
      icon: 'fas fa-capsules col-purple',
      dosage: '1 - 0 - 1',
    },
    {
      name: 'Paliperidone palmitate',
      icon: 'fas fa-tablets col-teal',
      dosage: '1 - 1 - 1',
    },
    {
      name: 'Sermorelin-injectable',
      icon: 'fas fa-syringe col-indigo',
      dosage: '1 Daily',
    },
  ];

  // Events
  events = [
    {
      day: 'Tuesday',
      date: 4,
      month: 'Jan',
      title: 'Science Fair',
      timeStart: '11:00 AM',
      timeEnd: '12:30 PM',
      status: 'Today',
    },
    {
      day: 'Friday',
      date: 12,
      month: 'Jan',
      title: 'Guest Speaker',
      timeStart: '11:00 AM',
      timeEnd: '12:30 PM',
      status: 'In 8 days',
    },
    {
      day: 'Sunday',
      date: 18,
      month: 'Jan',
      title: 'Art Exhibition Opening',
      timeStart: '01:00 PM',
      timeEnd: '02:30 PM',
      status: 'In 11 days',
    },
  ];

  // scheule
  scheduleList = [
    {
      title: 'Cara Stevens',
      dateRange: '23-03-2022 | 28-03-2022',
      statusClass: 'colorStyle1',
    },
    {
      title: 'Airi Satou',
      dateRange: '10-03-2022 | 15-03-2022',
      statusClass: 'colorStyle2',
    },
    {
      title: 'Jens Brincker',
      dateRange: '03-04-2022 | 10-04-2022',
      statusClass: 'colorStyle3',
    },
    {
      title: 'Jacob Ryan',
      dateRange: '11-05-2022 | 15-05-2022',
      statusClass: 'colorStyle4',
    },
    {
      title: 'Ashton Cox',
      dateRange: '17-05-2022 | 21-05-2022',
      statusClass: 'colorStyle1',
    },
    {
      title: 'Mark Hay',
      dateRange: '23-05-2022 | 28-05-2022',
      statusClass: 'colorStyle2',
    },
    {
      title: 'Sanjay Patel',
      dateRange: '11-06-2022 | 15-06-2022',
      statusClass: 'colorStyle3',
    },
  ];

  // Initialize critical alerts with complete data
  criticalAlerts: CriticalAlert[] = [
    {
      id: '1',
      patientName: 'John Smith',
      img: 'assets/images/user/user19.jpg',
      roomNumber: '201-A',
      alertType: 'Vital Signs',
      message: 'Heart rate elevated above normal range',
      time: '10:30 AM',
      timestamp: '10:30 AM',
      severity: 'High',
      severityClass: 'col-red',
      isNew: true,
    },
    {
      id: '2',
      patientName: 'Emily Carter',
      img: 'assets/images/user/user20.jpg',
      roomNumber: '202-B',
      alertType: 'IV Drip',
      message: 'IV fluid running low',
      time: '10:45 AM',
      timestamp: '10:45 AM',
      severity: 'Medium',
      severityClass: 'col-orange',
      isNew: true,
    },
    {
      id: '3',
      patientName: 'Michael Lee',
      img: 'assets/images/user/user21.jpg',
      roomNumber: '203-C',
      alertType: 'Respiratory',
      message: 'Oxygen saturation dropped below 94%',
      time: '10:50 AM',
      timestamp: '10:50 AM',
      severity: 'High',
      severityClass: 'col-red',
      isNew: true,
    },
  ];

  markAlertAsRead(alert: CriticalAlert) {
    alert.isNew = false;
  }

  onViewAlert(alert: CriticalAlert) {
    console.log('Viewing alert:', alert);
  }

  // Data for Handoff Notes
  handoffNotes: HandoffNote[] = [
    {
      timestamp: 'Today, 07:30 AM',
      sender: 'Nurse Johnson',
      img: 'assets/images/user/user19.jpg',
      message:
        'Patient in Room 201 complained of increased pain during night shift. Pain medication administered at 4:30 AM.',
      priority: 'Urgent',
      priorityClass: 'high-priority',
    },
    {
      timestamp: 'Today, 07:45 AM',
      sender: 'Dr. Chen',
      img: 'assets/images/user/user13.jpg',
      message:
        'Please monitor blood glucose levels for patient in Room 105 every 2 hours.',
      priority: 'Important',
      priorityClass: 'medium-priority',
    },
    {
      timestamp: 'Yesterday, 08:15 PM',
      sender: 'Nurse Williams',
      img: 'assets/images/user/user14.jpg',
      message:
        'Patient in Room 310 is scheduled for CT scan at 10:00 AM tomorrow. NPO after midnight.',
      priority: 'Routine',
      priorityClass: 'low-priority',
    },
    {
      timestamp: 'Yesterday, 09:30 PM',
      sender: 'Dr. Miller',
      img: 'assets/images/user/user15.jpg',
      message:
        'New medication orders for patient in Room 202. Please review chart.',
      priority: 'Important',
      priorityClass: 'medium-priority',
    },
  ];
}
