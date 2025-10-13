import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TenantService } from '../shared/services/tenant.service';

interface NavigationItem {
  icon: string;
  labelKey: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  private readonly translate = inject(TranslateService);
  private readonly tenantService = inject(TenantService);

  protected readonly navigation: NavigationItem[] = [
    {
      icon: 'ti ti-users-group',
      labelKey: 'nav.users',
      route: '/users',
      exact: true
    },
    {
      icon: 'ti ti-user-plus',
      labelKey: 'nav.registerUser',
      route: '/users/register',
      exact: true
    }
  ];

  protected readonly languages = [
    { code: 'es', label: 'ESP' },
    { code: 'en', label: 'ENG' }
  ];

  protected readonly tenants = [
    { id: 'default', labelKey: 'userRegistration.tenantOptions.default' },
    { id: 'clinic-a', labelKey: 'userRegistration.tenantOptions.clinicA' },
    { id: 'clinic-b', labelKey: 'userRegistration.tenantOptions.clinicB' }
  ];

  protected readonly navCollapsed = signal(false);
  protected readonly navCollapsedMob = signal(false);
  protected readonly isLanguageDropdownOpen = signal(false);

  protected readonly activeLanguage = computed(
    () => this.translate.currentLang || this.translate.defaultLang || 'es'
  );
  protected readonly activeTenant = this.tenantService.tenant$;
  protected readonly currentYear = new Date().getFullYear();

  constructor() {
    document.documentElement.lang = this.activeLanguage();
  }

  toggleDesktopMenu(): void {
    this.navCollapsed.update((value) => !value);
  }

  toggleMobileMenu(): void {
    this.navCollapsedMob.update((value) => !value);
  }

  closeMenu(): void {
    this.navCollapsedMob.set(false);
  }

  toggleLanguageDropdown(): void {
    this.isLanguageDropdownOpen.update((value) => !value);
  }

  closeLanguageDropdown(): void {
    this.isLanguageDropdownOpen.set(false);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
    document.documentElement.lang = language;
    this.closeLanguageDropdown();
  }

  changeTenant(tenant: string): void {
    this.tenantService.setTenant(tenant);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    if (!target.closest('.language-dropdown')) {
      this.closeLanguageDropdown();
    }
  }
}
