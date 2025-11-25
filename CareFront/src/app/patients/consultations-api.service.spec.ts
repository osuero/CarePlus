import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { ConsultationsApiService } from './consultations-api.service';
import { CreateConsultationRequest } from './consultations.model';

describe('ConsultationsApiService', () => {
  let service: ConsultationsApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl.replace(/\/$/, '');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConsultationsApiService],
    });

    service = TestBed.inject(ConsultationsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should request consultations by patient', () => {
    service.getByPatient('patient-1', 1, 10).subscribe();

    const req = httpMock.expectOne(
      `${baseUrl}/api/v1/consultations?patientId=patient-1&page=1&pageSize=10`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('x-tenant-id')).toBe(environment.tenantId ?? 'default');
    req.flush({ items: [], page: 1, pageSize: 10, totalCount: 0 });
  });

  it('should post new consultation', () => {
    const payload: CreateConsultationRequest = {
      patientId: 'p1',
      doctorId: 'd1',
      consultationDateTime: new Date().toISOString(),
      reasonForVisit: 'Checkup',
      symptoms: [],
    };

    service.create(payload).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/api/v1/consultations`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.patientId).toBe('p1');
    req.flush({ ...payload, id: 'c1', patientFullName: '', doctorName: '', symptoms: [] });
  });
});
