import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgScrollbar } from 'ngx-scrollbar';

export interface HandoffNote {
  img: string;
  sender: string;
  timestamp: string;
  message: string;
  priority: string;
  priorityClass: string; // e.g. 'high-priority' | 'medium-priority' | 'low-priority'
}

@Component({
  selector: 'app-handoff-notes',
  templateUrl: './handoff-notes.component.html',
  styleUrls: ['./handoff-notes.component.scss'],
  imports: [MatCardModule, NgScrollbar, MatIconModule, NgClass, CommonModule],
})
export class HandoffNotesComponent {
  @Input() notes: HandoffNote[] = [];

  onAddNote(event: Event) {
    event.preventDefault();
    // emit or handle "add note" event if needed
    console.log('Add Note clicked');
  }
}
