import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalCarInfoComponent } from './additional-car-info.component';

describe('AdditionalCarInfoComponent', () => {
  let component: AdditionalCarInfoComponent;
  let fixture: ComponentFixture<AdditionalCarInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalCarInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalCarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
