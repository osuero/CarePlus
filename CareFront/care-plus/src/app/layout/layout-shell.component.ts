import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent, SidebarMenuItem } from './sidebar/sidebar.component';

const PAGE_TITLES: Record<string, string> = {
  '/users': 'users.title',
  '/users/register': 'userRegistration.title'
};

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './layout-shell.component.html',
  styleUrls: ['./layout-shell.component.scss']
})
export class LayoutShellComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  sidebarOpen = signal(true);
  private readonly currentUrl = signal(this.router.url || '/users');

  readonly menu: SidebarMenuItem[] = [
    { icon: 'group', labelKey: 'nav.users', link: '/users' },
    { icon: 'person_add', labelKey: 'nav.registerUser', link: '/users/register' }
  ];

  readonly pageTitleKey = computed(() => {
    const url = this.currentUrl();
    const match = Object.keys(PAGE_TITLES).find((path) => url.startsWith(path));
    return match ? PAGE_TITLES[match] : 'app.name';
  });

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentUrl.set(this.router.url || '/users');
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }
}
