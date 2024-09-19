import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBranchComponent } from './open-branch.component';

describe('OpenBranchComponent', () => {
    
    let component: OpenBranchComponent;
    let fixture: ComponentFixture<OpenBranchComponent>;

    beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [OpenBranchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    });

    it('should create', () => {
    expect(component).toBeTruthy();
    });

});
