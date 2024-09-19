import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BookingComponent } from './booking/booking.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component'; 
import { SharedModule } from '../shared/shared.module';

@NgModule({

    declarations: [
        BookingComponent,
        BookingConfirmationComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        FullCalendarModule,
        BrowserAnimationsModule,
        
    ],
    exports: [
        BookingComponent,
        BookingConfirmationComponent,
    ]
})

export class BookingModule {}
