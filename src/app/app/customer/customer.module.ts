import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GarageComponent } from './garage/garage.component';
import { RentedComponent } from './rented/rented.component';
import { RenewalComponent } from './renewal/renewal.component'
import { SharedModule } from '../shared/shared.module';

@NgModule({

    declarations: [
        GarageComponent,
        RentedComponent,
        RenewalComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        GarageComponent,
        RentedComponent,
        RenewalComponent,
    ]

})

export class CustomerModule {}
