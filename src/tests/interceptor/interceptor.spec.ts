import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppInterceptor } from '../../app/app/shared/interceptor/interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe('AppInterceptor', () => {
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let interceptor: AppInterceptor;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AppInterceptor,
                    multi: true
                }
            ]
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
        interceptor = TestBed.inject(AppInterceptor);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    it('should add Authorization header if token exists', () => {
        localStorage.setItem('token', 'test-token'); 

        httpClient.get('/test-url').subscribe();

        const req = httpMock.expectOne('/test-url');
        expect(req.request.headers.has('Authorization')).toBeTrue();
        expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    });

    it('should not add Authorization header if token does not exist', () => {
        localStorage.removeItem('token'); 

        httpClient.get('/test-url').subscribe();

        const req = httpMock.expectOne('/test-url');
        expect(req.request.headers.has('Authorization')).toBeFalse();
    });

    it('should set Content-Type and Accept headers', () => {
        httpClient.get('/test-url').subscribe();

        const req = httpMock.expectOne('/test-url');
        expect(req.request.headers.get('Content-Type')).toBe('application/json');
        expect(req.request.headers.get('Accept')).toBe('application/json');
    });
});
