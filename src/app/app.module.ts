import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, HttpClientModule } from "@angular/common/http";
import { AppInterceptor } from "../../src/app/app/shared/interceptor/interceptor";
import { AppRoutingModule } from '../app/app-routing/app-routing.module';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';


import { AppComponent } from './app.component';
import { HomeModule } from '../app/app/home/home.module';
import { AuthModule } from '../app/app/auth/auth.module';
import { BusinessModule } from './app/business/business.module';
import { CarsModule } from '../app/app/cars/cars.module';
import { BookingModule } from '../app/app/booking/booking.module';
import { CustomerModule } from './app/customer/customer.module';
import { PaymentModule } from '../app/app/payment/payment.module';
import { ManagerModule } from './app/manager/manager.module';
import { SharedModule } from './app/shared/shared.module';

@NgModule({

    declarations: [
        AppComponent
    ],

    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterOutlet,
        FullCalendarModule,
        HomeModule,
        AuthModule,
        BusinessModule,
        CarsModule,
        BookingModule,
        CustomerModule,
        PaymentModule,
        ManagerModule,
        SharedModule,
        HttpClientModule
        
    ],

    exports: [AppRoutingModule],

    providers: [
        provideHttpClient(),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AppInterceptor,
            multi: true
        }
    ],

    bootstrap: [AppComponent]

})

export class AppModule {}
