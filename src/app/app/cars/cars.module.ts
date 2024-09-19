import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatepickerRangePopup } from "../shared/datepicker-range-popup/datepicker-range-popup.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { CarsComponent } from './cars/cars.component';
import { AdditionalCarInfoComponent } from './additional-car-info/additional-car-info.component';

@NgModule({

    declarations: [
        CarsComponent,
        AdditionalCarInfoComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        DatepickerRangePopup,
        NgbModule,
    ],
    exports: [
        SharedModule,
        CarsComponent,
        AdditionalCarInfoComponent,
    ],

})

export class CarsModule {}
