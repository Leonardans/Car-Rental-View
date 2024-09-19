import { TestBed } from '@angular/core/testing';

import { CarsManagementService } from '../../app/app/manager/car-management/car-management.service';

describe('CarsManagementService', () => {
  let service: CarsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarsManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
