import { TestBed } from '@angular/core/testing';

import { CustomersService } from '../../app/app/customer/customers.service';

describe('UserService', () => {
  let service: CustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
