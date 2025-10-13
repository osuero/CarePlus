import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserResponse } from '../../shared/models/user.model';
import { UserQueryService } from '../../shared/services/user-query.service';

type SortField = 'firstName' | 'lastName' | 'createdAtUtc';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  private readonly userQueryService = inject(UserQueryService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly isLoading = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly users = signal<UserResponse[]>([]);
  readonly totalCount = signal(0);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly totalPages = signal(1);
  readonly pageNumbers = computed(() => {
    const total = Math.max(this.totalPages(), 1);
    return Array.from({ length: total }, (_, index) => index + 1);
  });

  readonly sortField = signal<SortField>('createdAtUtc');
  readonly sortDirection = signal<SortDirection>('desc');

  readonly sortedUsers = computed(() => {
    const currentUsers = [...this.users()];
    const field = this.sortField();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;

    return currentUsers.sort((a, b) => {
      if (field === 'createdAtUtc') {
        const dateA = new Date(a.createdAtUtc).getTime();
        const dateB = new Date(b.createdAtUtc).getTime();
        return (dateA - dateB) * direction;
      }

      const valueA = (field === 'firstName' ? a.firstName : a.lastName) ?? '';
      const valueB = (field === 'firstName' ? b.firstName : b.lastName) ?? '';
      return valueA.localeCompare(valueB) * direction;
    });
  });

  readonly hasResults = computed(() => this.totalCount() > 0 && this.sortedUsers().length > 0);

  private fetchSubscription?: Subscription;

  constructor() {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.page.set(1);
        this.fetchUsers(value);
      });

    this.fetchUsers();

    this.destroyRef.onDestroy(() => this.fetchSubscription?.unsubscribe());
  }

  changePage(offset: number): void {
    const nextPage = this.page() + offset;
    if (nextPage < 1 || nextPage > this.totalPages()) {
      return;
    }

    this.page.set(nextPage);
    this.fetchUsers(this.searchControl.value);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.page.set(page);
    this.fetchUsers(this.searchControl.value);
  }

  changeSort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDirection.update((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDirection.set(field === 'createdAtUtc' ? 'desc' : 'asc');
    }
  }

  trackByUserId(_: number, user: UserResponse): string {
    return user.id;
  }

  trackByPageNumber(_: number, pageNumber: number): number {
    return pageNumber;
  }

  private fetchUsers(search?: string | null): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.fetchSubscription?.unsubscribe();
    this.fetchSubscription = this.userQueryService
      .fetchUsers({
        page: this.page(),
        pageSize: this.pageSize(),
        search: search?.trim() ? search.trim() : null
      })
      .subscribe({
        next: (result) => {
          this.users.set(result.nodes);
          this.totalCount.set(result.totalCount);
          this.totalPages.set(result.totalPages > 0 ? result.totalPages : 1);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.loadError.set(this.translate.instant('users.errorLoading'));
        }
      });
  }
}
