import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthModule } from '../../auth/auth.module';
import { LoginComponent } from '../../auth/login/login.component';
import { RegistrationComponent } from '../../auth/registration/registration.component';
import { AuthService } from '../../auth/auth.service';
import { OpenBranchComponent } from '../../business/open-branch/open-branch.component';
import { BusinessModule } from '../../business/business.module';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, AuthModule, BusinessModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent {

    @ViewChild(LoginComponent) loginComponent!: LoginComponent;
    @ViewChild(RegistrationComponent) registrationComponent!: RegistrationComponent;
    @ViewChild(OpenBranchComponent) openBranchComponent!: OpenBranchComponent;

    isUserLoggedIn: boolean = false; 
    userType: string = '';
    isAdminLoggedIn: boolean = false;
    isMenuActive = false;
    isNavActive = false;
    rentalLogoPath: string | null = null;

    constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

    // Subscribe to users / admin login
    ngOnInit() {
        this.authService.userLoggedIn.subscribe(loggedInSubject => {
            this.isUserLoggedIn = loggedInSubject; 
        });
        this.authService.userType.subscribe(userTypeSubject => {
            this.userType = userTypeSubject; 
            console.log(this.userType);
            if(this.userType === 'Guest') {
                this.rentalLogoPath = '/assets/logo/sun.png';
            }
        });
        this.authService.adminLoggedIn.subscribe(loggedInAdmin => {
            this.isAdminLoggedIn = loggedInAdmin;
        });
        
        this.loadRentalLogo();
    }

    // Load Rental Logo
    loadRentalLogo() {
        if (this.isUserLoggedIn && this.userType === 'Business') {
            const token = this.authService.getToken(); 

            this.http.get(this.authService.getRentalLogoPath, {
                headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' 
            }).subscribe(
                response => {
                    const url = window.URL.createObjectURL(response); 
                    this.rentalLogoPath = url; 
                }, error => {
                    console.error('Error loading rental logo', error);
                    this.rentalLogoPath = null; 
                }
            );
        }
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
    }

    // Toggle Burger Menu
    toggleMenu() {
        this.isMenuActive = !this.isMenuActive; 
        this.isNavActive = !this.isNavActive;
    }

    // Login Modal
    openLoginModal() {  
        this.loginComponent.open(this.loginComponent.contentLogin);
    }

    // Registration Modal
    openRegistrationModal() {
        this.registrationComponent.open(this.registrationComponent.contentRegistration);
    }

    // Open Branch Modal
    openBranchModal() {
        this.openBranchComponent.open(this.openBranchComponent.contentOpenBranch);
    }

}