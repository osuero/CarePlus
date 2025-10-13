import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UserCollectionResponse,
  UsersQueryResponse,
  UsersQueryVariables
} from '../models/user.model';
import { TenantService } from './tenant.service';

interface GraphQLRequest<TVariables> {
  query: string;
  variables: TVariables;
}

@Injectable({ providedIn: 'root' })
export class UserQueryService {
  private readonly endpoint = `${environment.apiUrl}/graphql`;

  private readonly usersQuery = `
    query Users($page: Int!, $pageSize: Int!, $search: String) {
      users(page: $page, pageSize: $pageSize, search: $search) {
        nodes {
          id
          firstName
          lastName
          email
          phoneNumber
          identification
          country
          createdAtUtc
        }
        totalCount
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  `;

  constructor(
    private readonly http: HttpClient,
    private readonly tenantService: TenantService
  ) {}

  fetchUsers(variables: UsersQueryVariables): Observable<UserCollectionResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Tenant-Id': this.tenantService.currentTenant
    });

    const payload: GraphQLRequest<UsersQueryVariables> = {
      query: this.usersQuery,
      variables
    };

    return this.http
      .post<UsersQueryResponse>(this.endpoint, payload, { headers })
      .pipe(map((response) => response.data.users));
  }
}
