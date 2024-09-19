import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { OpenBranchComponent } from './open-branch/open-branch.component';
import { OfficeManagementComponent } from './office-management/office-management.component';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({

    declarations: [
        OfficeManagementComponent,
        OpenBranchComponent,
        EmployeeManagementComponent,
    ],

    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgbDropdownModule,
    ],

    exports: [
        OpenBranchComponent,
        OfficeManagementComponent,
        EmployeeManagementComponent,
    ]
})

export class BusinessModule { }
