import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UsersService } from './users.service';
import {
  RegisterUserRequest,
  Role,
  User,
  UserCollection,
} from './users.model';
import { environment } from '../../environments/environment';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  const originalEnvironment = {
    apiUrl: environment.apiUrl,
    production: environment.production,
    tenantId: environment.tenantId,
    tenants: [...environment.tenants],
  };

  const apiUrl = 'https://fake-api.local:5120/';
  const tenantId = 'tenant-123';

  beforeEach(() => {
    environment.apiUrl = apiUrl;
    environment.tenantId = tenantId;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService],
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  afterAll(() => {
    environment.apiUrl = originalEnvironment.apiUrl;
    environment.production = originalEnvironment.production;
    environment.tenantId = originalEnvironment.tenantId;
    environment.tenants = [...originalEnvironment.tenants];
  });

  it('should request the users list endpoint with search parameters and tenant header', () => {
    const expectedResponse: UserCollection = {
      nodes: [],
      totalCount: 0,
      page: 2,
      pageSize: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    service.getUsers(2, 10, '  doctor ').subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne((request) => {
      return request.url === 'https://fake-api.local:5120/api/users';
    });

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('X-Tenant-Id')).toBe(tenantId);
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('10');
    expect(req.request.params.get('search')).toBe('doctor');

    req.flush(expectedResponse);
  });

  it('should post a registration request to the register endpoint including tenant id', () => {
    const registerRequest: RegisterUserRequest = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      gender: 'Female',
      dateOfBirth: '1990-01-01',
    };

    const expectedUser: User = {
      id: 'abc',
      tenantId,
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      gender: 'Female',
      dateOfBirth: '1990-01-01',
      age: 34,
      createdAtUtc: new Date().toISOString(),
      updatedAtUtc: new Date().toISOString(),
      phoneNumber: null,
      identification: null,
      country: null,
      roleId: null,
      roleName: null,
    };

    service.registerUser(registerRequest).subscribe((user) => {
      expect(user).toEqual(expectedUser);
    });

    const req = httpMock.expectOne(
      'https://fake-api.local:5120/api/users/register'
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X-Tenant-Id')).toBe(tenantId);
    expect(req.request.body.tenantId).toBe(tenantId);

    req.flush(expectedUser);
  });

  it('should update the user endpoint with the provided payload and tenant id', () => {
    const updateRequest: RegisterUserRequest = {
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@example.com',
      gender: 'Male',
      dateOfBirth: '1985-05-05',
    };

    const expectedUpdatedUser: User = {
      id: 'user-123',
      tenantId,
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@example.com',
      gender: 'Male',
      dateOfBirth: '1985-05-05',
      age: 39,
      createdAtUtc: new Date().toISOString(),
      updatedAtUtc: new Date().toISOString(),
      phoneNumber: null,
      identification: null,
      country: null,
      roleId: null,
      roleName: null,
    };

    service.updateUser('user-123', updateRequest).subscribe((user) => {
      expect(user).toEqual(expectedUpdatedUser);
    });

    const req = httpMock.expectOne(
      'https://fake-api.local:5120/api/users/user-123'
    );

    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('X-Tenant-Id')).toBe(tenantId);
    expect(req.request.body.tenantId).toBe(tenantId);

    req.flush(expectedUpdatedUser);
  });

  it('should send a delete request to the user endpoint with tenant header', () => {
    service.deleteUser('user-999').subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(
      'https://fake-api.local:5120/api/users/user-999'
    );

    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('X-Tenant-Id')).toBe(tenantId);

    req.flush(null);
  });

  it('should query countries endpoint without tenant header and with trimmed search', () => {
    const expectedCountries = [
      { code: 'US', name: 'United States' },
      { code: 'CA', name: 'Canada' },
    ];

    service.searchCountries('  nor ').subscribe((countries) => {
      expect(countries).toEqual(expectedCountries);
    });

    const req = httpMock.expectOne(
      (request) => request.url === 'https://fake-api.local:5120/api/users/countries'
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('X-Tenant-Id')).toBeFalse();
    expect(req.request.params.get('search')).toBe('nor');

    req.flush(expectedCountries);
  });

  it('should post to the graphql roles endpoint with includeGlobal and tenant header', () => {
    const rolesResponse = {
      data: {
        getRoles: {
          nodes: [
            {
              id: 'role-1',
              tenantId: tenantId,
              name: 'Admin',
              description: 'Administrator',
              isGlobal: false,
            },
            {
              id: 'role-2',
              tenantId: 'global',
              name: 'Global Admin',
              description: null,
              isGlobal: true,
            },
          ] satisfies Role[],
        },
      },
    };

    service.getRoles('  custom-tenant  ', false).subscribe((roles) => {
      expect(roles).toEqual(rolesResponse.data.getRoles.nodes);
    });

    const req = httpMock.expectOne(
      (request) => request.url === 'https://fake-api.local:5120/graphql'
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X-Tenant-Id')).toBe('custom-tenant');
    expect(req.request.body.query).toContain('getRoles');
    expect(req.request.body.variables).toEqual({ includeGlobal: false });

    req.flush(rolesResponse);
  });
});
