import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ManagerModule } from '../../manager/manager.module';
import { ManagerLoginComponent } from '../../manager/manager-login/manager-login.component';
import { HowItWorksComponent } from '../../customer/how-it-works/how-it-works.component';
import { AuthService } from '../../auth/auth.service';


@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, ManagerModule, HowItWorksComponent],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})

export class FooterComponent {

    @ViewChild(ManagerLoginComponent) managerLoginComponent!: ManagerLoginComponent;
    @ViewChild(HowItWorksComponent) howItWorksModal!: HowItWorksComponent;

    isUserLoggedIn: boolean = false; 
    userType: string = '';
    isAdminLoggedIn: boolean = false;

    constructor(private router: Router, private authService: AuthService) {}

    navigateTo(route: string) {
        this.router.navigate([route]);
    }

    // Subscribe to users / admin login
    ngOnInit() {
        this.authService.userLoggedIn.subscribe(loggedInSubject => {
            this.isUserLoggedIn = loggedInSubject; 
        });
        this.authService.userType.subscribe(userTypeSubject => {
            this.userType = userTypeSubject; 
        });
        this.authService.adminLoggedIn.subscribe(loggedInAdmin => {
            this.isAdminLoggedIn = loggedInAdmin;
        });
    }

    // Admin Login Modal
    openAdminLogin() {
        this.managerLoginComponent.open(this.managerLoginComponent.contentManagerLogin);
    }

    // Logout
    logout() {
        this.authService.logout().subscribe(
        () => {
            this.router.navigate(['/']); 
        },
        (error) => {
            console.error('Logout failed', error);
        });
    }

    // Open Customer tour
    openCustomerTour() {
        this.howItWorksModal.openHowItWorksModal();
    }
    
}
