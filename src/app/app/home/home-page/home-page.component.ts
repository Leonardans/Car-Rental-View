import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { UserOpenOfficeInteractComponent } from '../user-open-office-interact/user-open-office-interact.component';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css',
})

export class HomePageComponent {
    
    @ViewChild(UserOpenOfficeInteractComponent) userOpenOfficeInteractComponent!: UserOpenOfficeInteractComponent;
  
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
            this.getBackgroundImage();
        });
        this.authService.adminLoggedIn.subscribe(loggedInAdmin => {
            this.isAdminLoggedIn = loggedInAdmin;
        });
    }

    // Call User Open Office Interact Component
    callUserOpenOfficeInteractModal() {
        this.userOpenOfficeInteractComponent.open(this.userOpenOfficeInteractComponent.contentOpenOfficeInteract);
    }

    // Background-image
    getBackgroundImage() {
        if (!this.isUserLoggedIn) {
          return '/assets/home/guest-home.jpg';
        } else if (this.userType === 'Business') {
          return '/assets/home/business-home.jpg';
        } else if (this.userType === 'Customer') {
          return '/assets/home/customer-home.jpg';
        }
        return '/assets/see.jpg'; 
    }

}


