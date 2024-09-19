import { Routes } from '@angular/router';
import { HomePageComponent } from '../app/home/home-page/home-page.component';
import { AboutUsComponent } from '../app/home/about-us/about-us.component';
import { PartnersComponent } from '../app/home/partners/partners.component';
import { UserOpenOfficeInteractComponent } from '../app/home/user-open-office-interact/user-open-office-interact.component';
import { LoginComponent } from '../app/auth/login/login.component';
import { RegistrationComponent } from '../app/auth/registration/registration.component';
import { OpenBranchComponent } from '../app/business/open-branch/open-branch.component';
import { OfficeManagementComponent } from '../app/business/office-management/office-management.component';
import { EmployeeManagementComponent } from '../app/business/employee-management/employee-management.component';
import { CarsComponent } from '../app/cars/cars/cars.component';
import { AdditionalCarInfoComponent } from '../app/cars/additional-car-info/additional-car-info.component';
import { HowItWorksComponent } from '../app/customer/how-it-works/how-it-works.component';
import { ManagerLoginComponent } from '../app/manager/manager-login/manager-login.component';
import { BookingComponent } from '../app/booking/booking/booking.component';
import { BookingConfirmationComponent } from '../app/booking/booking-confirmation/booking-confirmation.component';
import { GarageComponent } from '../app/customer/garage/garage.component';
import { RentedComponent } from '../app/customer/rented/rented.component';
import { RenewalComponent } from '../app/customer/renewal/renewal.component';
import { PaymentComponent } from '../app/payment/payment/payment.component';
import { ManagerPanelComponent } from '../app/manager/manager-panel/manager-panel.component';
import { StatisticsComponent } from '../app/manager/statistics/statistics.component';
import { CarLoanComponent } from '../app/manager/car-management/car-loan/car-loan.component';
import { CarReturnComponent } from '../app/manager/car-management/car-return/car-return.component';
import { CarAdditionComponent } from '../app/manager/car-management/car-addition/car-addition.component';
import { authGuard } from '../app/auth/auth-guard/auth.guard';
import { roles } from '../app/auth/auth-guard/role';


export const appRoutes: Routes = [

    { path: '', component: HomePageComponent }, 
    { path: 'login', component: LoginComponent },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'partners', component: PartnersComponent },
    { path: 'user-open-office-interact', component: UserOpenOfficeInteractComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'open-branch', component: OpenBranchComponent, canActivate: [authGuard], data: { role: roles.Business.name } },
    { path: 'office-management', component: OfficeManagementComponent, canActivate: [authGuard], data: { role: roles.Business.name } },
    { path: 'employee-management', component: EmployeeManagementComponent, canActivate: [authGuard], data: { role: roles.Business.name } },
    { path: 'cars', component: CarsComponent },
    { path: 'cars-additional-info', component: AdditionalCarInfoComponent },
    { path: 'how-it-works', component: HowItWorksComponent },
    { path: 'booking', component: BookingComponent, canActivate: [authGuard], data: { role: roles.Customer.name } },
    { path: 'booking-confirmation', component: BookingConfirmationComponent, canActivate: [authGuard], data: { role: roles.Customer.name } },
    { path: 'payment', component: PaymentComponent, canActivate: [authGuard], data: { role: roles.Customer.name } },
    { path: 'garage', component: GarageComponent, canActivate: [authGuard], data: { role: roles.Customer.name } },
    { path: 'rented', component: RentedComponent, canActivate: [authGuard], data: { role: roles.Customer.name } },
    { path: 'renewal', component: RenewalComponent, canActivate: [authGuard], data: { role: roles.Customer.name } },
    { path: 'manager-login', component: ManagerLoginComponent },
    { path: 'manager-panel', component: ManagerPanelComponent, canActivate: [authGuard], data: { role: roles.Manager.name } },
    { path: 'manager-panel/statistics', component: StatisticsComponent, canActivate: [authGuard], data: { role: roles.Manager.name } },
    { path: 'manager-panel/car-loan', component: CarLoanComponent, canActivate: [authGuard], data: { role: roles.Manager.name } },
    { path: 'manager-panel/car-return', component: CarReturnComponent, canActivate: [authGuard], data: { role: roles.Manager.name } },
    { path: 'manager-panel/car-addition', component: CarAdditionComponent, canActivate: [authGuard], data: { role: roles.Manager.name } },
    { path: '**', redirectTo: '' }  

];
