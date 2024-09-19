import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOpenOfficeInteractComponent } from '../../../app/app/home/user-open-office-interact/user-open-office-interact.component';

describe('UserOpenOfficeInteractComponent', () => {
  let component: UserOpenOfficeInteractComponent;
  let fixture: ComponentFixture<UserOpenOfficeInteractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOpenOfficeInteractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOpenOfficeInteractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
