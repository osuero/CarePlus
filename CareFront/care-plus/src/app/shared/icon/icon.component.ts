import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type IconName =
  | 'menu'
  | 'notifications'
  | 'group'
  | 'person_add'
  | 'search'
  | 'arrow_upward'
  | 'arrow_downward'
  | 'unfold_more'
  | 'chevron_left'
  | 'chevron_right';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
}
